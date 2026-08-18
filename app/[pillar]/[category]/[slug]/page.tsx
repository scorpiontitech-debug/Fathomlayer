import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AffiliateDisclosure } from "@/components/AffiliateDisclosure";
import { CommunityReviews } from "@/components/CommunityReviews";
import { CopyBadge } from "@/components/CopyBadge";
import { EmbedBadge } from "@/components/EmbedBadge";
import { PriceAlertButton } from "@/components/PriceAlertButton";
import { ShareButtons } from "@/components/ShareButtons";
import { GithubStats } from "@/components/GithubStats";
import { JsonLd } from "@/components/JsonLd";
import { ProsCons } from "@/components/ProsCons";
import { SaveButton } from "@/components/SaveButton";
import { DiscontinuedBadge, DiscontinuedNotice } from "@/components/StatusBadge";
import { VerifiedBadge } from "@/components/VerifiedBadge";
import { DeepDive, FaqSection, KeyFeatures, VideoEmbed } from "@/components/RichContent";
import CopyPromptButton from "@/components/CopyPromptButton";
import { LifecycleBadge, FathomScores, HumanTranslation, PurchaseEssentials } from "@/components/product-features";
import { ProductEcosystem } from "@/components/ProductEcosystem";
import {
  ConsultantChat,
  DigitalTwinViewer,
  EcosystemTCO,
  ProROICalculator,
} from "@/components/product-features/LazyBlocks";
import { AffinityTracker } from "@/components/AffinityTracker";
import {
  getAggregateRating,
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

    const aggregateRating = await getAggregateRating("product", p.id);

    const { data: initialReviewsData } = await supabasePublic()
      .from("community_reviews")
      .select(`id, rating, comment, created_at, user_profiles ( username )`)
      .eq("entity_id", p.id)
      .order("created_at", { ascending: false });
    const initialReviews = initialReviewsData || [];

    return (
      <article className="space-y-12">
        <AffinityTracker categorySlug={category.slug} weight={2} />
        <JsonLd data={productLd(p, category, path, aggregateRating)} />
        <JsonLd data={breadcrumbLd(crumbs)} />

        <Breadcrumb pillar={pillar} category={category} />

        <header className="relative flex flex-col md:flex-row md:items-center justify-between gap-8 rounded-2xl border border-edge bg-surface/50 p-6 md:p-8 backdrop-blur-sm">
          <div className="max-w-xl">
            <LifecycleBadge status={p.lifecycle_status} />
            <div className="flex flex-wrap items-center gap-3 mb-4">
              {p.brand ? <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-accent-bright">{p.brand}</span> : null}
              {p.brand && tier ? <span className="text-edge-strong">|</span> : null}
              {tier ? (
                <span className="font-mono text-xs uppercase tracking-[0.14em] text-dim">{tier} tier</span>
              ) : null}
            </div>
            <h1 className="font-display text-4xl font-semibold tracking-tight sm:text-5xl">
              {p.title}
            </h1>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <VerifiedBadge verifiedAt={p.last_verified_at} />
              {p.status === "archived" ? <DiscontinuedBadge /> : null}
            </div>
            {p.price_from !== null ? (
              <div className="mt-6 font-mono tabular-nums text-xl">
                <span className="text-faint text-sm mr-2">Starting at</span>
                {formatPrice(p.price_from, p.price_currency)}
              </div>
            ) : null}
          </div>
          <div className="flex flex-col items-end gap-4 md:min-w-[200px]">
            {p.design_score !== null ? <DesignScore score={p.design_score} /> : null}
            <div className="flex w-full flex-col gap-2 sm:flex-row md:flex-col mt-2">
              <PriceAlertButton entityId={p.id} entityType="product" />
              <SaveButton entityId={p.id} entityType="product" />
            </div>
            <ShareButtons title={p.title} score={p.design_score} urlPath={`/${pillar}/${category}/${slug}`} />
          </div>
        </header>

        <FathomScores 
          design={p.design_score}
          battery={p.score_battery}
          value={p.score_value}
          performance={p.score_performance}
        />

        {/* Visual Highlights & Image Fallback */}
        <div className="grid md:grid-cols-3 gap-6">
          <figure className={`md:col-span-2 reveal flex items-center justify-center rounded-xl border border-edge overflow-hidden relative ${p.image_url ? 'bg-surface' : 'bg-gradient-to-br from-surface via-surface to-edge/20 min-h-[350px] p-8'}`}>
            {p.image_url ? (
              <img
                src={p.image_url}
                alt={p.title}
                className="w-full h-full object-cover aspect-[4/3] md:aspect-auto drop-shadow-2xl hover:scale-105 transition-transform duration-700 ease-out"
                loading="lazy"
              />
            ) : (
              <div className="text-center">
                <div className="font-display text-6xl text-edge-strong opacity-40 font-bold tracking-tighter blur-[1px]">
                  {p.brand || "FATHOM"}
                </div>
                <div className="mt-2 font-mono text-xs uppercase tracking-widest text-faint">Image Unavailable</div>
              </div>
            )}
          </figure>

          <div className="flex flex-col gap-3">
            {category.slug === "smart-rings" || category.slug === "wearables" ? (
              <div className="flex-1 rounded-xl border border-edge bg-surface/30 p-5 flex flex-col justify-center reveal">
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-faint mb-2">Live Biometric Simulation</span>
                <div className="w-full h-[200px] rounded-lg overflow-hidden relative">
                  <DigitalTwinViewer stressScore={45} heartRate={68} />
                </div>
              </div>
            ) : null}

            {specEntries(p.specs).slice(0, 4).map((entry, i) => (
              <div key={entry.key} className="flex-1 rounded-xl border border-edge bg-surface/30 p-5 flex flex-col justify-center reveal" style={{ animationDelay: `${i * 100}ms` }}>
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-faint mb-1">{entry.label}</span>
                <span className="font-medium text-sm text-ink line-clamp-2">{entry.value}</span>
              </div>
            ))}
            {specEntries(p.specs).length === 0 && (
              <div className="flex-1 rounded-xl border border-edge bg-surface/30 p-5 flex flex-col justify-center items-center text-center reveal">
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-faint mb-1">Status</span>
                <span className="font-medium text-sm text-dim">Specs Pending</span>
              </div>
            )}
          </div>
        </div>

        {/* Bloco de resposta atômica (≤150 palavras) — checklist GEO §8 */}
        {p.description ? (
          <section className="max-w-2xl border-l-2 border-accent pl-5">
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-faint">
              Verdict
            </p>
            <p className="mt-2 text-lg leading-relaxed">{p.description}</p>
          </section>
        ) : null}

        {/* --- Tools Injection --- */}
        {(category.slug === "smartphones" || category.slug === "tablets" || category.slug === "wearables" || category.slug === "gaming-consoles") && p.price_from ? (
          <EcosystemTCO basePrice={p.price_from} productName={p.title} brand={p.brand || "Brand"} />
        ) : null}

        {(p.price_from && p.price_from > 1500) || category.slug === "laptops" || category.slug === "desktops" ? (
          <ProROICalculator price={p.price_from || 1999} productName={p.title} />
        ) : null}
        {/* ----------------------- */}

        {p.video_url ? <VideoEmbed url={p.video_url} /> : null}

        <ProsCons pros={p.pros} cons={p.cons} idealFor={p.ideal_for} />

        {p.key_features && p.key_features.length > 0 ? <KeyFeatures features={p.key_features} /> : null}

        <SpecsTable specs={p.specs} />

        <HumanTranslation data={p.human_translation} />
        
        <PurchaseEssentials 
          colors={p.colors}
          inTheBox={p.in_the_box}
          repairability={p.repairability_score}
        />

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

        <ProductEcosystem accessorySlugs={p.accessories ?? []} />

        <section className="reveal max-w-2xl space-y-3 mb-12">
          <h2 className="font-display text-xl font-semibold tracking-tight">Fathom Consultant</h2>
          <p className="text-sm text-dim mb-4">Have specific questions about this product? Ask our AI.</p>
          <ConsultantChat productContext={{ title: p.title, verdict: p.description, brand: p.brand, specs: p.specs }} />
        </section>

        {p.status === "archived" ? (
          <DiscontinuedNotice kind="product" />
        ) : (
          <>
            <CommunityReviews entityId={p.id} entityType="product" initialReviews={initialReviews as any} />
            <OutLinks links={links} />
          </>
        )}

        <AlternativesBlock
          items={alternatives.map((alt: any) => ({
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

        <div className="reveal">
          <EmbedBadge itemSlug={p.slug} />
        </div>

        <CommunityReviews entityId={p.id} entityType="product" initialReviews={initialReviews as any} />
      </article>
    );
  }

  const s = entity.software as any;
  const [links, alternatives, furtherReading] = await Promise.all([
    getLinks("software", s.id),
    getAlternativeSoftware(s),
    getRelatedEditorialPages(s.category_id, s.tags),
  ]);

  const aggregateRating = await getAggregateRating("software", s.id);

  const { data: initialReviewsData } = await supabasePublic()
    .from("community_reviews")
    .select(`id, rating, comment, created_at, user_profiles ( username )`)
    .eq("entity_id", s.id)
    .order("created_at", { ascending: false });
  const initialReviews = initialReviewsData || [];

  return (
    <article className="space-y-12">
      <AffinityTracker categorySlug={category.slug} weight={2} />
      <JsonLd data={softwareLd(s, category, path, aggregateRating)} />
      <JsonLd data={breadcrumbLd(crumbs)} />

      <Breadcrumb pillar={pillar} category={category} />

      <header className="relative flex flex-col md:flex-row md:items-center justify-between gap-8 rounded-2xl border border-edge bg-surface/50 p-6 md:p-8 backdrop-blur-sm">
        <div className="max-w-xl">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            {s.pricing_model ? (
              <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-accent-bright">
                {s.pricing_model}
              </span>
            ) : null}
          </div>
          <h1 className="font-display text-4xl font-semibold tracking-tight sm:text-5xl">
            {s.name}
          </h1>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <VerifiedBadge verifiedAt={s.last_verified_at} />
            {s.status === "archived" ? <DiscontinuedBadge /> : null}
          </div>
          {s.price_text ? (
            <div className="mt-6 font-mono tabular-nums text-lg text-ink">
              {s.price_text}
            </div>
          ) : null}
        </div>
        <div className="flex flex-col gap-3 md:min-w-[200px]">
          <SaveButton entityId={s.id} entityType="software" />
          {s.website_url ? (
            <a
              href={s.website_url}
              rel="nofollow noopener"
              target="_blank"
              className="flex items-center justify-center gap-2 rounded-lg bg-ink px-4 py-2.5 text-sm font-medium text-surface transition-colors hover:bg-dim hover:text-white"
            >
              Visit Website ↗
            </a>
          ) : null}
          <ShareButtons title={s.name} score={null} urlPath={`/${pillar}/${category}/${slug}`} />
        </div>
      </header>

      {s.github_repo ? (
        <div className="reveal max-w-2xl">
          <GithubStats repo={s.github_repo} />
        </div>
      ) : null}

      <figure className={`reveal flex items-center justify-center rounded-xl border border-edge overflow-hidden relative ${s.image_url ? 'bg-surface' : 'bg-gradient-to-br from-surface via-surface to-edge/20 min-h-[350px] p-8'}`}>
        {s.image_url ? (
          <img
            src={s.image_url}
            alt={s.name}
            className="w-full h-full object-cover aspect-[21/9] drop-shadow-2xl hover:scale-105 transition-transform duration-700 ease-out"
            loading="lazy"
          />
        ) : (
          <div className="text-center">
            <div className="font-display text-6xl text-edge-strong opacity-40 font-bold tracking-tighter blur-[1px]">
              {s.name}
            </div>
            <div className="mt-2 font-mono text-xs uppercase tracking-widest text-faint">App Interface</div>
          </div>
        )}
      </figure>

      {s.description ? (
        <section className="max-w-2xl border-l-2 border-accent pl-5">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-faint">Verdict</p>
          <p className="mt-2 text-lg leading-relaxed">{s.description}</p>
        </section>
      ) : null}

      {s.video_url ? <VideoEmbed url={s.video_url} /> : null}

      <ProsCons pros={s.pros} cons={s.cons} idealFor={s.ideal_for} />

      {s.key_features && s.key_features.length > 0 ? <KeyFeatures features={s.key_features} /> : null}

      {/* --- Utility Layer --- */}
      {(s.integrations && s.integrations.length > 0) || (s.pro_tips && s.pro_tips.length > 0) || (s.prompts_templates && Array.isArray(s.prompts_templates) && s.prompts_templates.length > 0) ? (
        <section className="reveal max-w-2xl space-y-8 py-8 border-y border-edge/50">
          <h2 className="font-display text-2xl font-semibold">Utility Hub</h2>
          
          {s.integrations && s.integrations.length > 0 ? (
            <div>
              <h3 className="font-mono text-[11px] uppercase tracking-[0.18em] text-faint mb-3">Integrates with</h3>
              <div className="flex flex-wrap gap-2">
                {s.integrations.map((int: any) => (
                  <span key={int} className="px-3 py-1 rounded-full bg-surface border border-edge text-sm text-dim hover:text-ink hover:border-accent transition-colors">
                    {int}
                  </span>
                ))}
              </div>
            </div>
          ) : null}

          {s.pro_tips && s.pro_tips.length > 0 ? (
            <div>
              <h3 className="font-mono text-[11px] uppercase tracking-[0.18em] text-faint mb-3">Pro Tips & Shortcuts</h3>
              <ul className="space-y-3">
                {s.pro_tips.map((tip: any, idx: number) => (
                  <li key={tip} className="flex items-start text-sm text-dim bg-subtle p-3 rounded-lg border border-transparent hover:border-edge transition-colors">
                    <span className="text-accent mr-3">💡</span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {s.prompts_templates && Array.isArray(s.prompts_templates) && s.prompts_templates.length > 0 ? (
            <div>
              <h3 className="font-mono text-[11px] uppercase tracking-[0.18em] text-faint mb-3">Copy-Paste Templates</h3>
              <div className="space-y-4">
                {(s.prompts_templates as any[]).map((prompt, idx) => (
                  <div key={prompt.title} className="relative rounded-xl border border-edge bg-surface overflow-hidden group">
                    <div className="bg-subtle px-4 py-2 border-b border-edge text-sm font-medium text-ink flex items-center justify-between">
                      {prompt.title}
                    </div>
                    <div className="p-4 pr-12 text-sm font-mono text-dim whitespace-pre-wrap">
                      {prompt.text}
                    </div>
                    <CopyPromptButton promptText={prompt.text} />
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </section>
      ) : null}
      {/* --------------------- */}

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
          {/* website_url rendered in the header above */}

          <CommunityReviews entityId={s.id} entityType="software" initialReviews={initialReviews as any} />
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

      {/* Software doesn't have a design_score. Only products do. */}

      <div className="reveal">
        <EmbedBadge itemSlug={s.slug} />
      </div>

      <CommunityReviews entityId={s.id} entityType="software" initialReviews={initialReviews as any} />
    </article>
  );
}
