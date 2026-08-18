"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, Search, X } from "lucide-react";
import { ConsultantChat } from "./ConsultantChat";

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

export function GlobalCommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [aiMode, setAiMode] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const pathname = usePathname();

  // Close when navigating
  useEffect(() => {
    setIsOpen(false);
    setQuery("");
    setAiMode(false);
  }, [pathname]);

  // Global Kbd shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === "Escape") {
        if (aiMode) setAiMode(false);
        else setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [aiMode]);

  // Auto-focus when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery("");
      setAiMode(false);
    }
  }, [isOpen]);

  const jargonMatch = JARGON_DICT[query.trim().toLowerCase()];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (jargonMatch) return;
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query)}`);
      setIsOpen(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] sm:pt-[20vh] px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="relative w-full max-w-2xl bg-surface/90 backdrop-blur-xl border border-edge rounded-2xl shadow-2xl overflow-hidden"
          >
            <form onSubmit={handleSubmit} className={`flex items-center p-4 border-b border-edge/50 ${aiMode ? 'hidden' : 'flex'}`}>
              <Search className="w-5 h-5 text-dim mr-3" />
              <input
                ref={inputRef}
                type="text"
                className="flex-1 bg-transparent text-lg text-ink placeholder-dim outline-none font-display"
                placeholder="Search tech, ask AI, or translate jargon..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <button 
                type="button"
                onClick={() => setAiMode(true)}
                className="ml-2 px-3 py-1.5 rounded-lg bg-accent/10 text-accent-bright font-mono text-xs uppercase tracking-widest hover:bg-accent/20 transition-colors"
              >
                Ask AI
              </button>
            </form>

            {/* AI Mode */}
            {aiMode && (
              <div className="p-4 bg-surface/50">
                <div className="flex justify-between items-center mb-4">
                  <span className="font-mono text-xs uppercase text-accent-bright tracking-widest">Fathom Consultant</span>
                  <button onClick={() => setAiMode(false)} className="text-dim hover:text-ink"><X className="w-4 h-4" /></button>
                </div>
                <ConsultantChat />
              </div>
            )}

            {/* B.S. Translator */}
            {!aiMode && jargonMatch && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                className="bg-accent/5 p-6 border-b border-accent/10"
              >
                <div className="flex items-center gap-2 mb-4">
                  <div className="bg-accent/20 p-1 rounded">
                    <Zap className="w-4 h-4 text-accent-bright" />
                  </div>
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent-bright">B.S. Translator Intercepted</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-mono text-dim line-through decoration-edge-strong">Marketing Jargon: "{query}" ({jargonMatch.brand})</span>
                  <span className="font-display text-xl font-bold text-ink">Raw Spec: {jargonMatch.raw}</span>
                </div>
              </motion.div>
            )}

            {!aiMode && !jargonMatch && query.length > 0 && (
              <div className="p-4 text-center text-sm font-mono text-dim">
                Press <kbd className="border border-edge-strong rounded px-1.5 py-0.5 text-ink">Enter</kbd> to search for "{query}"
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
