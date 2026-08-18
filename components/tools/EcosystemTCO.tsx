"use client";

import { useState } from "react";
import { Check, Info, Plus, ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface EcosystemTCOProps {
  basePrice: number;
  productName: string;
  brand: string;
}

export function EcosystemTCO({ basePrice, productName, brand }: EcosystemTCOProps) {
  const isApple = brand.toLowerCase() === "apple";
  const [years, setYears] = useState(3);
  const [isOpen, setIsOpen] = useState(false);

  // Mocks based on typical ecosystem locks
  const [toggles, setToggles] = useState({
    charger: true, // often not included
    case: true,
    cloud: true,
    care: false,
    audio: false,
    watch: false,
  });

  const costs = {
    charger: isApple ? 39 : 29,
    case: isApple ? 49 : 39,
    cloud: isApple ? 2.99 * 12 : 1.99 * 12, // per year
    care: isApple ? 199 : 149, // fixed
    audio: isApple ? 249 : 199,
    watch: isApple ? 399 : 299,
  };

  const handleToggle = (key: keyof typeof toggles) => {
    setToggles((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const calculateTotal = () => {
    let total = basePrice;
    if (toggles.charger) total += costs.charger;
    if (toggles.case) total += costs.case;
    if (toggles.cloud) total += costs.cloud * years;
    if (toggles.care) total += costs.care;
    if (toggles.audio) total += costs.audio;
    if (toggles.watch) total += costs.watch;
    return total;
  };

  const total = calculateTotal();
  const format = (v: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(v);

  return (
    <section className="reveal max-w-2xl rounded-2xl border border-edge bg-surface/50 overflow-hidden shadow-sm">
      {/* Header */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-6 flex items-center justify-between bg-gradient-to-r from-bg to-surface text-left transition-colors hover:bg-subtle group"
      >
        <div>
          <h2 className="font-display text-xl font-semibold tracking-tight text-ink flex items-center gap-2">
            True Cost of Ownership (TCO)
            <Info className="h-4 w-4 text-faint" />
          </h2>
          <p className="mt-1 text-sm text-dim">
            What {productName} actually costs you over {years} years.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <span className="block text-2xl font-mono text-accent-bright tabular-nums">{format(total)}</span>
            <span className="block text-xs font-mono uppercase tracking-widest text-faint">+ {format(total - basePrice)} ecosystem</span>
          </div>
          {isOpen ? <ChevronUp className="text-dim" /> : <ChevronDown className="text-dim group-hover:text-ink transition-colors" />}
        </div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="p-6 border-t border-edge space-y-6 bg-surface/30">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-ink uppercase tracking-widest">Ownership timeframe</span>
            <div className="flex bg-subtle p-1 rounded-lg border border-edge">
              {[1, 2, 3, 4, 5].map(y => (
                <button
                  key={y}
                  onClick={() => setYears(y)}
                  className={`px-3 py-1 rounded-md text-sm font-mono transition-colors ${years === y ? 'bg-surface border border-edge shadow-sm text-ink' : 'text-dim hover:text-ink'}`}
                >
                  {y}y
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center py-2 border-b border-edge/50">
              <span className="text-sm font-medium text-ink">Base Device</span>
              <span className="font-mono text-sm">{format(basePrice)}</span>
            </div>

            <ToggleRow 
              label="Power Adapter (Not in box)" 
              cost={costs.charger} 
              active={toggles.charger} 
              onClick={() => handleToggle('charger')} 
            />
            <ToggleRow 
              label="Protective Case" 
              cost={costs.case} 
              active={toggles.case} 
              onClick={() => handleToggle('case')} 
            />
            <ToggleRow 
              label={`Cloud Storage (${years} yrs)`} 
              cost={costs.cloud * years} 
              active={toggles.cloud} 
              onClick={() => handleToggle('cloud')} 
            />
            <ToggleRow 
              label="Extended Warranty" 
              cost={costs.care} 
              active={toggles.care} 
              onClick={() => handleToggle('care')} 
            />
            <ToggleRow 
              label="Ecosystem Audio (e.g. AirPods)" 
              cost={costs.audio} 
              active={toggles.audio} 
              onClick={() => handleToggle('audio')} 
            />
            <ToggleRow 
              label="Smartwatch" 
              cost={costs.watch} 
              active={toggles.watch} 
              onClick={() => handleToggle('watch')} 
            />
          </div>

          {/* Visual Bar */}
          <div className="pt-4">
            <div className="h-3 w-full bg-subtle rounded-full overflow-hidden flex">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${(basePrice / total) * 100}%` }} 
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="bg-ink h-full" 
                />
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${((total - basePrice) / total) * 100}%` }} 
                  transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
                  className="bg-accent h-full relative overflow-hidden" 
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
                </motion.div>
              </div>
              <div className="flex justify-between mt-2 text-xs font-mono uppercase tracking-widest text-dim">
                <span>Device: {Math.round((basePrice / total) * 100)}%</span>
                <span className="text-accent flex items-center gap-1">
                  Ecosystem Tax: {Math.round(((total - basePrice) / total) * 100)}%
                </span>
              </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

function ToggleRow({ label, cost, active, onClick }: { label: string, cost: number, active: boolean, onClick: () => void }) {
  const format = (v: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(v);
  return (
    <div 
      className={`flex justify-between items-center p-3 rounded-lg cursor-pointer transition-colors border ${active ? 'border-accent/30 bg-accent/5' : 'border-transparent hover:bg-subtle'}`}
      onClick={onClick}
    >
      <div className="flex items-center gap-3">
        <div className={`flex items-center justify-center w-5 h-5 rounded border ${active ? 'bg-accent border-accent text-white' : 'border-edge-strong bg-surface text-transparent'}`}>
          <Check className="w-3 h-3" />
        </div>
        <span className={`text-sm ${active ? 'text-ink font-medium' : 'text-dim'}`}>{label}</span>
      </div>
      <div className="flex items-center gap-2">
        {!active && <Plus className="w-3 h-3 text-faint" />}
        <span className={`font-mono text-sm ${active ? 'text-accent' : 'text-faint'}`}>+{format(cost)}</span>
      </div>
    </div>
  );
}
