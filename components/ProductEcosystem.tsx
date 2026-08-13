import Link from "next/link";
import { getProductBySlug } from "@/lib/queries";
import { pillarByKey } from "@/lib/taxonomy";
import { supabasePublic } from "@/lib/supabase/server";

export async function ProductEcosystem({ accessorySlugs }: { accessorySlugs: string[] }) {
  if (!accessorySlugs || accessorySlugs.length === 0) return null;

  // Resolve os slugs para objetos de produto completos
  const items = [];
  for (const slug of accessorySlugs) {
    const p = await getProductBySlug(slug);
    if (p) {
      // Descobre o pillar baseado na categoria
      const { data: category } = await supabasePublic()
        .from("categories")
        .select("pillar, slug")
        .eq("id", p.category_id)
        .maybeSingle();

      if (category) {
        const pillar = pillarByKey(category.pillar);
        if (pillar) {
          items.push({
            ...p,
            pillarSlug: pillar.slug,
            categorySlug: category.slug,
          });
        }
      }
    } else {
      // DEMO MOCKS IF NOT IN DB
      if (slug === "studio-display") {
        items.push({
          slug: "studio-display",
          title: "Apple Studio Display 27\"",
          price_from: 1599,
          pillarSlug: "tech",
          categorySlug: "monitors",
          image_url: null,
        });
      }
      if (slug === "magic-keyboard-touchid") {
        items.push({
          slug: "magic-keyboard-touchid",
          title: "Magic Keyboard with Touch ID",
          price_from: 149,
          pillarSlug: "tech",
          categorySlug: "accessories",
          image_url: null,
        });
      }
    }
  }

  if (items.length === 0) return null;

  return (
    <section className="reveal max-w-2xl space-y-3 mb-12">
      <h2 className="font-display text-xl font-semibold tracking-tight">
        Perfect match (Ecosystem)
      </h2>
      <p className="text-sm text-dim mb-4">Aprimore sua experiência com acessórios que funcionam perfeitamente juntos.</p>
      
      <ul className="grid gap-3 sm:grid-cols-2">
        {items.map((item) => (
          <li key={item.slug}>
            <Link
              href={`/${item.pillarSlug}/${item.categorySlug}/${item.slug}`}
              className="group flex gap-4 rounded-lg border border-edge bg-surface p-4 hover:border-edge-strong transition-colors"
            >
              <div className="w-16 h-16 shrink-0 bg-surface rounded-md border border-edge overflow-hidden">
                {item.image_url ? (
                  <img src={item.image_url} alt={item.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center font-mono text-[8px] uppercase text-faint">No Img</div>
                )}
              </div>
              <div className="flex flex-col justify-center">
                <span className="text-sm font-medium leading-snug group-hover:text-accent-bright transition-colors">{item.title}</span>
                {item.price_from && (
                  <span className="mt-1 font-mono text-xs tabular-nums text-faint">
                    from ${item.price_from}
                  </span>
                )}
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
