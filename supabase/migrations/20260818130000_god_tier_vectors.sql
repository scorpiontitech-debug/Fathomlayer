-- Migration: God-Tier Vectors (Semantic Graph)
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS embedding vector(768);
ALTER TABLE public.software ADD COLUMN IF NOT EXISTS embedding vector(768);

CREATE INDEX IF NOT EXISTS idx_products_embedding ON public.products USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);
CREATE INDEX IF NOT EXISTS idx_software_embedding ON public.software USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

CREATE OR REPLACE FUNCTION match_fathom_entities(
  query_embedding vector(768),
  match_threshold float,
  match_count int
)
RETURNS TABLE (
  id uuid,
  title text,
  entity_type text,
  similarity float
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT p.id, p.title, 'product' AS entity_type, 1 - (p.embedding <=> query_embedding) AS similarity
  FROM public.products p
  WHERE p.embedding IS NOT NULL AND 1 - (p.embedding <=> query_embedding) > match_threshold
  UNION ALL
  SELECT s.id, s.name AS title, 'software' AS entity_type, 1 - (s.embedding <=> query_embedding) AS similarity
  FROM public.software s
  WHERE s.embedding IS NOT NULL AND 1 - (s.embedding <=> query_embedding) > match_threshold
  ORDER BY similarity DESC
  LIMIT match_count;
END;
$$;
