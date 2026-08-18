import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { HeroCanvas } from "@/components/three/HeroCanvas";
import { 
  getEditorialPages, 
  getIndexableCategories, 
  getPublishedSetups, 
  getTrendingItems,
  getLatestNews,
  getTopRankedProducts,
  getRecentEditorials,
  getBestOfCategory
} from "@/lib/queries";
import { organizationLd, websiteLd } from "@/lib/seo";
import { PILLARS, PILLAR_KEYS } from "@/lib/taxonomy";

import { OmniSearch } from "@/components/OmniSearch";
import { MarketTicker } from "@/components/MarketTicker";
import { QuickCompare } from "@/components/QuickCompare";
import { DataRing } from "@/components/DataRing";
import { LiveReviews } from "@/components/LiveReviews";

import { LatestNewsFeed } from "@/components/home/LatestNewsFeed";
import { TopRankedShowcase } from "@/components/home/TopRankedShowcase";
import { CategoryRankingsShowcase } from "@/components/home/CategoryRankingsShowcase";
import { QuickNavCarousel } from "@/components/home/QuickNavCarousel";
import { SetupsShowcase } from "@/components/home/SetupsShowcase";
import { EditorialGrid } from "@/components/home/EditorialGrid";
import { HeroSearchBox } from "@/components/home/HeroSearchBox";
import { TrendingRadar } from "@/components/home/TrendingRadar";
import { ToolsSuiteShowcase } from "@/components/home/ToolsSuiteShowcase";

// ... [existing imports]
export const revalidate = 3600;

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default async function HomePage() {
  const [categories, glossary, guides, launches, setups, trendingItems, latestNews, topRanked, recentEditorials] = await Promise.all([
    getIndexableCategories(),
    getEditorialPages("glossary"),
    getEditorialPages("guide"),
    getEditorialPages("launch"),
    getPublishedSetups(),
    getTrendingItems(),
    getLatestNews(4),
    getTopRankedProducts(5),
    getRecentEditorials(4),
  ]);
  const indexedItems = categories.reduce((n, c) => n + c.active_listing_count, 0);
  const referenceEntries = glossary.length + guides.length + launches.length;

  const topPopulatedCategories = [...categories]
    .sort((a, b) => b.active_listing_count - a.active_listing_count)
    .slice(0, 6);

  const categoryRankings = (await Promise.all(
    topPopulatedCategories.map(cat => getBestOfCategory(cat.slug, 3))
  )).filter(Boolean);

  return (
    <div className="space-y-28">
      {/* JSON-LD: Organization só na home (checklist GEO §8) */}
      <JsonLd data={organizationLd()} />
      <JsonLd data={websiteLd()} />

      {/* HERO — palco da peça 3D. A headline recua em Z conforme o scroll
          (tipografia cinética, 1 por página — design system §4). */}
      <section className="relative isolate -mx-5 flex min-h-[86vh] flex-col justify-center overflow-hidden px-5 pb-20 pt-16">
        <div className="layer-field" aria-hidden />
        <HeroCanvas />

        {/* z-10 explícito: sem ele o canvas pintava por cima da headline e o
            texto ficava ilegível atrás das partículas. Ordem no HTML não
            bastou — a camada precisa ser declarada. */}
        <div className="rise-group kinetic-scroll relative z-10 max-w-4xl mx-auto text-center flex flex-col items-center">
          <p className="font-mono text-xs uppercase tracking-[0.24em] text-dim">
            Independent technology index
          </p>
          <h1 className="mt-6 font-display text-[3.4rem] font-semibold leading-[0.94] tracking-[-0.03em] sm:text-[5.5rem] lg:text-[6.75rem]">
            The technology index
            <br />
            built on{" "}
            <span className="text-outline">verified</span>{" "}
            <span className="text-accent-bright">numbers.</span>
          </h1>
          <p className="mt-8 max-w-xl mx-auto text-center text-lg leading-relaxed text-dim">
            Hardware, software and AI — human-reviewed, design-scored, documented with data
            from primary sources. Never a paid ranking.
          </p>
          
          <HeroSearchBox />
          <div className="mt-12">
            <MarketTicker />
          </div>
        </div>

        {/* Régua de dados: números reais do banco, no rodapé do hero */}
        <dl className="relative z-10 mt-16 grid max-w-3xl grid-cols-3 gap-px overflow-hidden rounded-lg border border-edge bg-edge">
          {[
            // "Items indexed: 0" anunciava o vazio antes de o site se
            // apresentar. Enquanto não houver acervo, a régua mostra o que
            // de fato existe — nada aqui é número inventado.
            indexedItems > 0
              ? { k: "Items indexed", v: indexedItems.toString() }
              : { k: "Reference entries", v: referenceEntries.toString() },
            indexedItems > 0
              ? { k: "Reference entries", v: referenceEntries.toString() }
              : { k: "Primary-source specs", v: "100%" },
            { k: "Paid placements", v: "0" },
          ].map((stat) => (
            <div key={stat.k} className="bg-bg/80 px-5 py-4 backdrop-blur-sm">
              <dd className="font-mono text-2xl tabular-nums text-ink">{stat.v}</dd>
              <dt className="mt-1 font-mono text-[11px] uppercase tracking-[0.16em] text-faint">
                {stat.k}
              </dt>
            </div>
          ))}
        </dl>
      </section>

      {/* Quick Nav directly under the hero banner */}
      {categories.length > 0 && <QuickNavCarousel categories={categories} />}

      <TrendingRadar trendingItems={trendingItems} />
      
      {latestNews.length > 0 && <LatestNewsFeed posts={latestNews} />}
      {topRanked.length > 0 && <TopRankedShowcase products={topRanked} />}
      
      <ToolsSuiteShowcase />
      
      {categoryRankings.length > 0 && <CategoryRankingsShowcase rankings={categoryRankings} />}
      {setups.length > 0 && <SetupsShowcase setups={setups} />}

      <QuickCompare />

      {recentEditorials.length > 0 && <EditorialGrid editorials={recentEditorials} />}

      {/* Removed Market Microscope */}
      <LiveReviews />

      {/* MANIFESTO — os gates como afirmação tipográfica */}
      <section className="reveal relative -mx-5 overflow-hidden border-y border-edge px-5 py-20">
        <div className="mx-auto max-w-4xl text-center">
          <p className="font-mono text-xs uppercase tracking-[0.24em] text-faint">
            The gate every item passes
          </p>
          <p className="mt-6 font-display text-3xl font-semibold leading-[1.15] tracking-tight sm:text-5xl">
            <span className="text-accent-bright">3</span> published items before a category is
            indexed. <span className="text-accent-bright">5</span> structured data points
            before an item is published.{" "}
            <br/><br/><span className="text-dim">Everything else waits.</span>
          </p>
        </div>
      </section>
    </div>
  );
}
