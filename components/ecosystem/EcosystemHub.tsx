"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { HeroWalledGardens } from "./HeroWalledGardens";
import { MatterProtocolRadar } from "./MatterProtocolRadar";
import { MobilityShowcase } from "./MobilityShowcase";
import { EscapePodsShelf } from "./EscapePodsShelf";
import { DataPortabilityMatrix } from "./DataPortabilityMatrix";
import { RightToRepairTicker } from "./RightToRepairTicker";
import { EcosystemFAQ } from "./EcosystemFAQ";

// Lazy load heavy interactive components for better LCP
const LockInDiagnostic = dynamic(() => import("./LockInDiagnostic").then(mod => mod.LockInDiagnostic), { ssr: false });
const TCOCalculatorBlock = dynamic(() => import("./TCOCalculatorBlock").then(mod => mod.TCOCalculatorBlock), { ssr: false });
const CompatibilityEngine = dynamic(() => import("./CompatibilityEngine").then(mod => mod.CompatibilityEngine), { ssr: false });
const MigrationPlaybook = dynamic(() => import("./MigrationPlaybook").then(mod => mod.MigrationPlaybook), { ssr: false });
const RepairabilityIndexTable = dynamic(() => import("./RepairabilityIndexTable").then(mod => mod.RepairabilityIndexTable), { ssr: false });



interface EcosystemHubProps {
  pillar: { name: string; tagline: string; slug: string };
  categories: any[];
}

export function EcosystemHub({ pillar, categories }: EcosystemHubProps) {
  return (
    <div className="flex flex-col gap-32 pb-24 w-full">
      {/* 1. Visually arresting Hero with Framer Motion (The Problem) */}
      <section className="relative min-h-[85vh] flex flex-col justify-center">
        <header className="rise-group relative z-10 max-w-3xl pt-20">
          <div className="inline-flex items-center gap-3 mb-6">
            <span className="flex h-2 w-2 rounded-full bg-accent-bright animate-pulse" />
            <p className="font-mono text-xs uppercase tracking-[0.22em] text-accent-bright">
              Pillar: Ecosystem & Mobility
            </p>
          </div>
          <h1 className="font-display text-5xl font-semibold tracking-tight sm:text-7xl mb-6 relative">
            <span className="sr-only">Consumer Electronics Ecosystem Lock-in Analysis & Comparison</span>
            <span aria-hidden="true">Escape the Walled Garden.</span>
          </h1>
          <p className="text-xl leading-relaxed text-dim max-w-2xl">
            {pillar.tagline}. Big Tech locks you in. We calculate the hidden tax of convenience 
            and guide you towards open, interoperable phygital setups.
          </p>
        </header>
        
        {/* The visual lock-in grid */}
        <div className="absolute inset-0 z-0 flex items-center justify-end opacity-40 mix-blend-screen pointer-events-none">
          <HeroWalledGardens />
        </div>
      </section>

      {/* Anti-Trust Ticker Ribbon */}
      <div className="-mx-5">
        <RightToRepairTicker />
      </div>

      {/* Phase 2: Diagnostic Tool */}
      <section className="reveal relative z-10">
        <div className="max-w-xl mb-12">
          <h2 className="font-display text-3xl font-semibold tracking-tight mb-4">Are you a hostage?</h2>
          <p className="text-dim leading-relaxed">
            Take the 4-step diagnostic to find out your true lock-in score and how much it will cost you to leave.
          </p>
        </div>
        <LockInDiagnostic />
      </section>

      {/* 2. Interactive Tool: Ecosystem TCO (The Pain) */}
      <section className="reveal relative z-10 scroll-mt-24" id="tco-tool">
        <div className="max-w-xl mb-12">
          <h2 className="font-display text-3xl font-semibold tracking-tight mb-4">The Ecosystem Tax</h2>
          <p className="text-dim leading-relaxed">
            A "cheap" smartphone becomes the most expensive device you own once you are forced to buy 
            proprietary earbuds, watches, and tags to make it work properly. Calculate your real lock-in cost.
          </p>
        </div>
        <TCOCalculatorBlock />
      </section>

      {/* Phase 2: Data Portability */}
      <section className="reveal relative z-10">
        <DataPortabilityMatrix />
      </section>

      {/* 3. Phygital Mobility & EVs (The Solution) */}
      <section className="reveal relative z-10">
        <MobilityShowcase />
      </section>

      {/* Phase 4: Compatibility Engine */}
      <section className="reveal relative z-10">
        <CompatibilityEngine />
      </section>

      {/* 4. Matter & Interoperability Radar */}
      <section className="reveal relative z-10">
        <div className="max-w-xl mb-12">
          <h2 className="font-display text-3xl font-semibold tracking-tight mb-4">Interoperability Radar</h2>
          <p className="text-dim leading-relaxed">
            Stop buying e-waste. We track the true openness of smart home hubs, EV chargers, and wearables. 
            If it doesn't speak Matter or open protocols, it's a liability.
          </p>
        </div>
        <MatterProtocolRadar />
      </section>

      {/* Phase 2: Escape Pods */}
      <section className="reveal relative z-10">
        <EscapePodsShelf />
      </section>

      {/* Phase 4: Migration Playbook */}
      <section className="reveal relative z-10">
        <MigrationPlaybook />
      </section>

      {/* Phase 4: Repairability Index */}
      <section className="reveal relative z-10">
        <RepairabilityIndexTable />
      </section>

      {/* 5. Traditional Categories Grid (Directory) */}
      {categories.length > 0 && (
        <section className="reveal relative z-10 pt-16 border-t border-edge">
          <div className="flex items-baseline justify-between mb-8">
            <h2 className="font-display text-2xl font-semibold tracking-tight">Browse Categories</h2>
            <span className="font-mono text-xs uppercase tracking-[0.14em] text-faint">
              Directory
            </span>
          </div>
          <ul className="grid gap-4 sm:grid-cols-3">
            {categories.map((c) => (
              <li key={c.id}>
                <Link
                  href={`/${pillar.slug}/${c.slug}`}
                  data-spot
                  data-tilt
                  className="spot-card glow-hover tilt group flex min-h-[160px] flex-col justify-between rounded-xl border border-edge bg-surface/50 backdrop-blur-sm p-6 hover:border-edge-strong transition-colors"
                >
                  <div>
                    <div className="flex items-baseline justify-between gap-3">
                      <h3 className="font-display text-lg font-semibold tracking-tight text-ink">
                        {c.name}
                      </h3>
                      <span className="font-mono text-xs tabular-nums text-faint">
                        {c.active_listing_count}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center text-xs font-mono uppercase tracking-[0.14em] text-accent-bright mt-4 opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0">
                    Explore <span className="ml-2">→</span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Phase 3: AEO & SEO FAQs */}
      <EcosystemFAQ />
    </div>
  );
}
