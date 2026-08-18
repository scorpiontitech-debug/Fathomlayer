// @ts-nocheck
import { notFound } from "next/navigation";
import { getProductBySlug } from "@/lib/queries";
import { JsonLd } from "@/components/JsonLd";
import { CompareUI } from "@/components/CompareUI";
import Link from "next/link";
import { SITE_NAME } from "@/lib/seo";

export const revalidate = 86400; // Cache por 24h para Programmatic SEO
export const dynamicParams = true;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const parts = slug.split("-vs-");
  if (parts.length !== 2) return {};

  const [p1Slug, p2Slug] = parts;
  const [productA, productB] = await Promise.all([
    getProductBySlug(p1Slug),
    getProductBySlug(p2Slug),
  ]);

  if (!productA || !productB) return {};

  return {
    title: `${productA.title} vs ${productB.title} for Local AI Compute`,
    description: `Detailed comparison between ${productA.title} and ${productB.title} for running local AI models. See VRAM, bandwidth, pricing and benchmarks.`,
    alternates: { canonical: `/compute/compare/${slug}` },
  };
}

export default async function ProgrammaticComparePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  
  // Extract products from slug "product-a-vs-product-b"
  const parts = slug.split("-vs-");
  if (parts.length !== 2) notFound();
  
  const [p1Slug, p2Slug] = parts;

  // Parallel fetch both products from DB
  const [productA, productB] = await Promise.all([
    getProductBySlug(p1Slug),
    getProductBySlug(p2Slug),
  ]);

  if (!productA || !productB) notFound();

  const jsonLdData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": `${productA.title} vs ${productB.title} Compare Tool`,
    "applicationCategory": "UtilityApplication",
    "operatingSystem": "All",
    "description": `Compare VRAM and specifications of ${productA.title} against ${productB.title}.`,
    "offers": {
      "@type": "Offer",
      "price": "0.00",
      "priceCurrency": "USD"
    }
  };

  return (
    <article className="space-y-16 pb-24">
      <JsonLd data={jsonLdData} />
      
      <header className="rise-group max-w-4xl mx-auto pt-10 text-center px-4">
        <p className="font-mono text-xs uppercase tracking-[0.22em] text-accent-bright mb-4">
          Compute Versus Engine
        </p>
        <h1 className="font-display text-4xl font-bold tracking-tight sm:text-6xl text-white">
          <span className="text-zinc-400">{productA.title}</span> <br/>
          <span className="font-mono text-lg text-accent-bright my-4 block">VS</span>
          <span className="text-zinc-400">{productB.title}</span>
        </h1>
        <p className="mt-6 text-xl leading-relaxed text-dim max-w-2xl mx-auto font-light">
          Compare specifications, memory bandwidth, and real-world AI inference capabilities to decide your next build.
        </p>
      </header>

      <div className="max-w-6xl mx-auto px-4">
        {/* Render existing CompareUI passing the two products */}
        <CompareUI itemA={productA} itemB={productB} />
      </div>

      <section className="max-w-4xl mx-auto px-4 text-center mt-20 border-t border-edge pt-16">
        <h2 className="font-display text-2xl font-semibold text-white mb-6">Need more precision?</h2>
        <p className="text-dim mb-8">Test exactly which models will run on these setups.</p>
        <div className="flex justify-center gap-4">
          <Link href="/calculator" className="rounded-full bg-white px-8 py-3.5 text-sm font-semibold text-black hover:scale-105 transition-transform">
            Open AI Calculator
          </Link>
          <Link href="/compute/benchmarks" className="rounded-full border border-edge bg-surface px-8 py-3.5 text-sm font-semibold text-white hover:border-accent-bright transition-colors">
            View Live Benchmarks
          </Link>
        </div>
      </section>
    </article>
  );
}
