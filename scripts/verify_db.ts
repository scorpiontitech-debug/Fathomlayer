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

  // 4. Check if price_alerts exists
  const { data: alerts, error: err4 } = await supabase.from("price_alerts").select("id").limit(1);
  if (err4) {
    console.error("❌ Error checking price_alerts table:", err4.message);
  } else {
    console.log("✅ Table 'price_alerts' exists.");
  }

  // 5. Check if tool_submissions exists
  const { data: submissions, error: err5 } = await supabase.from("tool_submissions").select("id").limit(1);
  if (err5) {
    console.error("❌ Error checking tool_submissions table:", err5.message);
  } else {
    console.log("✅ Table 'tool_submissions' exists.");
  }

  console.log("Verification complete.");
}

verify();
