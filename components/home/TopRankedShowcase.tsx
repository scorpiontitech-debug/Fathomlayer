import Link from "next/link";
import { DataRing } from "@/components/DataRing";
import { pillarByKey } from "@/lib/taxonomy";

export function TopRankedShowcase({ products }: { products: any[] }) {
  if (!products || products.length === 0) return null;

  return (
    <section className="reveal space-y-5">
      <div className="flex items-baseline justify-between gap-4">
        <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          The Apex
        </h2>
        <span className="font-mono text-xs uppercase tracking-[0.18em] text-faint">
          Top Rated
        </span>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {products.map((p, i) => {
          const cat = p.categories;
          const pillar = cat ? pillarByKey(cat.pillar) : null;
          const href = pillar && cat ? `/${pillar.slug}/${cat.slug}/${p.slug}` : "#";

          return (
            <Link
              key={p.id}
              href={href}
              data-spot
              data-tilt
              className="spot-card glow-hover tilt group relative flex flex-col justify-between rounded-lg border border-edge backdrop-blur-2xl bg-white/5 p-6 hover:border-accent"
            >
              <div className="flex justify-between items-start">
                <span className="font-mono text-4xl font-bold text-edge-strong">
                  #{i + 1}
                </span>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] uppercase tracking-widest text-faint">
                    {cat?.name}
                  </span>
                  <DataRing score={p.design_score} size={40} strokeWidth={3} />
                </div>
              </div>
              
              <div className="mt-6">
                <h3 className="font-display text-xl font-semibold tracking-tight text-white group-hover:text-accent-bright transition-colors">
                  {p.title}
                </h3>
                <p className="mt-2 text-sm text-dim line-clamp-2">
                  {p.description}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
