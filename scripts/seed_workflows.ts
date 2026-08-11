import { createClient } from "@supabase/supabase-js";
import type { Database } from "../lib/database.types";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SECRET_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SECRET_KEY");
  process.exit(1);
}

const supabase = createClient<Database>(supabaseUrl, supabaseKey);

const workflows = [
  {
    slug: "automated-customer-support-ai",
    title: "Automated L1 Customer Support",
    description: "Deflect 80% of support tickets by routing them through an AI agent that knows your entire knowledge base. Escalates to human only when necessary.",
    difficulty: "Intermediate",
    estimated_time: "45 mins",
    steps: JSON.stringify([
      {
        title: "1. Build the Knowledge Base",
        description: "Upload all your Help Center articles, past support tickets, and company PDFs into a vector database to act as the AI's 'brain'.",
        software_slug: "chatgpt"
      },
      {
        title: "2. Set up the Trigger",
        description: "Connect your support inbox (e.g., Zendesk or Intercom) to Zapier. Set the trigger to fire whenever a new ticket is received.",
        software_slug: "zapier"
      },
      {
        title: "3. Process and Reply",
        description: "Pass the incoming ticket text to Claude 3.5 Sonnet to draft a response using the knowledge base. Then, push the draft back to Zendesk as an internal note or direct reply.",
        software_slug: "claude"
      }
    ])
  },
  {
    slug: "codebase-understanding-and-refactor",
    title: "Zero-Setup Codebase Refactoring",
    description: "Learn how to instantly index a massive legacy codebase and use AI to refactor large components without breaking dependencies.",
    difficulty: "Advanced",
    estimated_time: "20 mins",
    steps: JSON.stringify([
      {
        title: "1. Index the Repository",
        description: "Open the project folder in Cursor. Use the 'Codebase Indexing' feature so the AI understands all cross-file dependencies and imports.",
        software_slug: "cursor"
      },
      {
        title: "2. The Master Prompt",
        description: "Open the Composer panel (Cmd+I) and instruct it to refactor a specific module. E.g., 'Extract the authentication logic from this file into a separate service, updating all files that depend on it.'",
        software_slug: "cursor"
      },
      {
        title: "3. Review and Apply",
        description: "Cursor will generate a multi-file diff. Review the changes inline and hit 'Accept All' to apply the refactor across the entire project instantly.",
        software_slug: "cursor"
      }
    ])
  }
];

async function seedWorkflows() {
  console.log("Seeding workflows...");
  for (const wf of workflows) {
    const { error } = await supabase
      .from("workflows")
      .upsert({
        slug: wf.slug,
        title: wf.title,
        description: wf.description,
        difficulty: wf.difficulty,
        estimated_time: wf.estimated_time,
        steps: JSON.parse(wf.steps) // We parse it because the DB expects JSONb, and JS passes object
      }, { onConflict: "slug" });

    if (error) {
      console.error(`Error inserting workflow ${wf.slug}:`, error.message);
    } else {
      console.log(`✅ Seeded: ${wf.title}`);
    }
  }
  console.log("Done.");
}

seedWorkflows();
