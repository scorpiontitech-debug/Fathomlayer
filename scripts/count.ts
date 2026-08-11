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

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const secretKey = process.env.SUPABASE_SECRET_KEY;
if (!supabaseUrl || !secretKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SECRET_KEY in .env.local");
  process.exit(1);
}

const db = createClient<Database>(supabaseUrl, secretKey, {
  auth: { persistSession: false },
});

async function main() {
  const { count: productCount, error: err1 } = await db.from("products").select("*", { count: 'exact', head: true });
  const { count: softwareCount, error: err2 } = await db.from("software").select("*", { count: 'exact', head: true });
  const { count: categoryCount, error: err3 } = await db.from("categories").select("*", { count: 'exact', head: true });
  
  if (err1) console.error("Error products", err1);
  if (err2) console.error("Error software", err2);
  if (err3) console.error("Error categories", err3);

  console.log(`Products: ${productCount}`);
  console.log(`Software: ${softwareCount}`);
  console.log(`Categories: ${categoryCount}`);
  console.log(`Total indexed items (products + software): ${(productCount || 0) + (softwareCount || 0)}`);
}

main().catch(console.error);
