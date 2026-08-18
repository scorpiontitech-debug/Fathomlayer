-- Migration: Create AI Benchmarks table for Local Inference Performance

CREATE TABLE IF NOT EXISTS public.ai_benchmarks (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    hardware_id uuid REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
    model_name text NOT NULL, -- e.g., "Llama-3-8B-Instruct"
    quantization text NOT NULL, -- e.g., "Q4_K_M"
    tokens_per_second numeric(10,2) NOT NULL,
    framework text DEFAULT 'llama.cpp' NOT NULL, -- e.g., "llama.cpp", "MLX", "vLLM"
    is_verified boolean DEFAULT false NOT NULL, -- Editorial or Community verified
    submitted_by uuid REFERENCES auth.users(id) ON DELETE SET NULL, -- User who submitted
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    
    -- Constraint to prevent duplicate exact benchmarks from the same submission logic
    UNIQUE (hardware_id, model_name, quantization, framework)
);

-- RLS Policies
ALTER TABLE public.ai_benchmarks ENABLE ROW LEVEL SECURITY;

-- Anyone can read benchmarks
CREATE POLICY "Benchmarks are public" ON public.ai_benchmarks
    FOR SELECT USING (true);

-- Only authenticated users can insert (will be moderated)
CREATE POLICY "Authenticated users can insert benchmarks" ON public.ai_benchmarks
    FOR INSERT TO authenticated WITH CHECK (true);

-- Only admins/editors can update/delete
CREATE POLICY "Admins can update benchmarks" ON public.ai_benchmarks
    FOR UPDATE USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admins can delete benchmarks" ON public.ai_benchmarks
    FOR DELETE USING (auth.jwt() ->> 'role' = 'admin');

-- Add index for fast querying by hardware and model
CREATE INDEX idx_ai_benchmarks_hardware ON public.ai_benchmarks(hardware_id);
CREATE INDEX idx_ai_benchmarks_model ON public.ai_benchmarks(model_name);
