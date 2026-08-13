import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SECRET_KEY!
);

const getFallbackImage = (title: string, category: string) => {
  // Using Unsplash Source API or a reliable placeholder service with keywords
  // Since Unsplash Source is deprecated, using generic high-quality placeholders with keywords from images.unsplash.com via source format or a dummy image generator.
  // Actually, standard Unsplash source URL works for many clients: https://source.unsplash.com/1600x900/?keyword
  // Note: source.unsplash.com was shut down. Using a reliable alternative like Webhook.site or standard placekitten/placehold.co for safety?
  // Let's use images.unsplash.com with specific IDs if possible, but keywords are hard to map statically without API.
  // We'll use a polished placeholder service like placehold.co or a generic sleek tech image.
  
  const width = 1200;
  const height = 800;
  
  // Mapping general keywords to existing high-res Unsplash IDs to guarantee beautiful images (avoiding 404s)
  const map: Record<string, string> = {
    'smartphones': 'https://images.unsplash.com/photo-1592890288564-76628a30a657?q=80&w=1200&h=800&fit=crop',
    'premium-audio': 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?q=80&w=1200&h=800&fit=crop',
    'premium-laptops': 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1200&h=800&fit=crop',
    'local-ai-workstations': 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?q=80&w=1200&h=800&fit=crop', // GPU/Hardware
    'wearables': 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?q=80&w=1200&h=800&fit=crop', // Apple watch style
    'ar-glasses': 'https://images.unsplash.com/photo-1535223289827-42f1e9919769?q=80&w=1200&h=800&fit=crop', // VR/AR
    'setup-peripherals': 'https://images.unsplash.com/photo-1595225476474-87563907a212?q=80&w=1200&h=800&fit=crop', // Keyboard
    'ai-software': 'https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=1200&h=800&fit=crop', // AI Code
  };

  const text = encodeURIComponent(title);
  return map[category] || `https://placehold.co/${width}x${height}/1a1a1a/ffffff?text=${text}`;
};

async function seedImages() {
  console.log("Seeding fallback images...");

  const { data: categories } = await supabase.from("categories").select("id, slug");
  const catMap = Object.fromEntries(categories?.map(c => [c.id, c.slug]) || []);

  // Update Products
  const { data: products } = await supabase.from("products").select("id, title, category_id").is("image_url", null);
  if (products && products.length > 0) {
    console.log(`Found ${products.length} products missing images.`);
    for (const p of products) {
      const catSlug = catMap[p.category_id || ""] || "";
      const img = getFallbackImage(p.title, catSlug);
      await supabase.from("products").update({ image_url: img }).eq("id", p.id);
      console.log(`✅ Updated image for product: ${p.title}`);
    }
  }

  // Update Software
  const { data: software } = await (supabase as any).from("software").select("id, name, category_id").is("image_url", null);
  if (software && software.length > 0) {
    console.log(`Found ${software.length} software missing images.`);
    for (const s of software) {
      const catSlug = catMap[s.category_id || ""] || "";
      const img = getFallbackImage(s.name, catSlug);
      await (supabase as any).from("software").update({ image_url: img }).eq("id", s.id);
      console.log(`✅ Updated image for software: ${s.name}`);
    }
  }

  console.log("Image Seeding Complete.");
}

seedImages().catch(console.error);
