import Link from "next/link";

const PODS = [
  {
    locked: "iCloud / Google Photos",
    solution: "Local NAS + Immich",
    description: "Self-hosted photo backup with AI face recognition, identical to Google Photos but running on your own hardware.",
    difficulty: "Medium",
    cost: "~$300 one-time",
  },
  {
    locked: "AirPods Pro",
    solution: "Wired IEMs + Qudelix 5K",
    description: "Audiophile grade sound, repairable, battery-less earpieces, and platform-agnostic Bluetooth streaming.",
    difficulty: "Low",
    cost: "~$150",
  },
  {
    locked: "Apple Watch / Galaxy Watch",
    solution: "Garmin / Oura Ring",
    description: "Health metrics that export easily, battery life measured in weeks instead of hours, zero platform dependency.",
    difficulty: "Low",
    cost: "~$299+",
  },
  {
    locked: "HomeKit / Google Home",
    solution: "Home Assistant Green",
    description: "Local-first smart home hub. Everything works even when the internet goes down. Matter/Thread native.",
    difficulty: "Medium",
    cost: "~$99",
  }
];

export function EscapePodsShelf() {
  return (
    <div className="relative border-y border-edge py-16 my-16">
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-accent/5 to-transparent pointer-events-none" />
      
      <div className="max-w-xl mb-12">
        <h2 className="font-display text-3xl font-semibold tracking-tight mb-4 text-ink">The Escape Pods</h2>
        <p className="text-dim leading-relaxed">
          Trapped in a walled garden? Here are the highest-rated agnostic alternatives that prioritize 
          open standards, repairability, and data sovereignty.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {PODS.map((pod, i) => (
          <div key={i} className="flex flex-col h-full bg-surface border border-edge rounded-2xl p-6 relative group hover:border-accent-bright transition-colors">
            <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-green-500/50 shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
            
            <div className="mb-4">
              <span className="text-[10px] font-mono uppercase tracking-widest text-faint block mb-1">Escape from</span>
              <span className="line-through text-dim text-sm">{pod.locked}</span>
            </div>
            
            <h3 className="font-display text-lg font-semibold text-ink mb-3">{pod.solution}</h3>
            <p className="text-sm text-dim leading-relaxed flex-grow">{pod.description}</p>
            
            <div className="mt-6 pt-4 border-t border-edge flex justify-between items-center text-xs font-mono">
              <span className="text-faint">Diff: <span className={pod.difficulty === 'Low' ? 'text-green-400' : 'text-yellow-400'}>{pod.difficulty}</span></span>
              <span className="text-faint">{pod.cost}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
