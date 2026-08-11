// @ts-nocheck
import fs from "node:fs";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "../lib/database.types";

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

const db = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SECRET_KEY!,
  { auth: { persistSession: false } }
);

const CATEGORY_COMPUTE = "7a41bfa5-da52-41cf-a451-eba43218a4fb"; // local-ai-workstations
const CATEGORY_SOFTWARE = "4a5670b7-ec43-4216-90b2-e81a32adbcb8"; // ai-software
const CATEGORY_WEARABLES = "75822cf6-20e9-47ad-a499-9202811742ab"; // wearables

const productsToInsert = [
  {
    category_id: CATEGORY_COMPUTE,
    title: "Mac Studio M2 Ultra",
    slug: "mac-studio-m2-ultra",
    brand: "Apple",
    description: "The ultimate local AI workstation for running massive 70B+ parameters models effortlessly thanks to 192GB of unified memory.",
    design_score: 9.8,
    price_from: 3999,
    price_currency: "USD",
    release_year: 2023,
    status: "published",
    is_indexable: true,
    pros: ["192GB Unified Memory", "Dead silent operation", "Incredible power efficiency"],
    cons: ["Zero upgradeability", "Very expensive at high configs"],
    ideal_for: ["Local LLM researchers", "Pro AI artists"],
    tags: ["apple", "mac", "llm", "workstation"],
    key_features: ["M2 Ultra Chip with 76-core GPU", "Up to 192GB Unified Memory", "800GB/s Memory Bandwidth", "Supports up to 8 displays"],
    specs: {
      processor: "Apple M2 Ultra",
      gpu: "76-core GPU",
      memory: "Up to 192GB Unified",
      storage: "Up to 8TB SSD",
      tier: "enthusiast"
    },
    body_markdown: "## The Local AI King\\n\\nWhen it comes to running massive open-source models like LLaMA 3 70B or Mixtral locally, the Apple Mac Studio M2 Ultra is currently unmatched. While PC builds require multiple expensive RTX 4090s to reach similar VRAM pools, the Mac Studio achieves this through Apple's Unified Memory architecture.\\n\\n### Technical Nuances\\nWith memory bandwidth hitting 800GB/s, token generation speeds are phenomenal for inference tasks. It remains completely silent even under heavy load, contrasting sharply with multi-GPU PC rigs.",
    faqs: [
      { "question": "Can it run LLaMA 70B locally?", "answer": "Yes, if configured with 128GB or 192GB of unified memory, it can run 70B models with high precision easily." },
      { "question": "Is the memory upgradeable?", "answer": "No, unified memory is soldered directly to the SoC. You must configure what you need at purchase." }
    ]
  },
  {
    category_id: CATEGORY_COMPUTE,
    title: "NVIDIA GeForce RTX 4090",
    slug: "nvidia-rtx-4090-fe",
    brand: "NVIDIA",
    description: "The undisputed champion of consumer GPUs, offering 24GB of GDDR6X VRAM and unmatched tensor core performance for AI training and inference.",
    design_score: 9.5,
    price_from: 1599,
    price_currency: "USD",
    release_year: 2022,
    status: "published",
    is_indexable: true,
    pros: ["Unmatched raw compute", "24GB VRAM for large batches", "Excellent software ecosystem (CUDA)"],
    cons: ["Massive physical size", "High power draw (450W)", "Scalper pricing common"],
    ideal_for: ["Machine Learning Engineers", "3D Artists"],
    tags: ["nvidia", "gpu", "cuda", "training"],
    key_features: ["16384 CUDA Cores", "24GB GDDR6X VRAM", "3rd Gen RT Cores", "DLSS 3.0 Support"],
    specs: {
      vram: "24GB GDDR6X",
      tdp: "450W",
      cuda_cores: 16384,
      tier: "enthusiast"
    },
    body_markdown: "## The CUDA Juggernaut\\n\\nThe RTX 4090 remains the holy grail for local AI practitioners who need raw CUDA compute. While Macs win on total memory capacity, NVIDIA wins on speed, software support, and ecosystem maturity.\\n\\n### Why 24GB matters\\nFor fine-tuning models using LoRA or running Stable Diffusion XL, 24GB of VRAM is the sweet spot. Anything less requires heavy quantization, which degrades model output quality.",
    faqs: [
      { "question": "Do I need a new power supply?", "answer": "Most likely. A high quality 850W or 1000W ATX 3.0 power supply is highly recommended." },
      { "question": "Can I fit two in a standard PC?", "answer": "It is extremely difficult due to the 3-slot to 4-slot thickness of most models. Blower-style cards or custom water cooling are required for multi-GPU setups." }
    ]
  },
  {
    category_id: CATEGORY_WEARABLES,
    title: "Whoop 4.0",
    slug: "whoop-4-0",
    brand: "Whoop",
    description: "The definitive screenless fitness and recovery tracker favored by elite athletes, focusing purely on physiological data.",
    design_score: 9.2,
    price_from: 239,
    price_currency: "USD",
    release_year: 2021,
    status: "published",
    is_indexable: true,
    pros: ["Exceptional recovery analytics", "Screenless design removes distractions", "Comfortable for 24/7 wear"],
    cons: ["Requires a monthly subscription", "No screen for quick time checks"],
    ideal_for: ["Biohackers", "Endurance Athletes"],
    tags: ["wearable", "fitness", "recovery"],
    key_features: ["Strain & Recovery scoring", "Any-wear clothing integration", "Haptic alarms", "Continuous HR monitoring"],
    specs: {
      battery_life: "Up to 5 days",
      sensors: "HR, HRV, Temp, SpO2",
      subscription: "Required",
      tier: "premium"
    },
    body_markdown: "## Pure Data, Zero Distractions\\n\\nWhoop 4.0 takes a different approach to wearables by completely removing the screen. It acts purely as a sensor array on your wrist, sending all data to your phone for analysis. This forces a healthier relationship with your metrics.\\n\\n### Recovery is King\\nWhile an Apple Watch focuses on closing rings, Whoop tells you when to rest. Its algorithm combining HRV (Heart Rate Variability), resting heart rate, and sleep quality is considered the gold standard in consumer wearables.",
    faqs: [
      { "question": "Can I use it without a subscription?", "answer": "No, the hardware is functionally useless without an active Whoop membership." },
      { "question": "Is it waterproof?", "answer": "Yes, it is IP68 dustproof and water-resistant up to 10 meters." }
    ]
  }
];

