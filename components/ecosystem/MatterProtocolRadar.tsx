"use client";

import { useState } from "react";
import { motion } from "framer-motion";

const CATEGORIES = ["Smart Home", "Wearables", "EV Chargers", "Audio"];

const RADAR_ITEMS = [
  { name: "Aqara Hub M3", category: "Smart Home", score: 95, desc: "Native Matter bridge, works locally without cloud." },
  { name: "Apple HomePod mini", category: "Smart Home", score: 85, desc: "Matter thread border router, but iOS required for setup." },
  { name: "Garmin Fenix 8", category: "Wearables", score: 70, desc: "Platform agnostic, but proprietary data sync." },
  { name: "Apple Watch Ultra", category: "Wearables", score: 10, desc: "Zero interoperability outside iOS." },
  { name: "Wallbox Pulsar Plus", category: "EV Chargers", score: 80, desc: "Open API, integrates with Home Assistant." },
  { name: "Tesla Wall Connector", category: "EV Chargers", score: 40, desc: "Locked to Tesla app ecosystem natively." },
  { name: "Sony WF-1000XM6", category: "Audio", score: 90, desc: "Multipoint Bluetooth, OS agnostic." },
  { name: "AirPods Pro", category: "Audio", score: 30, desc: "Basic BT works, but 70% of features locked to iOS." },
];

export function MatterProtocolRadar() {
  const [activeCat, setActiveCat] = useState("All");

  const filtered = activeCat === "All" 
    ? RADAR_ITEMS 
    : RADAR_ITEMS.filter(i => i.category === activeCat);

  return (
    <div className="bg-surface rounded-2xl border border-edge p-6 md:p-8">
      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-8">
        <button
          onClick={() => setActiveCat("All")}
          className={`px-4 py-2 rounded-full text-xs font-mono uppercase tracking-widest transition-colors ${
            activeCat === "All" ? "bg-accent-bright text-white" : "bg-edge text-dim hover:bg-edge-strong"
          }`}
        >
          All
        </button>
        {CATEGORIES.map(c => (
          <button
            key={c}
            onClick={() => setActiveCat(c)}
            className={`px-4 py-2 rounded-full text-xs font-mono uppercase tracking-widest transition-colors ${
              activeCat === c ? "bg-accent-bright text-white" : "bg-edge text-dim hover:bg-edge-strong"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid gap-4">
        {filtered.map((item, i) => (
          <motion.div 
            key={item.name}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-xl border border-edge hover:border-edge-strong transition-colors bg-[#0a0a0b]/50"
          >
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-mono uppercase tracking-widest text-faint">{item.category}</span>
              </div>
              <h4 className="font-semibold text-ink">{item.name}</h4>
              <p className="text-sm text-dim mt-1">{item.desc}</p>
            </div>
            
            <div className="sm:w-48 shrink-0">
              <div className="flex justify-between text-xs font-mono mb-2">
                <span className="text-faint">Openness</span>
                <span className={item.score > 75 ? "text-green-400" : item.score > 40 ? "text-yellow-400" : "text-red-400"}>
                  {item.score}/100
                </span>
              </div>
              <div className="h-2 w-full bg-edge rounded-full overflow-hidden">
                <motion.div 
                  className={`h-full rounded-full ${item.score > 75 ? "bg-green-500" : item.score > 40 ? "bg-yellow-500" : "bg-red-500"}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${item.score}%` }}
                  transition={{ duration: 1, delay: 0.2 }}
                />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
