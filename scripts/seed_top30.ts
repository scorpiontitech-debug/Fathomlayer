import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

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
const secretKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY;
const db = createClient(supabaseUrl, secretKey, { auth: { persistSession: false } });

function toSlug(str: string) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
}

function parsePrice(priceStr: string) {
  const match = priceStr.match(/\d+(?:,\d+)*(?:\.\d+)?/);
  return match ? parseFloat(match[0].replace(/,/g, '')) : null;
}

const CATEGORY_MAP = {
  software: '4a5670b7-ec43-4216-90b2-e81a32adbcb8', 
  laptop: 'f102694d-3cd4-47e5-857e-a785a94e9294', 
  phone: '332889a3-a9e3-43a4-b951-88d99692ac8b', 
  wearable: '75822cf6-20e9-47ad-a499-9202811742ab', 
  ev: 'e43ee25f-5f3b-404b-8d8a-1bb801cdfe72', 
  general: 'ef970347-1f41-4be8-94de-a99c1955b669', 
};

function getCategoryId(item: any) {
  if (item.entity === 'software') return CATEGORY_MAP.software;
  const t = item.title.toLowerCase();
  if (t.includes('macbook') || t.includes('laptop')) return CATEGORY_MAP.laptop;
  if (t.includes('iphone') || t.includes('galaxy') || t.includes('phone')) return CATEGORY_MAP.phone;
  if (t.includes('watch') || t.includes('ring')) return CATEGORY_MAP.wearable;
  if (t.includes('tesla') || t.includes('ev')) return CATEGORY_MAP.ev;
  return CATEGORY_MAP.general;
}

async function main() {
  // Delete the test product we inserted to check constraint
  await db.from('products').delete().eq('slug', 'test');

  const absPath = "C:/Users/rodri/.gemini/antigravity/brain/ad4ce595-37b0-4ed9-8138-6f847afe55a9/fathom_global_top30.json";
  const rawData = fs.readFileSync(absPath, 'utf8');
  const items = JSON.parse(rawData);

  console.log(`Loaded ${items.length} items. Starting seed...`);

  for (const item of items) {
    const category_id = getCategoryId(item);
    
    if (item.entity === 'product') {
      const payload = {
        title: item.title,
        slug: toSlug(item.title),
        brand: item.brand,
        price_from: parsePrice(item.price_from),
        design_score: item.design_score ? (item.design_score / 10) : null,
        specs: { key_features: item.specs },
        pros: item.pros,
        cons: item.cons,
        ideal_for: [item.ideal_for],
        status: 'published',
        category_id
      };

      const { error } = await db.from('products').upsert(payload, { onConflict: 'slug' });
      if (error) console.error(`Error inserting product ${item.title}:`, error.message);
      else console.log(`[Product] Seeded: ${item.title}`);

    }
  }
  console.log("Seeding complete!");
}

main().catch(console.error);
