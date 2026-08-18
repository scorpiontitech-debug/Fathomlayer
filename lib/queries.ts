import { supabasePublic } from "@/lib/supabase/server";
import type { Tables } from "@/lib/database.types";
import { PILLARS, type PillarKey } from "@/lib/taxonomy";

export type Category = Tables<"categories">;
export type Product = Tables<"products">;
export type Software = Tables<"software">;
export type LinkRow = Tables<"links">;
export type Setup = Tables<"setups">;
export type SetupItem = Tables<"setup_items">;
export type EditorialPage = Tables<"editorial_pages">;
export type Workflow = any;

// Todas as leituras usam o cliente público: a RLS garante que só conteúdo
// aprovado pelos quality gates chega às páginas.

export async function getIndexableCategories(): Promise<Category[]> {
  const { data } = await supabasePublic()
    .from("categories")
    .select("*")
    .order("name");
  return data ?? [];
}

export async function getWorkflows(): Promise<Workflow[]> {
  const { data } = await (supabasePublic() as any)
    .from("workflows")
    .select("*")
    .order("created_at", { ascending: false });
  return data ?? [];
}

export async function getWorkflowBySlug(slug: string): Promise<Workflow | null> {
  const { data } = await (supabasePublic() as any)
    .from("workflows")
    .select("*")
    .eq("slug", slug)
    .single();
  return data;
}

export async function getCategoriesByPillar(pillar: PillarKey): Promise<Category[]> {
  const { data } = await supabasePublic()
    .from("categories")
    .select("*")
    .eq("pillar", pillar)
    .order("name");
  return data ?? [];
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const { data } = await supabasePublic()
    .from("categories")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  return data;
}

export async function getCategoryListings(categoryId: string): Promise<{
  products: Product[];
  software: Software[];
}> {
  const client = supabasePublic();
  const [products, software] = await Promise.all([
    client
      .from("products")
      .select("*")
      .eq("category_id", categoryId)
      .order("design_score", { ascending: false, nullsFirst: false })
      .order("title"),
    client
      .from("software")
      .select("*")
      .eq("category_id", categoryId)
      .order("name"),
  ]);
  // Roadmap #21: itens arquivados continuam listados — é o que impede a
  // página deles de virar órfã (content-spec §8) — mas sempre no fim, para
  // que a listagem apresente primeiro o que ainda se pode comprar.
  const liveFirst = <T extends { status: string }>(rows: T[]) => [
    ...rows.filter((r) => r.status !== "archived"),
    ...rows.filter((r) => r.status === "archived"),
  ];

  return {
    products: liveFirst(products.data ?? []),
    software: liveFirst(software.data ?? []),
  };
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const { data } = await supabasePublic()
    .from("products")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  return data;
}

export async function getSoftwareBySlug(slug: string): Promise<Software | null> {
  const { data } = await supabasePublic()
    .from("software")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  return data;
}

export async function getProductById(id: string): Promise<Product | null> {
  const { data } = await supabasePublic()
    .from("products")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  return data;
}



export async function getLatestNews(limit: number = 4) {
  const { data } = await (supabasePublic() as any)
    .from("content_posts")
    .select("id, title, slug, cover_image, excerpt, published_at")
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .limit(limit);
  return data ?? [];
}

export async function getTopRankedProducts(limit: number = 6) {
  const { data } = await supabasePublic()
    .from("products")
    .select("id, title, slug, design_score, image_url, description, category_id, price_from, price_currency, categories(name, slug, pillar)")
    .eq("status", "published")
    .not("design_score", "is", null)
    .order("design_score", { ascending: false })
    .limit(limit);
  return data ?? [];
}

export async function getRecentEditorials(limit: number = 4) {
  const { data } = await supabasePublic()
    .from("editorial_pages")
    .select("id, title, slug, content_type, published_at, created_at, body_markdown")
    .in("content_type", ["guide", "launch"])
    .order("published_at", { ascending: false })
    .limit(limit);
  return data ?? [];
}

