import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SECRET_KEY!,
  { auth: { persistSession: false } }
);

async function fix() {
  console.log("Fixing products...");
  const { error: pErr } = await supabase
    .from("products")
    .update({ is_indexable: true })
    .eq("status", "published");
  if (pErr) console.error("Error products:", pErr);

  console.log("Fixing software...");
  const { error: sErr } = await supabase
    .from("software")
    .update({ is_indexable: true })
    .eq("status", "published");
  if (sErr) console.error("Error software:", sErr);

  console.log("Done.");
}

fix();
