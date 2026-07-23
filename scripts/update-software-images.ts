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

const supabase = createClient(envVars["NEXT_PUBLIC_SUPABASE_URL"], envVars["SUPABASE_SECRET_KEY"]);

const softwareLogos: Record<string, string> = {
  "Lindy AI": "https://logo.clearbit.com/lindy.ai",
  "Surfer SEO": "https://logo.clearbit.com/surferseo.com",
  "Copy.ai": "https://logo.clearbit.com/copy.ai",
  "Jasper AI": "https://logo.clearbit.com/jasper.ai",
  "Gamma": "https://logo.clearbit.com/gamma.app",
  "Notion AI": "https://logo.clearbit.com/notion.so",
  "Stripe MCP Server": "https://logo.clearbit.com/stripe.com",
  "GitHub MCP Server": "https://logo.clearbit.com/github.com",
  "Slack MCP Server": "https://logo.clearbit.com/slack.com"
};

async function main() {
  for (const [name, url] of Object.entries(softwareLogos)) {
    const { error } = await supabase
      .from("software")
      .update({ image_url: url })
      .eq("name", name);
      
    if (error) {
      console.error(`Error updating ${name}:`, error);
    } else {
      console.log(`Updated logo for: ${name}`);
    }
  }
}

main().catch(console.error);
