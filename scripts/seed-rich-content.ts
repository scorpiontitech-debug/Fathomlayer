import { createClient } from "@supabase/supabase-js";
import * as fs from "fs";
import * as path from "path";

const envLocalPath = path.join(process.cwd(), ".env.local");
const envVars = fs.readFileSync(envLocalPath, "utf-8")
  .split("\n")
  .filter(line => line.trim() && !line.startsWith("#"))
  .reduce((acc, line) => {
    const [key, ...val] = line.split("=");
    acc[key.trim()] = val.join("=").trim().replace(/^"|"$/g, "");
    return acc;
  }, {} as Record<string, string>);

const supabaseUrl = envVars["NEXT_PUBLIC_SUPABASE_URL"];
const supabaseKey = envVars["SUPABASE_SECRET_KEY"]; // Using admin key

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing env vars");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const lindyMarkdown = `
Lindy AI represents a paradigm shift in how we approach workflow automation. While tools like Zapier established the "If This Then That" era of strict deterministic paths, Lindy AI operates probabilistically. You give it a goal, and it figures out the path.

### The Agentic Advantage
Instead of wiring 40 different steps to triage an inbox, extract invoices, and update a CRM, Lindy can handle it with natural language prompts. It reads context, interprets intent, and executes actions across multiple apps.

Here is an example of what makes this so powerful:
- **Resilience:** If an API format changes slightly, a traditional script breaks. Lindy adapts.
- **Context Awareness:** It doesn't just pass text strings; it understands what the text *means*.

However, this flexibility comes with a hidden cost: prompt engineering. The steep learning curve isn't in clicking buttons, but in writing instructions precise enough that the agent doesn't hallucinate actions.
`;

const lindyFaqs = [
  { question: "Is Lindy AI a replacement for Zapier?", answer: "Not entirely. For strict, mission-critical pipelines where data must follow an exact mathematical path, Zapier is safer. For messy, human-centric workflows (like reading emails or scheduling), Lindy is superior." },
  { question: "Can it write code?", answer: "While it can generate snippets, Lindy is optimized for workflow orchestration, not acting as a primary coding assistant like GitHub Copilot." }
];

const lindyFeatures = [
  "Natural language workflow creation",
  "Autonomous error recovery and self-correction",
  "Native integrations with Gmail, Calendar, and Slack",
  "Human-in-the-loop approval gates for critical actions"
];

// YouTube video of AI agent automation (using a stable MKBHD or AI video URL)
const lindyVideo = "https://www.youtube.com/watch?v=1b-b4sJ0bEY";

async function main() {
  console.log("Seeding rich content to Lindy AI...");

  const { data, error } = await supabase
    .from("software")
    .update({ 
      body_markdown: lindyMarkdown.trim(),
      faqs: lindyFaqs,
      key_features: lindyFeatures,
      video_url: lindyVideo
    })
    .ilike("name", "%Lindy AI%")
    .select();

  if (error) {
    console.error("Error updating Lindy:", error);
    process.exit(1);
  }

  console.log(`Updated ${data.length} software item(s).`);
}

main().catch(console.error);
