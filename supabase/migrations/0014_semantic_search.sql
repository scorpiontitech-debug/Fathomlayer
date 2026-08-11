-- ============================================================
-- Fathom Layer — MIGRATION 0014: SEMANTIC SEARCH (AI)
-- Função RPC para busca vetorial no Content Hub
-- ============================================================

-- Função RPC para encontrar posts similares
-- Usa a métrica de cosseno (1 - (embedding <=> query_embedding))
create or replace function match_posts_by_embedding (
  query_embedding vector(1536),
  match_threshold float,
  match_count int,
  category_filter uuid default null
)
returns table (
  id uuid,
  title text,
  slug text,
  excerpt text,
  cover_image_url text,
  status text,
  published_at timestamptz,
  author_id uuid,
  category_id uuid,
  similarity float
)
language plpgsql
as $$
begin
  return query
  select
    p.id,
    p.title,
    p.slug,
    p.excerpt,
    p.cover_image_url,
    p.status,
    p.published_at,
    p.author_id,
    p.category_id,
    1 - (p.embedding <=> query_embedding) as similarity
  from content_posts p
  where p.status = 'published'
    and (category_filter is null or p.category_id = category_filter)
    and 1 - (p.embedding <=> query_embedding) > match_threshold
  order by p.embedding <=> query_embedding
  limit match_count;
end;
$$;
