import { supabasePublic } from "@/lib/supabase/server";
import type { Tables } from "@/lib/database.types";
import type { PillarKey } from "@/lib/taxonomy";

export type Category = Tables<"categories">;
export type Product = Tables<"products">;
export type Software = Tables<"software">;
export type LinkRow = Tables<"links">;
export type Setup = Tables<"setups">;
export type SetupItem = Tables<"setup_items">;
export type EditorialPage = Tables<"editorial_pages">;

// Todas as leituras usam o cliente público: a RLS garante que só conteúdo
// aprovado pelos quality gates chega às páginas.

export async function getIndexableCategories(): Promise<Category[]> {
  const { data } = await supabasePublic()
    .from("categories")
    .select("*")
    .order("name");
  return data ?? [];
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
