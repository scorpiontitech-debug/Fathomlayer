"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { DataRing } from "@/components/DataRing";
import { pillarByKey } from "@/lib/taxonomy";
import { useAffinityStore } from "@/store/useAffinityStore";

export function CategoryRankingsShowcase({ rankings }: { rankings: any[] }) {
  const categoryWeights = useAffinityStore((state) => state.categoryWeights);
  const [sortedRankings, setSortedRankings] = useState(rankings);

  useEffect(() => {
    if (!rankings || rankings.length === 0) return;

    // Agentic Personalization: Reorder rankings based on user affinity (click history)
    const newSorted = [...rankings].sort((a, b) => {
      const weightA = categoryWeights[a.category.slug] || 0;
      const weightB = categoryWeights[b.category.slug] || 0;
      return weightB - weightA; // Descending order
    });

    setSortedRankings(newSorted);
  }, [rankings, categoryWeights]);

  if (!rankings || rankings.length === 0) return null;

  return (
    <section className="reveal space-y-16 py-8">
      <div className="flex flex-col items-center justify-center text-center max-w-3xl mx-auto mb-12">
        <h2 className="font-display text-4xl font-semibold tracking-tight sm:text-5xl text-white">
          Category Leaders
        </h2>
        <p className="mt-4 text-lg text-dim">
          The definitive ranking of the highest-rated hardware and software across our core categories.
        </p>
      </div>

      <div className="space-y-24">
        {sortedRankings.map((ranking) => {
          const cat = ranking.category;
          const items = ranking.items;
          const pillar = pillarByKey(cat.pillar);
          
          if (!items || items.length === 0) return null;

          return (
            <div key={cat.id} className="grid grid-cols-1 xl:grid-cols-4 gap-8 xl:gap-12 items-start">
              
              {/* Category Sticky Header */}
              <div className="xl:sticky top-32 xl:col-span-1 space-y-4">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 backdrop-blur-md">
                  <span className="h-2 w-2 rounded-full bg-accent-bright animate-pulse" />
                  <span className="font-mono text-xs uppercase tracking-widest text-faint">
                    {pillar?.name}
                  </span>
                </div>
                <h3 className="font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
                  Best {cat.name}
                </h3>
                <Link
                  href={`/${pillar?.slug}/${cat.slug}`}
                  className="inline-flex items-center text-sm font-medium text-accent hover:text-accent-bright transition-colors"
                >
                  View full category index <span className="ml-1">→</span>
                </Link>
              </div>

              {/* Items Grid */}
              <div className="xl:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6">
                {items.map((item: any, idx: number) => {
                  const isFirst = idx === 0;
                  const href = `/${pillar?.slug}/${cat.slug}/${item.slug}`;

                  let formattedPrice = item.price_text || null;
                  if (item.price_from !== null && item.price_from !== undefined) {
                    try {
                      formattedPrice = new Intl.NumberFormat('en-US', { style: 'currency', currency: item.price_currency || 'USD', maximumFractionDigits: 0 }).format(item.price_from);
                    } catch (e) {
                      formattedPrice = `${item.price_currency || '$'}${item.price_from}`;
                    }
                  }

                  return (
                    <Link
                      key={item.id}
                      href={href}
                      data-spot
                      data-tilt
                      className={`spot-card glow-hover tilt group relative flex flex-col justify-between overflow-hidden rounded-xl border border-white/5 bg-edge transition-colors hover:border-accent ${isFirst ? 'md:col-span-2 md:row-span-2 min-h-[400px]' : 'min-h-[280px]'}`}
                    >
                      {/* Background Image */}
                      {item.image_url ? (
                        <Image 
                          src={item.image_url} 
                          alt={item.title}
                          fill
                          className={`object-cover transition-all duration-700 ease-out group-hover:scale-105 saturate-0 group-hover:saturate-100 ${isFirst ? 'opacity-40 group-hover:opacity-60' : 'opacity-20 group-hover:opacity-40'}`}
                          sizes={isFirst ? "(max-width: 768px) 100vw, 50vw" : "(max-width: 768px) 100vw, 25vw"}
                        />
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-tr from-transparent to-white/5 opacity-50" />
                      )}

                      <div className={`absolute inset-0 bg-gradient-to-t ${isFirst ? 'from-black/90 via-black/40' : 'from-black/90'} to-transparent`} />

                      {/* Rank & Score */}
                      <div className="relative z-10 flex items-start justify-between p-6">
                        <span className={`font-display font-bold tracking-tighter transition-colors ${isFirst ? 'text-6xl text-white/90 drop-shadow-lg' : 'text-4xl text-white/40 group-hover:text-white/80'}`}>
                          #{idx + 1}
                        </span>
                        {item.design_score && (
                          <div className="rounded-full bg-black/40 backdrop-blur-md p-1 border border-white/10 shadow-lg">
                            <DataRing score={item.design_score} size={isFirst ? 44 : 36} strokeWidth={isFirst ? 4 : 3} />
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="relative z-10 p-6 mt-auto">
                        <div className="flex items-end justify-between gap-4">
                          <div>
                            <h4 className={`font-display font-bold tracking-tight text-white group-hover:text-accent-bright transition-colors ${isFirst ? 'text-3xl' : 'text-xl'}`}>
                              {item.title}
                            </h4>
                            {isFirst && item.description && (
                              <p className="mt-3 text-sm text-white/70 line-clamp-2">
                                {item.description}
                              </p>
                            )}
                          </div>
                          {formattedPrice && (
                            <div className="rounded border border-white/10 bg-white/5 px-2 py-1 backdrop-blur-md">
                              <span className="font-mono text-sm font-medium text-white">
                                {formattedPrice}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>

            </div>
          );
        })}
      </div>
    </section>
  );
}
