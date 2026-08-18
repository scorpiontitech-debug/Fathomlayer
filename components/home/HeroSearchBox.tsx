"use client";

import { useEffect, useState } from "react";
import { Search } from "lucide-react";

export function HeroSearchBox() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const triggerSearch = () => {
    // Dispatch a keyboard event to trigger the GlobalCommandPalette (Ctrl+K)
    const event = new KeyboardEvent("keydown", {
      key: "k",
      ctrlKey: true,
      bubbles: true,
    });
    window.dispatchEvent(event);
  };

  return (
    <div className="relative z-20 mx-auto mt-12 w-full max-w-2xl px-5">
      <div 
        onClick={triggerSearch}
        className="group relative flex h-16 w-full cursor-text items-center overflow-hidden rounded-full border border-white/10 bg-surface/50 px-6 backdrop-blur-3xl transition-all duration-500 hover:border-accent-bright/50 hover:bg-surface/80 hover:shadow-[0_0_60px_rgba(0,100,255,0.15)]"
      >
        <Search className="h-6 w-6 text-dim transition-colors group-hover:text-accent-bright" />
        <span className="ml-4 font-display text-lg text-dim group-hover:text-ink">
          Ask Fathom AI or search the index...
        </span>
        
        {mounted && (
          <div className="absolute right-4 flex items-center">
            <kbd className="hidden sm:flex h-8 items-center justify-center rounded-lg border border-white/10 bg-white/5 px-3 font-mono text-[11px] font-medium text-faint group-hover:border-accent/30 group-hover:text-accent-bright transition-colors">
              <span className="mr-1 text-sm">⌘</span>K
            </kbd>
          </div>
        )}
      </div>
    </div>
  );
}