export async function getBestOfCategory(categorySlug: string, limit: number = 5) {
  // First, find the category
  const { data: category } = await supabasePublic()
    .from("categories")
    .select("id, name, slug, pillar")
    .eq("slug", categorySlug)
    .single();

  if (!category) return null;

  // Fetch top products
  const { data: products } = await supabasePublic()
    .from("products")
    .select("id, title, slug, design_score, score_performance, score_value, score_battery, image_url, description, price_from, price_currency, status")
    .eq("category_id", category.id)
    .order("design_score", { ascending: false })
    .limit(limit);

  // Fetch top software
  const { data: software } = await supabasePublic()
    .from("software")
    .select("id, name, slug, image_url, price_text, price_from, price_currency, description, status, updated_at")
    .eq("category_id", category.id)
    .order("updated_at", { ascending: false })
    .limit(limit);

  // Combine and sort
  const combined = [
    ...(products ?? []).map(p => ({ ...p, type: 'product', title: p.title, price_text: null as string | null })),
    ...(software ?? []).map(s => ({ ...s, type: 'software', title: s.name, design_score: null as number | null }))
  ];

  combined.sort((a, b) => (b.design_score ?? 0) - (a.design_score ?? 0));

  return {
    category,
    items: combined.slice(0, limit)
  };
}

export async function getAggregateRating(entityType: string, entityId: string) {
  const { data, error } = await supabasePublic()
    .from("community_reviews")
    .select("rating")
    .eq("entity_type", entityType)
    .eq("entity_id", entityId);

  if (error || !data || data.length === 0) return null;

  const count = data.length;
  const sum = data.reduce((acc, curr) => acc + curr.rating, 0);
  return {
    ratingValue: (sum / count).toFixed(1),
    reviewCount: count,
  };
}

export async function getTrendingItems() {
  // Simple MVP approach: get the last 20 saves and reviews, and fetch those entities.
  const { data: saves } = await supabasePublic()
    .from("user_saves")
    .select("entity_type, entity_id")
    .order("created_at", { ascending: false })
    .limit(10);
    
  const { data: reviews } = await supabasePublic()
    .from("community_reviews")
    .select("entity_type, entity_id")
    .order("created_at", { ascending: false })
    .limit(10);

  const entityMap = new Map<string, { type: string, score: number }>();
  
  (saves ?? []).forEach(s => {
    const key = `${s.entity_type}:${s.entity_id}`;
    entityMap.set(key, { type: s.entity_type, score: (entityMap.get(key)?.score ?? 0) + 1 });
  });
  
  (reviews ?? []).forEach(r => {
    const key = `${r.entity_type}:${r.entity_id}`;
    entityMap.set(key, { type: r.entity_type, score: (entityMap.get(key)?.score ?? 0) + 2 });
  });

  const sortedEntities = Array.from(entityMap.entries()).sort((a, b) => b[1].score - a[1].score).slice(0, 10);
  
  // O href sai daqui, não da página. A página antiga montava
  // `/hardware/gpu/{slug}` e `/software/ai/{slug}` — rotas que nunca
  // existiram no app, então todo item da lista era um 404.
  const results = await Promise.all(sortedEntities.map(async ([key, data]) => {
    const id = key.split(":")[1];
    const table = data.type === "product" ? "products" : "software";
    const { data: row } = await supabasePublic()
      .from(table)
      .select("*, categories(slug, pillar)")
      .eq("id", id)
      .eq("status", "published")
      .maybeSingle();
    if (!row) return null;

    const rel = (row as { categories?: unknown }).categories;
    const cat = (Array.isArray(rel) ? rel[0] : rel) as
      | { slug: string; pillar: string }
      | null
      | undefined;
    const pillar = cat ? PILLARS[cat.pillar as PillarKey] : null;
    if (!cat || !pillar) return null;

    const r = row as Record<string, unknown>;
    return {
      ...r,
      type: data.type,
      title: (data.type === "product" ? r.title : r.name) as string,
      href: `/${pillar.slug}/${cat.slug}/${r.slug as string}`,
    };
  }));

  return results.filter(Boolean);
}

export async function getLinks(
  entityType: "product" | "software",
  entityId: string
): Promise<LinkRow[]> {
  const { data } = await supabasePublic()
    .from("links")
    .select("*")
    .eq("entity_type", entityType)
    .eq("entity_id", entityId)
    .order("is_primary", { ascending: false });
  return data ?? [];
}

