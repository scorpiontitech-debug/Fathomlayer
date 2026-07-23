import { createClient } from "@supabase/supabase-js";

// Read from local environment since this is a script
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

const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  console.log("Adding image to MacBook Pro M4 Max...");
  
  // The Apple MacBook Pro M1 Max image from Wikimedia Commons (same chassis as M4)
  const imageUrl = "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/MacBook_Pro_14%22_16%22_M1_Max_transparent.png/800px-MacBook_Pro_14%22_16%22_M1_Max_transparent.png";

  const { data, error } = await supabase
    .from("products")
    .update({ image_url: imageUrl })
    .ilike("title", "%MacBook Pro%")
    .select();

  if (error) {
    console.error("Error updating image:", error);
    process.exit(1);
  }

  console.log(`Updated ${data.length} products with image.`);
}

main().catch(console.error);
