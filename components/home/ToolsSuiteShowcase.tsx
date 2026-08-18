"use client";

import Link from "next/link";
import { Calculator, Zap, Crosshair } from "lucide-react";

export function ToolsSuiteShowcase() {
  return (
    <section className="reveal max-w-6xl mx-auto my-24 px-5">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div className="max-w-2xl">
          <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl mb-4">
            Fathom Tools Suite
          </h2>
          <p className="text-lg text-dim leading-relaxed">
            Stop relying on marketing brochures. Use our deterministic engineering tools to calculate real ROI, uncover hidden ecosystem taxes, and translate corporate bullshit into raw specs.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Tool: AI Hardware Sizer */}
        <Link href="/tools/local-ai-sizer" className="group relative flex flex-col justify-between rounded-2xl border border-edge bg-surface/30 p-8 hover:bg-surface/60 transition-colors overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5 text-ink group-hover:text-accent group-hover:scale-110 transition-all duration-500">
            <Calculator className="w-32 h-32" />
          </div>
          <div className="relative z-10">
            <div className="bg-accent/10 w-12 h-12 rounded-xl flex items-center justify-center mb-6 border border-accent/20">
              <Calculator className="w-6 h-6 text-accent-bright" />
            </div>
            <h3 className="font-display text-2xl font-semibold text-ink mb-3">Local AI Sizer</h3>
            <p className="text-dim text-sm leading-relaxed mb-8">
              Deterministically calculate the exact VRAM and System RAM required to run open-weight models like Llama 3 locally.
            </p>
          </div>
          <div className="relative z-10 flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-accent-bright">
            <span className="flex h-2 w-2 rounded-full bg-accent-bright animate-pulse" />
            Interactive Oracle
          </div>
        </Link>

        {/* Tool: Cloud vs Local */}
        <Link href="/tools/cloud-vs-local" className="group relative flex flex-col justify-between rounded-2xl border border-edge bg-surface/30 p-8 hover:bg-surface/60 transition-colors overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5 text-ink group-hover:text-warn group-hover:scale-110 transition-all duration-500">
            <Crosshair className="w-32 h-32" />
          </div>
          <div className="relative z-10">
            <div className="bg-warn/10 w-12 h-12 rounded-xl flex items-center justify-center mb-6 border border-warn/20">
              <Crosshair className="w-6 h-6 text-warn" />
            </div>
            <h3 className="font-display text-2xl font-semibold text-ink mb-3">Cloud vs Local TCO</h3>
            <p className="text-dim text-sm leading-relaxed mb-8">
              Calculate the Exact Break-Even Point between paying monthly Cloud AI subscriptions vs building your own Local AI server.
            </p>
          </div>
          <div className="relative z-10 flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-warn">
            <span className="flex h-2 w-2 rounded-full bg-warn animate-pulse" />
            Financial Matrix
          </div>
        </Link>

        {/* Tool 1: TCO */}
        <div className="group relative flex flex-col justify-between rounded-2xl border border-edge bg-surface/30 p-8 hover:bg-surface/60 transition-colors overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5 text-ink group-hover:text-accent group-hover:scale-110 transition-all duration-500">
            <Calculator className="w-32 h-32" />
          </div>
          <div className="relative z-10">
            <div className="bg-accent/10 w-12 h-12 rounded-xl flex items-center justify-center mb-6 border border-accent/20">
              <Calculator className="w-6 h-6 text-accent-bright" />
            </div>
            <h3 className="font-display text-2xl font-semibold text-ink mb-3">Ecosystem TCO</h3>
            <p className="text-dim text-sm leading-relaxed mb-8">
              Calculate the true hidden cost of locking into an ecosystem over 1 to 5 years. Active on Smartphones, Wearables, and Consoles.
            </p>
          </div>
          <div className="relative z-10 flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-accent-bright">
            <span className="flex h-2 w-2 rounded-full bg-accent-bright animate-pulse" />
            Injected in Products
          </div>
        </div>

        {/* Tool 2: ROI */}
        <div className="group relative flex flex-col justify-between rounded-2xl border border-edge bg-surface/30 p-8 hover:bg-surface/60 transition-colors overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5 text-ink group-hover:text-ok group-hover:scale-110 transition-all duration-500">
            <Crosshair className="w-32 h-32" />
          </div>
          <div className="relative z-10">
            <div className="bg-ok/10 w-12 h-12 rounded-xl flex items-center justify-center mb-6 border border-ok/20">
              <Crosshair className="w-6 h-6 text-ok" />
            </div>
            <h3 className="font-display text-2xl font-semibold text-ink mb-3">Pro ROI Calculator</h3>
            <p className="text-dim text-sm leading-relaxed mb-8">
              Determine exactly how many months a high-end workstation takes to pay for itself based on your hourly rate and time saved.
            </p>
          </div>
          <div className="relative z-10 flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-ok">
            <span className="flex h-2 w-2 rounded-full bg-ok animate-pulse" />
            Active for Pro Gear
          </div>
        </div>

        {/* Tool 3: B.S. Translator */}
        <div className="group relative flex flex-col justify-between rounded-2xl border border-edge bg-surface/30 p-8 hover:bg-surface/60 transition-colors overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5 text-ink group-hover:text-warn group-hover:scale-110 transition-all duration-500">
            <Zap className="w-32 h-32" />
          </div>
          <div className="relative z-10">
            <div className="bg-warn/10 w-12 h-12 rounded-xl flex items-center justify-center mb-6 border border-warn/20">
              <Zap className="w-6 h-6 text-warn" />
            </div>
            <h3 className="font-display text-2xl font-semibold text-ink mb-3">B.S. Translator</h3>
            <p className="text-dim text-sm leading-relaxed mb-8">
              Press <kbd className="font-mono bg-white/10 px-1 rounded text-ink border border-white/20">Ctrl+K</kbd> anywhere on the site and type a marketing buzzword like "Retina" to reveal the raw, unpolished specification.
            </p>
          </div>
          <div className="relative z-10 flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-warn">
            <span className="flex h-2 w-2 rounded-full bg-warn animate-pulse" />
            Global Command Palette
          </div>
        </div>
      </div>
    </section>
  );
}
