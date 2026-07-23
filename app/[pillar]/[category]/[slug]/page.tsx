import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AffiliateDisclosure } from "@/components/AffiliateDisclosure";
import { CommunityReviews } from "@/components/CommunityReviews";
import { GithubStats } from "@/components/GithubStats";
import { JsonLd } from "@/components/JsonLd";
import { ProsCons } from "@/components/ProsCons";
import { SaveButton } from "@/components/SaveButton";
import { DiscontinuedBadge, DiscontinuedNotice } from "@/components/StatusBadge";
import { VerifiedBadge } from "@/components/VerifiedBadge";
import { DeepDive, FaqSection, KeyFeatures, VideoEmbed } from "@/components/RichContent";
import {
  getAlternativeProducts,
  getAlternativeSoftware,
  getCategoryBySlug,
  getIndexableCategories,
  getLinks,
  getProductById,
  getProductBySlug,
  getRelatedEditorialPages,
  getSoftwareBySlug,
  type Category,
  type EditorialPage,
  type LinkRow,
  type Product,
  type Software,
} from "@/lib/queries";
import { breadcrumbLd, productLd, softwareLd, SITE_NAME } from "@/lib/seo";
import { specEntries, tierLabel } from "@/lib/spec-display";
import { supabasePublic } from "@/lib/supabase/server";
import { pillarBySlug, pillarByKey } from "@/lib/taxonomy";

// Item pages revalidate slowly: specs rarely change (design system section 6).
export const revalidate = 86400;
export const dynamicParams = true;

export async function generateStaticParams() {
  const client = supabasePublic();
  const categories = await getIndexableCategories();
  const categoryById = new Map(categories.map((c) => [c.id, c]));

  const [products, software] = await Promise.all([
    client.from("products").select("slug, category_id"),
    client.from("software").select("slug, category_id"),
  ]);

  const params: { pillar: string; category: string; slug: string }[] = [];
  for (const row of [...(products.data ?? []), ...(software.data ?? [])]) {
    const category = categoryById.get(row.category_id);
    if (!category) continue;
    const pillar = pillarByKey(category.pillar);
    if (!pillar) continue;
    params.push({ pillar: pillar.slug, category: category.slug, slug: row.slug });
  }
  return params;
}

async function resolveEntity(slug: string): Promise<
  | { kind: "product"; product: Product }
  | { kind: "software"; software: Software }
  | null
> {
  const product = await getProductBySlug(slug);
  if (product) return { kind: "product", product };
  const software = await getSoftwareBySlug(slug);
  if (software) return { kind: "software", software };
  return null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ pillar: string; category: string; slug: string }>;
}): Promise<Metadata> {
  const { pillar, category, slug } = await params;
  const entity = await resolveEntity(slug);
  if (!entity) return {};
  const path = `/${pillar}/${category}/${slug}`;
  const title = entity.kind === "product" ? entity.product.title : entity.software.name;
  const description =
    (entity.kind === "product" ? entity.product.description : entity.software.description) ??
    undefined;
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title: `${title} — ${SITE_NAME}`,
      description,
      url: path,
      siteName: SITE_NAME,
      type: "website",
    },
    twitter: { card: "summary_large_image", title: `${title} — ${SITE_NAME}`, description },
  };
}

function Breadcrumb({
  pillar,
  category,
}: {
  pillar: { slug: string; name: string };
  category: Category;
}) {
  return (
    <nav aria-label="Breadcrumb" className="font-mono text-xs uppercase tracking-[0.14em]">
      <Link href={`/${pillar.slug}`} className="text-dim transition-colors hover:text-ink">
        {pillar.name}
      </Link>
      <span className="mx-2 text-faint">/</span>
      <Link
        href={`/${pillar.slug}/${category.slug}`}
        className="text-dim transition-colors hover:text-ink"
      >
        {category.name}
      </Link>
    </nav>
  );
}

function DesignScore({ score }: { score: number }) {
  return (
    <div className="shrink-0 rounded-lg border border-edge bg-surface p-5 text-right">
      <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-faint">
        Design score
      </p>
      <p className="mt-1 font-mono text-4xl tabular-nums leading-none text-accent-bright">
        {score.toFixed(1)}
        <span className="text-base text-faint">/10</span>
      </p>
      <div className="mt-3 h-px w-36 bg-edge-strong">
        <div className="h-px bg-accent-bright" style={{ width: `${score * 10}%` }} />
      </div>
      <Link
        href="/methodology"
        className="mt-2 inline-block font-mono text-[11px] uppercase tracking-[0.14em] text-faint transition-colors hover:text-dim"
      >
        How we score →
      </Link>
    </div>
  );
}

