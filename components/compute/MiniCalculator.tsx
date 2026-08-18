"use client";

import { useState } from "react";
import Link from "next/link";

const MODELS = [
  { name: "Llama 3 8B", params: 8, defaultQ: "Q4_K_M", vramBase: 6 },
  { name: "Mixtral 8x7B", params: 47, defaultQ: "Q4_K_M", vramBase: 32 },
  { name: "Llama 3 70B", params: 70, defaultQ: "Q4_K_M", vramBase: 48 },
  { name: "Command R+", params: 104, defaultQ: "Q4_K_M", vramBase: 64 },
];

export function MiniCalculator() {
  const [activeModel, setActiveModel] = useState(MODELS[0]);

  return (
    <section id="calculator" className="reveal relative overflow-hidden rounded-2xl border border-edge bg-surface p-8 sm:p-10">
      <div className="absolute top-0 right-0 -mt-20 -mr-20 h-64 w-64 rounded-full bg-accent opacity-10 blur-3xl mix-blend-screen"></div>
      
      <div className="relative z-10 grid gap-12 lg:grid-cols-2 lg:gap-8 items-center">
        <div>
          <span className="font-mono text-xs uppercase tracking-widest text-accent-bright">Quick Utility</span>
          <h2 className="mt-4 font-display text-3xl font-bold tracking-tight">VRAM Calculator</h2>
          <p className="mt-4 text-dim leading-relaxed">
            Select a popular model to instantly see the VRAM required for inference. For customized quantization and context windows, use the full tool.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            {MODELS.map((model) => (
              <button
                key={model.name}
                onClick={() => setActiveModel(model)}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                  activeModel.name === model.name
                    ? "bg-ink text-surface scale-105 shadow-md"
                    : "bg-surface-dim text-dim hover:text-ink hover:bg-edge border border-edge"
                }`}
              >
                {model.name}
              </button>
            ))}
          </div>
          
          <div className="mt-8">
            <Link 
              href="/calculator" 
              className="inline-flex items-center gap-2 text-sm font-semibold text-accent-bright hover:text-accent transition-colors"
            >
              Open Full Calculator <span>→</span>
            </Link>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center rounded-xl border border-edge bg-black/40 p-10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] backdrop-blur-md">
          <div className="text-center space-y-2">
            <p className="font-mono text-sm text-faint uppercase tracking-widest">Required Memory Tier</p>
            <div className="flex items-baseline justify-center gap-1 text-accent-bright">
              <span className="font-display text-6xl font-bold tracking-tighter">{activeModel.vramBase}</span>
              <span className="font-mono text-xl">GB</span>
            </div>
            <p className="font-mono text-xs text-dim">@ {activeModel.defaultQ} Quantization</p>
          </div>

          <div className="mt-8 w-full border-t border-white/10 pt-6">
            <p className="text-center text-xs text-faint mb-4 uppercase tracking-widest">Recommended Architecture</p>
            <div className="flex justify-center gap-4">
              {activeModel.vramBase <= 24 ? (
                <div className="flex flex-col items-center text-center">
                  <span className="font-medium text-sm text-ink">Consumer GPU</span>
                  <span className="text-xs text-dim">RTX 4080 / 4090</span>
                </div>
              ) : activeModel.vramBase <= 64 ? (
                <div className="flex flex-col items-center text-center">
                  <span className="font-medium text-sm text-ink">Unified Memory</span>
                  <span className="text-xs text-dim">Mac Studio M2 Ultra</span>
                </div>
              ) : (
                <div className="flex flex-col items-center text-center">
                  <span className="font-medium text-sm text-ink">Multi-GPU Rig</span>
                  <span className="text-xs text-dim">2x RTX 4090 or Threadripper</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
