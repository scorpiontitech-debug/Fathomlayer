-- Migration 0020_live_events.sql
-- Creates a table for global live events (searches, price drops, trending hits)
-- Enables Supabase Realtime for this table.

CREATE TABLE IF NOT EXISTS public.live_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_type TEXT NOT NULL, -- e.g., 'search', 'price_drop', 'trending'
    payload JSONB NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Habilitar RLS (Apenas leitura pública, escrita apenas via functions seguras ou service_role)
ALTER TABLE public.live_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access on live_events"
    ON public.live_events
    FOR SELECT
    USING (true);

-- Ativar o replica identity para que o realtime funcione perfeitamente com updates/deletes (mesmo sendo um log append-only)
ALTER TABLE public.live_events REPLICA IDENTITY FULL;

-- Adicionar a tabela à publicação do supabase_realtime
BEGIN;
  -- Verifica se a publicação existe (Supabase cria por padrão)
  DO $$
  BEGIN
    IF NOT EXISTS (
      SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime'
    ) THEN
      CREATE PUBLICATION supabase_realtime;
    END IF;
  END
  $$;
  
  -- Adiciona a tabela
  ALTER PUBLICATION supabase_realtime ADD TABLE public.live_events;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END;
