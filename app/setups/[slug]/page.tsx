import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPublishedSetups, getResolvedSetupItems, getSetupBySlug } from "@/lib/queries";
import { pillarByKey } from "@/lib/taxonomy";

export const revalidate = 3600;
export const dynamicParams = true;

export async function generateStaticParams() {
  const setups = await getPublishedSetups();
  return setups.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const setup = await getSetupBySlug(slug);
  if (!setup) return {};
  return { title: setup.title, description: setup.description ?? undefined };
}

export default async function SetupDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const setup = await getSetupBySlug(slug);
  if (!setup) notFound();

  const items = await getResolvedSetupItems(setup.id);

  return (
    <article className="space-y-10">
      <nav aria-label="Breadcrumb" className="font-mono text-xs uppercase tracking-[0.14em]">
        <Link href="/setups" className="text-dim transition-colors hover:text-ink">
          Setups
        </Link>
        <span className="mx-2 text-faint">/</span>
        <span className="text-ink">{setup.title}</span>
      </nav>

      <header className="max-w-2xl">
        <h1 className="font-display text-4xl font-semibold tracking-tight sm:text-5xl">
          {setup.title}
        </h1>
        {setup.description ? (
          <p className="mt-3 text-lg leading-relaxed text-dim">{setup.description}</p>
        ) : null}
      </header>

      {items.length > 0 ? (
        <ol className="max-w-2xl space-y-4">
          {items.map(({ item, product, software, category }, index) => {
            const title = product?.title ?? software?.name ?? "";
            const entitySlug = product?.slug ?? software?.slug ?? "";
            const pillar = category ? pillarByKey(category.pillar) : null;
            const href =
              category && pillar ? `/${pillar.slug}/${category.slug}/${entitySlug}` : null;
            return (
              <li key={item.id} className="reveal">
                <div className="group flex gap-5 rounded-lg border border-edge bg-surface p-5 transition-[border-color] duration-300 ease-flow hover:border-edge-strong">
                  <span className="font-mono text-sm tabular-nums text-faint">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div className="flex-1">
                    {href ? (
                      <Link
                        href={href}
                        className="font-display font-semibold transition-colors hover:text-accent-bright"
                      >
                        {title}
                      </Link>
                    ) : (
                      <span className="font-display font-semibold">{title}</span>
                    )}
                    {item.note ? (
                      <p className="mt-1.5 text-sm leading-relaxed text-dim">{item.note}</p>
                    ) : null}
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      ) : (
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-faint">
          Items in curation
        </p>
      )}
    </article>
  );
}
