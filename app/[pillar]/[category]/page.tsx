import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/JsonLd";
import { ProductCard, SoftwareCard } from "@/components/cards";
import { getCategoryBySlug, getCategoryListings, getIndexableCategories } from "@/lib/queries";
import { breadcrumbLd, itemListLd } from "@/lib/seo";
import { pillarBySlug, pillarByKey } from "@/lib/taxonomy";

// Template pSEO: mesma direção de arte, movimento só via CSS nativo
// (design system 5.3) — Core Web Vitals é parte da estratégia.
export const revalidate = 3600;
export const dynamicParams = true;

export async function generateStaticParams() {
  const categories = await getIndexableCategories();
  const params: { pillar: string; category: string }[] = [];
  for (const c of categories) {
    const pillar = pillarByKey(c.pillar);
    if (pillar) params.push({ pillar: pillar.slug, category: c.slug });
  }
  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ pillar: string; category: string }>;
}): Promise<Metadata> {
  const { pillar: pillarSlug, category: categorySlug } = await params;
  const category = await getCategoryBySlug(categorySlug);
  if (!category) return {};
  const description =
    category.description ??
    `${category.name}: items evaluated with verified data by Fathom Layer.`;
  return {
    title: category.name,
    description,
    alternates: { canonical: `/${pillarSlug}/${categorySlug}` },
    openGraph: {
      title: `${category.name} — Fathom Layer`,
      description,
      url: `/${pillarSlug}/${categorySlug}`,
      siteName: "Fathom Layer",
      type: "website",
    },
    twitter: { card: "summary_large_image" },
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ pillar: string; category: string }>;
}) {
  const { pillar: pillarSlug, category: categorySlug } = await params;
  const pillar = pillarBySlug(pillarSlug);
  if (!pillar) notFound();

  const category = await getCategoryBySlug(categorySlug);
  if (!category || category.pillar !== pillar.key) notFound();

  const { products, software } = await getCategoryListings(category.id);
  const total = products.length + software.length;

  const basePath = `/${pillar.slug}/${category.slug}`;
  const listItems = [
    ...products.map((p) => ({ name: p.title, path: `${basePath}/${p.slug}` })),
    ...software.map((s) => ({ name: s.name, path: `${basePath}/${s.slug}` })),
  ];

  return (
    <div className="space-y-10">
      <JsonLd
        data={breadcrumbLd([
          { name: pillar.name, path: `/${pillar.slug}` },
          { name: category.name, path: basePath },
        ])}
      />
      {listItems.length > 0 ? <JsonLd data={itemListLd(listItems, category.name)} /> : null}
      <nav aria-label="Breadcrumb" className="font-mono text-xs uppercase tracking-[0.14em]">
        <Link href={`/${pillar.slug}`} className="text-dim transition-colors hover:text-ink">
          {pillar.name}
        </Link>
        <span className="mx-2 text-faint">/</span>
        <span className="text-ink">{category.name}</span>
      </nav>

      <header className="max-w-2xl">
        <h1 className="font-display text-4xl font-semibold tracking-tight sm:text-5xl">
          {category.name}
        </h1>
        {category.description ? (
          <p className="mt-3 text-lg leading-relaxed text-dim">{category.description}</p>
        ) : null}
        <p className="mt-4 font-mono text-xs uppercase tracking-[0.18em] text-faint">
          {total} item{total === 1 ? "" : "s"} · human-reviewed
        </p>
      </header>

      {products.length > 0 ? (
        <section className="space-y-4">
          <h2 className="font-display text-xl font-semibold tracking-tight">Hardware</h2>
          <ul className="reveal-stagger grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((p) => (
              <li key={p.id}>
                <ProductCard product={p} href={`/${pillar.slug}/${category.slug}/${p.slug}`} />
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {software.length > 0 ? (
        <section className="space-y-4">
          <h2 className="font-display text-xl font-semibold tracking-tight">Software</h2>
          <ul className="reveal-stagger grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {software.map((s) => (
              <li key={s.id}>
                <SoftwareCard software={s} href={`/${pillar.slug}/${category.slug}/${s.slug}`} />
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {total === 0 ? (
        <div className="rounded-lg border border-edge bg-surface px-6 py-14 text-center">
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-faint">In curation</p>
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-dim">
            No items published in this category yet.
          </p>
        </div>
      ) : null}
    </div>
  );
}
