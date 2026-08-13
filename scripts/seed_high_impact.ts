import fs from "node:fs";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";
import type { Database, Json } from "../lib/database.types";

function loadEnvLocal() {
  const file = path.join(process.cwd(), ".env.local");
  if (!fs.existsSync(file)) return;
  for (const line of fs.readFileSync(file, "utf8").split(/\r?\n/)) {
    const match = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);
    if (!match) continue;
    const [, key, rawValue] = match;
    if (process.env[key] !== undefined) continue;
    process.env[key] = rawValue.replace(/^["']|["']$/g, "");
  }
}
loadEnvLocal();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const secretKey = process.env.SUPABASE_SECRET_KEY;
if (!supabaseUrl || !secretKey) {
  console.error("Missing env vars");
  process.exit(1);
}

const db = createClient<Database>(supabaseUrl, secretKey, {
  auth: { persistSession: false },
});

async function main() {
  // 1. Fetch categories
  const { data: categories, error: catError } = await db.from("categories").select("id, slug, pillar");
  if (catError) throw catError;

  const getCatId = (slug: string) => {
    const cat = categories.find((c) => c.slug === slug);
    if (!cat) throw new Error(`Category not found: ${slug}`);
    return cat.id;
  };

  const laptopsCat = getCatId("premium-laptops");
  const wearablesCat = getCatId("wearables");
  const arGlassesCat = getCatId("ar-glasses");
  const aiSoftwareCat = getCatId("ai-software");

  // 2. Prepare Products
  const products = [
    {
      category_id: laptopsCat,
      title: 'Apple MacBook Pro 16" (M3 Max)',
      slug: "macbook-pro-16-m3-max",
      brand: "Apple",
      description: "The definitive mobile workstation for local AI development. Powered by the M3 Max chip with a 40-core GPU and up to 128GB of unified memory running at 400GB/s, it runs massive LLMs (like Llama 3 70B quantized) entirely on-device without thermal throttling.",
      pros: ["400GB/s memory bandwidth eliminates LLM bottlenecks", "Up to 128GB unified RAM supports massive 70B+ models", "Unmatched battery life under heavy sustained compute"],
      cons: ["Astronomical price at high memory configurations", "Unified memory cannot be upgraded post-purchase"],
      ideal_for: ["Local AI Researchers", "Heavy LLM Developers", "Professional 3D/Video Editors"],
      price_from: 3499.00,
      release_year: 2023,
      design_score: 9.8,
      status: "published",
      specs: {
        "architecture": "ARMv8.6-A (Apple Silicon)",
        "cpu_cores": "16-core (12 performance, 4 efficiency)",
        "gpu_cores": "40-core (Hardware-accelerated ray tracing)",
        "neural_engine": "16-core (18 TOPS)",
        "memory_bandwidth": "400 GB/s",
        "unified_memory": "Up to 128GB LPDDR5",
        "fabrication_process": "3nm (TSMC N3B)",
        "display": "16.2-inch Liquid Retina XDR (3456x2234, 120Hz ProMotion)",
        "battery": "100-watt-hour lithium-polymer"
      }
    },
    {
      category_id: laptopsCat,
      title: "Microsoft Surface Laptop 7 (Snapdragon X Elite)",
      slug: "surface-laptop-7-snapdragon",
      brand: "Microsoft",
      description: "The vanguard of Copilot+ PCs, introducing Windows on ARM that finally competes with Apple Silicon. The Snapdragon X Elite integrates a massive 45 TOPS Hexagon NPU, delivering ultra-low latency for local on-device AI tasks while achieving multi-day battery efficiency.",
      pros: ["Class-leading 45 TOPS NPU for instant local AI inference", "Stunning fanless-like thermal efficiency and battery life", "Premium haptic touchpad and aluminum unibody build"],
      cons: ["x86 emulation overhead for legacy specialized software", "Gaming performance is limited by driver compatibility"],
      ideal_for: ["Enterprise Road Warriors", "Windows AI Developers", "Productivity Power Users"],
      price_from: 1499.00,
      release_year: 2024,
      design_score: 9.2,
      status: "published",
      specs: {
        "soc": "Qualcomm Snapdragon X Elite (X1E-80-100)",
        "cpu_cores": "12-core Qualcomm Oryon (up to 3.4GHz, 4.0GHz boost)",
        "npu": "Qualcomm Hexagon (45 TOPS)",
        "memory": "16GB or 32GB LPDDR5x (8448 MT/s)",
        "fabrication_process": "4nm (TSMC)",
        "display": "13.8 or 15-inch PixelSense Flow (120Hz)",
        "connectivity": "Wi-Fi 7, Bluetooth 5.4"
      }
    },
    {
      category_id: arGlassesCat,
      title: "Apple Vision Pro",
      slug: "apple-vision-pro",
      brand: "Apple",
      description: "The most ambitious spatial computer ever engineered. Driven by a dual-chip architecture (M2 for compute, R1 for zero-latency sensor processing), it feeds 23 million pixels to micro-OLED displays with a staggering 12ms photon-to-photon latency, completely redefining immersive human-computer interaction.",
      pros: ["12ms photon-to-photon latency eliminates VR motion sickness", "Micro-OLED displays offer unprecedented text legibility", "Optic ID and eye-tracking UI feel telepathic"],
      cons: ["600g+ weight creates facial fatigue after 2 hours", "External tethered battery restricts true mobility", "Prohibitive entry price restricts developer ecosystem"],
      ideal_for: ["Spatial Computing Pioneers", "Immersive UI Designers", "Early Adopters"],
      price_from: 3499.00,
      release_year: 2024,
      design_score: 8.9,
      status: "published",
      specs: {
        "compute_architecture": "Apple M2 (8-core CPU, 10-core GPU) + R1 (sensor processing)",
        "displays": "Dual Micro-OLED (23 million total pixels, 92Hz/96Hz/100Hz)",
        "memory_bandwidth": "256 GB/s",
        "sensors": "12 cameras, 5 sensors (LiDAR), 6 microphones",
        "biometrics": "Optic ID (Iris scanning)",
        "latency": "12ms photon-to-photon",
        "weight": "600g - 650g (without external battery)"
      }
    },
    {
      category_id: wearablesCat,
      title: "Oura Ring Gen 3",
      slug: "oura-ring-gen-3",
      brand: "Oura",
      description: "The apex of passive health tracking. Operating from the finger for superior pulse signal fidelity, it utilizes high-frequency PPG sensors and surgical-grade NTC thermistors. It distills complex biometric data into actionable readiness, sleep, and activity scores via heavily refined machine learning models.",
      pros: ["Finger-based PPG provides drastically clearer signals than wrist trackers", "NTC thermistors track illness onset via 0.1°C temperature variance", "Titanium shell withstands deep water and extreme elements"],
      cons: ["Full data access locked behind a mandatory monthly subscription", "Bulky form factor on smaller hands", "Lacks real-time vibration or notification haptics"],
      ideal_for: ["Biohackers", "Sleep Optimization Enthusiasts", "Data-Driven Athletes"],
      price_from: 299.00,
      release_year: 2021,
      design_score: 9.5,
      status: "published",
      specs: {
        "sensors": "Red/Green/IR PPG, NTC temperature, 3D accelerometer",
        "temperature_precision": "0.1°C variance detection",
        "materials": "Titanium shell with PVD coating, non-allergenic inner molding",
        "battery": "15mAh to 22mAh Lipo (Up to 7 days)",
        "water_resistance": "Up to 100 meters (10 ATM)",
        "connectivity": "Bluetooth Low Energy (BLE)",
        "weight": "4g to 6g"
      }
    }
  ];

  // 3. Prepare Software
  const software = [
    {
      category_id: aiSoftwareCat,
      name: "Claude 3.5 Sonnet",
      slug: "claude-3-5-sonnet",
      description: "Anthropic's flagship frontier model, striking the ultimate balance between reasoning speed and cost. Boasting a massive 200K token context window and near-perfect recall, it leads the industry in zero-shot coding tasks (92.0% HumanEval) and introduces Artifacts for real-time generative UI rendering.",
      pros: ["92.0% HumanEval score dominates coding benchmarks", "Artifacts UI enables real-time rendering of generated code/svgs", "200K context window digests entire codebases seamlessly"],
      cons: ["Strict safety rails can sometimes refuse benign edge-case prompts", "Lacks native web browsing integration (unlike ChatGPT)"],
      ideal_for: ["Software Engineers", "Data Analysts", "Product Managers"],
      price_text: "Free tier available; Pro at $20/mo",
      pricing_model: "freemium",
      status: "published",
      website_url: "https://claude.ai",
      tags: ["llm", "coding", "reasoning"],
      integrations: ["API", "Slack", "Cursor (via API)"],
      pro_tips: ["Use Artifacts to generate self-contained React components instantly.", "Upload technical PDFs; Claude's table extraction is currently state-of-the-art."],
      prompts_templates: [
        {
          "title": "Code Review & Refactor",
          "text": "Analyze the following TypeScript file. Identify security flaws, memory leaks, and O(n) bottlenecks. Rewrite the inefficient functions using functional paradigms and provide a markdown explanation of the Big-O improvements."
        }
      ]
    },
    {
      category_id: aiSoftwareCat,
      name: "Midjourney v6",
      slug: "midjourney-v6",
      description: "The absolute zenith of generative AI design. Operating entirely via Discord (and a new Alpha web interface), v6 achieves photographic realism, accurate text rendering, and profound prompt adherence. It eliminates the 'AI look' through sophisticated sub-prompting and `--style raw` parameters.",
      pros: ["Unrivaled photographic realism and cinematic lighting", "Finally supports accurate semantic text rendering within images", "Alpha web UI vastly improves usability over Discord"],
      cons: ["Steep learning curve for parameter syntax (--ar, --stylize, --p)", "No free tier available", "Requires Discord account for onboarding"],
      ideal_for: ["Art Directors", "Concept Artists", "Marketing Teams"],
      price_text: "Starting at $10/mo",
      pricing_model: "paid",
      status: "published",
      website_url: "https://midjourney.com",
      tags: ["generative-ai", "image-generation", "design"],
      integrations: ["Discord"],
      pro_tips: ["Use the `--style raw` parameter to bypass default aesthetics for ultra-realistic photography.", "Use `::` to assign multi-prompt weights to specific subjects."],
      prompts_templates: [
        {
          "title": "Cinematic Product Photography",
          "text": "commercial product photography of a sleek titanium smart ring resting on dark volcanic rock, dramatic rim lighting, macro lens 100mm, depth of field, photorealistic, 8k, --ar 16:9 --style raw --v 6.0"
        }
      ]
    }
  ];

  // 4. Inject Products
  for (const p of products) {
    const { error } = await db.from("products").upsert({ ...p }, { onConflict: "slug" });
    if (error) console.error(`Error inserting ${p.slug}:`, error.message);
    else console.log(`Injected product: ${p.slug}`);
  }

  // 5. Inject Software
  for (const s of software) {
    const { error } = await (db as any).from("software").upsert({ ...s }, { onConflict: "slug" });
    if (error) console.error(`Error inserting ${s.slug}:`, error.message);
    else console.log(`Injected software: ${s.slug}`);
  }

  console.log("High impact seeding complete!");
}

main().catch(console.error);
