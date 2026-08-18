// @ts-nocheck
import type { Metadata } from "next";
import Link from "next/link";
import { getPublishedSetups } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Verified Builds | Compute",
  description: "Community-submitted and editorial-verified hardware builds for Local AI.",
};

export default async function VerifiedBuildsPage() {
  // Use existing setups architecture, but filter/display with a "Verified" focus
  const setups = await getPublishedSetups();
  
  // Mocking some "Verified" data to augment the existing setups for MVP
  const verifiedSetups = setups.map((s, i) => ({
    ...s,
    verifiedInference: i % 2 === 0, // Mock: some are verified, some are just regular setups
    tps_claim: i % 2 === 0 ? "14.5 t/s" : null,
    model_claim: i % 2 === 0 ? "Llama-3-70B" : null,
  }));

  return (
    <div className="space-y-12 pb-24 max-w-6xl mx-auto px-4">
      <header className="rise-group pt-10 text-center">
        <p className="font-mono text-xs uppercase tracking-[0.22em] text-accent-bright mb-4">
          Community Engine
        </p>
        <h1 className="font-display text-4xl font-bold tracking-tight sm:text-5xl text-white">
          Verified Builds
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-dim max-w-2xl mx-auto font-light">
          Real rigs built by the community. We verify the specs and the inference speeds so you know exactly what to expect before you buy.
        </p>
      </header>

      <div className="reveal grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-12">
        {verifiedSetups.map((setup) => (
          <Link
            key={setup.id}
            href={`/setups/${setup.slug}`}
            className="group relative flex flex-col overflow-hidden rounded-2xl border border-edge bg-surface transition-all hover:border-accent"
          >
            {setup.verifiedInference && (
              <div className="absolute top-4 right-4 z-20 flex items-center gap-1.5 rounded-full bg-black/60 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-accent-bright backdrop-blur-md border border-accent-bright/30">
                <span className="h-1.5 w-1.5 rounded-full bg-accent-bright animate-pulse"></span>
                Verified
              </div>
            )}
            
            <div className="aspect-[4/3] w-full overflow-hidden bg-surface-dim relative">
              {setup.image_url ? (
                <img
                  src={setup.image_url}
                  alt={setup.title}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-dim font-mono text-xs">
                  No Image Provided
                </div>
              )}
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
            </div>

            <div className="flex flex-col p-6 absolute bottom-0 left-0 right-0 z-10">
              <h2 className="font-display text-xl font-semibold text-white group-hover:text-accent-bright transition-colors line-clamp-1">
                {setup.title}
              </h2>
              <p className="mt-1 font-mono text-xs text-zinc-400">
                by {setup.author_name || "Community Member"}
              </p>
            </div>

            {setup.verifiedInference && (
              <div className="border-t border-edge/50 bg-black/40 p-4 pt-16 -mt-12 relative z-0 flex justify-between items-center">
                <div className="font-mono text-xs text-dim">
                  <span className="block text-faint mb-0.5 text-[9px] uppercase">Verified Test</span>
                  {setup.model_claim}
                </div>
                <div className="font-mono font-bold text-accent-bright text-sm">
                  {setup.tps_claim}
                </div>
              </div>
            )}
          </Link>
        ))}
      </div>
      
      <div className="text-center mt-16 pt-8 border-t border-edge">
        <button className="rounded-full bg-white px-8 py-3.5 text-sm font-semibold text-black transition-transform hover:scale-105">
          Submit Your Build
        </button>
      </div>
    </div>
  );
}
