-- Create workflows table
CREATE TABLE public.workflows (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    difficulty TEXT NOT NULL CHECK (difficulty IN ('Beginner', 'Intermediate', 'Advanced')),
    estimated_time TEXT NOT NULL,
    steps JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Note: the 'steps' JSONB will have the structure:
-- [
--   { "title": "Step 1", "description": "...", "software_slug": "cursor" },
--   { "title": "Step 2", "description": "...", "software_slug": "claude" }
-- ]

-- Enable RLS
ALTER TABLE public.workflows ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Workflows are viewable by everyone" ON public.workflows
    FOR SELECT USING (true);

-- Allow authenticated users with role 'service_role' to insert/update
-- (Since we seed via service role, this is mostly handled)
