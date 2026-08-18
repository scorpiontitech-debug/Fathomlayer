"use client";

import { useState } from "react";
import { Calculator, Target, Clock, ArrowRight, Info, ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ProROICalculatorProps {
  price: number;
  productName: string;
}

export function ProROICalculator({ price, productName }: ProROICalculatorProps) {
  const [hourlyRate, setHourlyRate] = useState(50);
  const [hoursSavedPerWeek, setHoursSavedPerWeek] = useState(5);
  const [isOpen, setIsOpen] = useState(false);

  const valueSavedPerMonth = hourlyRate * hoursSavedPerWeek * 4;
  const monthsToPayoff = price / valueSavedPerMonth;

  const format = (v: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(v);

  return (
    <section className="reveal max-w-2xl rounded-2xl border border-edge bg-surface/50 overflow-hidden shadow-sm mt-6">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-6 flex items-center justify-between bg-gradient-to-r from-bg to-surface text-left transition-colors hover:bg-subtle group"
      >
        <div>
          <h2 className="font-display text-xl font-semibold tracking-tight text-ink flex items-center gap-2">
            Pro ROI Calculator
            <Calculator className="h-4 w-4 text-faint" />
          </h2>
          <p className="mt-1 text-sm text-dim">
            When does the {productName} pay for itself in time saved?
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <span className="block text-2xl font-mono text-accent-bright tabular-nums">{monthsToPayoff.toFixed(1)} mo</span>
            <span className="block text-xs font-mono uppercase tracking-widest text-faint">Break-even</span>
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
            <div className="p-6 border-t border-edge space-y-8 bg-surface/30">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium text-ink uppercase tracking-widest">Your Hourly Rate</label>
                  <span className="font-mono text-accent">{format(hourlyRate)}/hr</span>
                </div>
                <input 
                  type="range" 
                  min="15" 
                  max="200" 
                  step="5"
                  value={hourlyRate}
                  onChange={(e) => setHourlyRate(parseInt(e.target.value))}
                  className="w-full h-1 bg-subtle rounded-full appearance-none cursor-pointer accent-accent"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium text-ink uppercase tracking-widest">Time Saved (weekly)</label>
                  <span className="font-mono text-accent">{hoursSavedPerWeek} hrs</span>
                </div>
                <input 
                  type="range" 
                  min="1" 
                  max="20" 
                  step="1"
                  value={hoursSavedPerWeek}
                  onChange={(e) => setHoursSavedPerWeek(parseInt(e.target.value))}
                  className="w-full h-1 bg-subtle rounded-full appearance-none cursor-pointer accent-accent"
                />
                <p className="text-xs text-faint mt-2 flex items-start gap-1">
                  <Info className="w-3 h-3 flex-shrink-0 mt-0.5" />
                  Estimate based on faster renders, compiles, and fewer UI stutters compared to a 3-year-old machine.
                </p>
              </div>
            </div>

            <div className="bg-subtle border border-edge rounded-xl p-5 flex flex-col justify-center relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                <Target className="w-32 h-32" />
              </div>
              <p className="text-xs font-mono uppercase tracking-widest text-dim mb-1">Value Generated</p>
              <p className="text-3xl font-mono text-ink mb-4">{format(valueSavedPerMonth)}<span className="text-sm text-dim"> /mo</span></p>
              
              <div className="h-px bg-edge w-full mb-4" />

              <p className="text-xs font-mono uppercase tracking-widest text-dim mb-1">Payoff Point</p>
              <div className="flex items-end gap-2">
                <p className="text-4xl font-mono text-accent-bright leading-none">{monthsToPayoff.toFixed(1)}</p>
                <p className="text-sm text-dim pb-1">months</p>
              </div>
            </div>
          </div>
          
          {/* Progress Visual */}
          <div>
            <div className="flex justify-between text-xs font-mono text-dim mb-2">
              <span>Purchase Date</span>
              <span className="text-accent">ROI Positive!</span>
            </div>
            <div className="h-2 w-full bg-subtle rounded-full overflow-hidden relative">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
                className="absolute inset-y-0 left-0 bg-accent"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>
      )}
      </AnimatePresence>
    </section>
  );
}
