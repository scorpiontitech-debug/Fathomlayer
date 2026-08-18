import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SECRET_KEY! || process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function seedEditorials() {
  console.log("Seeding Editorials for SEO & AEO...");

  const editorials = [
    {
      title: "How to build a Tesla P40 cluster for Local AI",
      slug: "guia-cluster-tesla-p40",
      content_type: "guide",
      body_markdown: `
# How to build a Tesla P40 cluster for Local AI

If you are looking to run 70B parameter models (like Llama 3.3 70B) locally, you have probably encountered the absurd VRAM bottleneck. The most economical solution in 2026? The humble NVIDIA Tesla P40.

## Why the Tesla P40?
The Tesla P40 offers 24GB of GDDR5 VRAM. Despite being slow for training (lack of Tensor Cores), it is incredibly capable for inference (GGUF/llama.cpp) when you pool several of them in parallel.

### The Basic Setup
1. **Motherboard and CPU:** An older X99 platform with a Xeon v4 or 1st-gen Threadripper (plenty of PCIe lanes).
2. **Cooling:** Tesla P40s don't have fans! You will need to 3D print ducts and attach server fans or adapt liquid cooling.
3. **Software:** Use \`llama.cpp\` which supports massive offloading to P40s via the Vulkan API or classic CUDA.

For around $500, you get 48GB of VRAM (two P40s), enough for massive models. For Autonomous Agents running Mastra, this is total independence.
      `,
      tags: ["AI", "Hardware", "DIY", "Local AI"]
    },
    {
      title: "Definitive Guide: Llama 3 vs DeepSeek R1 Locally",
      slug: "guia-llama3-vs-deepseek",
      content_type: "guide",
      body_markdown: `
# Definitive Guide: Llama 3 vs DeepSeek R1 Locally

The open-source market in 2026 is dominated by two colossi. Which one should you choose for your "Local AI Appliance"?

## Llama 3.3 (70B)
Meta's safe bet.
- **Pros:** Massive ecosystem. All tools (Mastra, LangChain) have first-class support.
- **Ideal use:** General assistants and B2B roleplay.

## DeepSeek R1
The hyper-efficient challenger.
- **Pros:** Destroys math and coding benchmarks. The MoE model allows running with lower active VRAM.
- **Ideal use:** Advanced coding (Copilot replacement) and complex data analysis.
      `,
      tags: ["LLM", "Benchmark", "Software"]
    },
    {
      title: "What is the Model Context Protocol (MCP)?",
      slug: "o-que-e-mcp",
      content_type: "glossary",
      body_markdown: `
# What is the Model Context Protocol (MCP)?

The MCP (Model Context Protocol) is an open standard introduced to solve the biggest problem for AI Agents: secure data access.

## The B2B Revolution
Instead of pasting documents into a prompt, MCP allows tools (like Mastra or Claude Desktop) to open secure connections with local servers (databases, Slack, Notion) and pull context on demand.

**Why does it matter?** It is what separates a toy chatbot from an Enterprise AI. With MCP, the Fathom Layer AI can read live technical specs from Supabase without the risk of hallucinating.
      `,
      tags: ["MCP", "Glossary", "AEO"]
    },
    {
      title: "The End of Burn-in: What is MicroLED in Wearables?",
      slug: "microled-em-wearables",
      content_type: "glossary",
      body_markdown: `
# The End of Burn-in: What is MicroLED in Wearables?

For years, the OLED screen was the undisputed king of smartwatches and AR glasses. But OLED has a fatal enemy: burn-in, especially on "Always-On" displays.

## The Arrival of MicroLED
MicroLED uses inorganic materials. It offers the infinite contrast of OLED (perfect blacks) but can reach 10,000 nits of brightness without degrading.

In augmented reality devices (like advanced Snap and XREAL prototypes), this means holograms can finally be seen in broad daylight in the desert.
      `,
      tags: ["Displays", "Wearables", "AR"]
    },
    {
      title: "What is a Local AI Appliance?",
      slug: "local-ai-appliance",
      content_type: "glossary",
      body_markdown: `
# What is a Local AI Appliance?

A **Local AI Appliance** is a new category (2025-2026) of hardware focused 100% on being a low-power private AI server for your home.

Think of them like your internet router, but for intelligence. Devices like the *ClawBox* consume less than 20W and run language models 24/7. This allows you to have the Alexa of the future, entirely private, that never sends your voice to the cloud.
      `,
      tags: ["Privacy", "Local AI", "Hardware"]
    }
  ];

  for (const page of editorials) {
    const { error } = await (supabase as any).from("editorial_pages").upsert({
      title: page.title,
      slug: page.slug,
      content_type: page.content_type,
      body_markdown: page.body_markdown,
      content_language: "en",
      status: "published",
      is_indexable: true,
      tags: page.tags,
      published_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }, { onConflict: "slug" });

    if (error) {
      console.error(`Erro inserindo ${page.slug}:`, error);
    } else {
      console.log(`✅ Editorial inserido: ${page.title}`);
    }
  }

  console.log("Editorials Seed Complete.");
}

seedEditorials().catch(console.error);
