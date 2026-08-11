import fs from "node:fs";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";
import Anthropic from "@anthropic-ai/sdk";
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

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const secretKey = process.env.SUPABASE_SECRET_KEY;
if (!supabaseUrl || !secretKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SECRET_KEY in .env.local");
  process.exit(1);
}

const db = createClient<Database>(supabaseUrl, secretKey, {
  auth: { persistSession: false },
});

const anthropicKey = process.env.ANTHROPIC_API_KEY;
const anthropic = anthropicKey ? new Anthropic({ apiKey: anthropicKey }) : null;

if (!anthropic) {
  console.error("Missing ANTHROPIC_API_KEY in .env.local. Enrichment requires AI.");
  process.exit(1);
}

const ENRICHMENT_SYSTEM = `You are a technical editor for Fathom Layer, an independent tech index.
Your goal is to enrich product information based on the product's title, brand, and basic specs.
Produce output in strictly valid JSON matching this schema:
{
  "body_markdown": "A comprehensive 200-300 word technical review and deep dive in markdown format. Include sections like 'The Verdict', 'Who it is for', and 'Technical Nuances'. Use markdown headers (##), bold text, and lists.",
  "faqs": [
    { "question": "Question 1", "answer": "Answer 1" },
    { "question": "Question 2", "answer": "Answer 2" },
    { "question": "Question 3", "answer": "Answer 3" }
  ],
  "key_features": [
    "Feature 1 (short sentence)",
    "Feature 2 (short sentence)",
    "Feature 3 (short sentence)",
    "Feature 4 (short sentence)"
  ]
}

Maintain a quiet, authoritative, and factual tone. Do not use marketing fluff.`;

async function enrichProduct(product: any) {
  const payload = {
    title: product.title,
    brand: product.brand,
    description: product.description,
    specs: product.specs,
    ideal_for: product.ideal_for,
  };

  const response = await anthropic!.messages.create({
    model: "claude-3-5-sonnet-20241022",
    max_tokens: 2048,
    system: ENRICHMENT_SYSTEM,
    messages: [{ role: "user", content: JSON.stringify(payload) }],
  });

  const text = response.content.find((b) => b.type === "text")?.text ?? "";
  
  // Extract JSON from response in case Claude adds conversational wrapper
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error("Could not parse JSON from Claude response.");
  }
  
  return JSON.parse(jsonMatch[0]);
}

async function main() {
  console.log("Fetching products with missing rich data...");
  const { data: products, error } = await db
    .from("products")
    .select("id, title, brand, description, specs, ideal_for, body_markdown, faqs, key_features");
  
  if (error) throw error;

  // Filter products that lack body_markdown or faqs
  const toEnrich = (products ?? []).filter(p => !p.body_markdown || !p.faqs || (Array.isArray(p.faqs) && p.faqs.length === 0));
  
  console.log(`Found ${toEnrich.length} products to enrich.`);

  for (const product of toEnrich) {
    console.log(`Enriching: ${product.title}...`);
    try {
      const enriched = await enrichProduct(product);
      
      const { error: updateError } = await db
        .from("products")
        .update({
          body_markdown: enriched.body_markdown,
          faqs: enriched.faqs,
          key_features: enriched.key_features,
        })
        .eq("id", product.id);
        
      if (updateError) {
        console.error(`Failed to update ${product.title}:`, updateError.message);
      } else {
        console.log(`Successfully enriched ${product.title}`);
      }
    } catch (e: any) {
      console.error(`Failed to enrich ${product.title}:`, e.message);
    }
  }
  
  console.log("Enrichment complete.");
}

main().catch(console.error);
