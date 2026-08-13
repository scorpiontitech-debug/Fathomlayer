"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function QuickCompare() {
  const router = useRouter();
  const [item1, setItem1] = useState("");
  const [item2, setItem2] = useState("");

  const handleCompare = () => {
    if (item1 && item2) {
      router.push(`/compare?id1=${item1}&id2=${item2}`);
    }
  };

  return (
    <section className="relative z-10 -mt-8 mx-auto max-w-4xl px-5">
      <div className="rounded-2xl border border-white/5 bg-black/60 p-6 backdrop-blur-2xl shadow-[0_30px_60px_rgba(0,0,0,0.4)]">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-lg font-semibold tracking-tight text-white">
            Quick Compare
          </h2>
          <span className="font-mono text-[10px] uppercase tracking-widest text-faint">
            Data Lab
          </span>
        </div>
        
        <div className="flex flex-col items-center gap-4 sm:flex-row">
          <div className="w-full flex-1 relative">
            <select
              value={item1}
              onChange={(e) => setItem1(e.target.value)}
              className="w-full appearance-none rounded-lg border border-white/10 bg-white/5 px-4 py-3 font-mono text-sm text-ink outline-none transition-colors hover:border-white/20 focus:border-accent-bright"
            >
              <option value="" disabled>Select Hardware A...</option>
              <option value="macbook-pro-m3-max">MacBook Pro M3 Max</option>
              <option value="rtx-4090">NVIDIA RTX 4090</option>
              <option value="amd-rx-7900-xtx">AMD RX 7900 XTX</option>
              <option value="sony-wh-1000xm5">Sony WH-1000XM5</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-dim">
              ▼
            </div>
          </div>
          
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/5 text-xs font-bold text-dim">
            VS
          </div>
          
          <div className="w-full flex-1 relative">
            <select
              value={item2}
              onChange={(e) => setItem2(e.target.value)}
              className="w-full appearance-none rounded-lg border border-white/10 bg-white/5 px-4 py-3 font-mono text-sm text-ink outline-none transition-colors hover:border-white/20 focus:border-accent-bright"
            >
              <option value="" disabled>Select Hardware B...</option>
              <option value="macbook-pro-m3-max">MacBook Pro M3 Max</option>
              <option value="rtx-4090">NVIDIA RTX 4090</option>
              <option value="amd-rx-7900-xtx">AMD RX 7900 XTX</option>
              <option value="sony-wh-1000xm5">Sony WH-1000XM5</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-dim">
              ▼
            </div>
          </div>
          
          <button
            onClick={handleCompare}
            disabled={!item1 || !item2 || item1 === item2}
            className="group flex h-[46px] items-center justify-center rounded-lg bg-white px-8 font-display text-sm font-bold text-black transition-all hover:bg-accent hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            FIGHT
          </button>
        </div>
      </div>
    </section>
  );
}
