-- ============================================================
-- Fathom Layer — MIGRATION 0006: ADD ITEM IMAGES
-- ============================================================

-- Add image_url to products
alter table products add column image_url text;

-- Add image_url to software
alter table software add column image_url text;
