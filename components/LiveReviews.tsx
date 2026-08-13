"use client";

import { useEffect, useState } from "react";

// Mock data MVP. Idealmente via WebSocket ou Polling da API
const REVIEWS = [
  { id: 1, user: "Alex_C", rating: 9, item: "MacBook Pro M3 Max", text: "Incrível para compilação local." },
  { id: 2, user: "Sarah99", rating: 8, item: "Oculus Quest 3", text: "Ótimo custo-benefício." },
  { id: 3, user: "DevNode", rating: 10, item: "NVIDIA RTX 4090", text: "Poder bruto absoluto para LLMs." },
  { id: 4, user: "TechEnthusiast", rating: 7, item: "Apple Vision Pro", text: "Hardware incrível, mas pesado." },
  { id: 5, user: "GamerX", rating: 9, item: "Steam Deck OLED", text: "A tela perfeita para portáteis." },
  { id: 6, user: "AudioPhile", rating: 9, item: "Sony WH-1000XM5", text: "O noise cancelling é imbatível." },
];

export function LiveReviews() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <section className="py-20 overflow-hidden bg-black">
      <div className="mx-auto max-w-6xl px-5 mb-10">
        <h2 className="font-display text-2xl font-semibold tracking-tight text-white flex items-center gap-3">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>
          Live Community Pulse
        </h2>
        <p className="font-mono text-xs text-dim mt-2 uppercase tracking-widest">Real-time user validations</p>
      </div>

      <div className="relative flex overflow-x-hidden group">
        <div className="flex animate-marquee whitespace-nowrap group-hover:[animation-play-state:paused]">
          {[...REVIEWS, ...REVIEWS, ...REVIEWS].map((review, i) => (
            <div 
              key={`${review.id}-${i}`}
              className="mx-3 flex w-[300px] shrink-0 flex-col justify-between rounded-xl border border-white/10 bg-white/5 p-5 backdrop-blur-md transition-colors hover:border-accent-bright/50 hover:bg-white/10"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-accent/20 text-[10px] font-bold text-accent-bright">
                    {review.user.charAt(0).toUpperCase()}
                  </div>
                  <span className="font-mono text-xs text-faint">{review.user}</span>
                </div>
                <div className="flex items-center gap-1">
                  <svg className="w-3 h-3 text-accent-bright" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="font-mono text-xs font-bold text-white">{review.rating}/10</span>
                </div>
              </div>
              
              <h4 className="font-display text-sm font-semibold text-white mb-1 truncate">{review.item}</h4>
              <p className="text-xs text-dim truncate">"{review.text}"</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
