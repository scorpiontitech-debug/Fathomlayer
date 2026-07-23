-- ============================================================
-- Fathom Layer — MIGRATION 0007: ADD RICH CONTENT TO ITEMS
-- ============================================================

-- Add columns to products
ALTER TABLE products ADD COLUMN body_markdown text;
ALTER TABLE products ADD COLUMN video_url text;
ALTER TABLE products ADD COLUMN faqs jsonb DEFAULT '[]'::jsonb;
ALTER TABLE products ADD COLUMN key_features text[] DEFAULT '{}'::text[];

-- Add columns to software
ALTER TABLE software ADD COLUMN body_markdown text;
ALTER TABLE software ADD COLUMN video_url text;
ALTER TABLE software ADD COLUMN faqs jsonb DEFAULT '[]'::jsonb;
ALTER TABLE software ADD COLUMN key_features text[] DEFAULT '{}'::text[];
