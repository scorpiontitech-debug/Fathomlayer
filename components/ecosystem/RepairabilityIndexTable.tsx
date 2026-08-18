"use client";

import { motion } from "framer-motion";

const DEVICES = [
  { rank: 1, name: "Fairphone 5", brand: "Fairphone", ifixit: 10, supportYears: 8, costPerYear: "$87", notes: "Modular design, battery replaced in seconds." },
  { rank: 2, name: "Google Pixel 8", brand: "Google", ifixit: 7, supportYears: 7, costPerYear: "$99", notes: "Official parts available on iFixit, 7 years OS updates." },
  { rank: 3, name: "Samsung Galaxy S24", brand: "Samsung", ifixit: 6, supportYears: 7, costPerYear: "$114", notes: "Difficult to open but long software lifecycle." },
  { rank: 4, name: "iPhone 15", brand: "Apple", ifixit: 4, supportYears: 5, costPerYear: "$159", notes: "Parts pairing limits independent repair heavily." },
  { rank: 5, name: "AirPods Pro", brand: "Apple", ifixit: 0, supportYears: 3, costPerYear: "$83", notes: "Unopenable. Designed as consumable e-waste." }
];

export function RepairabilityIndexTable() {
  return (
    <div className="bg-[#0a0a0b] border border-edge rounded-3xl p-8 overflow-x-auto">
      <div className="max-w-2xl mb-8">
        <h2 className="font-display text-3xl font-semibold tracking-tight mb-4">Hardware Repairability Index</h2>
        <p className="text-dim leading-relaxed">
          The ultimate hidden cost of an ecosystem is planned obsolescence. Devices with low repair scores become e-waste faster, inflating your long-term ownership costs.
        </p>
      </div>

      <table className="w-full text-left border-collapse min-w-[800px]">
        <thead>
          <tr className="border-b border-edge">
            <th className="py-4 px-4 font-mono text-xs uppercase tracking-widest text-faint font-normal">Rank</th>
            <th className="py-4 px-4 font-mono text-xs uppercase tracking-widest text-faint font-normal">Device</th>
            <th className="py-4 px-4 font-mono text-xs uppercase tracking-widest text-faint font-normal">iFixit Score</th>
            <th className="py-4 px-4 font-mono text-xs uppercase tracking-widest text-faint font-normal">Software Support</th>
            <th className="py-4 px-4 font-mono text-xs uppercase tracking-widest text-faint font-normal">TCO / Year</th>
            <th className="py-4 px-4 font-mono text-xs uppercase tracking-widest text-faint font-normal">Notes</th>
          </tr>
        </thead>
        <tbody>
          {DEVICES.map((device, i) => (
            <motion.tr 
              key={device.name}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="border-b border-edge/50 hover:bg-surface/30 transition-colors"
            >
              <td className="py-4 px-4 text-dim font-mono">{device.rank}</td>
              <td className="py-4 px-4">
                <div className="font-semibold text-ink">{device.name}</div>
                <div className="text-xs text-faint">{device.brand}</div>
              </td>
              <td className="py-4 px-4">
                <div className="flex items-center gap-2">
                  <div className="w-24 h-1.5 bg-surface rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${device.ifixit >= 7 ? 'bg-green-500' : device.ifixit >= 4 ? 'bg-yellow-500' : 'bg-red-500'}`} 
                      style={{ width: `${(device.ifixit / 10) * 100}%` }}
                    />
                  </div>
                  <span className="font-mono text-sm">{device.ifixit}/10</span>
                </div>
              </td>
              <td className="py-4 px-4">
                <span className="inline-flex items-center px-2 py-1 rounded-md bg-surface text-sm border border-edge">
                  {device.supportYears} Years
                </span>
              </td>
              <td className="py-4 px-4 font-mono text-accent-bright">{device.costPerYear}</td>
              <td className="py-4 px-4 text-sm text-dim max-w-[200px]">{device.notes}</td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