export async function getPublishedSetups(): Promise<Setup[]> {
  const { data } = await supabasePublic()
    .from("setups")
    .select("*")
    .order("published_at", { ascending: false });
  return data ?? [];
}

export async function getSetupBySlug(slug: string): Promise<Setup | null> {
  const { data } = await supabasePublic()
    .from("setups")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  return data;
}

// Páginas editoriais (content-spec 7.3): launch / glossary / guide.
export async function getEditorialPages(
  contentType: "launch" | "glossary" | "guide"
): Promise<EditorialPage[]> {
  const { data, error } = await supabasePublic()
    .from("editorial_pages")
    .select("*")
    .eq("content_type", contentType)
    .order("published_at", { ascending: false });
  // Erro silencioso vira página vazia sem explicação — sempre logar.
  if (error) console.error(`[fathom-layer] getEditorialPages(${contentType}):`, error.message);
  return data ?? [];
}

export async function getEditorialPageBySlug(slug: string): Promise<EditorialPage | null> {
  const { data } = await supabasePublic()
    .from("editorial_pages")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  return data;
}

// Leitura relacionada (content-spec §8: 8-12 links internos contextuais por
// página, nunca página órfã). Casa glossário/guias com o item por categoria
// ou por interseção de tags — o link só existe quando há relação real, então
// uma página sem correspondência simplesmente não mostra o bloco, em vez de
// inventar link para encher contagem.
export async function getRelatedEditorialPages(
  categoryId: string,
  tags: string[],
  limit = 4
): Promise<EditorialPage[]> {
  const { data, error } = await supabasePublic()
    .from("editorial_pages")
    .select("*")
    .in("content_type", ["glossary", "guide"]);
  if (error) {
    console.error("[fathom-layer] getRelatedEditorialPages:", error.message);
    return [];
  }

  const tagSet = new Set(tags);
  return (data ?? [])
    .map((page) => {
      const overlap = page.tags.filter((t) => tagSet.has(t)).length;
      const sameCategory = page.category_id === categoryId ? 1 : 0;
      // Guia vale mais que verbete de glossário como leitura seguinte.
      const typeBonus = page.content_type === "guide" ? 0.5 : 0;
      return { page, rank: overlap * 2 + sameCategory * 1.5 + typeBonus };
    })
    .filter((r) => r.rank > 0)
    .sort((a, b) => b.rank - a.rank)
    .slice(0, limit)
    .map(({ page }) => page);
}

// Leitura relacionada entre páginas editoriais (content-spec §8). Os verbetes
// já terminam com "See also: x, y, z" em texto puro — sem link. Este bloco
// transforma essa relação em navegação de verdade, por interseção de tags,
// sem depender de editar o markdown de cada página.
export async function getRelatedEditorialByTags(
  tags: string[],
  excludeId: string,
  limit = 5
): Promise<EditorialPage[]> {
  const { data, error } = await supabasePublic()
    .from("editorial_pages")
    .select("*")
    .neq("id", excludeId);
  if (error) {
    console.error("[fathom-layer] getRelatedEditorialByTags:", error.message);
    return [];
  }

  const tagSet = new Set(tags);
  return (data ?? [])
    .map((page) => ({
      page,
      overlap: page.tags.filter((t) => tagSet.has(t)).length,
    }))
    .filter((r) => r.overlap > 0)
    .sort((a, b) => b.overlap - a.overlap)
    .slice(0, limit)
    .map(({ page }) => page);
}

// Buscador de Alternativas (content-spec 7.2): mesma categoria + interseção
// de tags + design_score próximo — query simples sobre dados existentes,
// nunca sistema de recomendação complexo.
export async function getAlternativeProducts(product: Product, limit = 3): Promise<Product[]> {
  const { data } = await supabasePublic()
    .from("products")
    .select("*")
    .eq("category_id", product.category_id)
    .neq("id", product.id)
    // Nunca recomendar item descontinuado como alternativa (roadmap #21).
    .eq("status", "published");
  const candidates = data ?? [];
  const tagSet = new Set(product.tags);
  return candidates
    .map((c) => {
      const overlap = c.tags.filter((t) => tagSet.has(t)).length;
      const scoreGap =
        product.design_score !== null && c.design_score !== null
          ? Math.abs(product.design_score - c.design_score)
          : 5;
      return { c, rank: overlap * 2 - scoreGap * 0.5 };
    })
    .sort((a, b) => b.rank - a.rank)
    .slice(0, limit)
    .map(({ c }) => c);
}