const softwareToInsert = [
  {
    category_id: CATEGORY_SOFTWARE,
    name: "Cursor",
    slug: "cursor-ai",
    description: "The AI-first code editor that is rapidly replacing VS Code for modern developers.",
    price_text: "$20/mo",
    pricing_model: "freemium",
    release_year: 2023,
    status: "published",
    is_indexable: true,
    pros: ["Seamless codebase indexing", "Incredible AI auto-complete (Copilot++ )", "Built on VS Code (all extensions work)"],
    cons: ["Privacy concerns for enterprise", "Fast-moving UI changes"],
    ideal_for: ["Software Engineers", "Indie Hackers"],
    tags: ["editor", "coding", "ai-assistant"],
    key_features: ["Codebase-wide chat", "Copilot++ predictive typing", "Cmd+K inline generation", "Use your own API keys"],
    body_markdown: "## The New Standard for Coding\\n\\nCursor isn't just an extension; it's a fork of VS Code built entirely around AI. By indexing your entire codebase, its AI can understand context spanning multiple files, making refactoring and feature additions remarkably fast.\\n\\n### Copilot++\\nThe predictive typing system is arguably better than GitHub Copilot, often predicting multi-line edits across several files simultaneously.",
    faqs: [
      { "question": "Do my VS Code extensions work?", "answer": "Yes, because Cursor is a fork of VS Code, you can install any extension with one click." },
      { "question": "Is my code sent to servers?", "answer": "Yes, for AI features to work, code snippets are sent. However, Cursor offers a 'Privacy Mode' where code is not stored." }
    ]
  },
  {
    category_id: CATEGORY_SOFTWARE,
    name: "Perplexity",
    slug: "perplexity-ai",
    description: "An AI search engine that delivers direct, cited answers instead of a list of blue links.",
    price_text: "$20/mo",
    pricing_model: "freemium",
    release_year: 2022,
    status: "published",
    is_indexable: true,
    pros: ["Excellent citations and sourcing", "Fast real-time web search", "Pro search asks clarifying questions"],
    cons: ["Can still hallucinate facts", "Struggles with highly niche academic queries"],
    ideal_for: ["Researchers", "Students", "Professionals"],
    tags: ["search", "ai", "research"],
    key_features: ["Real-time web browsing", "Inline source citations", "Copilot/Pro guided search", "PDF analysis"],
    body_markdown: "## The Google Killer?\\n\\nPerplexity has fundamentally shifted how early adopters search the web. Instead of scanning SEO-optimized articles, Perplexity reads them for you, synthesizing the answer with footnotes linking back to the original sources.\\n\\n### Pro Search\\nWhen you use 'Pro Search', the AI acts as a research assistant, asking you clarifying questions before executing a multi-step search query.",
    faqs: [
      { "question": "What models does Perplexity Pro use?", "answer": "Pro users can choose between GPT-4o, Claude 3.5 Sonnet, and Perplexity's own models." },
      { "question": "Is there a free version?", "answer": "Yes, the standard search is free and very capable, but Pro Search uses more advanced reasoning and models." }
    ]
  }
];

async function run() {
  console.log("Seeding products...");
  for (const item of productsToInsert) {
    const { error } = await db.from("products").upsert(item, { onConflict: "slug" });
    if (error) console.error(`Error on ${item.slug}:`, error.message);
    else console.log(`✓ Inserted product ${item.slug}`);
  }

  console.log("\\nSeeding software...");
  for (const item of softwareToInsert) {
    const { error } = await db.from("software").upsert(item, { onConflict: "slug" });
    if (error) console.error(`Error on ${item.slug}:`, error.message);
    else console.log(`✓ Inserted software ${item.slug}`);
  }
  
  console.log("Done seeding trending items.");
}

run().catch(console.error);
