import { requireAdmin } from "@/lib/supabase/auth";
import { supabaseAdmin } from "@/lib/supabase/server";
import { PILLARS, type PillarKey } from "@/lib/taxonomy";
import { LinksAdmin, type EntityRow, type LinkRow } from "./LinksAdmin";

export const dynamic = "force-dynamic";

export default async function LinksAdminPage() {
  await requireAdmin();

  const admin = supabaseAdmin();
  if (!admin) {
    return (
      <div className="max-w-xl py-16">
        <h1 className="text-xl font-semibold">Monetisation</h1>
        <p className="mt-3 text-dim">
          <code className="font-mono">SUPABASE_SECRET_KEY</code> is not configured in{" "}
          <code className="font-mono">.env.local</code>.
        </p>
      </div>
    );
  }

  const [{ data: products }, { data: software }, { data: links }, { data: clicks }] =
    await Promise.all([
      admin
        .from("products")
        .select("id, title, slug, categories(slug, pillar)")
        .eq("status", "published")
        .order("title"),
      admin
        .from("software")
        .select("id, name, slug, categories(slug, pillar)")
        .eq("status", "published")
        .order("name"),
      admin
        .from("links")
        .select("id, entity_type, entity_id, program_name, url, label, region, is_primary"),
      admin.from("link_clicks").select("link_id"),
    ]);

  // Caminho público do item, para o operador conferir a página antes de
  // colar o link — o erro caro aqui é apontar o afiliado para o item errado.
  const publicPath = (
    cat: { slug: string; pillar: string } | null,
    slug: string
  ): string | null => {
    if (!cat) return null;
    const pillar = PILLARS[cat.pillar as PillarKey];
    if (!pillar) return null;
    return `/${pillar.slug}/${cat.slug}/${slug}`;
  };

  const first = <T,>(rel: T | T[] | null): T | null =>
    Array.isArray(rel) ? (rel[0] ?? null) : rel;

  const entities: EntityRow[] = [
    ...(products ?? []).map((p) => ({
      id: p.id,
      type: "product" as const,
      title: p.title,
      path: publicPath(first(p.categories), p.slug),
    })),
    ...(software ?? []).map((s) => ({
      id: s.id,
      type: "software" as const,
      title: s.name,
      path: publicPath(first(s.categories), s.slug),
    })),
  ].sort((a, b) => a.title.localeCompare(b.title));

  const clickCount = new Map<string, number>();
  for (const c of clicks ?? []) {
    clickCount.set(c.link_id, (clickCount.get(c.link_id) ?? 0) + 1);
  }

  const rows: LinkRow[] = (links ?? []).map((l) => ({
    ...l,
    clicks: clickCount.get(l.id) ?? 0,
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold">Monetisation</h1>
        <p className="mt-1 max-w-2xl text-sm text-dim">
          Affiliate links for published items. Every link is served through{" "}
          <code className="font-mono">/out/&#123;id&#125;</code>, which records the click and
          redirects — so the destination URL can be swapped at any time without touching a page.
          Items with no link earn nothing.
        </p>
      </div>
      <LinksAdmin entities={entities} links={rows} />
    </div>
  );
}
