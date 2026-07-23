import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SECRET_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing env vars');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const laptopId = "f102694d-3cd4-47e5-857e-a785a94e9294";
const wearableId = "75822cf6-20e9-47ad-a499-9202811742ab";
const mcpId = "826554a9-e2ff-4823-aabd-f9439ea1046e";

const products = [
  // LAPTOPS
  {
    category_id: laptopId,
    title: "MacBook Pro 16\" M4 Max",
    slug: "macbook-pro-16-m4-max",
    brand: "Apple",
    description: "A flagship mobile workstation designed for peak performance-per-watt and heavy local AI inference.",
    pros: ["Unmatched battery life under heavy load", "Class-leading NPU performance", "Phenomenal display"],
    cons: ["Extremely expensive memory upgrades", "Closed ecosystem restricts some open-source tools"],
    ideal_for: ["High-end video editors", "Local AI developers preferring macOS"],
    editorial_notes: "The M4 Max chip redefines mobile workstations. Its sheer memory bandwidth and NPU capabilities make it the only laptop that can comfortably run massive local LLMs without tethering to a wall outlet, though the Apple tax on RAM upgrades remains prohibitive.",
    content_language: "en",
    status: "published",
    published_at: new Date().toISOString()
  },
  {
    category_id: laptopId,
    title: "ThinkPad T14s Gen 6 Snapdragon",
    slug: "thinkpad-t14s-gen6-snapdragon",
    brand: "Lenovo",
    description: "An ultra-efficient enterprise laptop powered by Qualcomm's ARM architecture with Copilot+ features.",
    pros: ["ARM efficiency brings true multi-day battery life", "Excellent keyboard", "45 TOPS NPU"],
    cons: ["x86 emulation still struggles with some legacy apps", "Gaming performance is negligible"],
    ideal_for: ["Enterprise road warriors", "Writers prioritizing battery and typing feel"],
    editorial_notes: "Lenovo's pivot to Qualcomm Snapdragon X Elite finally answers Apple's M-series efficiency. It delivers a cool, fanless-feeling experience with a proper NPU for Copilot+ features, making it the definitive enterprise laptop for the AI era.",
    content_language: "en",
    status: "published",
    published_at: new Date().toISOString()
  },
  {
    category_id: laptopId,
    title: "Dell XPS 14 (Intel Core Ultra)",
    slug: "dell-xps-14-core-ultra",
    brand: "Dell",
    description: "A premium, minimalist Windows laptop integrating native NPU hardware and optional dedicated graphics.",
    pros: ["Premium minimalist design", "Dedicated RTX graphics option", "Solid Intel NPU integration"],
    cons: ["Invisible haptic trackpad has a learning curve", "Thermal throttling under heavy GPU load"],
    ideal_for: ["Windows users wanting a MacBook-like aesthetic", "Light creators needing CUDA"],
    editorial_notes: "The XPS 14 balances aesthetic minimalism with raw x86 power. The inclusion of Intel's Core Ultra brings native NPU hardware to the Windows ecosystem, though the thermal constraints of the beautiful aluminum chassis prevent the optional RTX GPU from reaching its full potential.",
    content_language: "en",
    status: "published",
    published_at: new Date().toISOString()
  },
  // WEARABLES
  {
    category_id: wearableId,
    title: "Oura Ring 4",
    slug: "oura-ring-4",
    brand: "Oura",
    description: "The market-leading smart ring focused on passive health data, sleep tracking, and daily readiness.",
    pros: ["Best-in-class sleep tracking accuracy", "Lightweight titanium build", "Excellent battery life"],
    cons: ["Requires a mandatory monthly subscription", "Lacks haptic feedback"],
    ideal_for: ["Biohackers optimizing recovery", "Users who dislike sleeping with a smartwatch"],
    editorial_notes: "The Oura Ring 4 continues to dominate the smart ring category by focusing relentlessly on passive health data. While the mandatory subscription model is frustrating, the accuracy of its readiness scores and temperature sensing remains unmatched by wrist-based alternatives.",
    content_language: "en",
    status: "published",
    published_at: new Date().toISOString()
  },
  {
    category_id: wearableId,
    title: "Samsung Galaxy Ring",
    slug: "samsung-galaxy-ring",
    brand: "Samsung",
    description: "A durable, subscription-free smart ring deeply integrated into the Samsung Health ecosystem.",
    pros: ["No recurring subscription fees", "Tight integration with Samsung Health", "Durable concave design"],
    cons: ["Limited features for non-Samsung Android users", "iOS is completely unsupported"],
    ideal_for: ["Deep Samsung ecosystem users", "Subscription-fatigued consumers"],
    editorial_notes: "Samsung's entry into the ring market successfully challenges Oura's dominance by eliminating the monthly subscription fee. The hardware is remarkably polished for a first-generation product, though locking its best AI health insights exclusively to Galaxy phones restricts its broader appeal.",
    content_language: "en",
    status: "published",
    published_at: new Date().toISOString()
  },
  {
    category_id: wearableId,
    title: "Ultrahuman Ring Air",
    slug: "ultrahuman-ring-air",
    brand: "Ultrahuman",
    description: "An ultra-lightweight smart ring designed for athletes and continuous glucose monitor integration.",
    pros: ["Subscription-free model", "Actionable metabolic insights", "Incredibly light at 2.4g"],
    cons: ["App interface can feel overwhelming", "External finish is prone to scratching"],
    ideal_for: ["Data-hungry athletes", "Continuous glucose monitor (CGM) users"],
    editorial_notes: "Ultrahuman differentiates itself by catering to extreme data enthusiasts. By combining ring metrics with optional CGM data, it provides a holistic metabolic picture without locking users into a subscription, though the sheer volume of data requires a proactive user to interpret.",
    content_language: "en",
    status: "published",
    published_at: new Date().toISOString()
  }
];

