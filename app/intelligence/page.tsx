import type { Metadata } from "next";
import Link from "next/link";
import { getCategoriesByPillar, getEditorialPages } from "@/lib/queries";
import { PILLARS, matchesPillar } from "@/lib/taxonomy";
import { IntelligenceHero } from "@/components/home/IntelligenceHero";
import { McpStackBuilder } from "@/components/tools/McpStackBuilder";
import { IntelligenceBento } from "@/components/content/IntelligenceBento";
import { LlmCalculator } from "@/components/tools/LlmCalculator";
import { IntelligencePicks } from "@/components/content/IntelligencePicks";
import { IntelligenceFaq } from "@/components/content/IntelligenceFaq";
import { generateFaqSchema } from "@/components/content/intelligenceFaqData";
import { IntelligenceAeoTable } from "@/components/content/IntelligenceAeoTable";
import { JsonLd } from "@/components/JsonLd";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const pillar = PILLARS.intelligence;
  return {
    title: `${pillar.name} Hub`,
    description: `${pillar.tagline} — independent curation by Fathom Layer.`,
    alternates: { canonical: `/${pillar.slug}` },
  };
}

export default async function IntelligencePage() {
  const pillar = PILLARS.intelligence;

  // Busca categorias e conteúdo
  const [categories, glossary, guides] = await Promise.all([
    getCategoriesByPillar("intelligence"),
    getEditorialPages("glossary"),
    getEditorialPages("guide"),
  ]);

  const reading = [...guides, ...glossary].filter((p) => matchesPillar(p.tags, "intelligence"));

  // Montagem do @graph Schema (AEO/SEO state-of-the-art)
  const graphSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": "https://fathomlayer.com/intelligence",
        "name": "Intelligence Hub",
        "description": "Fathom Layer's independent curation of AI Software, Agent Frameworks, and MCP Servers."
      },
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://fathomlayer.com" },
          { "@type": "ListItem", "position": 2, "name": "Intelligence", "item": "https://fathomlayer.com/intelligence" }
        ]
      },
      // Injeta o conteúdo do FAQ direto no grafo sem envolver num novo { "@context" }
      ...generateFaqSchema().mainEntity.map(q => ({
        ...q,
        isPartOf: { "@id": "https://fathomlayer.com/intelligence" }
      }))
    ]
  };

  return (
    <>
      <JsonLd data={graphSchema} />

      <div className="space-y-20 pb-20">
        <IntelligenceHero />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-24">
          
          <section className="scroll-mt-24" id="builder">
            <McpStackBuilder />
            <LlmCalculator />
          </section>

          <IntelligencePicks />

          <IntelligenceBento categories={categories} pillarSlug={pillar.slug} />

          <IntelligenceFaq />

          {reading.length > 0 && (
            <section className="reveal max-w-3xl space-y-6">
              <div className="flex items-baseline justify-between gap-4 border-b border-edge pb-4">
                <h2 className="font-display text-2xl font-semibold tracking-tight">Intelligence Reference</h2>
                <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-faint">
                  Glossary & Guides
                </span>
              </div>
              <ul className="divide-y divide-edge">
                {reading.map((page) => (
                  <li key={page.id}>
                    <Link
                      href={`/${page.content_type === "guide" ? "guides" : "glossary"}/${page.slug}`}
                      className="group flex items-center justify-between gap-4 py-5"
                    >
                      <div>
                        <span className="block text-lg font-medium leading-snug text-dim transition-colors group-hover:text-ink">
                          {page.title}
                        </span>
                      </div>
                      <span className="shrink-0 rounded-full bg-surface px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-dim border border-edge transition-colors group-hover:border-accent group-hover:text-accent-bright">
                        {page.content_type === "guide" ? "Guide" : "Glossary"}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Tabela Estruturada para Extração RAG / AEO */}
          <IntelligenceAeoTable />

        </div>
      </div>
    </>
  );
}
