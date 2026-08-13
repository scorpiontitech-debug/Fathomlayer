-- Migration 0016: Supabase Storage Buckets
-- Configure storage for cover images and AI-generated media.

INSERT INTO storage.buckets (id, name, public)
VALUES ('covers', 'covers', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('media', 'media', true)
ON CONFLICT (id) DO NOTHING;

-- Enable RLS
-- Objects table already has RLS enabled by default in Supabase, but we declare policies.

-- Policy: Allow public read access to covers
CREATE POLICY "Public Access to covers"
ON storage.objects FOR SELECT
USING (bucket_id = 'covers');

-- Policy: Allow public read access to media
CREATE POLICY "Public Access to media"
ON storage.objects FOR SELECT
USING (bucket_id = 'media');

-- Policy: Allow service role to upload files
CREATE POLICY "Service Role full access on storage"
ON storage.objects
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);
