-- ============================================================
-- Fathom Layer — SEED: cluster de lançamento "Hardware para IA Local"
-- Fonte: docs/fathom-layer-seed-hardware-ia-local.md (6 itens reais).
-- Entra pelo fluxo desenhado: staging (synthesized) -> products
-- (pending_review). NADA é publicado aqui — publicar exige revisão
-- humana no /admin/review (design_score + editorial note do operador).
-- Idempotente: on conflict / where not exists.
-- ============================================================

-- Categorias do cluster (launch_phase = 1: cluster de lançamento).
-- is_indexable continua false até 3 itens published (Quality Gate).
insert into categories (name, slug, pillar, description, launch_phase)
values
  ('Local AI Workstations', 'local-ai-workstations', 'compute',
   'Mini PCs, unified-memory systems and DIY builds for running language models locally.', 1),
  ('Setup Peripherals', 'setup-peripherals', 'compute',
   'Keyboards, mice and desk hardware for daily-driver setups.', 1)
on conflict (slug) do nothing;

-- Staging: 6 itens da pesquisa de mercado, payload cru + síntese em EN.
-- source_note registra que as specs vêm da pesquisa e precisam de
-- verificação antes do publish — exatamente o papel do pending_review.
insert into ingestion_staging (target_table, source_name, raw_payload, proposed_category_id, ai_synthesis, status)
select 'products', 'manual_seed_market_research', payload, category_id, synthesis, 'synthesized'
from (
  values
  (
    (select id from categories where slug = 'local-ai-workstations'),
    '{
      "title": "Ryzen 5 + RTX 4060 Ti Build",
      "slug": "ryzen-5-rtx-4060-ti-build",
      "brand": null,
      "specs": {"tier": "entry", "cpu": "AMD Ryzen 5", "gpu": "NVIDIA GeForce RTX 4060 Ti", "vram_gb": 16, "ram_gb": 64, "example_models": "Phi-4-mini (3.8B), Gemma 3 4B", "tokens_per_second": "~90"},
      "tags": ["local-ai", "tier-entry", "diy-build", "runs-phi-4-mini", "runs-gemma-4b"],
      "source_note": "market research 2026; verify against vendor specs before publish"
    }'::jsonb,
    '{"description": "Entry-tier DIY build for local AI: an AMD Ryzen 5 CPU paired with an NVIDIA GeForce RTX 4060 Ti (16 GB VRAM) and 64 GB of system RAM. Runs small models such as Phi-4-mini (3.8B) and Gemma 3 4B at roughly 90 tokens/s — the lowest-cost path in this index to useful local inference.", "method": "seed"}'::jsonb
  ),
  (
    (select id from categories where slug = 'local-ai-workstations'),
    '{
      "title": "Mac Mini M4 Pro (64GB)",
      "slug": "mac-mini-m4-pro-64gb",
      "brand": "Apple",
      "specs": {"tier": "mid", "chip": "Apple M4 Pro", "unified_memory_gb": 64, "example_models": "Gemma 3 27B, Qwen3 30B-A3B", "tokens_per_second": "35-50"},
      "tags": ["local-ai", "tier-mid", "unified-memory", "runs-gemma-27b", "runs-qwen3-30b"],
      "source_note": "market research 2026; verify against vendor specs before publish"
    }'::jsonb,
    '{"description": "Compact unified-memory system built on the Apple M4 Pro with 64 GB shared between CPU and GPU. Runs Gemma 3 27B and Qwen3 30B-A3B at roughly 35-50 tokens/s while operating near-silently — the mid tier of this index for local AI work.", "method": "seed"}'::jsonb
  ),
  (
    (select id from categories where slug = 'local-ai-workstations'),
    '{
      "title": "Minisforum MS-01",
      "slug": "minisforum-ms-01",
      "brand": "Minisforum",
      "specs": {"tier": "mid", "form_factor": "mini-pc", "expandable": true},
      "tags": ["local-ai", "tier-mid", "mini-pc", "expandable"],
      "source_note": "market research 2026; same memory bracket as mid tier; verify configuration before publish"
    }'::jsonb,
    '{"description": "Expandable mini-PC in the same memory bracket as the mid tier of this index. Its distinguishing trait against closed unified-memory systems is serviceability: RAM and storage are user-upgradeable, which extends the useful life of the machine as local models grow.", "method": "seed"}'::jsonb
  ),
  (
    (select id from categories where slug = 'local-ai-workstations'),
    '{
      "title": "GMKtec EVO-X2 (128GB)",
      "slug": "gmktec-evo-x2-128gb",
      "brand": "GMKtec",
      "specs": {"tier": "enthusiast", "chip": "AMD Ryzen AI Max+ 395", "unified_memory_gb": 128, "example_models": "Llama 3.3 70B, Mistral Small 3.1", "tokens_per_second": "15-25"},
      "tags": ["local-ai", "tier-enthusiast", "unified-memory", "runs-llama-70b", "runs-mistral-small"],
      "source_note": "market research 2026; verify against vendor specs before publish"
    }'::jsonb,
    '{"description": "Enthusiast-tier mini workstation: AMD Ryzen AI Max+ 395 with 128 GB of unified memory. Runs Llama 3.3 70B and Mistral Small 3.1 at roughly 15-25 tokens/s — 70B-class models without a discrete GPU, in a small-form-factor chassis.", "method": "seed"}'::jsonb
  ),
  (
    (select id from categories where slug = 'local-ai-workstations'),
    '{
      "title": "Threadripper Pro + Dual RTX 4090 Build",
      "slug": "threadripper-pro-dual-rtx-4090-build",
      "brand": null,
      "specs": {"tier": "professional", "cpu": "AMD Ryzen Threadripper Pro", "gpu": "2x NVIDIA GeForce RTX 4090", "vram_gb_total": 48, "ram_gb": 256, "example_models": "Llama 3.1 405B, gpt-oss-120b", "tokens_per_second": "10-20"},
      "tags": ["local-ai", "tier-professional", "diy-build", "runs-llama-405b", "runs-gpt-oss-120b"],
      "source_note": "market research 2026; verify against vendor specs before publish"
    }'::jsonb,
    '{"description": "Professional-tier workstation: AMD Ryzen Threadripper Pro with two NVIDIA GeForce RTX 4090s (48 GB VRAM total) and 256 GB of RAM. Runs Llama 3.1 405B and gpt-oss-120b at roughly 10-20 tokens/s — the enterprise end of this index for on-premises inference.", "method": "seed"}'::jsonb
  ),
  (
    (select id from categories where slug = 'setup-peripherals'),
    '{
      "title": "Keychron K3 HE",
      "slug": "keychron-k3-he",
      "brand": "Keychron",
      "specs": {"type": "mechanical-keyboard", "switches": "magnetic analog (Hall effect)", "profile": "low-profile"},
      "tags": ["peripheral", "keyboard", "magnetic-switches", "low-profile"],
      "source_note": "market research 2026; verify current pricing/availability before publish"
    }'::jsonb,
    '{"description": "Low-profile mechanical keyboard with magnetic analog (Hall effect) switches, allowing per-key actuation adjustment and analog input. Listed in this index as a setup peripheral for desk-based local AI workstations.", "method": "seed"}'::jsonb
  )
) as seed(category_id, payload, synthesis)
where not exists (
  select 1 from ingestion_staging s
  where s.raw_payload->>'slug' = seed.payload->>'slug'
);

-- Promoção: staging synthesized -> products pending_review (nunca published).
insert into products (category_id, title, slug, brand, description, specs, tags, status)
select
  s.proposed_category_id,
  s.raw_payload->>'title',
  s.raw_payload->>'slug',
  nullif(s.raw_payload->>'brand', ''),
  s.ai_synthesis->>'description',
  coalesce(s.raw_payload->'specs', '{}'::jsonb),
  coalesce(array(select jsonb_array_elements_text(s.raw_payload->'tags')), '{}'),
  'pending_review'
from ingestion_staging s
where s.status = 'synthesized' and s.target_table = 'products'
on conflict (slug) do nothing;

update ingestion_staging
set status = 'approved'
where status = 'synthesized' and target_table = 'products';
