-- 0007: busca real no catálogo, rate limit durável e fechamento de RLS.
--
-- Contexto: o consultor de IA resolvia a pergunta do usuário com
-- ilike('title', '%frase inteira%'), o que só acerta se a frase digitada
-- aparecer literalmente dentro do título. Na prática retornava vazio para
-- toda pergunta em linguagem natural, e o modelo respondia sem dados —
-- exatamente o que a regra 3 do system prompt proíbe.

-- ---------------------------------------------------------------------------
-- 1. Busca do catálogo
-- ---------------------------------------------------------------------------
-- Pontuação híbrida: trigrama no título (pega erro de digitação e nome
-- parcial) somado a acertos de token no blob de texto do item (pega intenção
-- — "notebook para rodar modelo local" casa por tags e ideal_for).
-- SECURITY INVOKER de propósito: a RLS continua valendo, então a função nunca
-- expõe rascunho nem item arquivado.

create or replace function public.search_catalog(
  q text,
  max_results int default 6
)
returns table (
  entity text,
  id uuid,
  slug text,
  title text,
  brand text,
  price_from numeric,
  design_score numeric,
  pros text[],
  cons text[],
  ideal_for text[],
  specs jsonb,
  category_slug text,
  pillar text,
  score real
)
language sql
stable
security invoker
set search_path = public, extensions
as $$
  with toks as (
    select array(
      select tok
      from unnest(
        string_to_array(lower(regexp_replace(coalesce(q, ''), '[^a-zA-Z0-9]+', ' ', 'g')), ' ')
      ) as tok
      where length(tok) >= 3
        and tok not in (
          'the','and','for','with','best','what','which','that','you','your',
          'are','can','use','how','from','more','than','into','good','need',
          'want','should','about','como','para','qual','quais','melhor','uma',
          'que','com','dos','das','por'
        )
    ) as t
  ),
  scored as (
    select
      'product'::text as entity,
      pr.id,
      pr.slug,
      pr.title,
      pr.brand,
      pr.price_from,
      pr.design_score,
      pr.pros,
      pr.cons,
      pr.ideal_for,
      pr.specs,
      c.slug as category_slug,
      c.pillar,
      lower(
        pr.title || ' ' || coalesce(pr.brand, '') || ' ' || coalesce(pr.description, '')
        || ' ' || array_to_string(pr.tags, ' ')
        || ' ' || array_to_string(pr.ideal_for, ' ')
        || ' ' || c.name
      ) as blob
    from public.products pr
    join public.categories c on c.id = pr.category_id
    where pr.status = 'published'

    union all

    select
      'software'::text,
      sw.id,
      sw.slug,
      sw.name,
      null::text,
      sw.price_from,
      null::numeric,
      sw.pros,
      sw.cons,
      sw.ideal_for,
      '{}'::jsonb,
      c.slug,
      c.pillar,
      lower(
        sw.name || ' ' || coalesce(sw.description, '')
        || ' ' || array_to_string(sw.tags, ' ')
        || ' ' || array_to_string(sw.ideal_for, ' ')
        || ' ' || array_to_string(sw.key_features, ' ')
        || ' ' || c.name
      )
    from public.software sw
    join public.categories c on c.id = sw.category_id
    where sw.status = 'published'
  )
  select
    s.entity, s.id, s.slug, s.title, s.brand, s.price_from, s.design_score,
    s.pros, s.cons, s.ideal_for, s.specs, s.category_slug, s.pillar,
    (
      3.0 * extensions.similarity(lower(s.title), lower(coalesce(q, '')))
      + (
          select count(*)
          from unnest((select t from toks)) as tok
          where s.blob like '%' || tok || '%'
        )
    )::real as score
  from scored s
  where (
    3.0 * extensions.similarity(lower(s.title), lower(coalesce(q, '')))
    + (
        select count(*)
        from unnest((select t from toks)) as tok
        where s.blob like '%' || tok || '%'
      )
  ) > 0.35
  order by score desc, s.title
  limit greatest(1, least(coalesce(max_results, 6), 20));
$$;

comment on function public.search_catalog(text, int) is
  'Busca híbrida (trigrama + tokens) sobre produtos e software publicados. Usada pelo consultor de IA em /api/chat.';

-- Índices trigrama: sem eles a similaridade faz seq scan no catálogo inteiro
-- a cada pergunta feita ao chat.
create index if not exists products_title_trgm_idx
  on public.products using gin (lower(title) extensions.gin_trgm_ops);
create index if not exists software_name_trgm_idx
  on public.software using gin (lower(name) extensions.gin_trgm_ops);

-- ---------------------------------------------------------------------------
-- 2. Rate limit durável
-- ---------------------------------------------------------------------------
-- /api/chat é público e chama um LLM pago. Contador em memória não serve:
-- cada instância serverless tem a sua, e o abusador simplesmente cai em
-- outra. O contador precisa ser compartilhado — por isso vive no banco.

create table if not exists public.rate_limits (
  bucket text primary key,
  window_start timestamptz not null default now(),
  hits int not null default 0
);

alter table public.rate_limits enable row level security;
-- Sem policy: só a service key escreve aqui. RLS ligada e vazia nega tudo
-- para as chaves públicas, que é exatamente o desejado.

create or replace function public.consume_rate_limit(
  p_bucket text,
  p_limit int,
  p_window_seconds int
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_hits int;
begin
  insert into public.rate_limits (bucket, window_start, hits)
  values (p_bucket, now(), 1)
  on conflict (bucket) do update
    set
      -- Janela expirada reinicia a contagem; dentro da janela, incrementa.
      hits = case
        when public.rate_limits.window_start < now() - make_interval(secs => p_window_seconds)
        then 1
        else public.rate_limits.hits + 1
      end,
      window_start = case
        when public.rate_limits.window_start < now() - make_interval(secs => p_window_seconds)
        then now()
        else public.rate_limits.window_start
      end
  returning hits into v_hits;

  return v_hits <= p_limit;
end;
$$;

comment on function public.consume_rate_limit(text, int, int) is
  'Janela fixa por bucket. Retorna false quando a chamada estourou o limite.';

-- Higiene: sem isso a tabela cresce para sempre com buckets de IPs de
-- visitantes de meses atrás.
create or replace function public.prune_rate_limits()
returns void
language sql
security definer
set search_path = public
as $$
  delete from public.rate_limits where window_start < now() - interval '1 day';
$$;

-- ---------------------------------------------------------------------------
-- 3. Fechamento de RLS apontado pelos advisors
-- ---------------------------------------------------------------------------
-- Ambas as tabelas já estão com RLS ligada e sem policy, o que na prática já
-- nega leitura pública. As policies explícitas abaixo tornam a intenção
-- legível para quem auditar o schema depois, em vez de depender de ausência.

drop policy if exists "link_clicks: service role only" on public.link_clicks;
create policy "link_clicks: service role only"
  on public.link_clicks
  for all
  to authenticated, anon
  using (false)
  with check (false);

drop policy if exists "ingestion_staging: service role only" on public.ingestion_staging;
create policy "ingestion_staging: service role only"
  on public.ingestion_staging
  for all
  to authenticated, anon
  using (false)
  with check (false);

-- ---------------------------------------------------------------------------
-- 4. search_path da função de embeddings (advisor WARN 0011)
-- ---------------------------------------------------------------------------
do $$
begin
  if exists (
    select 1 from pg_proc p
    join pg_namespace n on n.oid = p.pronamespace
    where n.nspname = 'public' and p.proname = 'match_posts_by_embedding'
  ) then
    execute 'alter function public.match_posts_by_embedding set search_path = public, extensions';
  end if;
end
$$;
