import type { Metadata } from "next";
import Link from "next/link";
import { getCategoriesByPillar, getEditorialPages, getIndexableCategories } from "@/lib/queries";
import { pillarByKey, matchesPillar } from "@/lib/taxonomy";
import { ComputeHero } from "@/components/compute/ComputeHero";
import { MiniCalculator } from "@/components/compute/MiniCalculator";
import { HardwareRadar } from "@/components/compute/HardwareRadar";
import { BottleneckAnalyzer } from "@/components/compute/BottleneckAnalyzer";
import { ComputeFAQ } from "@/components/compute/ComputeFAQ";
import { supabasePublic } from "@/lib/supabase/server";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Compute | Local AI Hardware",
  description: "Raw power for Local Intelligence. Find the best hardware, compare architectures, and calculate memory requirements for your AI models.",
  alternates: { canonical: "/compute" },
};

export default async function ComputePage() {
  const pillar = pillarByKey("compute");
  
  const [categories, glossary, guides, allCategories] = await Promise.all([
    getCategoriesByPillar("compute"),
    getEditorialPages("glossary"),
    getEditorialPages("guide"),
    getIndexableCategories()
  ]);

  const reading = [...guides, ...glossary].filter((p) => matchesPillar(p.tags, "compute"));
  
  // Prepare calculator items
  const computeCategories = allCategories.filter((c) => c.pillar === "compute");
  const categoryById = new Map(computeCategories.map((c) => [c.id, c]));
  
  let topProducts: any[] = [];
  if (computeCategories.length > 0) {
    const { data: products } = await supabasePublic()
      .from("products")
      .select("*")
      .in(
        "category_id",
        computeCategories.map((c) => c.id)
      )
      .order("design_score", { ascending: false, nullsFirst: false })
      .limit(6);
      
    topProducts = products ?? [];
  }

  return (
    <div className="space-y-16 pb-16">
      <ComputeHero />
      
      <div className="max-w-4xl mx-auto space-y-24 px-4 sm:px-6 lg:px-8">
        <MiniCalculator />

        <div className="reveal">
          <BottleneckAnalyzer />
        </div>
        
        <HardwareRadar products={topProducts} />
        
        {/* Tier List */}
        <section className="reveal space-y-6">
          <header className="flex items-baseline justify-between gap-4 border-b border-edge pb-4">
            <h2 className="font-display text-2xl font-semibold tracking-tight">The Hardware Tiers</h2>
            <Link href="/compute/workstations" className="text-sm font-medium text-accent-bright hover:underline underline-offset-4">
              View all rigs →
            </Link>
          </header>
          
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {topProducts.slice(0, 3).map((product) => {
              const cat = categoryById.get(product.category_id);
              return (
                <Link
                  key={product.id}
                  href={`/compute/${cat?.slug}/${product.slug}`}
                  data-spot
                  data-tilt
                  className="spot-card glow-hover tilt group flex flex-col justify-between rounded-lg border border-edge bg-surface p-6 hover:border-edge-strong transition-all"
                >
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-widest text-accent-bright mb-2">Top Pick</p>
                    <h3 className="font-display text-lg font-semibold tracking-tight group-hover:text-ink transition-colors">
                      {product.name}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-dim line-clamp-2">
                      {product.tagline}
                    </p>
                  </div>
                  <div className="mt-6 flex items-center justify-between">
                    <span className="font-mono text-xs tabular-nums text-faint border border-edge px-2 py-1 rounded">
                      {product.price ? `$${product.price.toLocaleString()}` : 'Check Price'}
                    </span>
                    <span aria-hidden className="text-faint transition-transform duration-300 ease-flow group-hover:translate-x-1 group-hover:text-accent-bright">
                      →
                    </span>
                  </div>
                </Link>
              )
            })}
          </div>
        </section>

        {/* Deep Dives & Guides */}
        {reading.length > 0 ? (
          <section className="reveal space-y-6">
            <header className="flex items-baseline justify-between gap-4 border-b border-edge pb-4">
              <h2 className="font-display text-2xl font-semibold tracking-tight">Community & Deep Dives</h2>
              <Link href="/compute/builds" className="text-sm font-medium text-accent-bright hover:underline underline-offset-4 flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-accent-bright animate-pulse"></span>
                Verified Builds
              </Link>
            </header>
            <div className="grid gap-4 sm:grid-cols-2">
              {reading.slice(0, 4).map((page) => (
                <Link
                  key={page.id}
                  href={`/${page.content_type === "guide" ? "guides" : "glossary"}/${page.slug}`}
                  className="group flex flex-col gap-2 rounded-lg border border-transparent bg-surface-dim p-4 hover:border-edge hover:bg-surface transition-colors"
                >
                  <span className="text-sm font-mono uppercase tracking-widest text-faint">
                    {page.content_type === "guide" ? "Guide" : "Glossary"}
                  </span>
                  <span className="font-medium leading-snug text-dim transition-colors group-hover:text-ink">
                    {page.title}
                  </span>
                </Link>
              ))}
            </div>
          </section>
        ) : null}

        {/* SEO FAQ Section */}
        <ComputeFAQ />
      </div>
    </div>
  );
}
