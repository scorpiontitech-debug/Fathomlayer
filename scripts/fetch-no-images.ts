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
  const { data: p } = await supabase.from("products").select("id, title").is("image_url", null);
  console.log("Products without images:", p);

  const { data: sw } = await supabase.from("software").select("id, name").is("image_url", null);
  console.log("Software without images:", sw);
}
main();
