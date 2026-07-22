import type { MetadataRoute } from "next";
import {
  getEditorialPages,
  getIndexableCategories,
  getPublishedSetups,
} from "@/lib/queries";
import { SITE_URL } from "@/lib/seo";
import { supabasePublic } from "@/lib/supabase/server";
import { PILLARS, PILLAR_KEYS, pillarByKey } from "@/lib/taxonomy";

// Sitemaps segmentados (design system §6 / content-spec). Tudo derivado do
// banco via RLS: só conteúdo que venceu os quality gates é emitido — com o
// índice vazio, os segmentos saem vazios e crescem sozinhos.

export async function generateSitemaps() {
  return [
    { id: "core" },
    { id: "categories" },
    { id: "products" },
    { id: "software" },
    { id: "editorial" },
  ];
}

const entry = (
  path: string,
  lastModified?: string,
  changeFrequency?: MetadataRoute.Sitemap[number]["changeFrequency"],
  priority?: number
): MetadataRoute.Sitemap[number] => ({
  url: `${SITE_URL}${path}`,
  ...(lastModified ? { lastModified: new Date(lastModified) } : {}),
  ...(changeFrequency ? { changeFrequency } : {}),
  ...(priority !== undefined ? { priority } : {}),
});

export default async function sitemap({
  id,
}: {
  id: string;
}): Promise<MetadataRoute.Sitemap> {
  if (id === "core") {
    const setups = await getPublishedSetups();
    return [
      entry("/", undefined, "daily", 1),
      ...PILLAR_KEYS.map((key) => entry(`/${PILLARS[key].slug}`, undefined, "daily", 0.8)),
      entry("/calculator", undefined, "weekly", 0.8),
      entry("/setups", undefined, "weekly", 0.6),
      ...setups.map((s) => entry(`/setups/${s.slug}`, s.updated_at, "weekly", 0.6)),
      entry("/glossary", undefined, "weekly", 0.5),
      entry("/guides", undefined, "weekly", 0.5),
      entry("/radar", undefined, "weekly", 0.5),
      entry("/methodology", undefined, "monthly", 0.5),
      entry("/about", undefined, "monthly", 0.4),
      entry("/affiliate-disclosure", undefined, "yearly", 0.2),
      entry("/privacy", undefined, "yearly", 0.2),
    ];
  }

  const categories = await getIndexableCategories();
  const categoryById = new Map(categories.map((c) => [c.id, c]));
  const pathFor = (categoryId: string, slug: string) => {
    const category = categoryById.get(categoryId);
    const pillar = category ? pillarByKey(category.pillar) : null;
    return category && pillar ? `/${pillar.slug}/${category.slug}/${slug}` : null;
  };

  if (id === "categories") {
    return categories.flatMap((c) => {
      const pillar = pillarByKey(c.pillar);
      return pillar ? [entry(`/${pillar.slug}/${c.slug}`, c.updated_at, "daily", 0.7)] : [];
    });
  }

  if (id === "products") {
    const { data } = await supabasePublic()
      .from("products")
      .select("slug, category_id, updated_at");
    return (data ?? []).flatMap((p) => {
      const path = pathFor(p.category_id, p.slug);
      return path ? [entry(path, p.updated_at, "weekly", 0.6)] : [];
    });
  }

  if (id === "software") {
    const { data } = await supabasePublic()
      .from("software")
      .select("slug, category_id, updated_at");
    return (data ?? []).flatMap((s) => {
      const path = pathFor(s.category_id, s.slug);
      return path ? [entry(path, s.updated_at, "weekly", 0.6)] : [];
    });
  }

  if (id === "editorial") {
    const [glossary, guides, launches] = await Promise.all([
      getEditorialPages("glossary"),
      getEditorialPages("guide"),
      getEditorialPages("launch"),
    ]);
    return [
      ...glossary.map((p) => entry(`/glossary/${p.slug}`, p.updated_at, "monthly", 0.5)),
      ...guides.map((p) => entry(`/guides/${p.slug}`, p.updated_at, "monthly", 0.5)),
      ...launches.map((p) => entry(`/radar/${p.slug}`, p.updated_at, "weekly", 0.5)),
    ];
  }

  return [];
}
