-- ============================================================
-- Fathom Layer — MIGRATION 0003: HARDENING (advisors do Supabase)
-- search_path fixo nas funções de trigger (lint 0011) e
-- pg_trgm movida para o schema extensions (lint 0014).
-- ============================================================

alter function public.refresh_category_listing_count() set search_path = public, pg_temp;
alter function public.set_updated_at() set search_path = public, pg_temp;
alter function public.refresh_category_gate_on_phase_change() set search_path = public, pg_temp;

alter extension pg_trgm set schema extensions;
