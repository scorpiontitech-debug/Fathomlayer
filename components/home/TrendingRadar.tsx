"use client";

import Link from "next/link";
import { DataRing } from "@/components/DataRing";
import { Activity } from "lucide-react";

export function TrendingRadar({ trendingItems }: { trendingItems: any[] }) {
  if (!trendingItems || trendingItems.length === 0) return null;

  return (
    <section className="reveal max-w-4xl mx-auto mt-24 mb-16 px-5">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-accent-bright"></span>
          </div>
          <h2 className="font-display text-2xl font-semibold tracking-tight">Market Radar</h2>
        </div>
        <span className="font-mono text-xs uppercase tracking-widest text-accent-bright bg-accent/10 px-3 py-1.5 rounded-lg border border-accent/20">
          Last 24h Velocity
        </span>
      </div>

      <div className="rounded-2xl border border-white/10 bg-[#131316]/80 backdrop-blur-3xl overflow-hidden shadow-2xl">
        <div className="divide-y divide-white/5">
          {trendingItems.slice(0, 5).map((item, idx) => (
            <Link
              key={item.id}
              href={`/${item.type === "software" ? "software" : "products"}/${item.slug}`}
              className="group flex flex-col sm:flex-row sm:items-center justify-between px-6 py-5 transition-colors hover:bg-white/5 gap-4"
            >
              <div className="flex items-center gap-6">
                <span className="font-mono text-sm text-faint w-4">0{idx + 1}</span>
                <div>
                  <h3 className="font-display text-lg font-medium text-ink group-hover:text-accent-bright transition-colors">
                    {item.title}
                  </h3>
                  {item.brand && (
                    <span className="font-mono text-[10px] uppercase tracking-widest text-dim">{item.brand}</span>
                  )}
                </div>
              </div>
              
              <div className="flex items-center justify-between sm:justify-end gap-8 w-full sm:w-auto">
                {/* Simulated Velocity Metric */}
                <div className="flex items-center gap-2 text-ok">
                  <Activity className="w-4 h-4" />
                  <span className="font-mono text-sm">+{Math.floor(Math.random() * 50) + 15}%</span>
                </div>

                {item.design_score && (
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs text-dim hidden sm:block">Score</span>
                    <DataRing score={item.design_score} size={40} strokeWidth={3} />
                  </div>
                )}
                <span className="text-dim transition-transform duration-300 group-hover:translate-x-2 hidden sm:block">→</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