function SpecsTable({ specs }: { specs: unknown }) {
  const entries = specEntries(specs);
  if (entries.length === 0) return null;
  return (
    <section className="reveal max-w-2xl">
      <h2 className="font-display text-xl font-semibold tracking-tight">Specifications</h2>
      <table className="mt-4 w-full border-collapse text-sm">
        <tbody>
          {entries.map((entry) => (
            <tr key={entry.key} className="border-b border-edge">
              <th className="py-3 pr-6 text-left align-top font-normal text-dim">
                {entry.label}
              </th>
              <td className="py-3 text-right font-mono tabular-nums">{entry.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

function OutLinks({ links }: { links: LinkRow[] }) {
  if (links.length === 0) return null;
  return (
    <section className="reveal space-y-3">
      <h2 className="font-display text-xl font-semibold tracking-tight">Where to buy</h2>
      <ul className="flex flex-wrap gap-3">
        {links.map((link) => (
          <li key={link.id}>
            <a
              href={`/out/${link.id}`}
              rel="nofollow sponsored"
              data-magnetic
              className={`magnetic group inline-flex items-center gap-2 rounded-md px-5 py-2.5 text-sm font-medium active:scale-[0.98] ${
                link.is_primary
                  ? "bg-accent text-white hover:bg-accent-bright hover:shadow-[0_0_34px_rgba(0,82,255,0.42)]"
                  : "border border-edge-strong text-ink hover:border-accent-bright"
              }`}
            >
              {link.label ?? link.program_name ?? "View offer"}
              {link.region !== "global" ? (
                <span className="font-mono text-xs uppercase text-white/60">{link.region}</span>
              ) : null}
              <span
                aria-hidden
                className="transition-transform duration-200 ease-flow group-hover:translate-x-0.5"
              >
                →
              </span>
            </a>
          </li>
        ))}
      </ul>
      <AffiliateDisclosure />
    </section>
  );
}

function AlternativesBlock({
  items,
  pillarSlug,
  categorySlug,
}: {
  items: { slug: string; title: string; score: number | null; metric: string | null }[];
  pillarSlug: string;
  categorySlug: string;
}) {
  if (items.length === 0) return null;
  return (
    <section className="reveal max-w-2xl space-y-3">
      <h2 className="font-display text-xl font-semibold tracking-tight">
        Alternatives to consider
      </h2>
      <ul className="reveal-stagger grid gap-3 sm:grid-cols-3">
        {items.map((alt) => (
          <li key={alt.slug}>
            <Link
              href={`/${pillarSlug}/${categorySlug}/${alt.slug}`}
              data-spot
              data-tilt
              className="spot-card glow-hover tilt group flex h-full flex-col justify-between rounded-lg border border-edge bg-surface p-4 hover:border-edge-strong"
            >
              <span className="text-sm font-medium leading-snug">{alt.title}</span>
              <span className="mt-3 flex items-baseline justify-between font-mono text-xs tabular-nums">
                <span className="text-faint">{alt.metric ?? ""}</span>
                {alt.score !== null ? (
                  <span className="text-accent-bright">{alt.score.toFixed(1)}</span>
                ) : null}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

// Leitura relacionada (content-spec §8). Glossário e guias são a cauda longa
// do índice — sem link de entrada a partir das páginas de item, ficam órfãos
// e a autoridade não circula.
function FurtherReading({ pages }: { pages: EditorialPage[] }) {
  if (pages.length === 0) return null;
  return (
    <section className="reveal max-w-2xl space-y-3">
      <h2 className="font-display text-xl font-semibold tracking-tight">Further reading</h2>
      <ul className="divide-y divide-edge border-y border-edge">
        {pages.map((page) => (
          <li key={page.id}>
            <Link
              href={`/${page.content_type === "guide" ? "guides" : "glossary"}/${page.slug}`}
              className="group flex items-center justify-between gap-4 py-3.5"
            >
              <span className="text-sm leading-snug text-dim transition-colors group-hover:text-ink">
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
  );
}

const formatPrice = (value: number, currency: string | null) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency ?? "USD",
    maximumFractionDigits: 0,
  }).format(value);

export default async function DetailPage({
  params,
}: {
  params: Promise<{ pillar: string; category: string; slug: string }>;
}) {
  const { pillar: pillarSlug, category: categorySlug, slug } = await params;
  const pillar = pillarBySlug(pillarSlug);
  if (!pillar) notFound();

  const category = await getCategoryBySlug(categorySlug);
  if (!category || category.pillar !== pillar.key) notFound();

  const entity = await resolveEntity(slug);
  if (!entity) notFound();

  const entityCategoryId =
    entity.kind === "product" ? entity.product.category_id : entity.software.category_id;
  if (entityCategoryId !== category.id) notFound();

  const path = `/${pillar.slug}/${category.slug}/${slug}`;
  const crumbs = [
    { name: pillar.name, path: `/${pillar.slug}` },
    { name: category.name, path: `/${pillar.slug}/${category.slug}` },
    {
      name: entity.kind === "product" ? entity.product.title : entity.software.name,
      path,
    },
  ];

  if (entity.kind === "product") {
    const p = entity.product;
    const tier = tierLabel(p.specs);
    const [links, relatedProduct, alternatives, furtherReading] = await Promise.all([
      getLinks("product", p.id),
      p.related_context_product_id ? getProductById(p.related_context_product_id) : null,
      getAlternativeProducts(p),
      getRelatedEditorialPages(p.category_id, p.tags),
    ]);
    let relatedCategory: Category | null = null;
    if (relatedProduct) {
      const { data } = await supabasePublic()
        .from("categories")
        .select("*")
        .eq("id", relatedProduct.category_id)
        .maybeSingle();
      relatedCategory = data;
    }
    const relatedPillar = relatedCategory ? pillarByKey(relatedCategory.pillar) : null;

    return (
      <article className="space-y-12">
        <JsonLd data={productLd(p, category, path)} />
        <JsonLd data={breadcrumbLd(crumbs)} />

        <Breadcrumb pillar={pillar} category={category} />

        <header className="flex flex-wrap items-start justify-between gap-6">
          <div className="max-w-2xl">
            <h1 className="font-display text-4xl font-semibold tracking-tight sm:text-5xl">
              {p.title}
            </h1>
            <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-dim">
              {p.brand ? <span>{p.brand}</span> : null}
              {p.brand && tier ? <span className="text-faint">·</span> : null}
              {tier ? (
                <span className="font-mono text-xs uppercase tracking-[0.14em]">{tier} tier</span>
              ) : null}
              {p.price_from !== null ? (
                <>
                  <span className="text-faint">·</span>
                  <span className="font-mono tabular-nums">
                    from {formatPrice(p.price_from, p.price_currency)}
                  </span>
                </>
              ) : null}
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <VerifiedBadge verifiedAt={p.last_verified_at} />
              {p.status === "archived" ? <DiscontinuedBadge /> : null}
            </div>
          </div>
          <div className="flex flex-col items-end gap-3">
            {p.design_score !== null ? <DesignScore score={p.design_score} /> : null}
            <SaveButton entityId={p.id} entityType="product" />
          </div>
        </header>

        {p.image_url ? (
          <figure className="reveal flex justify-center rounded-lg border border-edge bg-surface p-8">
            <img
              src={p.image_url}
              alt={p.title}
              className="max-h-[400px] w-auto max-w-full object-contain"
              loading="lazy"
            />
          </figure>
        ) : null}

        {/* Bloco de resposta atômica (≤150 palavras) — checklist GEO §8 */}
        {p.description ? (
          <section className="max-w-2xl border-l-2 border-accent pl-5">
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-faint">
              Verdict
            </p>
            <p className="mt-2 text-lg leading-relaxed">{p.description}</p>
          </section>
        ) : null}

        {p.video_url ? <VideoEmbed url={p.video_url} /> : null}

        <ProsCons pros={p.pros} cons={p.cons} idealFor={p.ideal_for} />

        {p.key_features && p.key_features.length > 0 ? <KeyFeatures features={p.key_features} /> : null}

        <SpecsTable specs={p.specs} />

        {p.editorial_notes ? (
          <section className="reveal max-w-2xl rounded-lg border border-edge bg-surface p-6">
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-faint">
              Editorial note
            </p>
            <p className="mt-2 leading-relaxed text-dim">{p.editorial_notes}</p>
          </section>
        ) : null}

        {p.body_markdown ? <DeepDive markdown={p.body_markdown} /> : null}
        
        {p.faqs ? <FaqSection faqs={p.faqs} /> : null}

        {p.status === "archived" ? (
          <DiscontinuedNotice kind="product" />
        ) : (
          <OutLinks links={links} />
        )}

        <AlternativesBlock
          items={alternatives.map((alt) => ({
            slug: alt.slug,
            title: alt.title,
            score: alt.design_score,
            metric: specEntries(alt.specs)[0]?.value ?? null,
          }))}
          pillarSlug={pillar.slug}
          categorySlug={category.slug}
        />

        <FurtherReading pages={furtherReading} />

        {relatedProduct && relatedCategory && relatedPillar ? (
          <section className="reveal max-w-2xl">
            <Link
              href={`/${relatedPillar.slug}/${relatedCategory.slug}/${relatedProduct.slug}`}
              className="group flex items-center justify-between gap-4 rounded-lg border border-edge bg-surface p-5 transition-[border-color,transform] duration-300 ease-flow hover:-translate-y-0.5 hover:border-edge-strong"
            >
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-faint">
                  Technical context
                </p>
                <p className="mt-1 font-display font-semibold">{relatedProduct.title}</p>
              </div>
              <span
                aria-hidden
                className="text-accent-bright transition-transform duration-200 ease-flow group-hover:translate-x-1"
              >
                →
              </span>
            </Link>
          </section>
        ) : null}

        <CommunityReviews entityId={p.id} entityType="product" />
      </article>
    );
  }

  const s = entity.software;
  const [links, alternatives, furtherReading] = await Promise.all([
    getLinks("software", s.id),
    getAlternativeSoftware(s),
    getRelatedEditorialPages(s.category_id, s.tags),
  ]);

  return (
    <article className="space-y-12">
      <JsonLd data={softwareLd(s, category, path)} />
      <JsonLd data={breadcrumbLd(crumbs)} />

      <Breadcrumb pillar={pillar} category={category} />

      <header className="max-w-2xl">
        <h1 className="font-display text-4xl font-semibold tracking-tight sm:text-5xl">
          {s.name}
        </h1>
        <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-dim">
          {s.pricing_model ? (
            <span className="font-mono text-xs uppercase tracking-[0.14em]">
              {s.pricing_model}
            </span>
          ) : null}
          {s.pricing_model && s.price_text ? <span className="text-faint">·</span> : null}
          {s.price_text ? <span className="font-mono tabular-nums">{s.price_text}</span> : null}
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <VerifiedBadge verifiedAt={s.last_verified_at} />
          {s.status === "archived" ? <DiscontinuedBadge /> : null}
        </div>
        <div className="mt-4">
          <SaveButton entityId={s.id} entityType="software" />
        </div>
      </header>

      {s.github_repo ? (
        <div className="reveal max-w-2xl">
          <GithubStats repo={s.github_repo} />
        </div>
      ) : null}

      {s.image_url ? (
        <figure className="reveal flex justify-center rounded-lg border border-edge bg-surface p-8">
          <img
            src={s.image_url}
            alt={s.name}
            className="max-h-[400px] w-auto max-w-full object-contain"
            loading="lazy"
          />
        </figure>
      ) : null}

      {s.description ? (
        <section className="max-w-2xl border-l-2 border-accent pl-5">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-faint">Verdict</p>
          <p className="mt-2 text-lg leading-relaxed">{s.description}</p>
        </section>
      ) : null}

      {s.video_url ? <VideoEmbed url={s.video_url} /> : null}

      <ProsCons pros={s.pros} cons={s.cons} idealFor={s.ideal_for} />

      {s.key_features && s.key_features.length > 0 ? <KeyFeatures features={s.key_features} /> : null}

      {s.editorial_notes ? (
        <section className="reveal max-w-2xl rounded-lg border border-edge bg-surface p-6">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-faint">
            Editorial note
          </p>
          <p className="mt-2 leading-relaxed text-dim">{s.editorial_notes}</p>
        </section>
      ) : null}

      {s.body_markdown ? <DeepDive markdown={s.body_markdown} /> : null}

      {s.faqs ? <FaqSection faqs={s.faqs} /> : null}

      {/* Software arquivado: nem site oficial nem caminho de compra — o
          destino provavelmente já não existe (roadmap #21). */}
      {s.status === "archived" ? (
        <DiscontinuedNotice kind="software" />
      ) : (
        <>
          {s.website_url ? (
            <p className="reveal">
              <a
                href={s.website_url}
                rel="nofollow noopener"
                target="_blank"
                className="nav-link text-sm text-accent-bright"
              >
                Official website ↗
              </a>
            </p>
          ) : null}

          <OutLinks links={links} />
        </>
      )}

      <AlternativesBlock
        items={alternatives.map((alt) => ({
          slug: alt.slug,
          title: alt.name,
          score: null,
          metric: alt.price_text,
        }))}
        pillarSlug={pillar.slug}
        categorySlug={category.slug}
      />

      <FurtherReading pages={furtherReading} />

      <CommunityReviews entityId={s.id} entityType="software" />
    </article>
  );
}
