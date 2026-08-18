"use client";

import { EcosystemTCO } from "@/components/tools/EcosystemTCO";
import { useState } from "react";

const PHONES = [
  { id: "s26", name: "Galaxy S26 Ultra", brand: "Samsung", price: 1299 },
  { id: "ip16", name: "iPhone 16 Pro", brand: "Apple", price: 1099 },
  { id: "pixel", name: "Pixel 9 Pro", brand: "Google", price: 999 },
];

export function TCOCalculatorBlock() {
  const [selected, setSelected] = useState(PHONES[1]);

  return (
    <div className="rounded-2xl border border-edge bg-surface/40 p-6 md:p-10 backdrop-blur-xl relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-accent-bright/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="grid lg:grid-cols-[1fr_400px] gap-12 relative z-10">
        <div>
          <div className="mb-8">
            <h3 className="text-xl font-display font-semibold mb-2">Step 1. Choose your poison</h3>
            <p className="text-dim text-sm">Select a flagship device to see how much the ecosystem truly costs over 3 years.</p>
          </div>
          
          <div className="grid gap-3 sm:grid-cols-3 mb-10">
            {PHONES.map((phone) => {
              const isActive = selected.id === phone.id;
              return (
                <button
                  key={phone.id}
                  onClick={() => setSelected(phone)}
                  className={`text-left p-4 rounded-xl border transition-all duration-300 ${
                    isActive 
                      ? "border-accent-bright bg-accent/10 shadow-[0_0_20px_rgba(255,100,50,0.1)]" 
                      : "border-edge bg-surface hover:border-edge-strong"
                  }`}
                >
                  <span className="block text-[10px] font-mono uppercase tracking-widest text-faint mb-1">
                    {phone.brand}
                  </span>
                  <span className={`block font-semibold ${isActive ? "text-ink" : "text-dim"}`}>
                    {phone.name}
                  </span>
                  <span className="block text-sm font-mono mt-2 opacity-60">
                    ${phone.price} base
                  </span>
                </button>
              );
            })}
          </div>

          <div className="prose prose-invert max-w-none text-sm text-dim leading-relaxed">
            <p>
              Manufacturers price hardware at a perceived loss or thin margin because they know they will extract 
              <strong> 30% to 50% more value</strong> from you through proprietary accessories. 
            </p>
            <p>
              Once you buy the smartphone, you are strongly incentivized (often functionally forced) to buy their wireless earbuds, 
              their smartwatches, and their tracking tags. Open standards like Bluetooth and Qi are artificially degraded to make first-party hardware look superior.
            </p>
          </div>
        </div>

        <div className="relative">
          <div className="absolute -inset-4 bg-gradient-to-b from-surface to-transparent rounded-3xl -z-10" />
          <h3 className="text-xl font-display font-semibold mb-6">Step 2. The Real Cost</h3>
          <EcosystemTCO 
            basePrice={selected.price} 
            productName={selected.name} 
            brand={selected.brand} 
          />
        </div>
      </div>
    </div>
  );
}
