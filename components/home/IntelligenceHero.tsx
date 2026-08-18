"use client";

import { useEffect, useRef } from "react";
import { createIntelligenceViz, IntelligenceVizHandle } from "../three/intelligenceViz";
import { IntelligenceTicker } from "./IntelligenceTicker";
import Link from "next/link";

export function IntelligenceHero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    let viz: IntelligenceVizHandle;
    try {
      viz = createIntelligenceViz(canvasRef.current);
    } catch (err) {
      console.error("Three.js Init Error:", err);
    }
    return () => viz?.dispose();
  }, []);

  return (
    <section className="relative flex min-h-[70vh] flex-col items-center justify-center overflow-hidden py-24">
      {/* 3D Background */}
      <div className="absolute inset-0 z-0 pointer-events-none mix-blend-screen opacity-60">
        <canvas ref={canvasRef} className="h-full w-full pointer-events-auto" />
      </div>

      <div className="rise-group relative z-10 flex flex-col items-center text-center max-w-4xl px-4">
        <div className="mb-6 flex items-center justify-center space-x-3 rounded-full border border-accent/20 bg-accent/5 px-4 py-1.5 backdrop-blur-md">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75"></span>
            <span className="relative inline-flex h-2 w-2 rounded-full bg-accent"></span>
          </span>
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent-bright">
            Intelligence Hub
          </span>
        </div>

        <h1 className="font-display text-5xl font-bold tracking-tight sm:text-7xl">
          The Nervous System of
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-white">
            Modern Software
          </span>
        </h1>

        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-dim sm:text-xl">
          AI agents, models, MCP servers, and frameworks. Explore the building blocks of autonomous computation.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="#stack-builder"
            className="group relative inline-flex items-center justify-center overflow-hidden rounded-full bg-ink px-8 py-3 font-medium text-surface transition-transform duration-300 ease-flow hover:scale-105"
          >
            <span className="absolute inset-0 bg-accent transition-transform duration-300 ease-flow group-hover:scale-105"></span>
            <span className="relative z-10 flex items-center gap-2">
              Build Your Stack
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none" className="transition-transform group-hover:translate-x-1">
                <path d="M8.14645 3.14645C8.34171 2.95118 8.65829 2.95118 8.85355 3.14645L12.8536 7.14645C13.0488 7.34171 13.0488 7.65829 12.8536 7.85355L8.85355 11.8536C8.65829 12.0488 8.34171 12.0488 8.14645 11.8536C7.95118 11.6583 7.95118 11.3417 8.14645 11.1464L11.2929 8H2.5C2.22386 8 2 7.77614 2 7.5C2 7.22386 2.22386 7 2.5 7H11.2929L8.14645 3.85355C7.95118 3.65829 7.95118 3.34171 8.14645 3.14645Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
              </svg>
            </span>
          </Link>
          <a
            href="#categories"
            className="inline-flex items-center justify-center rounded-full border border-edge bg-surface px-8 py-3 font-medium text-dim transition-colors hover:border-edge-strong hover:text-ink"
          >
            Explore Categories
          </a>
        </div>
      </div>
      
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-surface to-transparent z-10"></div>
      
      {/* Live Market Ticker */}
      <div className="absolute bottom-10 left-0 right-0 z-20">
        <IntelligenceTicker />
      </div>
    </section>
  );
}
