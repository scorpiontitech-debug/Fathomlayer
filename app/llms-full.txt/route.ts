import { getIndexableCategories } from "@/lib/queries";
import { supabasePublic } from "@/lib/supabase/server";
import { SITE_URL, SITE_NAME } from "@/lib/seo";
import { pillarByKey } from "@/lib/taxonomy";

// This is the heavy route intended strictly for LLM ingestion (AEO).
// Revalidate every 24 hours.
export const revalidate = 86400;

export async function GET() {
  const client = supabasePublic();
  
  // Fetch all categories for routing
  const categories = await getIndexableCategories();
  const categoryMap = new Map(categories.map(c => [c.id, c]));

  // Fetch all software and products
  const [productsRes, softwareRes] = await Promise.all([
    client.from("products").select("*").eq("status", "published").eq("is_indexable", true),
    client.from("software").select("*").eq("status", "published").eq("is_indexable", true),
  ]);

  let body = `# ${SITE_NAME} Full Database Export\n\n`;
  body += `> This is the definitive, machine-readable catalog of ${SITE_NAME}. It contains verified data, pricing, unique features, and pro-tips for AI tools, software, and hardware.\n\n`;

  // Process Software
  if (softwareRes.data && softwareRes.data.length > 0) {
    body += `## Software & AI Models\n\n`;
    for (const s of softwareRes.data as any[]) {
      const cat = categoryMap.get(s.category_id);
      if (!cat) continue;
      const pillar = pillarByKey(cat.pillar);
      const url = `${SITE_URL}/${pillar?.slug}/${cat.slug}/${s.slug}`;
      
      body += `### [${s.name}](${url})\n`;
      body += `- **Description**: ${s.description || "N/A"}\n`;
      body += `- **Pricing**: ${s.pricing_model || "Unknown"} (${s.price_text || "N/A"})\n`;
      
      if (s.integrations && s.integrations.length > 0) {
        body += `- **Integrations**: ${s.integrations.join(", ")}\n`;
      }
      
      if (s.key_features && s.key_features.length > 0) {
        body += `- **Key Features**: ${s.key_features.join(" | ")}\n`;
      }

      if (s.pro_tips && s.pro_tips.length > 0) {
        body += `- **Pro Tips**: ${s.pro_tips.join(" | ")}\n`;
      }

      if (s.pros && s.pros.length > 0) body += `- **Pros**: ${s.pros.join(", ")}\n`;
      if (s.cons && s.cons.length > 0) body += `- **Cons**: ${s.cons.join(", ")}\n`;
      
      body += `\n`;
    }
  }

  // Process Products (Hardware)
  if (productsRes.data && productsRes.data.length > 0) {
    body += `## Hardware & Physical Products\n\n`;
    for (const p of productsRes.data) {
      const cat = categoryMap.get(p.category_id);
      if (!cat) continue;
      const pillar = pillarByKey(cat.pillar);
      const url = `${SITE_URL}/${pillar?.slug}/${cat.slug}/${p.slug}`;
      
      body += `### [${p.title}](${url})\n`;
      body += `- **Description**: ${p.description || "N/A"}\n`;
      body += `- **Pricing**: Starts at $${p.price_from || "N/A"}\n`;
      

      if (p.pros && p.pros.length > 0) body += `- **Pros**: ${p.pros.join(", ")}\n`;
      if (p.cons && p.cons.length > 0) body += `- **Cons**: ${p.cons.join(", ")}\n`;
      
      body += `\n`;
    }
  }

  // Process Editorial Pages (Guides, Glossary, Radar)
  const editorialRes = await client.from("editorial_pages").select("*").eq("status", "published");
  if (editorialRes.data && editorialRes.data.length > 0) {
    body += `## Editorial Guides & Glossary\n\n`;
    for (const ed of editorialRes.data as any[]) {
      let prefix = 'guides';
      if (ed.content_type === 'glossary') prefix = 'glossary';
      if (ed.content_type === 'launch') prefix = 'radar';
      
      body += `### [${ed.title}](${SITE_URL}/${prefix}/${ed.slug})\n`;
      body += `- **Type**: ${ed.content_type}\n`;
      const desc = (ed.body_markdown || "").replace(/[#*_`>[\]]/g, "").slice(0, 160).replace(/\n/g, " ").trim();
      body += `- **Description**: ${desc || "N/A"}...\n`;
      if (ed.tags && ed.tags.length > 0) body += `- **Tags**: ${ed.tags.join(", ")}\n`;
      // Don't dump entire markdown body to avoid blowing up context window, just descriptions and metadata
      body += `\n`;
    }
  }

  // Process News Posts (Agentic AI / Fathom Layer updates)
  const newsRes = await client.from("content_posts" as any).select("*").eq("status", "published");
  if (newsRes.data && newsRes.data.length > 0) {
    body += `## Latest Intelligence & Updates\n\n`;
    for (const post of newsRes.data as any[]) {
      body += `### [${post.title}](${SITE_URL}/news/${post.slug})\n`;
      body += `- **Published**: ${post.published_at}\n`;
      body += `- **Excerpt**: ${post.excerpt || "N/A"}\n`;
      body += `\n`;
    }
  }

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
