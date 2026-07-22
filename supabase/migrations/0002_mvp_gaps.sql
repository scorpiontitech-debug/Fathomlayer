-- ============================================================
-- Fathom Layer — MIGRATION 0002: ALTERAÇÕES MVP (gaps-roadmap)
-- Itens bloqueantes de MVP: #1 staging de ingestão, #2 fila de
-- revisão (pending_review), #4 rastreamento de cliques, #5 launch_phase.
-- Itens de Fase 2 (last_verified_at, link_status, newsletter,
-- content_synthesis_log) ficam FORA desta migration por decisão de roadmap.
-- ============================================================

-- ------------------------------------------------------------
-- #1 Aquisição de dados em escala — staging separado das tabelas públicas.
-- A IA só sintetiza texto sobre o que está em raw_payload; nunca inventa números.
-- ------------------------------------------------------------
create table ingestion_staging (
    id              uuid primary key default gen_random_uuid(),
    target_table    text not null check (target_table in ('products', 'software')),
    source_name     text not null,       -- ex: 'amazon_pa_api', 'github_api', 'manual'
    raw_payload     jsonb not null,      -- dados crus da fonte, sem edição
    proposed_category_id uuid references categories(id),
    ai_synthesis    jsonb,               -- description/editorial_notes gerados, aguardando revisão
    status          text not null default 'pending' check (status in ('pending', 'synthesized', 'approved', 'rejected')),
    fetched_at      timestamptz not null default now()
);

create index idx_ingestion_staging_status on ingestion_staging (status, fetched_at);

-- ------------------------------------------------------------
-- #2 Fila de revisão humana — estágio intermediário pending_review
-- ------------------------------------------------------------
alter table products drop constraint products_status_check;
alter table products add constraint products_status_check
    check (status in ('draft', 'pending_review', 'published', 'archived'));

alter table software drop constraint software_status_check;
alter table software add constraint software_status_check
    check (status in ('draft', 'pending_review', 'published', 'archived'));

-- ------------------------------------------------------------
-- #4 Analytics de conversão — todo link de afiliado passa por /out/{link_id}
-- ------------------------------------------------------------
create table link_clicks (
    id              uuid primary key default gen_random_uuid(),
    link_id         uuid not null references links(id) on delete cascade,
    referrer_path   text,
    region_detected text,
    clicked_at      timestamptz not null default now()
);
create index idx_link_clicks_link on link_clicks (link_id, clicked_at);

-- ------------------------------------------------------------
-- #5 Lançamento por clusters — launch_phase controla indexação
-- 1 = cluster de lançamento (indexável desde já), 2 = aguardando fase 2, 3 = fase 3
-- ------------------------------------------------------------
alter table categories add column launch_phase integer not null default 2;

-- Quality Gate atualizado: is_indexable exige launch_phase = 1
-- E active_listing_count >= 3 (soma de products + software published).
create or replace function refresh_category_listing_count()
returns trigger as $$
declare
    v_category_id uuid;
    v_count integer;
begin
    v_category_id := coalesce(new.category_id, old.category_id);

    select (
        select count(*) from products
        where category_id = v_category_id and status = 'published'
    ) + (
        select count(*) from software
        where category_id = v_category_id and status = 'published'
    ) into v_count;

    update categories
    set active_listing_count = v_count,
        is_indexable = (launch_phase = 1 and v_count >= 3),
        updated_at = now()
    where id = v_category_id;

    return null;
end;
$$ language plpgsql;

-- Mudança de launch_phase também precisa reavaliar o gate,
-- senão uma categoria promovida a fase 1 só indexaria na próxima publicação.
create or replace function refresh_category_gate_on_phase_change()
returns trigger as $$
begin
    new.is_indexable := (new.launch_phase = 1 and new.active_listing_count >= 3);
    return new;
end;
$$ language plpgsql;

create trigger trg_categories_phase_gate
before update of launch_phase on categories
for each row execute function refresh_category_gate_on_phase_change();

-- ------------------------------------------------------------
-- RLS das novas tabelas: internas (pipeline/operador via service_role).
-- Nenhuma policy pública — anon não lê staging nem clicks.
-- ------------------------------------------------------------
alter table ingestion_staging enable row level security;
alter table link_clicks enable row level security;
