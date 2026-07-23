import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SECRET_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing env vars');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const categoryId = "4a5670b7-ec43-4216-90b2-e81a32adbcb8"; // AI Software

const softwareItems = [
  {
    category_id: categoryId,
    name: "Lindy AI",
    slug: "lindy-ai",
    description: "A no-code AI agent builder designed to automate complex workflows and schedule tasks autonomously.",
    pricing_model: "paid",
    price_text: "$49/month",
    price_from: 49.00,
    price_currency: "USD",
    website_url: "https://lindy.ai",
    tags: ["ai-agents", "automation", "productivity"],
    pros: ["No-code AI agent builder", "Native integrations with Gmail and Calendar", "Trigger-based autonomous execution"],
    cons: ["Steep learning curve for complex workflows", "Pricing scales quickly with high execution volume"],
    ideal_for: ["Automating repetitive email drafting", "Building autonomous scheduling assistants"],
    editorial_notes: "Lindy AI bridges the gap between raw LLM capabilities and practical workflow automation. Unlike standard chatbots, its ability to run autonomously on triggers makes it a genuine operational replacement for Zapier in context-heavy scenarios, though the initial setup requires careful prompting.",
    release_year: 2024,
    content_language: "en",
    status: "published",
    published_at: new Date().toISOString()
  },
  {
    category_id: categoryId,
    name: "Surfer SEO",
    slug: "surfer-seo",
    description: "An SEO optimization platform that uses NLP and data-driven algorithms to score and improve content.",
    pricing_model: "paid",
    price_text: "$89/month",
    price_from: 89.00,
    price_currency: "USD",
    website_url: "https://surferseo.com",
    tags: ["seo", "content-creation", "marketing"],
    pros: ["Data-driven content scoring algorithm", "NLP-based keyword suggestions", "Built-in AI content generation (Surfer AI)"],
    cons: ["High entry price for solo bloggers", "Suggestions can sometimes lead to keyword stuffing"],
    ideal_for: ["SEO agencies optimizing client content", "Publishers scaling organic traffic"],
    editorial_notes: "Surfer SEO remains the industry standard for on-page optimization by mathematically reverse-engineering search results. While its proprietary AI writer accelerates drafting, its true value lies in the rigorous NLP scoring system that forces writers to hit semantic relevance targets.",
    release_year: 2017,
    content_language: "en",
    status: "published",
    published_at: new Date().toISOString()
  },
  {
    category_id: categoryId,
    name: "Copy.ai",
    slug: "copy-ai",
    description: "An AI-powered copywriting tool geared toward marketing teams and high-volume outbound sales.",
    pricing_model: "freemium",
    price_text: "Free tier / $49/month",
    price_from: 0.00,
    price_currency: "USD",
    website_url: "https://copy.ai",
    tags: ["copywriting", "marketing", "sales"],
    pros: ["Brand voice customization", "Unlimited words on paid tiers", "Pre-built sales and marketing workflows"],
    cons: ["Output can feel generic without strict brand guidelines", "UI feels cluttered for simple tasks"],
    ideal_for: ["Marketing teams generating ad variations", "Drafting high-volume outbound sales emails"],
    editorial_notes: "Copy.ai has successfully pivoted from a simple wrapper to a comprehensive marketing workflow engine. Its ability to enforce a consistent brand voice across multiple campaigns makes it highly scalable for B2B sales teams, though it requires upfront time investment to train the voice profile correctly.",
    release_year: 2020,
    content_language: "en",
    status: "published",
    published_at: new Date().toISOString()
  },
  {
    category_id: categoryId,
    name: "Jasper AI",
    slug: "jasper-ai",
    description: "An enterprise-grade AI copilot designed for marketing departments requiring strict brand consistency and collaboration.",
    pricing_model: "paid",
    price_text: "$39/month",
    price_from: 39.00,
    price_currency: "USD",
    website_url: "https://jasper.ai",
    tags: ["enterprise", "marketing", "content-creation"],
    pros: ["Enterprise-grade security and permissions", "Cross-platform browser extension", "Native integration with Surfer SEO"],
    cons: ["No permanent free tier available", "Feature overlap with cheaper alternatives"],
    ideal_for: ["Mid-market to enterprise marketing departments", "Teams requiring strict user access controls"],
    editorial_notes: "Jasper positions itself as the AI copilot for enterprise marketing rather than solo creators. By prioritizing team collaboration, SOC2 compliance, and direct integrations with tools like Surfer SEO, it commands a premium but justifies it for large teams needing brand consistency across hundreds of daily outputs.",
    release_year: 2021,
    content_language: "en",
    status: "published",
    published_at: new Date().toISOString()
  },
  {
    category_id: categoryId,
    name: "Gamma",
    slug: "gamma",
    description: "An AI-driven presentation builder that replaces rigid slides with fluid, web-native card layouts.",
    pricing_model: "freemium",
    price_text: "Free tier / $16/month",
    price_from: 0.00,
    price_currency: "USD",
    website_url: "https://gamma.app",
    tags: ["presentations", "design", "productivity"],
    pros: ["Generates presentations from simple prompts", "Flexible, web-native card layouts", "One-click theme application"],
    cons: ["Less granular control than PowerPoint/Keynote", "Export formatting can occasionally break"],
    ideal_for: ["Founders creating rapid pitch decks", "Consultants building visual reports"],
    editorial_notes: "Gamma reimagines the presentation deck as a fluid, web-native document rather than a series of rigid slides. Its AI generation excels at structural outlines and initial drafting, dramatically reducing the 'blank canvas' friction for professionals who need to communicate visually but lack design skills.",
    release_year: 2022,
    content_language: "en",
    status: "published",
    published_at: new Date().toISOString()
  },
  {
    category_id: categoryId,
    name: "Notion AI",
    slug: "notion-ai",
    description: "An intelligent AI add-on integrated directly into the Notion workspace for seamless drafting and summarization.",
    pricing_model: "paid",
    price_text: "$10/month add-on",
    price_from: 10.00,
    price_currency: "USD",
    website_url: "https://notion.so",
    tags: ["productivity", "knowledge-management", "writing"],
    pros: ["Deeply integrated into existing Notion workspaces", "Excellent at summarizing existing databases", "Frictionless /slash command interface"],
    cons: ["Requires a separate add-on subscription", "Context window struggles with massive databases"],
    ideal_for: ["Knowledge workers already using Notion", "Summarizing meeting notes instantly"],
    editorial_notes: "Notion AI's strength is its total lack of context switching. Because it lives exactly where your documents and databases already reside, it acts less like an external chatbot and more like an intelligent editor for your existing knowledge base, making it an essential add-on for heavy Notion users.",
    release_year: 2023,
    content_language: "en",
    status: "published",
    published_at: new Date().toISOString()
  }
];

async function main() {
  for (const item of softwareItems) {
    const { error } = await supabase.from('software').upsert(item, { onConflict: 'slug' });
    if (error) {
      console.error(`Failed to insert ${item.name}:`, error);
    } else {
      console.log(`Inserted and published: ${item.name}`);
    }
  }
  
  // Verify category statuses
  const { data: cats, error: catError } = await supabase
    .from('categories')
    .select('name, active_listing_count, is_indexable')
    .eq('id', categoryId);
    
  console.log('\n--- Category Status ---');
  if (catError) console.error(catError);
  else console.table(cats);
}

main();
