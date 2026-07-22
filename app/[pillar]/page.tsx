import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCategoriesByPillar, getEditorialPages } from "@/lib/queries";
import { PILLARS, PILLAR_KEYS, matchesPillar, pillarBySlug } from "@/lib/taxonomy";

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

  const [categories, glossary, guides] = await Promise.all([
    getCategoriesByPillar(pillar.key),
    getEditorialPages("glossary"),
    getEditorialPages("guide"),
  ]);

  // Conteúdo editorial já publicado que pertence a este pilar. É o que
  // impede a página de ser um beco sem saída enquanto nenhuma categoria
  // cruzou o Quality Gate — sem burlar o gate, só usando o que já é público.
  const reading = [...guides, ...glossary].filter((p) => matchesPillar(p.tags, pillar.key));

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
        /* Sem categoria indexável ainda. Em vez de uma caixa vazia, a página
           declara o critério e segue com o que já existe publicado. */
        <div className="max-w-2xl border-l-2 border-accent pl-5">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-faint">
            Categories in review
          </p>
          <p className="mt-2 leading-relaxed text-dim">
            A category appears here only after three items have been evaluated and
            published — score, editorial note and verified specifications. Until then the
            reference material below is the useful part of this pillar, and it is already
            written.
          </p>
        </div>
      )}

      {reading.length > 0 ? (
        <section className="reveal space-y-4 pt-4">
          <div className="flex items-baseline justify-between gap-4">
            <h2 className="font-display text-xl font-semibold tracking-tight">Start here</h2>
            <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-faint">
              Reference
            </span>
          </div>
          <ul className="divide-y divide-edge border-y border-edge">
            {reading.map((page) => (
              <li key={page.id}>
                <Link
                  href={`/${page.content_type === "guide" ? "guides" : "glossary"}/${page.slug}`}
                  className="group flex items-center justify-between gap-4 py-4"
                >
                  <span className="leading-snug text-dim transition-colors group-hover:text-ink">
                    {page.title}
                  </span>
                  <span className="shrink-0 font-mono text-[11px] uppercase tracking-[0.14em] text-faint">
                    {page.content_type === "guide" ? "Guide" : "Glossary"}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {pillar.key === "compute" ? (
        <Link
          href="/calculator"
          data-spot
          className="spot-card group flex items-center justify-between gap-4 rounded-lg border border-edge bg-surface p-6 transition-[border-color,transform] duration-300 ease-flow hover:-translate-y-0.5 hover:border-edge-strong"
        >
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-faint">
              Interactive tool
            </p>
            <p className="mt-1 font-display text-lg font-semibold">Local AI Hardware Calculator</p>
            <p className="mt-1 text-sm leading-relaxed text-dim">
              Pick a model, see the memory tier it needs.
            </p>
          </div>
          <span
            aria-hidden
            className="text-accent-bright transition-transform duration-200 ease-flow group-hover:translate-x-1"
          >
            →
          </span>
        </Link>
      ) : null}
    </div>
  );
}
