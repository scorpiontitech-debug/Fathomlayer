import { motion } from "framer-motion";

const METRICS = [
  { service: "Apple Health", portability: 80, notes: "Allows full XML export, but schemas are complex." },
  { service: "Google Fit", portability: 90, notes: "Google Takeout provides JSON/CSV easily." },
  { service: "iCloud Photos", portability: 40, notes: "Metadata (albums/edits) often lost when exporting outside Apple." },
  { service: "Google Photos", portability: 50, notes: "Takeout splits metadata into separate JSON files, hard to merge." },
  { service: "Spotify", portability: 20, notes: "No native playlist export. Requires 3rd party tools." },
  { service: "Oura", portability: 85, notes: "Web dashboard allows full CSV export of all biometric data." },
];

export function DataPortabilityMatrix() {
  return (
    <div className="bg-surface/50 border border-edge rounded-3xl p-8 backdrop-blur-md">
      <div className="flex flex-col md:flex-row gap-8 mb-8">
        <div className="flex-1">
          <h2 className="font-display text-2xl font-semibold tracking-tight mb-2">Data Portability Friction</h2>
          <p className="text-dim text-sm leading-relaxed">
            Ecosystems keep you locked in by making data migration painful. We score how easily you can 
            extract your data in an open, usable format (CSV, JSON, XML) without losing metadata.
          </p>
        </div>
        <div className="flex items-end gap-4 text-xs font-mono uppercase tracking-widest text-faint">
          <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-red-500" /> Hostage</div>
          <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-yellow-500" /> Friction</div>
          <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-green-500" /> Portable</div>
        </div>
      </div>

      <div className="space-y-4">
        {METRICS.map((item, i) => {
          const isGood = item.portability >= 75;
          const isBad = item.portability <= 40;
          const colorClass = isGood ? "bg-green-500" : isBad ? "bg-red-500" : "bg-yellow-500";
          const textColor = isGood ? "text-green-400" : isBad ? "text-red-400" : "text-yellow-400";

          return (
            <div key={i} className="flex flex-col sm:flex-row sm:items-center gap-4 bg-[#0a0a0b] border border-edge rounded-xl p-4">
              <div className="w-48 font-semibold text-ink">{item.service}</div>
              
              <div className="flex-1">
                <div className="h-1.5 w-full bg-edge rounded-full overflow-hidden">
                  <div className={`h-full ${colorClass}`} style={{ width: `${item.portability}%` }} />
                </div>
                <div className="text-xs text-dim mt-2">{item.notes}</div>
              </div>
              
              <div className={`w-16 text-right font-mono text-sm ${textColor}`}>
                {item.portability}/100
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