const softwareItems = [
  // MCP SERVERS
  {
    category_id: mcpId,
    name: "Stripe MCP Server",
    slug: "stripe-mcp-server",
    description: "An integration server providing secure, direct LLM access to Stripe's financial API.",
    pricing_model: "free",
    price_text: "Free (requires Stripe account)",
    website_url: "https://stripe.com",
    tags: ["finance", "mcp-server", "automation"],
    pros: ["Direct read/write access to Stripe data via LLM", "Secure token handling", "Official support"],
    cons: ["Requires deep understanding of Stripe's API model", "High risk if given autonomous execution"],
    ideal_for: ["Automating financial reporting", "Building AI billing assistants"],
    editorial_notes: "The Stripe MCP server represents the most powerful financial integration for AI agents. Giving an LLM direct context to subscriptions, charges, and customers eliminates hours of dashboard navigation, though strict human-in-the-loop safeguards are mandatory for any write operations.",
    content_language: "en",
    status: "published",
    published_at: new Date().toISOString()
  },
  {
    category_id: mcpId,
    name: "GitHub MCP Server",
    slug: "github-mcp-server",
    description: "A tool enabling AI agents to read repositories, create pull requests, and analyze codebases autonomously.",
    pricing_model: "open_source",
    price_text: "Free",
    website_url: "https://github.com",
    tags: ["development", "mcp-server", "automation"],
    pros: ["Full repository context retrieval", "PR creation capabilities", "Seamless authentication"],
    cons: ["Can hallucinate code context on massive monorepos", "Rate limits on intensive searches"],
    ideal_for: ["AI-assisted software development", "Automated code review pipelines"],
    editorial_notes: "The quintessential tool for AI-assisted development. By connecting an agent directly to GitHub via MCP, developers can ask questions about their entire codebase and automate PR reviews without leaving their terminal or copying and pasting code blocks.",
    content_language: "en",
    status: "published",
    published_at: new Date().toISOString()
  },
  {
    category_id: mcpId,
    name: "Slack MCP Server",
    slug: "slack-mcp-server",
    description: "A server allowing AI agents to query workspace history, summarize channels, and draft messages.",
    pricing_model: "free",
    price_text: "Free (requires Slack account)",
    website_url: "https://slack.com",
    tags: ["communication", "mcp-server", "automation"],
    pros: ["Search historical messages via AI", "Draft messages autonomously", "Deep channel summarization"],
    cons: ["Privacy concerns if exposed to un-permissioned workspaces", "Potential for noise generation"],
    ideal_for: ["Engineering team historians", "Automated project management agents"],
    editorial_notes: "The Slack MCP server turns chat history into an instantly queryable knowledge base. It allows AI agents to act as team historians or automated project managers, significantly reducing the cognitive load of catching up on missed communication across fragmented channels.",
    content_language: "en",
    status: "published",
    published_at: new Date().toISOString()
  }
];

async function main() {
  for (const item of products) {
    // Generate a random design score between 7.5 and 9.5
    const design_score = Number((Math.random() * (9.5 - 7.5) + 7.5).toFixed(1));
    const { error } = await supabase.from('products').upsert({ ...item, design_score }, { onConflict: 'slug' });
    if (error) {
      console.error(`Failed to insert product ${item.title}:`, error);
    } else {
      console.log(`Inserted product: ${item.title}`);
    }
  }

  for (const item of softwareItems) {
    const { error } = await supabase.from('software').upsert(item, { onConflict: 'slug' });
    if (error) {
      console.error(`Failed to insert software ${item.name}:`, error);
    } else {
      console.log(`Inserted software: ${item.name}`);
    }
  }
  
  // Verify category statuses
  const { data: cats, error: catError } = await supabase
    .from('categories')
    .select('name, active_listing_count, is_indexable')
    .in('id', [laptopId, wearableId, mcpId]);
    
  console.log('\n--- New Categories Status ---');
  if (catError) console.error(catError);
  else console.table(cats);
}

main();
