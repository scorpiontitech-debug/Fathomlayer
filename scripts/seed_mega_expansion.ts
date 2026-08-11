import { createClient } from "@supabase/supabase-js";
import type { Database } from "../lib/database.types";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SECRET_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SECRET_KEY");
  process.exit(1);
}

const supabase = createClient<Database>(supabaseUrl, supabaseKey);

// HARDCODED category IDs (we assume these exist or we will just use dummy for testing if needed)
// To be safe, we will first fetch categories by slug to link them dynamically.
const softwareData = [
  {
    categorySlug: "automation",
    name: "Zapier",
    slug: "zapier",
    price_text: "Free tier / $19.99/mo",
    pricing_model: "freemium",
    description: "The industry standard for connecting apps and automating workflows. Zapier integrates with over 7,000 apps and now features AI-driven zap creation, allowing you to describe your automation in plain English.",
    integrations: ["Slack", "Gmail", "Salesforce", "Notion", "Airtable", "OpenAI"],
    pro_tips: [
      "Use 'Paths' to create conditional logic in your zaps without needing separate workflows.",
      "Zapier's built-in Formatter tool is perfect for cleaning up AI-generated text before sending it to a database."
    ],
    prompts_templates: [
      {
        title: "AI Zap Builder Prompt",
        text: "Create a zap that triggers when a new lead is added to my Facebook Lead Ads. Then, use ChatGPT to summarize their request, and send that summary to a specific Slack channel. Finally, add the lead to my Mailchimp audience."
      }
    ]
  },
  {
    categorySlug: "automation",
    name: "n8n",
    slug: "n8n",
    price_text: "Free (Self-hosted) / €20/mo",
    pricing_model: "freemium",
    description: "A powerful, fair-code workflow automation tool. n8n is highly favored by developers for its node-based visual interface and the ability to self-host for complete data privacy.",
    integrations: ["PostgreSQL", "GitHub", "Stripe", "Discord", "OpenAI", "Claude"],
    pro_tips: [
      "You can copy and paste entire workflows as JSON strings directly into the n8n canvas.",
      "Use the 'Execute Command' node to run local bash scripts alongside your cloud automations."
    ],
    prompts_templates: [
      {
        title: "Database Sync Workflow (JSON)",
        text: '{"nodes":[{"parameters":{},"name":"Start","type":"n8n-nodes-base.start","typeVersion":1,"position":[250,300]},{"parameters":{"operation":"getAll","returnAll":true},"name":"MySQL","type":"n8n-nodes-base.mySql","typeVersion":1,"position":[450,300]}],"connections":{"Start":{"main":[[{"node":"MySQL","type":"main","index":0}]]}}}'
      }
    ]
  },
  {
    categorySlug: "video-generators",
    name: "Google Veo 3.1",
    slug: "google-veo",
    price_text: "Included in Google One AI Premium",
    pricing_model: "paid",
    description: "Google's flagship video generation model, capable of producing highly realistic, 1080p video with consistent physics. Veo 3.1 uniquely features native dialogue generation and spatial audio.",
    integrations: ["YouTube", "Google Workspace", "Google Ads"],
    pro_tips: [
      "Specify camera movements using standard cinematography terms like 'pan left', 'dolly zoom', or 'tracking shot'.",
      "Veo understands cinematic lighting; specify 'golden hour', 'neon cyberpunk', or 'volumetric lighting' for better results."
    ],
    prompts_templates: [
      {
        title: "Cinematic Product Reveal",
        text: "A macro tracking shot of a sleek, matte black espresso machine. Steam rises gently from the group head. Cinematic lighting, deep shadows, 4k resolution, photorealistic. The camera slowly pushes in as a shot is pulled."
      }
    ]
  },
  {
    categorySlug: "coding-assistants",
    name: "GitHub Copilot",
    slug: "github-copilot",
    price_text: "$10/mo",
    pricing_model: "paid",
    description: "The most widely adopted AI coding assistant. Integrated directly into your IDE, Copilot provides real-time autocomplete suggestions and features a chat interface for explaining and refactoring code.",
    integrations: ["VS Code", "Visual Studio", "JetBrains", "Neovim"],
    pro_tips: [
      "Use inline chat (Cmd+I) to refactor code without leaving your current file context.",
      "Write a detailed comment block explaining the function you want, and Copilot will usually write the entire function body for you."
    ],
    prompts_templates: [
      {
        title: "Refactor to React Hooks",
        text: "Refactor this class component into a functional component using React Hooks (useState and useEffect). Ensure all lifecycle methods are properly translated."
      }
    ]
  },
  {
    categorySlug: "coding-assistants",
    name: "Lovable",
    slug: "lovable",
    price_text: "$20/mo",
    pricing_model: "freemium",
    description: "The rising star of 'vibe coding'. Lovable allows you to build full-stack web applications by simply describing them in natural language. It handles the frontend, backend, and deployment.",
    integrations: ["GitHub", "Supabase", "Vercel"],
    pro_tips: [
      "Start with a highly detailed 'master prompt' that includes your color scheme, database requirements, and user roles.",
      "You can paste Figma designs directly into Lovable to have it generate the UI automatically."
    ],
    prompts_templates: [
      {
        title: "SaaS Dashboard MVP",
        text: "Build a modern, dark-mode SaaS dashboard using Next.js and Tailwind CSS. It should have a sidebar navigation, a KPI overview section with 4 metric cards, and a data table showing recent transactions. Use a glassmorphism design aesthetic with subtle purple accents."
      }
    ]
  },
  {
    categorySlug: "productivity",
    name: "Notion AI",
    slug: "notion-ai",
    price_text: "Add-on: $8/mo",
    pricing_model: "paid",
    description: "Integrates AI directly into your Notion workspace. It can summarize long documents, extract action items from meeting notes, and rewrite text for different tones without switching tabs.",
    integrations: ["Slack", "Google Drive", "Jira", "Figma"],
    pro_tips: [
      "Press the spacebar on an empty block to instantly bring up the Notion AI prompt.",
      "Use the 'Ask Notion' Q&A feature to query your entire workspace, e.g., 'What were the action items from last week's marketing sync?'"
    ],
    prompts_templates: [
      {
        title: "Meeting Summary Extractor",
        text: "Read the notes above. Extract a bulleted list of the top 3 key decisions made, and create a table assigning all action items to the respective team members with due dates."
      }
    ]
  },
  {
    categorySlug: "productivity",
    name: "NotebookLM",
    slug: "notebooklm",
    price_text: "Free",
    pricing_model: "free",
    description: "Google's personalized AI research assistant. Upload your PDFs, Google Docs, and web links, and NotebookLM becomes an expert on your specific source material. Famous for its 'Audio Overview' feature that turns documents into a realistic podcast.",
    integrations: ["Google Drive", "Google Docs"],
    pro_tips: [
      "Upload up to 50 sources to create a massive interconnected knowledge base for a specific project.",
      "Generate an 'Audio Overview' and listen to two AI hosts discuss your documents on your commute."
    ],
    prompts_templates: [
      {
        title: "Research Synthesizer",
        text: "Based on the uploaded scientific papers, synthesize the main arguments regarding [Topic]. Highlight where the authors agree and disagree, and provide citations to the specific documents."
      }
    ]
  }
];

