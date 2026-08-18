"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { JsonLd } from "@/components/JsonLd";

const DEVICES = {
  host: ["iPhone 15/16", "Samsung Galaxy", "Google Pixel", "Nothing Phone"],
  accessory: ["AirPods Pro", "Galaxy Buds", "Apple Watch", "Garmin Watch", "AirTags", "Oura Ring"]
};

// Simplified database for the matrix
const MATRIX: Record<string, any> = {
  "AirPods Pro": {
    "iPhone 15/16": { status: "green", text: "Perfect compatibility. Spatial audio, auto-switching, and full control mapping." },
    "Samsung Galaxy": { status: "yellow", text: "Basic audio and ANC work. No spatial audio, no auto-switching, no firmware updates, no battery pop-ups." },
    "Google Pixel": { status: "yellow", text: "Basic audio and ANC work. No spatial audio, no firmware updates." },
    "Nothing Phone": { status: "yellow", text: "Basic audio and ANC work. No spatial audio, no firmware updates." }
  },
  "Apple Watch": {
    "iPhone 15/16": { status: "green", text: "Perfect compatibility. Full ecosystem integration." },
    "Samsung Galaxy": { status: "red", text: "Completely incompatible. Will not pair or function at all." },
    "Google Pixel": { status: "red", text: "Completely incompatible. Apple actively blocks Android pairing." },
    "Nothing Phone": { status: "red", text: "Completely incompatible." }
  },
  "Garmin Watch": {
    "iPhone 15/16": { status: "green", text: "Excellent. Full health sync to Apple Health, though interactive replies to iOS messages are blocked by Apple." },
    "Samsung Galaxy": { status: "green", text: "Excellent. Full health sync and full notification interactivity." },
    "Google Pixel": { status: "green", text: "Excellent. True OS-agnostic compatibility." },
    "Nothing Phone": { status: "green", text: "Excellent. True OS-agnostic compatibility." }
  }
};

export function CompatibilityEngine() {
  const [host, setHost] = useState("iPhone 15/16");
  const [acc, setAcc] = useState("AirPods Pro");

  const result = MATRIX[acc]?.[host] || { 
    status: "yellow", 
    text: "Partial compatibility. Standard Bluetooth/network profiles apply, but proprietary features may be missing." 
  };

  const statusColors = {
    green: "bg-green-500/10 border-green-500/20 text-green-400",
    yellow: "bg-yellow-500/10 border-yellow-500/20 text-yellow-400",
    red: "bg-red-500/10 border-red-500/20 text-red-400",
  };

  const statusTitles = {
    green: "Fully Compatible",
    yellow: "Degraded Experience",
    red: "Artificially Blocked"
  };

  // SEO: Generate Q&A Schema for the selected pair dynamically
  const jsonLdData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [{
      "@type": "Question",
      "name": `Does ${acc} work with ${host}?`,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": result.text
      }
    }]
  };

  return (
    <div className="bg-surface/30 border border-edge rounded-3xl p-8 lg:p-12 relative overflow-hidden backdrop-blur-md">
      <JsonLd data={jsonLdData} />
      
      <div className="max-w-2xl mb-12">
        <h2 className="font-display text-3xl font-semibold tracking-tight mb-4">Cross-Platform Compatibility Engine</h2>
        <p className="text-dim leading-relaxed">
          Don't buy e-waste. Check exactly what features are artificially blocked when mixing brands before you purchase.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <div>
          <label className="block font-mono text-xs uppercase tracking-widest text-faint mb-3">If I have a...</label>
          <select 
            value={host}
            onChange={(e) => setHost(e.target.value)}
            className="w-full bg-black/40 border border-edge rounded-xl px-5 py-4 text-ink focus:border-accent-bright transition-colors appearance-none"
          >
            {DEVICES.host.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>
        <div>
          <label className="block font-mono text-xs uppercase tracking-widest text-faint mb-3">Can I use...</label>
          <select 
            value={acc}
            onChange={(e) => setAcc(e.target.value)}
            className="w-full bg-black/40 border border-edge rounded-xl px-5 py-4 text-ink focus:border-accent-bright transition-colors appearance-none"
          >
            {DEVICES.accessory.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={`${host}-${acc}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className={`rounded-2xl border p-8 ${statusColors[result.status as keyof typeof statusColors]}`}
        >
          <div className="flex items-center gap-4 mb-4">
            <div className={`w-3 h-3 rounded-full ${result.status === 'green' ? 'bg-green-500' : result.status === 'yellow' ? 'bg-yellow-500' : 'bg-red-500'} animate-pulse`} />
            <h3 className="font-display text-2xl font-semibold">{statusTitles[result.status as keyof typeof statusTitles]}</h3>
          </div>
          <p className="text-lg leading-relaxed opacity-90">{result.text}</p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
