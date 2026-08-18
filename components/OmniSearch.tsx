"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ConsultantChat } from "./ConsultantChat";
import { Zap } from "lucide-react";

const JARGON_DICT: Record<string, { raw: string; brand: string }> = {
  "retina": { raw: "High-density IPS LCD or OLED display (typically >300 PPI)", brand: "Apple" },
  "super retina xdr": { raw: "OLED display with peak HDR brightness (usually 1200+ nits)", brand: "Apple" },
  "promotion": { raw: "Variable refresh rate panel (typically up to 120Hz)", brand: "Apple" },
  "liquid retina": { raw: "Standard IPS LCD with rounded corners", brand: "Apple" },
  "blast processing": { raw: "DMA trick to transfer graphics data faster (historical)", brand: "Sega" },
  "qled": { raw: "Standard LCD TV with a Quantum Dot color filter layer", brand: "Samsung" },
  "dynamic amoled": { raw: "OLED panel with HDR10+ support and variable refresh rate", brand: "Samsung" },
  "infinity-o": { raw: "Display with a hole-punch camera cutout", brand: "Samsung" },
};

export function OmniSearch() {
  const [isFocused, setIsFocused] = useState(false);
  const [query, setQuery] = useState("");
  const [aiMode, setAiMode] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Escuta o atalho Ctrl+K (ou Cmd+K) globalmente
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
      // Escuta ESC para fechar AI Mode
      if (e.key === "Escape") {
        setAiMode(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (jargonMatch) return; // Block search if a jargon card is showing
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  const jargonMatch = JARGON_DICT[query.trim().toLowerCase()];

  return (
    <div className="relative z-50 mx-auto mt-12 w-full max-w-2xl">
      <form
        onSubmit={handleSubmit}
        className={`relative flex items-center overflow-hidden rounded-2xl border bg-black/40 backdrop-blur-3xl transition-all duration-500 ease-out ${
          isFocused || aiMode
            ? "border-accent-bright/50 shadow-[0_0_60px_rgba(0,100,255,0.15)] ring-1 ring-accent-bright/30" 
            : "border-white/10 shadow-2xl hover:border-white/20"
        } ${aiMode ? 'hidden' : 'flex'}`}
      >
        <div className="flex h-16 w-16 shrink-0 items-center justify-center text-dim">
          {/* Magnifying Glass Icon */}
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
        </div>

        <input
          ref={inputRef}
          type="text"
          className="peer h-16 w-full bg-transparent pr-20 font-display text-xl tracking-tight text-ink placeholder-dim outline-none transition-all"
          placeholder="Search hardware, software, or ask the AI..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />

        {/* Cérebro / AI Toggle Icon */}
        <button 
          type="button"
          onClick={() => setAiMode(true)}
          className="absolute right-12 flex h-full items-center justify-center opacity-40 transition-opacity hover:opacity-100 cursor-pointer z-10" 
          title="Activate Fathom Consultant AI"
        >
          <svg className="h-6 w-6 text-accent-bright" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
          </svg>
        </button>

        {/* Atalho Visual (Kbd) */}
        <div className={`absolute right-4 flex h-full items-center justify-center transition-opacity duration-300 ${isFocused || query.length > 0 ? "opacity-0 pointer-events-none" : "opacity-100"}`}>
          <kbd className="flex h-7 items-center justify-center rounded border border-white/10 bg-white/5 px-2 font-mono text-[10px] font-medium text-faint">
            <span className="mr-1 text-xs">⌘</span>K
          </kbd>
        </div>
      </form>

      {/* Consultant Chat Modal/Expansion */}
      {aiMode && (
        <div className="absolute top-0 w-full animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="flex justify-end mb-2">
            <button 
              onClick={() => setAiMode(false)}
              className="text-dim hover:text-white font-mono text-xs border border-white/10 bg-black/40 px-3 py-1 rounded backdrop-blur-xl transition-colors"
            >
              [ESC] Close AI
            </button>
          </div>
          <ConsultantChat />
        </div>
      )}

      {/* B.S. Translator (Marketing Jargon Interceptor) */}
      {!aiMode && jargonMatch && (
        <div className="absolute top-[110%] w-full animate-in slide-in-from-top-2 fade-in duration-300">
          <div className="bg-surface border border-edge rounded-2xl p-6 shadow-2xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent pointer-events-none" />
            
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-accent/20 p-1.5 rounded-md">
                <Zap className="w-4 h-4 text-accent-bright" />
              </div>
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent-bright">B.S. Translator Intercepted</span>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-sm font-mono text-dim line-through decoration-edge-strong">Marketing Jargon: "{query}" ({jargonMatch.brand})</span>
              <span className="font-display text-2xl font-bold text-ink">Raw Spec: {jargonMatch.raw}</span>
            </div>
            
            <p className="mt-4 text-xs font-mono uppercase tracking-widest text-faint">Search suspended to prevent marketing interference.</p>
          </div>
        </div>
      )}
    </div>
  );
}
