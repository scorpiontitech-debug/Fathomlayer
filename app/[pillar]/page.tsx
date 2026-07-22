import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCategoriesByPillar } from "@/lib/queries";
import { PILLARS, PILLAR_KEYS, pillarBySlug } from "@/lib/taxonomy";

export const revalidate = 3600;
// dynamicParams true: `false` quebra o prefetch RSC (NoFallbackError) sob ISR.
// Slugs inválidos já caem no notFound() abaixo, via pillarBySlug.
export const dynamicParams = true;

export function generateStaticParams() {
  return PILLAR_KEYS.map((key) => ({ pillar: PILLARS[key].slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ pillar: string }>;
}): Promise<Metadata> {
  const { pillar: pillarSlug } = await params;
  const pillar = pillarBySlug(pillarSlug);
  if (!pillar) return {};
  return {
    title: pillar.name,
    description: `${pillar.tagline} — independent curation by Fathom Layer.`,
    alternates: { canonical: `/${pillar.slug}` },
  };
}

export default async function PillarPage({
  params,
}: {
  params: Promise<{ pillar: string }>;
}) {
  const { pillar: pillarSlug } = await params;
  const pillar = pillarBySlug(pillarSlug);
  if (!pillar) notFound();

  const categories = await getCategoriesByPillar(pillar.key);

  return (
    <div className="space-y-10">
      <header className="rise-group max-w-2xl">
        <p className="font-mono text-xs uppercase tracking-[0.22em] text-dim">Pillar</p>
        <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight sm:text-5xl">
          {pillar.name}
        </h1>
        <p className="mt-3 text-lg leading-relaxed text-dim">{pillar.tagline}</p>
      </header>

      {categories.length > 0 ? (
        <ul className="reveal-stagger grid gap-4 sm:grid-cols-2">
          {categories.map((c) => (
            <li key={c.id}>
              <Link
                href={`/${pillar.slug}/${c.slug}`}
                data-spot
                data-tilt
                className="spot-card glow-hover tilt group flex min-h-[150px] flex-col justify-between rounded-lg border border-edge bg-surface p-6 hover:border-edge-strong"
              >
                <div>
                  <div className="flex items-baseline justify-between gap-3">
                    <h2 className="font-display text-lg font-semibold tracking-tight">
                      {c.name}
                    </h2>
                    <span className="font-mono text-xs tabular-nums text-faint">
                      {c.active_listing_count} item{c.active_listing_count === 1 ? "" : "s"}
                    </span>
                  </div>
                  {c.description ? (
                    <p className="mt-2 text-sm leading-relaxed text-dim">{c.description}</p>
                  ) : null}
                </div>
                <div className="relative mt-5 h-5 overflow-hidden font-mono text-xs uppercase tracking-[0.14em]">
                  <span className="absolute inset-x-0 text-faint transition-transform duration-300 ease-flow group-hover:-translate-y-5">
                    Category
                  </span>
                  <span className="absolute inset-x-0 translate-y-5 text-accent-bright transition-transform duration-300 ease-flow group-hover:translate-y-0">
                    Enter →
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <div className="rounded-lg border border-edge bg-surface px-6 py-14 text-center">
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-faint">In curation</p>
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-dim">
            Categories in this pillar are being reviewed. A category only enters the public
            index with at least 3 published, evaluated items.
          </p>
        </div>
      )}
    </div>
  );
}
