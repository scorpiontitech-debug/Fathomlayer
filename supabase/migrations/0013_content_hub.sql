-- ============================================================
-- Fathom Layer — MIGRATION 0013: CONTENT HUB (Awwwards Level)
-- Tabelas: content_authors, content_categories, content_tags,
--          content_posts, content_post_tags, content_post_entities
-- ============================================================

-- EXTENSIONS
create extension if not exists "vector";

-- ============================================================
-- 1. CONTENT AUTHORS (E-E-A-T)
-- ============================================================
create table content_authors (
    id              uuid primary key default gen_random_uuid(),
    name            text not null,
    slug            text not null unique,
    bio             text,
    avatar_url      text,
    social_links    jsonb not null default '{}'::jsonb, -- ex: { "x": "...", "linkedin": "..." }
    created_at      timestamptz not null default now(),
    updated_at      timestamptz not null default now()
);
create index idx_content_authors_slug on content_authors (slug);

-- ============================================================
-- 2. CONTENT CATEGORIES
-- ============================================================
create table content_categories (
    id              uuid primary key default gen_random_uuid(),
    name            text not null,
    slug            text not null unique,
    description     text,
    created_at      timestamptz not null default now(),
    updated_at      timestamptz not null default now()
);
create index idx_content_categories_slug on content_categories (slug);

-- ============================================================
-- 3. CONTENT TAGS
-- ============================================================
create table content_tags (
    id              uuid primary key default gen_random_uuid(),
    name            text not null,
    slug            text not null unique,
    created_at      timestamptz not null default now()
);
create index idx_content_tags_slug on content_tags (slug);

-- ============================================================
-- 4. CONTENT POSTS (Notícias, Tutoriais, Artigos)
-- ============================================================
create table content_posts (
    id              uuid primary key default gen_random_uuid(),
    author_id       uuid not null references content_authors(id) on delete restrict,
    category_id     uuid references content_categories(id) on delete set null,
    
    title           text not null,
    slug            text not null unique,
    excerpt         text,
    content         text, -- Markdown / MDX / JSON Rico
    
    cover_image_url text,
    audio_url       text, -- Para acessibilidade Zero-UI
    
    status          text not null default 'draft' check (status in ('draft', 'review', 'published', 'archived')),
    
    -- AI & Personalização
    embedding       vector(1536), -- Vector embedding para "For You" feeds
    
    published_at    timestamptz,
    created_at      timestamptz not null default now(),
    updated_at      timestamptz not null default now()
);
create index idx_content_posts_slug on content_posts (slug);
create index idx_content_posts_status on content_posts (status);
create index idx_content_posts_published_at on content_posts (published_at desc);

-- Index para busca vetorial eficiente (HNSW)
create index idx_content_posts_embedding on content_posts using hnsw (embedding vector_cosine_ops);

-- ============================================================
-- 5. CONTENT POST TAGS (Muitos para Muitos)
-- ============================================================
create table content_post_tags (
    post_id         uuid not null references content_posts(id) on delete cascade,
    tag_id          uuid not null references content_tags(id) on delete cascade,
    primary key (post_id, tag_id)
);

-- ============================================================
-- 6. CONTENT POST ENTITIES (Linkando artigos com Produtos/Software)
-- ============================================================
create table content_post_entities (
    post_id         uuid not null references content_posts(id) on delete cascade,
    entity_type     text not null check (entity_type in ('product', 'software')),
    entity_id       uuid not null,
    primary key (post_id, entity_type, entity_id)
);
create index idx_content_post_entities on content_post_entities (entity_type, entity_id);

-- ============================================================
-- 7. UPDATED_AT TRIGGERS
-- ============================================================
create trigger trg_content_authors_updated_at before update on content_authors
    for each row execute function set_updated_at();

create trigger trg_content_categories_updated_at before update on content_categories
    for each row execute function set_updated_at();

create trigger trg_content_posts_updated_at before update on content_posts
    for each row execute function set_updated_at();

-- ============================================================
-- 8. ROW-LEVEL SECURITY
-- ============================================================
alter table content_authors enable row level security;
alter table content_categories enable row level security;
alter table content_tags enable row level security;
alter table content_posts enable row level security;
alter table content_post_tags enable row level security;
alter table content_post_entities enable row level security;

-- Public Read Policies
create policy "public_read_authors" on content_authors
    for select using (true);

create policy "public_read_content_categories" on content_categories
    for select using (true);

create policy "public_read_content_tags" on content_tags
    for select using (true);

create policy "public_read_published_posts" on content_posts
    for select using (status = 'published');

create policy "public_read_post_tags" on content_post_tags
    for select using (
        exists (
            select 1 from content_posts
            where content_posts.id = content_post_tags.post_id
            and content_posts.status = 'published'
        )
    );

create policy "public_read_post_entities" on content_post_entities
    for select using (
        exists (
            select 1 from content_posts
            where content_posts.id = content_post_entities.post_id
            and content_posts.status = 'published'
        )
    );
