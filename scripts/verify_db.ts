import { createClient } from "@supabase/supabase-js";
import * as fs from "fs";
import * as path from "path";

const envPath = path.join(process.cwd(), ".env.local");
const envContent = fs.readFileSync(envPath, "utf-8");
const urlMatch = envContent.match(/NEXT_PUBLIC_SUPABASE_URL=(.+)/);
const keyMatch = envContent.match(/NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=(.+)/);

const supabaseUrl = urlMatch ? urlMatch[1].trim() : process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = keyMatch ? keyMatch[1].trim() : process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function verify() {
  console.log("Verifying Database Schema...");

  // 1. Check if github_repo exists in software
  const { data: software, error: err1 } = await supabase.from("software").select("github_repo").limit(1);
  if (err1) {
    console.error("❌ Error checking software table:", err1.message);
  } else {
    console.log("✅ Column 'github_repo' exists in software table.");
  }

  // 2. Check if user_profiles exists
  const { data: profiles, error: err2 } = await supabase.from("user_profiles").select("id").limit(1);
  if (err2) {
    console.error("❌ Error checking user_profiles table:", err2.message);
  } else {
    console.log("✅ Table 'user_profiles' exists.");
  }

  // 3. Check if community_reviews exists
  const { data: reviews, error: err3 } = await supabase.from("community_reviews").select("id").limit(1);
  if (err3) {
    console.error("❌ Error checking community_reviews table:", err3.message);
  } else {
    console.log("✅ Table 'community_reviews' exists.");
  }

  console.log("Verification complete.");
}

verify();
