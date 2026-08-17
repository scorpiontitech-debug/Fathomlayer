import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase keys");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const softwareData = [
  { name: "Claude 3.5 Sonnet", slug: "claude-3-5-sonnet", description: "Anthropic's fastest and most intelligent frontier model.", pros: ["Incredible coding capability", "Fast inference"], cons: ["Strict safety rails"], price_from: 15 },
  { name: "GPT-4o", slug: "gpt-4o", description: "OpenAI's flagship omni model.", pros: ["Multimodal native", "Huge context window"], cons: ["Can be expensive at scale"], price_from: 5 },
  { name: "Llama 3.1 405B", slug: "llama-3-1-405b", description: "Meta's open-weights behemoth.", pros: ["Open weights", "GPT-4 level reasoning"], cons: ["Requires massive VRAM to run locally"], price_from: 0 },
  { name: "DeepSeek R1", slug: "deepseek-r1", description: "Leading Chinese foundation model with exceptional math reasoning.", pros: ["Cheap API", "High math scores"], cons: ["Less native integrations"], price_from: 1 },
  { name: "Gemini 1.5 Pro", slug: "gemini-1-5-pro", description: "Google's 2M context window powerhouse.", pros: ["Massive context window", "Native Google integration"], cons: ["Inconsistent reasoning sometimes"], price_from: 7 },
  { name: "CrewAI", slug: "crewai", description: "Framework for orchestrating autonomous AI agents.", pros: ["Easy to use", "Role-based architecture"], cons: ["Overhead for simple tasks"], price_from: 0 },
  { name: "AutoGPT", slug: "autogpt", description: "The original autonomous AI agent.", pros: ["Pioneering architecture", "Large community"], cons: ["Often gets stuck in loops"], price_from: 0 },
  { name: "Mistral Large 2", slug: "mistral-large-2", description: "European flagship frontier model.", pros: ["Multilingual", "Strong coding"], cons: ["Closed source"], price_from: 3 },
  { name: "Qwen 2.5 72B", slug: "qwen-2-5-72b", description: "Alibaba's top open-weights model.", pros: ["Excellent coding", "Multilingual"], cons: ["Heavy to run locally"], price_from: 0 },
  { name: "LangChain", slug: "langchain", description: "The standard library for building LLM applications.", pros: ["Huge ecosystem", "Tons of integrations"], cons: ["Steep learning curve", "Abstraction leaks"], price_from: 0 },
  { name: "LlamaIndex", slug: "llamaindex", description: "Data framework for LLM applications.", pros: ["Best for RAG", "Easy data connectors"], cons: ["Less agentic focus than others"], price_from: 0 },
  { name: "ChromaDB", slug: "chromadb", description: "AI-native open-source vector database.", pros: ["Easy local setup", "Python native"], cons: ["Not ideal for massive enterprise scale"], price_from: 0 },
  { name: "Pinecone", slug: "pinecone", description: "Managed vector database for AI.", pros: ["Fully managed", "Highly scalable"], cons: ["No local self-host option", "Can get expensive"], price_from: 70 },
  { name: "Ollama", slug: "ollama", description: "Get up and running with large language models locally.", pros: ["Dead simple installation", "Mac/Windows/Linux"], cons: ["Limited fine-tuning options"], price_from: 0 },
  { name: "LM Studio", slug: "lm-studio", description: "Discover, download, and run local LLMs.", pros: ["Great GUI", "Cross-platform"], cons: ["Closed source UI"], price_from: 0 }
];

