import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

// /out nunca deve ser rastreado (redirects de afiliado); /admin é interno.
// Sitemaps segmentados gerados por app/sitemap.ts (generateSitemaps).
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        disallow: ["/out/", "/admin/"],
      },
    ],
    sitemap: ["core", "categories", "products", "software", "editorial"].map(
      (id) => `${SITE_URL}/sitemap/${id}.xml`
    ),
  };
}
