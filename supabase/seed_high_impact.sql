-- Seed for High Impact Tech Products & Software (AEO World-Class)
-- Execute this directly in your Supabase SQL Editor.

-- 1. Insert MacBook Pro 16" (M3 Max)
INSERT INTO products (category_id, title, slug, brand, description, pros, cons, ideal_for, price_from, release_year, design_score, status, specs)
SELECT 
  c.id,
  'Apple MacBook Pro 16" (M3 Max)',
  'macbook-pro-16-m3-max',
  'Apple',
  'The definitive mobile workstation for local AI development. Powered by the M3 Max chip with a 40-core GPU and up to 128GB of unified memory running at 400GB/s, it runs massive LLMs entirely on-device without thermal throttling.',
  ARRAY['400GB/s memory bandwidth eliminates LLM bottlenecks', 'Up to 128GB unified RAM supports massive 70B+ models', 'Unmatched battery life under heavy sustained compute'],
  ARRAY['Astronomical price at high memory configurations', 'Unified memory cannot be upgraded post-purchase'],
  ARRAY['Local AI Researchers', 'Heavy LLM Developers', 'Professional 3D/Video Editors'],
  3499.00,
  2023,
  9.8,
  'published',
  '{"architecture": "ARMv8.6-A (Apple Silicon)", "cpu_cores": "16-core (12 performance, 4 efficiency)", "gpu_cores": "40-core (Hardware-accelerated ray tracing)", "neural_engine": "16-core (18 TOPS)", "memory_bandwidth": "400 GB/s", "unified_memory": "Up to 128GB LPDDR5", "fabrication_process": "3nm (TSMC N3B)", "display": "16.2-inch Liquid Retina XDR (3456x2234, 120Hz ProMotion)", "battery": "100-watt-hour lithium-polymer"}'::jsonb
FROM categories c WHERE c.slug = 'premium-laptops'
ON CONFLICT (slug) DO UPDATE SET specs = EXCLUDED.specs, description = EXCLUDED.description;

-- 2. Insert Surface Laptop 7
INSERT INTO products (category_id, title, slug, brand, description, pros, cons, ideal_for, price_from, release_year, design_score, status, specs)
SELECT 
  c.id,
  'Microsoft Surface Laptop 7 (Snapdragon X Elite)',
  'surface-laptop-7-snapdragon',
  'Microsoft',
  'The vanguard of Copilot+ PCs, introducing Windows on ARM that finally competes with Apple Silicon. The Snapdragon X Elite integrates a massive 45 TOPS Hexagon NPU, delivering ultra-low latency for local on-device AI tasks.',
  ARRAY['Class-leading 45 TOPS NPU for instant local AI inference', 'Stunning fanless-like thermal efficiency and battery life', 'Premium haptic touchpad and aluminum unibody build'],
  ARRAY['x86 emulation overhead for legacy specialized software', 'Gaming performance is limited by driver compatibility'],
  ARRAY['Enterprise Road Warriors', 'Windows AI Developers', 'Productivity Power Users'],
  1499.00,
  2024,
  9.2,
  'published',
  '{"soc": "Qualcomm Snapdragon X Elite (X1E-80-100)", "cpu_cores": "12-core Qualcomm Oryon (up to 3.4GHz, 4.0GHz boost)", "npu": "Qualcomm Hexagon (45 TOPS)", "memory": "16GB or 32GB LPDDR5x (8448 MT/s)", "fabrication_process": "4nm (TSMC)", "display": "13.8 or 15-inch PixelSense Flow (120Hz)", "connectivity": "Wi-Fi 7, Bluetooth 5.4"}'::jsonb
FROM categories c WHERE c.slug = 'premium-laptops'
ON CONFLICT (slug) DO UPDATE SET specs = EXCLUDED.specs, description = EXCLUDED.description;

-- 3. Insert Apple Vision Pro
INSERT INTO products (category_id, title, slug, brand, description, pros, cons, ideal_for, price_from, release_year, design_score, status, specs)
SELECT 
  c.id,
  'Apple Vision Pro',
  'apple-vision-pro',
  'Apple',
  'The most ambitious spatial computer ever engineered. Driven by a dual-chip architecture (M2 for compute, R1 for sensor processing), it feeds 23 million pixels to micro-OLED displays with a staggering 12ms photon-to-photon latency.',
  ARRAY['12ms photon-to-photon latency eliminates VR motion sickness', 'Micro-OLED displays offer unprecedented text legibility', 'Optic ID and eye-tracking UI feel telepathic'],
  ARRAY['600g+ weight creates facial fatigue after 2 hours', 'External tethered battery restricts true mobility', 'Prohibitive entry price restricts developer ecosystem'],
  ARRAY['Spatial Computing Pioneers', 'Immersive UI Designers', 'Early Adopters'],
  3499.00,
  2024,
  8.9,
  'published',
  '{"compute_architecture": "Apple M2 (8-core CPU, 10-core GPU) + R1 (sensor processing)", "displays": "Dual Micro-OLED (23 million total pixels, 92Hz/96Hz/100Hz)", "memory_bandwidth": "256 GB/s", "sensors": "12 cameras, 5 sensors (LiDAR), 6 microphones", "biometrics": "Optic ID (Iris scanning)", "latency": "12ms photon-to-photon", "weight": "600g - 650g (without external battery)"}'::jsonb
