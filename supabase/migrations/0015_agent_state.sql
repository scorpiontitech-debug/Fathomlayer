-- Migration 0015: Agent State Persistence for Mastra
-- Used for durable execution chains and Human-in-the-loop pausing.

CREATE TABLE IF NOT EXISTS public.agent_workflows (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workflow_name TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('running', 'paused', 'completed', 'failed')),
    context JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for security
ALTER TABLE public.agent_workflows ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow service role full access on agent_workflows" 
ON public.agent_workflows
FOR ALL 
TO service_role 
USING (true) 
WITH CHECK (true);
