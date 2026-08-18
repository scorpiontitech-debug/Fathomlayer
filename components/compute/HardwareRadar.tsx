"use client";

import { useEffect, useState } from "react";

interface Product {
  id: string;
  name: string;
  price: number | null;
  design_score: number | null;
}

interface HardwareRadarProps {
  products: Product[];
}

export function HardwareRadar({ products }: HardwareRadarProps) {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Filter out products without price or score for the graph
  const validProducts = products.filter(p => p.price && p.design_score);
  
  if (validProducts.length === 0) {
    return null; // Hide if no data
  }

  const maxPrice = Math.max(...validProducts.map(p => p.price || 0), 4000);
  const minScore = 7;
  const maxScore = 10;

  return (
    <section id="radar" className="reveal relative overflow-hidden rounded-2xl border border-edge bg-[#0a0a0b] py-16 px-6 shadow-2xl">
      <div className="mx-auto max-w-5xl">
        <div className="mb-12 flex flex-col items-center justify-center text-center">
          <h2 className="font-display text-3xl font-semibold tracking-tight text-white">
            Compute <span className="text-accent-bright">Matrix</span>
          </h2>
          <p className="mt-4 max-w-xl font-mono text-xs uppercase tracking-widest text-dim">
            Price vs Capability Evaluation
          </p>
        </div>

        <div className="relative mx-auto h-[400px] w-full rounded-2xl border border-white/10 bg-white/[0.02] p-8 backdrop-blur-md">
          {/* Grid lines */}
          <div className="absolute inset-8 grid grid-cols-4 grid-rows-4 opacity-10">
            {[...Array(5)].map((_, i) => (
              <div key={`h-${i}`} className="col-span-4 border-t border-white" style={{ top: `${i * 25}%`, position: "absolute", width: "100%" }} />
            ))}
            {[...Array(5)].map((_, i) => (
              <div key={`v-${i}`} className="row-span-4 border-l border-white" style={{ left: `${i * 25}%`, position: "absolute", height: "100%" }} />
            ))}
          </div>

          {/* Axes Labels */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 font-mono text-[10px] uppercase tracking-widest text-faint">Price (USD) →</div>
          <div className="absolute left-[-20px] top-1/2 -translate-y-1/2 -rotate-90 font-mono text-[10px] uppercase tracking-widest text-faint">← Design Score</div>

          {/* Sweet Spot Quadrant */}
          <div className="absolute left-8 top-8 h-1/2 w-1/2 rounded-tl-xl bg-accent-bright/5 mix-blend-screen" />
          <span className="absolute left-12 top-12 font-mono text-[10px] font-bold uppercase tracking-widest text-accent-bright/40">Sweet Spot</span>

          {/* Nodes */}
          <div className="absolute inset-8">
            {validProducts.map((item, i) => {
              const xPos = ((item.price || 0) / maxPrice) * 100;
              const yPos = 100 - (((item.design_score || 0) - minScore) / (maxScore - minScore)) * 100;
              
              const isHovered = hoveredNode === item.id;

              return (
                <div
                  key={item.id}
                  className="absolute z-10 transition-all duration-700 ease-out"
                  style={{
                    left: `${xPos}%`,
                    top: `${Math.max(0, Math.min(100, yPos))}%`,
                    opacity: isMounted ? 1 : 0,
                    transform: isMounted ? `translate(-50%, -50%) scale(1)` : `translate(-50%, -50%) scale(0)`,
                    transitionDelay: `${i * 150}ms`
                  }}
                  onMouseEnter={() => setHoveredNode(item.id)}
                  onMouseLeave={() => setHoveredNode(null)}
                >
                  <div className={`relative flex h-5 w-5 cursor-crosshair items-center justify-center rounded-full transition-colors ${isHovered ? 'bg-accent-bright shadow-[0_0_15px_rgba(255,255,255,0.5)]' : 'bg-white/30 hover:bg-white/50 backdrop-blur-sm'}`}>
                    <div className={`absolute bottom-full mb-3 w-56 rounded-lg border border-white/10 bg-black/90 p-4 shadow-2xl backdrop-blur-xl transition-all duration-200 ${isHovered ? 'pointer-events-auto translate-y-0 opacity-100' : 'pointer-events-none translate-y-2 opacity-0'}`}>
                      <p className="font-display text-sm font-semibold text-white leading-tight">{item.name}</p>
                      <div className="mt-3 flex items-center justify-between border-t border-white/10 pt-3 font-mono text-xs">
                        <span className="text-zinc-400">${item.price?.toLocaleString()}</span>
                        <span className="text-accent-bright bg-accent-bright/10 px-2 py-0.5 rounded">Score: {item.design_score}/10</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
