"use client";

import Link from "next/link";

type Category = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  active_listing_count: number;
};

export function IntelligenceBento({ categories, pillarSlug }: { categories: Category[], pillarSlug: string }) {
  if (!categories || categories.length === 0) {
    return (
      <div className="max-w-2xl border-l-2 border-accent pl-5">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-faint">
          Categories in review
        </p>
        <p className="mt-2 leading-relaxed text-dim">
          A category appears here only after three items have been evaluated and published.
        </p>
      </div>
    );
  }

  return (
    <section id="categories" className="py-12">
      <div className="mb-10">
        <h2 className="font-display text-3xl font-semibold tracking-tight">Intelligence Categories</h2>
        <p className="mt-2 text-dim">Explore curated software, agents, and frameworks.</p>
      </div>
      
      <nav aria-label="Intelligence Categories" className="reveal-stagger grid gap-4 md:grid-cols-3 md:grid-rows-2">
        {categories.map((c, i) => {
          // Diferentes tamanhos de grid para fazer o efeito Bento. O primeiro item pode ser largo.
          const isFeatured = i === 0 || i === 3;
          const spanClass = isFeatured ? "md:col-span-2" : "md:col-span-1";
          
          return (
            <Link
              key={c.id}
              href={`/${pillarSlug}/${c.slug}`}
              data-spot
              data-tilt
              className={`spot-card glow-hover tilt group flex min-h-[220px] flex-col justify-between rounded-xl border border-edge bg-surface p-8 transition-colors hover:border-edge-strong ${spanClass}`}
            >
              <div className="relative z-10">
                <div className="flex items-start justify-between gap-4">
                  <h3 className="font-display text-2xl font-semibold tracking-tight text-ink">
                    {c.name}
                  </h3>
                  <span className="flex h-6 items-center rounded-full bg-accent/10 px-2.5 font-mono text-xs tabular-nums text-accent-bright">
                    {c.active_listing_count}
                  </span>
                </div>
                {c.description && (
                  <p className="mt-3 max-w-sm text-sm leading-relaxed text-dim">
                    {c.description}
                  </p>
                )}
              </div>
              
              <div className="relative z-10 mt-8 flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest">
                <span className="text-faint transition-colors duration-300 group-hover:text-accent-bright">
                  Explore Sector
                </span>
                <span className="text-accent opacity-0 transition-all duration-300 group-hover:translate-x-2 group-hover:opacity-100">
                  →
                </span>
              </div>

              {/* Decorative Background Elements */}
              {isFeatured && (
                <div className="absolute -bottom-10 -right-10 z-0 h-40 w-40 rounded-full bg-accent/5 blur-3xl transition-transform duration-700 group-hover:scale-150 group-hover:bg-accent/10"></div>
              )}
            </Link>
          );
        })}
      </nav>
    </section>
  );
}
