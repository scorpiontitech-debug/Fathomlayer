-- ============================================================
-- NEXUS TECH HUB — SCHEMA SUPABASE (POSTGRES)
-- Arquitetura simplificada: Produtos / Softwares / Setups
-- ============================================================

-- EXTENSIONS
create extension if not exists "pgcrypto";
create extension if not exists "pg_trgm";

-- ============================================================
-- 1. CATEGORIES (compartilhada por Produtos e Softwares)
-- ============================================================
create table categories (
    id              uuid primary key default gen_random_uuid(),
    name            text not null,
    slug            text not null unique,
    pillar          text not null check (pillar in ('intelligence', 'compute', 'ecosystem_mobility')),
    parent_id       uuid references categories(id) on delete set null,
    description     text,
    -- Quality Gate: contagem de listagens ativas nesta categoria
    active_listing_count integer not null default 0,
    is_indexable    boolean not null default false,
    created_at      timestamptz not null default now(),
    updated_at      timestamptz not null default now()
);

create index idx_categories_slug on categories (slug);
create index idx_categories_parent on categories (parent_id);
create index idx_categories_pillar on categories (pillar);

-- ============================================================
-- 2. PRODUCTS (hardware, gadgets, eletrônicos, EVs, periféricos)
-- ============================================================
create table products (
    id              uuid primary key default gen_random_uuid(),
    category_id     uuid not null references categories(id) on delete restrict,

    title           text not null,
    slug            text not null unique,
    brand           text,
    description     text,

    -- Specs técnicas puras (estrutura livre, mas sempre dados factuais — nunca prosa de marketing)
    specs           jsonb not null default '{}'::jsonb,

    -- Curadoria própria do Nexus (Unique Data Gate)
    design_score    numeric(3,1) check (design_score between 0 and 10),
    editorial_notes text,

    -- Análise estruturada de vantagens/desvantagens — alimenta páginas comparativas "X vs Y"
    -- e blocos de resposta atômica para retrieval por IA generativa (nunca prosa solta aqui)
    pros            text[] not null default '{}',
    cons            text[] not null default '{}',
    ideal_for       text[] not null default '{}',  -- ex: '{"quem precisa de VRAM alta", "uso silencioso em home office"}'

    -- Preço de referência para filtro/ordenação (Recomendador por Orçamento) — nunca o preço final,
    -- que muda em tempo real no destino do link de afiliado. Atualizado manualmente/via staging, não em tempo real.
    price_from      numeric(10,2),
    price_currency  text default 'USD',

    -- Ano de lançamento/geração — alimenta páginas pSEO "Melhores X de [ano]" (mesmo campo em software)
    release_year    integer,

    -- Idioma do conteúdo (description/editorial_notes/pros/cons) — 'en' é o padrão de lançamento,
    -- decisão tomada por alinhamento com volume de busca global e domínio .com
    content_language text not null default 'en',

    tags            text[] not null default '{}',

    -- Bloco opcional de contexto técnico (ex: "hardware recomendado para IA local")
    -- Aponta para outro produto, sem sistema de compatibilidade complexo.
    related_context_product_id uuid references products(id) on delete set null,

    status          text not null default 'draft' check (status in ('draft', 'published', 'archived')),
    is_indexable    boolean not null default false,

    published_at    timestamptz,
    created_at      timestamptz not null default now(),
    updated_at      timestamptz not null default now()
);

create index idx_products_slug on products (slug);
create index idx_products_category on products (category_id);
create index idx_products_status on products (status);
create index idx_products_tags on products using gin (tags);
create index idx_products_specs on products using gin (specs);
create index idx_products_title_trgm on products using gin (title gin_trgm_ops);

-- ============================================================
-- 3. SOFTWARE (SaaS, apps de IA, frameworks, ferramentas)
-- ============================================================
create table software (
    id              uuid primary key default gen_random_uuid(),
    category_id     uuid not null references categories(id) on delete restrict,

    name            text not null,
    slug            text not null unique,
    description     text,

    pricing_model   text check (pricing_model in ('free', 'freemium', 'paid', 'open_source', 'enterprise')),
    price_text      text,  -- ex: "$20/mês" ou "Grátis até 10k execuções"

    website_url     text,

    tags            text[] not null default '{}',

    -- Mesma análise estruturada de products — ver seção 2 do schema
    pros            text[] not null default '{}',
    cons            text[] not null default '{}',
    ideal_for       text[] not null default '{}',

    -- Preço de referência para filtro/ordenação — ver nota equivalente em products
    price_from      numeric(10,2),
    price_currency  text default 'USD',

    -- Ano de lançamento/versão relevante — alimenta páginas pSEO "Melhores X de [ano]"
    release_year    integer,

    -- Idioma do conteúdo — ver nota equivalente em products
    content_language text not null default 'en',

    editorial_notes text,

    status          text not null default 'draft' check (status in ('draft', 'published', 'archived')),
    is_indexable    boolean not null default false,

    published_at    timestamptz,
    created_at      timestamptz not null default now(),
    updated_at      timestamptz not null default now()
);

create index idx_software_slug on software (slug);
create index idx_software_category on software (category_id);
create index idx_software_status on software (status);
create index idx_software_tags on software using gin (tags);
create index idx_software_name_trgm on software using gin (name gin_trgm_ops);

-- ============================================================
-- 4. LINKS (afiliados por região — polimórfico entre products/software)
-- ============================================================
create table links (
    id              uuid primary key default gen_random_uuid(),

    entity_type     text not null check (entity_type in ('product', 'software')),
    entity_id       uuid not null,

    region          text not null default 'global', -- ex: 'CH', 'US', 'BR', 'global'
    program_name    text,   -- ex: 'Amazon Associates', 'Tesla Referral'
    url             text not null,
    label           text,   -- ex: 'Comprar na Amazon', 'Testar grátis'

    is_primary      boolean not null default false,
    created_at      timestamptz not null default now()
);