const hardwareData = [
  { title: "NVIDIA RTX 5090", slug: "nvidia-rtx-5090", description: "The absolute pinnacle of consumer AI inference.", pros: ["Unmatched speed", "Large VRAM"], cons: ["Extremely expensive", "High power draw"], price_from: 1999 },
  { title: "NVIDIA RTX 4090", slug: "nvidia-rtx-4090", description: "The current king of local AI workstations.", pros: ["24GB VRAM", "Fast tensor cores"], cons: ["Expensive", "Large physical size"], price_from: 1599 },
  { title: "Apple Mac Studio M2 Ultra", slug: "apple-mac-studio-m2-ultra", description: "Unified memory powerhouse for running huge models.", pros: ["Up to 192GB unified RAM", "Low power"], cons: ["Slow token generation compared to NVIDIA"], price_from: 3999 },
  { title: "Tesla P40", slug: "tesla-p40", description: "The budget king for 24GB VRAM.", pros: ["Very cheap on eBay", "24GB VRAM"], cons: ["Old architecture", "Requires custom cooling"], price_from: 150 },
  { title: "NVIDIA RTX 3090", slug: "nvidia-rtx-3090", description: "The sweet spot for dual-GPU local AI setups.", pros: ["24GB VRAM", "Used market is cheap"], cons: ["High power consumption"], price_from: 700 },
  { title: "Coral Edge TPU", slug: "coral-edge-tpu", description: "Google's USB accelerator for local ML inference.", pros: ["Very low power", "Cheap"], cons: ["Only supports TFLite", "Old tech"], price_from: 60 },
  { title: "Raspberry Pi 5", slug: "raspberry-pi-5", description: "The standard for IoT edge computing.", pros: ["PCIe slot", "Active community"], cons: ["No native NPU"], price_from: 80 },
  { title: "Oura Ring Gen 3", slug: "oura-ring-gen-3", description: "The standard for smart rings and sleep tracking.", pros: ["Highly accurate", "Comfortable"], cons: ["Monthly subscription"], price_from: 299 },
  { title: "Samsung Galaxy Ring", slug: "samsung-galaxy-ring", description: "Samsung's entry into the smart ring ecosystem.", pros: ["No subscription", "Samsung Health integration"], cons: ["Android only"], price_from: 399 },
  { title: "Ultrahuman Ring Air", slug: "ultrahuman-ring-air", description: "The lightweight, subscription-free alternative.", pros: ["No subscription", "Very light"], cons: ["App UI is cluttered"], price_from: 349 },
  { title: "Whoop 4.0", slug: "whoop-4-0", description: "The hardcore athlete's wearable.", pros: ["Amazing recovery insights", "No screen"], cons: ["Expensive monthly sub"], price_from: 30 },
  { title: "Intel Gaudi 3", slug: "intel-gaudi-3", description: "Intel's enterprise AI accelerator.", pros: ["Great cost/performance", "Open ethernet"], cons: ["Software ecosystem trailing NVIDIA"], price_from: 15000 },
  { title: "AMD Instinct MI300X", slug: "amd-instinct-mi300x", description: "AMD's flagship datacenter GPU.", pros: ["192GB HBM3", "Cheaper than H100"], cons: ["ROCm software stack"], price_from: 15000 },
  { title: "Snapdragon X Elite", slug: "snapdragon-x-elite", description: "ARM processor with powerful 45 TOPS NPU.", pros: ["Great battery", "Fast NPU for Windows"], cons: ["x86 emulation overhead"], price_from: 1000 },
  { title: "Apple M4", slug: "apple-m4", description: "Apple's latest silicon with an upgraded neural engine.", pros: ["Incredible single core", "Fast NPU"], cons: ["Locked ecosystem"], price_from: 999 }
];

async function seedPSEO() {
  console.log("Fetching a category ID...");
  const { data: category } = await supabase.from("categories").select("id").limit(1).single();
  const categoryId = category?.id || null;

  console.log("Seeding Software...");
  for (const sw of softwareData) {
    const { data: existing } = await supabase.from("software").select("id").eq("slug", sw.slug).single();
    if (!existing) {
      await supabase.from("software").insert({ ...sw, category_id: categoryId });
      console.log(`[Inserted] Software: ${sw.slug}`);
    } else {
      console.log(`[SKIPPED] Software: ${sw.slug}`);
    }
  }

  console.log("Seeding Products...");
  for (const hw of hardwareData) {
    const { data: existing } = await supabase.from("products").select("id").eq("slug", hw.slug).single();
    if (!existing) {
      await supabase.from("products").insert({ ...hw, category_id: categoryId });
      console.log(`[Inserted] Product: ${hw.slug}`);
    } else {
       console.log(`[SKIPPED] Product: ${hw.slug}`);
    }
  }

  console.log("pSEO Seeding Completed!");
}

seedPSEO();
