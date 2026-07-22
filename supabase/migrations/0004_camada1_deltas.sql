-- ============================================================
-- Fathom Layer — MIGRATION 0004: deltas da atualização de documentos
-- (content-spec/schema atualizados + Camada 1 do gaps-roadmap)
-- Aditiva: nada existente muda de forma destrutiva.
-- ============================================================

-- Análise estruturada + preço de referência + ano + idioma + selo
-- de verificação (content-spec §2, §7.1, §7.4, §7.6; schema atualizado)
alter table products
  add column pros            text[] not null default '{}',
  add column cons            text[] not null default '{}',
  add column ideal_for       text[] not null default '{}',
  add column price_from      numeric(10,2),
  add column price_currency  text default 'USD',
  add column release_year    integer,
  add column content_language text not null default 'en',
  add column last_verified_at timestamptz not null default now();

alter table software
  add column pros            text[] not null default '{}',
  add column cons            text[] not null default '{}',
  add column ideal_for       text[] not null default '{}',
  add column price_from      numeric(10,2),
  add column price_currency  text default 'USD',
  add column release_year    integer,
  add column content_language text not null default 'en',
  add column last_verified_at timestamptz not null default now();

-- ============================================================
-- EDITORIAL_PAGES (content-spec §7.3): launch / glossary / guide
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
    source_url            text,

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

create trigger trg_editorial_pages_updated_at before update on editorial_pages
    for each row execute function set_updated_at();

alter table editorial_pages enable row level security;
create policy "public_read_editorial_pages" on editorial_pages
    for select using (status = 'published' and is_indexable = true);
