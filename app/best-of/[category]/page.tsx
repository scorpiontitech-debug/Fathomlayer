import { getBestOfCategory } from "@/lib/queries";
import { notFound } from "next/navigation";
import Link from "next/link";
import { DesignScore } from "@/components/DesignScore";

export default async function BestOfPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  const data = await getBestOfCategory(category);

  if (!data || data.items.length === 0) {
    notFound();
  }

  const title = `Best ${data.category.name} in 2026`;
  const description = `The definitive, data-driven list of the top ${data.category.name} based on design, utility, and community consensus.`;

  return (
    <div className="space-y-16 pb-24 max-w-3xl mx-auto">
      <header className="rise-group border-b border-edge pb-10">
        <p className="font-mono text-sm uppercase tracking-widest text-accent-bright mb-4">
          Fathom Layer Curated
        </p>
        <h1 className="font-display text-4xl font-semibold tracking-tight sm:text-5xl text-ink">
          {title}
        </h1>
        <p className="mt-6 text-xl text-dim">
          {description}
        </p>
      </header>

      <section className="space-y-12 reveal">
        {data.items.map((item, index) => (
          <article key={item.id} className="relative rounded-2xl border border-edge bg-surface p-8 shadow-sm">
            <div className="absolute -top-4 -left-4 flex h-10 w-10 items-center justify-center rounded-full bg-ink text-surface font-display font-bold">
              #{index + 1}
            </div>
            
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="font-display text-2xl font-bold text-ink">{item.title}</h2>
                {item.price_text && (
                  <p className="mt-1 font-mono text-sm text-dim">{item.price_text}</p>
                )}
              </div>
              {item.design_score !== null && (
                <DesignScore score={item.design_score} />
              )}
            </div>

            {item.image_url && (
              <div className="mb-6 overflow-hidden rounded-lg border border-edge">
                <img src={item.image_url} alt={item.title} className="w-full object-cover" />
              </div>
            )}

            <p className="text-dim mb-6 leading-relaxed">
              {item.description || "No description provided."}
            </p>

            <Link
              href={`/hardware/${data.category.slug}/${item.slug}`} // Assuming hardware for MVP, in real app resolve pillar
              className="inline-flex items-center justify-center rounded-lg bg-ink px-5 py-2.5 text-sm font-medium text-surface transition hover:bg-ink/90"
            >
              Read Full Review & Specs
            </Link>
          </article>
        ))}
      </section>
    </div>
  );
}
