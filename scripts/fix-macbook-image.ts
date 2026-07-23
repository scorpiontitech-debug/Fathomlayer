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

async function main() {
  // Using a very stable Unsplash image of a MacBook just to prove the UI works.
  const imageUrl = "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=1000";

  const { data, error } = await supabase
    .from("products")
    .update({ image_url: imageUrl })
    .ilike("title", "%MacBook Pro%")
    .select();

  if (error) {
    console.error("Error updating:", error);
  } else {
    console.log("Updated to stable image:", data[0]?.title);
  }
}
main();
