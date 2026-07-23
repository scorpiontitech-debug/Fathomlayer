import type { Metadata } from "next";
import { CompareUI } from "@/components/CompareUI";
import { getProductBySlug, getSoftwareBySlug } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Head-to-Head Comparison",
  description: "Compare Specs, Pricing, and VRAM requirements side-by-side.",
  alternates: { canonical: "/compare" },
};

async function fetchItem(slug?: string) {
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
      specs: (product.specs as Record<string, string>) || {}
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
      specs: (software.specs as Record<string, string>) || {}
    };
  }

  return null;
}

export default async function ComparePage({
  searchParams,
}: {
  searchParams: Promise<{ a?: string; b?: string }>;
}) {
  const params = await searchParams;
  const itemA = await fetchItem(params.a);
  const itemB = await fetchItem(params.b);

  return (
    <div className="space-y-12 pb-24">
      <header className="rise-group max-w-3xl">
        <p className="font-mono text-xs uppercase tracking-[0.22em] text-dim">
          Decision Engine
        </p>
        <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight sm:text-5xl">
          Head-to-Head Comparison
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-dim">
          Don't guess. Compare specs, pricing, and capabilities side-by-side to make the right choice for your stack.
        </p>
      </header>

      <div className="reveal">
        <CompareUI itemA={itemA} itemB={itemB} />
      </div>
    </div>
  );
}
