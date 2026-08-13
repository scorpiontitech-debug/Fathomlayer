"use client";

import { useEffect, useState } from "react";

// Dados mockados para o MVP do Microscópio de Mercado
const MOCK_DATA = [
  { id: 1, name: "MacBook Pro M3 Max", price: 3499, score: 9.6, category: "Laptop" },
  { id: 2, name: "NVIDIA RTX 4090", price: 1599, score: 9.8, category: "GPU" },
  { id: 3, name: "AMD RX 7900 XTX", price: 999, score: 9.2, category: "GPU" },
  { id: 4, name: "Sony WH-1000XM5", price: 398, score: 9.1, category: "Audio" },
  { id: 5, name: "Framework Laptop 16", price: 1699, score: 8.8, category: "Laptop" },
  { id: 6, name: "Oculus Quest 3", price: 499, score: 8.9, category: "VR" },
  { id: 7, name: "Steam Deck OLED", price: 549, score: 9.5, category: "Gaming" },
  { id: 8, name: "Apple Vision Pro", price: 3499, score: 8.5, category: "VR" },
];

export function ScatterPlot() {
  const [hoveredNode, setHoveredNode] = useState<number | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Escala simplificada
  const maxPrice = 4000;
  const minScore = 8;
  const maxScore = 10;

  return (
    <section className="reveal relative -mx-5 overflow-hidden border-y border-edge bg-[#0a0a0b] py-20 px-5">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 flex flex-col items-center justify-center text-center">
          <h2 className="font-display text-3xl font-semibold tracking-tight text-white sm:text-5xl">
            Market <span className="text-accent-bright">Microscope</span>
          </h2>
          <p className="mt-4 max-w-2xl font-mono text-xs uppercase tracking-widest text-dim">
            Price vs Performance Matrix (Top Tier)
          </p>
        </div>

        {/* Gráfico SVG Customizado */}
        <div className="relative mx-auto h-[400px] w-full max-w-4xl rounded-2xl border border-white/10 bg-white/[0.02] p-8 backdrop-blur-md">
          {/* Grid lines */}
          <div className="absolute inset-8 grid grid-cols-4 grid-rows-4 opacity-10">
            {[...Array(5)].map((_, i) => (
              <div key={`h-${i}`} className="col-span-4 border-t border-white" style={{ top: `${i * 25}%`, position: "absolute", width: "100%" }} />
            ))}
            {[...Array(5)].map((_, i) => (
              <div key={`v-${i}`} className="row-span-4 border-l border-white" style={{ left: `${i * 25}%`, position: "absolute", height: "100%" }} />
            ))}
          </div>

          {/* Eixos Labels */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 font-mono text-[10px] uppercase tracking-widest text-faint">Price (USD) →</div>
          <div className="absolute left-[-20px] top-1/2 -translate-y-1/2 -rotate-90 font-mono text-[10px] uppercase tracking-widest text-faint">← Design Score</div>

          {/* Quadrante Sweet Spot (Alto Score, Baixo Preço) */}
          <div className="absolute left-8 top-8 h-1/2 w-1/2 rounded-tl-xl bg-green-500/5 mix-blend-screen" />
          <span className="absolute left-12 top-12 font-mono text-[10px] font-bold uppercase tracking-widest text-green-500/40">Sweet Spot</span>

          {/* Nós (Nodes) */}
          <div className="absolute inset-8">
            {MOCK_DATA.map((item, i) => {
              // Normalizar coordenadas (0 a 100%)
              const xPos = (item.price / maxPrice) * 100;
              const yPos = 100 - ((item.score - minScore) / (maxScore - minScore)) * 100;
              
              const isHovered = hoveredNode === item.id;

              return (
                <div
                  key={item.id}
                  className="absolute z-10 transition-all duration-700 ease-out"
                  style={{
                    left: `${xPos}%`,
                    top: `${yPos}%`,
                    opacity: isMounted ? 1 : 0,
                    transform: isMounted ? `translate(-50%, -50%) scale(1)` : `translate(-50%, -50%) scale(0)`,
                    transitionDelay: `${i * 100}ms`
                  }}
                  onMouseEnter={() => setHoveredNode(item.id)}
                  onMouseLeave={() => setHoveredNode(null)}
                >
                  <div className={`relative flex h-4 w-4 cursor-crosshair items-center justify-center rounded-full transition-colors ${isHovered ? 'bg-accent-bright' : 'bg-white/20 hover:bg-white/40'}`}>
                    {/* Tooltip */}
                    <div className={`absolute bottom-full mb-2 w-48 rounded-lg border border-white/10 bg-black/90 p-3 shadow-2xl backdrop-blur-xl transition-all duration-200 ${isHovered ? 'pointer-events-auto translate-y-0 opacity-100' : 'pointer-events-none translate-y-2 opacity-0'}`}>
                      <p className="font-display text-sm font-semibold text-white">{item.name}</p>
                      <div className="mt-2 flex items-center justify-between border-t border-white/10 pt-2 font-mono text-[10px]">
                        <span className="text-dim">${item.price}</span>
                        <span className="text-accent-bright">{item.score}/10</span>
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