export async function getAlternativeSoftware(software: Software, limit = 3): Promise<Software[]> {
  const { data } = await supabasePublic()
    .from("software")
    .select("*")
    .eq("category_id", software.category_id)
    .neq("id", software.id)
    // Nunca recomendar item descontinuado como alternativa (roadmap #21).
    .eq("status", "published");
  const candidates = data ?? [];
  const tagSet = new Set(software.tags);
  return candidates
    .map((c) => ({ c, rank: c.tags.filter((t) => tagSet.has(t)).length }))
    .sort((a, b) => b.rank - a.rank)
    .slice(0, limit)
    .map(({ c }) => c);
}

export type ResolvedSetupItem = {
  item: SetupItem;
  product: Product | null;
  software: Software | null;
  category: Category | null;
};

// Resolve os itens de um setup para as entidades reais. Itens que apontem para
// conteúdo não publicado somem silenciosamente (a RLS não os retorna) — um
// setup nunca exibe item que o quality gate reprovaria.
export async function getResolvedSetupItems(setupId: string): Promise<ResolvedSetupItem[]> {
  const client = supabasePublic();
  const { data: items } = await client
    .from("setup_items")
    .select("*")
    .eq("setup_id", setupId)
    .order("position");
  if (!items || items.length === 0) return [];

  const productIds = items.filter((i) => i.item_type === "product").map((i) => i.item_id);
  const softwareIds = items.filter((i) => i.item_type === "software").map((i) => i.item_id);

  const [productsRes, softwareRes] = await Promise.all([
    productIds.length
      ? client.from("products").select("*").in("id", productIds)
      : Promise.resolve({ data: [] as Product[] }),
    softwareIds.length
      ? client.from("software").select("*").in("id", softwareIds)
      : Promise.resolve({ data: [] as Software[] }),
  ]);

  const products = productsRes.data ?? [];
  const software = softwareRes.data ?? [];

  const categoryIds = [
    ...new Set([...products.map((p) => p.category_id), ...software.map((s) => s.category_id)]),
  ];
  const { data: categories } = categoryIds.length
    ? await client.from("categories").select("*").in("id", categoryIds)
    : { data: [] as Category[] };
  const categoryById = new Map((categories ?? []).map((c) => [c.id, c]));

  return items
    .map((item) => {
      const product =
        item.item_type === "product" ? products.find((p) => p.id === item.item_id) ?? null : null;
      const software_ =
        item.item_type === "software" ? software.find((s) => s.id === item.item_id) ?? null : null;
      const entity = product ?? software_;
      return {
        item,
        product,
        software: software_,
        category: entity ? categoryById.get(entity.category_id) ?? null : null,
      };
    })
    .filter((r) => r.product || r.software);
}

export async function getLatestLaunches(limit: number = 10) {
  const [productsRes, softwareRes] = await Promise.all([
    supabasePublic()
      .from("products")
      .select("id, title, slug, image_url, description, price_from, price_currency, created_at, category_id, categories(name, slug, pillar)")
      .eq("status", "published")
      .order("created_at", { ascending: false })
      .limit(limit),
    supabasePublic()
      .from("software")
      .select("id, name, slug, image_url, description, price_from, price_currency, created_at, category_id, categories(name, slug, pillar)")
      .eq("status", "published")
      .order("created_at", { ascending: false })
      .limit(limit)
  ]);

  const products = (productsRes.data || []).map((i: any) => ({ ...i, type: 'product' }));
  const software = (softwareRes.data || []).map((i: any) => ({ ...i, title: i.name, type: 'software' }));

  return [...products, ...software]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, limit);
}

export async function getPriceHistory(entityId: string, entityType: 'product' | 'software') {
  const { data } = await supabasePublic()
    .from("price_history" as any)
    .select("price, recorded_at")
    .eq("entity_id", entityId)
    .eq("entity_type", entityType)
    .order("recorded_at", { ascending: true });
  return (data as any[]) || [];
}
