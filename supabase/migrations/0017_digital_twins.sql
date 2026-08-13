-- Migration 0017: Digital Twins & Biometric Telemetry (Fase 2)
-- Segue padrões rigorosos de segurança e isolamento (Zero Trust / HIPAA readiness).

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Tabela para Gêmeos Digitais (Armazena a representação algorítmica do usuário)
CREATE TABLE IF NOT EXISTS public.digital_twins (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL, -- Referência hipotética à auth.users no Supabase
    metabolic_baseline JSONB DEFAULT '{}'::jsonb,
    stress_threshold FLOAT DEFAULT 0.5,
    last_simulation_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de Telemetria Contínua (Wearables como Abbott Lingo, Apple Watch via ROOK/JondaX)
CREATE TABLE IF NOT EXISTS public.biometric_telemetry (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    source_device TEXT NOT NULL, -- Ex: 'abbott_lingo', 'oura_ring'
    metric_type TEXT NOT NULL,   -- Ex: 'glucose', 'hrv', 'sleep_stages'
    metric_value JSONB NOT NULL, -- Valor numérico ou espectro vetorial
    recorded_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices otimizados para séries temporais e pesquisas por usuário
CREATE INDEX IF NOT EXISTS idx_biometric_user_metric ON public.biometric_telemetry(user_id, metric_type);
CREATE INDEX IF NOT EXISTS idx_biometric_recorded_at ON public.biometric_telemetry(recorded_at DESC);
CREATE UNIQUE INDEX IF NOT EXISTS idx_digital_twins_user ON public.digital_twins(user_id);

-- Ativar Row Level Security (RLS) garantindo a privacidade biométrica (Privacy by Design)
ALTER TABLE public.digital_twins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.biometric_telemetry ENABLE ROW LEVEL SECURITY;

-- Políticas de Segurança Absoluta (Zero Trust)
-- 1. O próprio usuário só pode ler seus próprios sinais vitais
CREATE POLICY "Users can view their own digital twin" 
ON public.digital_twins FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own biometrics" 
ON public.biometric_telemetry FOR SELECT USING (auth.uid() = user_id);

-- 2. A API Service Role (back-end/Mastra/Edge Functions) tem acesso total para calcular a simulação
CREATE POLICY "Service Role full access on twins" 
ON public.digital_twins FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "Service Role full access on biometrics" 
ON public.biometric_telemetry FOR ALL TO service_role USING (true) WITH CHECK (true);