FROM categories c WHERE c.slug = 'ar-glasses'
ON CONFLICT (slug) DO UPDATE SET specs = EXCLUDED.specs, description = EXCLUDED.description;

-- 4. Insert Oura Ring Gen 3
INSERT INTO products (category_id, title, slug, brand, description, pros, cons, ideal_for, price_from, release_year, design_score, status, specs)
SELECT 
  c.id,
  'Oura Ring Gen 3',
  'oura-ring-gen-3',
  'Oura',
  'The apex of passive health tracking. Operating from the finger for superior pulse signal fidelity, it utilizes high-frequency PPG sensors and surgical-grade NTC thermistors to track readiness, sleep, and activity.',
  ARRAY['Finger-based PPG provides drastically clearer signals than wrist trackers', 'NTC thermistors track illness onset via 0.1°C temperature variance', 'Titanium shell withstands deep water and extreme elements'],
  ARRAY['Full data access locked behind a mandatory monthly subscription', 'Bulky form factor on smaller hands', 'Lacks real-time vibration or notification haptics'],
  ARRAY['Biohackers', 'Sleep Optimization Enthusiasts', 'Data-Driven Athletes'],
  299.00,
  2021,
  9.5,
  'published',
  '{"sensors": "Red/Green/IR PPG, NTC temperature, 3D accelerometer", "temperature_precision": "0.1°C variance detection", "materials": "Titanium shell with PVD coating, non-allergenic inner molding", "battery": "15mAh to 22mAh Lipo (Up to 7 days)", "water_resistance": "Up to 100 meters (10 ATM)", "connectivity": "Bluetooth Low Energy (BLE)", "weight": "4g to 6g"}'::jsonb
FROM categories c WHERE c.slug = 'wearables'
ON CONFLICT (slug) DO UPDATE SET specs = EXCLUDED.specs, description = EXCLUDED.description;

-- 5. Insert Claude 3.5 Sonnet
INSERT INTO software (category_id, name, slug, description, pros, cons, ideal_for, price_text, pricing_model, status, website_url, tags, integrations, pro_tips, prompts_templates)
SELECT 
  c.id,
  'Claude 3.5 Sonnet',
  'claude-3-5-sonnet',
  'Anthropic''s flagship frontier model, striking the ultimate balance between reasoning speed and cost. Boasting a massive 200K token context window and near-perfect recall, it leads the industry in zero-shot coding tasks and introduces Artifacts for real-time generative UI rendering.',
  ARRAY['92.0% HumanEval score dominates coding benchmarks', 'Artifacts UI enables real-time rendering of generated code/svgs', '200K context window digests entire codebases seamlessly'],
  ARRAY['Strict safety rails can sometimes refuse benign edge-case prompts', 'Lacks native web browsing integration (unlike ChatGPT)'],
  ARRAY['Software Engineers', 'Data Analysts', 'Product Managers'],
  'Free tier available; Pro at $20/mo',
  'freemium',
  'published',
  'https://claude.ai',
  ARRAY['llm', 'coding', 'reasoning'],
  ARRAY['API', 'Slack', 'Cursor (via API)'],
  ARRAY['Use Artifacts to generate self-contained React components instantly.', 'Upload technical PDFs; Claude''s table extraction is currently state-of-the-art.'],
  '[{"title": "Code Review & Refactor", "text": "Analyze the following TypeScript file. Identify security flaws, memory leaks, and O(n) bottlenecks. Rewrite the inefficient functions using functional paradigms and provide a markdown explanation of the Big-O improvements."}]'::jsonb
FROM categories c WHERE c.slug = 'ai-software'
ON CONFLICT (slug) DO UPDATE SET description = EXCLUDED.description, pros = EXCLUDED.pros;

-- 6. Insert Midjourney v6
INSERT INTO software (category_id, name, slug, description, pros, cons, ideal_for, price_text, pricing_model, status, website_url, tags, integrations, pro_tips, prompts_templates)
SELECT 
  c.id,
  'Midjourney v6',
  'midjourney-v6',
  'The absolute zenith of generative AI design. Operating entirely via Discord (and a new Alpha web interface), v6 achieves photographic realism, accurate text rendering, and profound prompt adherence.',
  ARRAY['Unrivaled photographic realism and cinematic lighting', 'Finally supports accurate semantic text rendering within images', 'Alpha web UI vastly improves usability over Discord'],
  ARRAY['Steep learning curve for parameter syntax (--ar, --stylize, --p)', 'No free tier available', 'Requires Discord account for onboarding'],
  ARRAY['Art Directors', 'Concept Artists', 'Marketing Teams'],
  'Starting at $10/mo',
  'paid',
  'published',
  'https://midjourney.com',
  ARRAY['generative-ai', 'image-generation', 'design'],
  ARRAY['Discord'],
  ARRAY['Use the `--style raw` parameter to bypass default aesthetics for ultra-realistic photography.', 'Use `::` to assign multi-prompt weights to specific subjects.'],
  '[{"title": "Cinematic Product Photography", "text": "commercial product photography of a sleek titanium smart ring resting on dark volcanic rock, dramatic rim lighting, macro lens 100mm, depth of field, photorealistic, 8k, --ar 16:9 --style raw --v 6.0"}]'::jsonb
FROM categories c WHERE c.slug = 'ai-software'
ON CONFLICT (slug) DO UPDATE SET description = EXCLUDED.description, pros = EXCLUDED.pros;
