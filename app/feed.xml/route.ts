import { NextResponse } from "next/server";
import { supabasePublic } from "@/lib/supabase/server";
import { SITE_URL, SITE_NAME } from "@/lib/seo";

export const revalidate = 3600; // Cache for 1 hour

export async function GET() {
  const { data: articles } = await supabasePublic()
    .from("editorial_pages")
    .select("title, slug, content_type, body_markdown, published_at, updated_at")
    .eq("status", "published")
    .eq("is_indexable", true)
    .order("published_at", { ascending: false, nullsFirst: false })
    .limit(20);

  if (!articles) {
    return new NextResponse("Error fetching articles", { status: 500 });
  }

  const escapeXml = (unsafe: string) => {
    return unsafe.replace(/[<>&'"]/g, (c) => {
      switch (c) {
        case "<": return "&lt;";
        case ">": return "&gt;";
        case "&": return "&amp;";
        case "'": return "&apos;";
        case '"': return "&quot;";
        default: return c;
      }
    });
  };

  const getPrefix = (type: string) => {
    if (type === "glossary") return "glossary";
    if (type === "launch") return "radar";
    return "guides";
  };

  const items = articles
    .map((article) => {
      const prefix = getPrefix(article.content_type);
      const url = `${SITE_URL}/${prefix}/${article.slug}`;
      const pubDate = new Date(article.published_at || article.updated_at).toUTCString();
      // Extract a short description from markdown
      const desc = escapeXml(
        (article.body_markdown || "")
          .replace(/[#*_`>[\]]/g, "")
          .slice(0, 200)
          .replace(/\n/g, " ")
          .trim() + "..."
      );

      return `
    <item>
      <title>${escapeXml(article.title)}</title>
      <link>${url}</link>
      <guid>${url}</guid>
      <pubDate>${pubDate}</pubDate>
      <description>${desc}</description>
    </item>`;
    })
    .join("");

  const rssFeed = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${SITE_NAME}</title>
    <link>${SITE_URL}</link>
    <description>The latest guides, glossaries, and news from ${SITE_NAME}.</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml" />${items}
  </channel>
</rss>`;

  return new NextResponse(rssFeed, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "s-maxage=3600, stale-while-revalidate",
    },
  });
}
