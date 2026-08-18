import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SECRET_KEY!
);

async function seedIntelligence() {
  console.log("Seeding Intelligence Hub...");

  const { data: categories } = await supabase.from("categories").select("id, slug");
  if (!categories) {
    console.error("No categories found");
    return;
  }
  const catMap = Object.fromEntries(categories.map(c => [c.slug, c.id]));

  const software = [
    // Agent Frameworks
    {
      name: "Mastra", slug: "mastra", categorySlug: "agent-frameworks",
      description: "Opinionated, strongly-typed agent framework for Next.js and TypeScript.",
      price_text: "Open Source", pros: ["Native TypeScript", "Next.js integration", "Telemetry built-in"], cons: ["Newer ecosystem"]
    },
    {
      name: "LangChain", slug: "langchain", categorySlug: "agent-frameworks",
      description: "The most popular and versatile orchestration framework for LLMs.",
      price_text: "Open Source", pros: ["Massive community", "Endless integrations"], cons: ["Can be overly abstracted"]
    },
    {
      name: "SmolAgents", slug: "smolagents", categorySlug: "agent-frameworks",
      description: "Lightweight HuggingFace agents that focus on raw Python code generation.",
      price_text: "Open Source", pros: ["Extremely lightweight", "Code generation focus"], cons: ["Python only"]
    },
    // MCP Servers
    {
      name: "Supabase MCP", slug: "supabase-mcp", categorySlug: "mcp-servers",
      description: "Exposes PostgreSQL database tables and pgvector search natively to agents.",
      price_text: "Free", pros: ["Direct DB access", "pgvector support"], cons: []
    },
    {
      name: "GitHub MCP", slug: "github-mcp", categorySlug: "mcp-servers",
      description: "Allows agents to read repositories, create PRs, and manage issues.",
      price_text: "Free", pros: ["Full repository access", "PR management"], cons: []
    },
    {
      name: "Brave Search MCP", slug: "brave-search-mcp", categorySlug: "mcp-servers",
      description: "Provides real-time web search capabilities to any MCP-compliant agent.",
      price_text: "Free API", pros: ["Real-time data", "Ad-free results"], cons: ["Rate limits apply"]
    },
    // AI Software
    {
      name: "Cursor", slug: "cursor", categorySlug: "ai-software",
      description: "The AI-first code editor that predicts your next edit.",
      price_text: "$20/month", pros: ["Incredible UX", "Composer mode"], cons: ["Subscription required"]
    },
    {
      name: "Windsurf", slug: "windsurf", categorySlug: "ai-software",
      description: "Agentic IDE by Codeium with deep codebase understanding.",
      price_text: "$15/month", pros: ["Agentic capabilities", "Fast indexer"], cons: ["Smaller extension ecosystem"]
    },
    {
      name: "ChatGPT Enterprise", slug: "chatgpt-enterprise", categorySlug: "ai-software",
      description: "Secure, high-speed access to OpenAI models for teams.",
      price_text: "Enterprise", pros: ["Data privacy", "Advanced Data Analysis"], cons: ["Expensive"]
    }
  ];

  for (const s of software) {
    const categoryId = catMap[s.categorySlug];
    if (!categoryId) {
      console.log(`Category not found for ${s.categorySlug}`);
      continue;
    }
    
    const { error } = await supabase.from("software").upsert({
      slug: s.slug,
      category_id: categoryId,
      name: s.name,
      description: s.description,
      price_text: s.price_text,
      pros: s.pros,
      cons: s.cons,
      status: "published",
      is_indexable: true,
      updated_at: new Date().toISOString()
    }, { onConflict: "slug" });

    if (error) console.error(`Error ${s.name}:`, error);
    else console.log(`✅ Injected software: ${s.name}`);
  }

  console.log("Intelligence Seeding Complete.");
}

seedIntelligence().catch(console.error);
