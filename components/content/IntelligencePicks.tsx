// @ts-nocheck
"use client";

import Link from "next/link";
import { VerifiedBadge } from "../VerifiedBadge";

export function IntelligencePicks() {
  return (
    <section className="reveal py-12">
      <div className="mb-10 border-b border-edge pb-6">
        <h2 className="font-display text-3xl font-semibold tracking-tight">
          Editor's Picks
        </h2>
        <p className="mt-2 text-dim">
          Standout tools tested and verified by Fathom Layer for production readiness.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Pick 1 */}
        <div className="group relative overflow-hidden rounded-2xl border border-edge bg-surface p-8 transition-colors hover:border-edge-strong">
          <div className="absolute top-0 right-0 p-6">
            <VerifiedBadge verifiedAt="2026-08-15" />
          </div>
          
          <div className="mb-6 flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 text-xl font-bold text-accent-bright">
              M
            </div>
            <div>
              <h3 className="font-display text-xl font-semibold text-ink">Mastra</h3>
              <span className="font-mono text-xs text-faint">Agent Framework</span>
            </div>
          </div>
          
          <p className="mb-6 text-sm leading-relaxed text-dim">
            "We selected Mastra as our top pick for its strongly-typed approach to agent orchestration. Unlike older frameworks that feel like bloated wrappers, Mastra offers a pristine developer experience with built-in telemetry and native Next.js integration."
          </p>
          
          <div className="flex items-center gap-4">
             <Link
               href="/intelligence/agent-frameworks/mastra"
               className="font-mono text-xs uppercase tracking-widest text-accent hover:text-accent-bright transition-colors"
             >
               Read full review →
             </Link>
          </div>
        </div>

        {/* Pick 2 */}
        <div className="group relative overflow-hidden rounded-2xl border border-edge bg-surface p-8 transition-colors hover:border-edge-strong">
          <div className="absolute top-0 right-0 p-6">
            <VerifiedBadge verifiedAt="2026-08-15" />
          </div>
          
          <div className="mb-6 flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 text-xl font-bold text-accent-bright">
              S
            </div>
            <div>
              <h3 className="font-display text-xl font-semibold text-ink">Supabase</h3>
              <span className="font-mono text-xs text-faint">Vector & MCP DB</span>
            </div>
          </div>
          
          <p className="mb-6 text-sm leading-relaxed text-dim">
            "For AI infrastructure, Supabase is unmatched. With native pgvector support and a ready-to-use Model Context Protocol server, it bridges the gap between traditional relational data and modern semantic search instantly."
          </p>
          
          <div className="flex items-center gap-4">
             <Link
               href="/intelligence/ai-software/supabase"
               className="font-mono text-xs uppercase tracking-widest text-accent hover:text-accent-bright transition-colors"
             >
               Read full review →
             </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
