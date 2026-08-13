import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CompareUI } from "@/components/CompareUI";
import { DecisionMatrix } from "@/components/DecisionMatrix";
import { getProductBySlug, getSoftwareBySlug } from "@/lib/queries";
import { SITE_NAME, SITE_URL } from "@/lib/seo";

// This enables dynamic comparison routes like /compare/zapier-vs-make
export const dynamicParams = true;

async function fetchItem(slug: string) {
  if (!slug) return null;
  // Try product first, then software
  const product = await getProductBySlug(slug);
  if (product) {
    return {
      id: product.id,
      title: product.title,
      slug: product.slug,
      image_url: product.image_url ?? null,
      description: product.description ?? null,
      pros: product.pros || [],
      cons: product.cons || [],
      specs: (product.specs as Record<string, string>) || {},
      // Matrix fields
      price_from: product.price_from,
      integrations: [], // products usually don't have integrations in this schema
      key_features: product.key_features || []
    };
  }
  
  const software = await getSoftwareBySlug(slug);
  if (software) {
    return {
      id: software.id,
      title: software.name,
      slug: software.slug,
      image_url: software.image_url ?? null,
      description: software.description ?? null,
      pros: software.pros || [],
      cons: software.cons || [],
      specs: {}, // software usually uses features instead of raw specs, but we can pass empty
      // Matrix fields
      price_from: software.price_from,
      integrations: (software as any).integrations || [],
      key_features: (software as any).key_features || []
    };
  }

  return null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slugs: string }>;
}): Promise<Metadata> {
  const { slugs } = await params;
  const parts = slugs.split("-vs-");
  if (parts.length !== 2) return {};

  const [slugA, slugB] = parts;
  const itemA = await fetchItem(slugA);
  const itemB = await fetchItem(slugB);

  if (!itemA || !itemB) return {};

  const title = `${itemA.title} vs ${itemB.title}`;
  const description = `Compare ${itemA.title} and ${itemB.title}. See which is the best choice based on pricing, features, and ecosystem.`;
  
  return {
    title,
    description,
    alternates: { canonical: `/compare/${slugs}` },
    openGraph: {
      title: `${title} — ${SITE_NAME}`,
      description,
      url: `/compare/${slugs}`,
      siteName: SITE_NAME,
      type: "website",
    },
    twitter: { card: "summary_large_image", title: `${title} — ${SITE_NAME}`, description },
  };
}

export default async function VersusPage({
  params,
}: {
  params: Promise<{ slugs: string }>;
}) {
  const { slugs } = await params;
  const parts = slugs.split("-vs-");
  
  if (parts.length !== 2) {
    notFound();
  }

  const [slugA, slugB] = parts;
  const itemA = await fetchItem(slugA);
  const itemB = await fetchItem(slugB);

  if (!itemA || !itemB) {
    notFound();
  }

  const title = `${itemA.title} vs ${itemB.title}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: title,
    description: `Compare ${itemA.title} and ${itemB.title}. See which is the best choice based on pricing, features, and ecosystem.`,
    url: `${SITE_URL}/compare/${slugs}`,
  };

  return (
    <div className="space-y-12 pb-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <header className="rise-group max-w-3xl">
        <p className="font-mono text-xs uppercase tracking-[0.22em] text-dim">
          Versus Engine
        </p>
        <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight sm:text-5xl">
          {itemA.title} <span className="text-faint">vs</span> {itemB.title}
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-dim">
          Don't guess. Compare pricing, capabilities, and ecosystems side-by-side to make the right choice.
        </p>
      </header>

      <div className="reveal">
        <DecisionMatrix itemA={itemA} itemB={itemB} />
        <CompareUI itemA={itemA} itemB={itemB} />
      </div>
    </div>
  );
}
