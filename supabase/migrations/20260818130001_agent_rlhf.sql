-- Migration: RLHF & Prompt Policies (Self-Evolution)
CREATE TABLE IF NOT EXISTS public.prompt_policies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agent_role TEXT NOT NULL,
    version INTEGER NOT NULL DEFAULT 1,
    active_prompt TEXT NOT NULL,
    success_rate NUMERIC(5,2) DEFAULT 0.00,
    is_active BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.prompt_policies ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role full access on prompt_policies" ON public.prompt_policies FOR ALL TO service_role USING (true) WITH CHECK (true);
