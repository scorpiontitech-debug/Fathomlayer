"use client";

import { HeroCanvas } from "@/components/three/HeroCanvas";
import { useEffect, useState } from "react";

export function ComputeHero() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden border-b border-edge bg-black">
      {/* 3D Background */}
      <div className="absolute inset-0 z-0 opacity-60 mix-blend-screen">
        <HeroCanvas />
      </div>

      {/* Grid overlay for tech aesthetic */}
      <div className="absolute inset-0 z-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>

      <div className="relative z-10 mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
        <div className={`transition-all duration-1000 ease-out ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <p className="font-mono text-sm md:text-base uppercase tracking-[0.3em] text-accent-bright mb-6">
            Pillar // Compute
          </p>
          <h1 className="font-display text-5xl md:text-7xl font-bold tracking-tight text-white drop-shadow-2xl">
            Raw Power for<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-200 via-zinc-400 to-zinc-600">
              Local Intelligence
            </span>
          </h1>
          <p className="mx-auto mt-8 max-w-2xl text-lg md:text-xl leading-relaxed text-zinc-400 font-light">
            Build, benchmark, and deploy. Discover the exact hardware specifications required to run the next generation of open-weight models directly on your silicon.
          </p>
          
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <a 
              href="#calculator" 
              className="rounded-full bg-white px-8 py-3.5 text-sm font-semibold text-black transition-transform hover:scale-105 active:scale-95"
            >
              Calculate VRAM
            </a>
            <a 
              href="#radar" 
              className="rounded-full border border-white/20 bg-white/5 px-8 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/10"
            >
              View Hardware Matrix
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
