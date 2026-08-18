-- Migration: Agent Swarm Task Queue & Logging
-- Includes agent_tasks and content_synthesis_log as defined in the Swarm Architecture

CREATE TABLE IF NOT EXISTS public.agent_tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agent_role TEXT NOT NULL,
    task_type TEXT NOT NULL,
    payload JSONB DEFAULT '{}'::jsonb,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'running', 'completed', 'failed')),
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE
);

CREATE TABLE IF NOT EXISTS public.content_synthesis_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    staging_id UUID, -- assumes ingestion_staging exists (if not, this is a soft reference)
    agent_role TEXT NOT NULL,
    model_used TEXT NOT NULL,
    tokens_used INTEGER,
    estimated_cost_usd NUMERIC(10,4),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.agent_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_synthesis_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow service role full access on agent_tasks" ON public.agent_tasks FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Allow service role full access on content_synthesis_log" ON public.content_synthesis_log FOR ALL TO service_role USING (true) WITH CHECK (true);