async function seedMegaExpansion() {
  console.log("Fetching categories to map IDs...");
  const { data: categories } = await supabase.from("categories").select("id, slug");
  if (!categories) {
    console.error("Failed to fetch categories");
    return;
  }
  
  const categoryMap = categories.reduce((acc, cat) => {
    acc[cat.slug] = cat.id;
    return acc;
  }, {} as Record<string, string>);

  console.log("Seeding Utility Layer software...");

  for (const item of softwareData) {
    // If the category doesn't exist, fallback to the first one available (for safety in testing)
    const categoryId = categoryMap[item.categorySlug] || categories[0].id;

    const { error } = await supabase
      .from("software")
      .upsert({
        slug: item.slug,
        category_id: categoryId,
        name: item.name,
        price_text: item.price_text,
        pricing_model: item.pricing_model,
        description: item.description,
        integrations: item.integrations,
        pro_tips: item.pro_tips,
        prompts_templates: item.prompts_templates as any,
        is_indexable: true,
        status: "published",
        tags: ["ai", "2026-trending"],
        faqs: [],
        key_features: [],
        ideal_for: [],
        pros: [],
        cons: [],
        updated_at: new Date().toISOString()
      }, { onConflict: "slug" });

    if (error) {
      console.error(`Error inserting ${item.name}:`, error.message);
    } else {
      console.log(`✅ Seeded: ${item.name}`);
    }
  }

  console.log("Mega Expansion Seeding Complete!");
}

seedMegaExpansion();
