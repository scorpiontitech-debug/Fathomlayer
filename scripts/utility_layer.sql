-- Add Utility Layer columns to the software table
ALTER TABLE public.software
ADD COLUMN IF NOT EXISTS pro_tips text[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS prompts_templates jsonb DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS integrations text[] DEFAULT '{}';

-- Notify PostgREST to reload schema
NOTIFY pgrst, 'reload schema';