create index idx_links_entity on links (entity_type, entity_id);
create index idx_links_region on links (region);

-- ============================================================
-- 5. SETUPS (agrupamentos manuais/temáticos — curadoria editorial)
-- ============================================================
create table setups (
    id              uuid primary key default gen_random_uuid(),
    title           text not null,
    slug            text not null unique,
    description     text,
    cover_image_url text,
    tags            text[] not null default '{}',

    status          text not null default 'draft' check (status in ('draft', 'published', 'archived')),
    is_indexable    boolean not null default false,

    published_at    timestamptz,
    created_at      timestamptz not null default now(),
    updated_at      timestamptz not null default now()
);

create index idx_setups_slug on setups (slug);
create index idx_setups_status on setups (status);

create table setup_items (
    id              uuid primary key default gen_random_uuid(),
    setup_id        uuid not null references setups(id) on delete cascade,

    item_type       text not null check (item_type in ('product', 'software')),
    item_id         uuid not null,

    position        integer not null default 0,
    note            text  -- ex: "essencial para quem usa Claude Code no dia a dia"
);

create index idx_setup_items_setup on setup_items (setup_id, position);
create unique index idx_setup_items_unique on setup_items (setup_id, item_type, item_id);

-- ============================================================
-- 5.1 EDITORIAL_PAGES (conteúdo de utilidade: lançamentos futuros, glossário técnico, guias de compra)
-- Uma única tabela genérica em vez de 3 — mesmo padrão de simplicidade das demais.
-- ============================================================
create table editorial_pages (
    id              uuid primary key default gen_random_uuid(),

    content_type    text not null check (content_type in ('launch', 'glossary', 'guide')),
    title           text not null,
    slug            text not null unique,
    body_markdown   text not null,

    category_id     uuid references categories(id) on delete set null,
    tags            text[] not null default '{}',
    content_language text not null default 'en',

    -- Campos usados só quando content_type = 'launch'; ficam null nos demais tipos
    expected_release_date date,
    launch_confidence     text check (launch_confidence in ('rumored', 'announced', 'confirmed')),
    source_url             text,  -- fonte da informação de lançamento, para credibilidade/GEO

    status          text not null default 'draft' check (status in ('draft', 'published', 'archived')),
    is_indexable    boolean not null default false,

    published_at    timestamptz,
    created_at      timestamptz not null default now(),
    updated_at      timestamptz not null default now()
);

create index idx_editorial_pages_slug on editorial_pages (slug);
create index idx_editorial_pages_type on editorial_pages (content_type);
create index idx_editorial_pages_status on editorial_pages (status);
create index idx_editorial_pages_tags on editorial_pages using gin (tags);

alter table editorial_pages enable row level security;
create policy "public_read_editorial_pages" on editorial_pages
    for select using (status = 'published' and is_indexable = true);

-- ============================================================
-- 6. QUALITY GATE — trigger simples de contagem por categoria
-- ============================================================
create or replace function refresh_category_listing_count()
returns trigger as $$
declare
    v_category_id uuid;
begin
    v_category_id := coalesce(new.category_id, old.category_id);

    update categories
    set active_listing_count = (
            select count(*) from products
            where category_id = v_category_id and status = 'published'
        ) + (
            select count(*) from software
            where category_id = v_category_id and status = 'published'
        ),
        is_indexable = (
            select (count(*) >= 3) from products
            where category_id = v_category_id and status = 'published'
        ) or (
            select (count(*) >= 3) from software
            where category_id = v_category_id and status = 'published'
        ),
        updated_at = now()
    where id = v_category_id;

    return null;
end;
$$ language plpgsql;

create trigger trg_products_category_count
after insert or update or delete on products
for each row execute function refresh_category_listing_count();

create trigger trg_software_category_count
after insert or update or delete on software
for each row execute function refresh_category_listing_count();

-- ============================================================
-- 7. updated_at automático
-- ============================================================
create or replace function set_updated_at()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

create trigger trg_categories_updated_at before update on categories
    for each row execute function set_updated_at();
create trigger trg_products_updated_at before update on products
    for each row execute function set_updated_at();
create trigger trg_software_updated_at before update on software
    for each row execute function set_updated_at();
create trigger trg_setups_updated_at before update on setups
    for each row execute function set_updated_at();
create trigger trg_editorial_pages_updated_at before update on editorial_pages
    for each row execute function set_updated_at();

-- ============================================================
-- 8. ROW-LEVEL SECURITY
-- ============================================================
alter table categories enable row level security;
alter table products enable row level security;
alter table software enable row level security;
alter table links enable row level security;
alter table setups enable row level security;
alter table setup_items enable row level security;

-- Leitura pública: apenas o que passou nos quality gates
create policy "public_read_categories" on categories
    for select using (is_indexable = true);

create policy "public_read_products" on products
    for select using (status = 'published' and is_indexable = true);

create policy "public_read_software" on software
    for select using (status = 'published' and is_indexable = true);

create policy "public_read_links" on links
    for select using (true);

create policy "public_read_setups" on setups
    for select using (status = 'published' and is_indexable = true);

create policy "public_read_setup_items" on setup_items
    for select using (
        exists (
            select 1 from setups
            where setups.id = setup_items.setup_id
            and setups.status = 'published'
            and setups.is_indexable = true
        )
    );

-- Escrita: apenas service_role (scripts de ingestão / operador solo)
-- Nenhuma policy de insert/update/delete criada para 'authenticated' ou 'anon' —
-- service_role no Supabase ignora RLS por padrão, então nenhuma policy adicional é necessária.
