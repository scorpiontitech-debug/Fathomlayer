import Link from "next/link";

export function MobilityShowcase() {
  return (
    <div className="relative rounded-3xl overflow-hidden bg-surface border border-edge">
      <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay pointer-events-none" />
      
      <div className="grid md:grid-cols-2">
        <div className="p-8 md:p-12 flex flex-col justify-center">
          <div className="inline-flex items-center gap-3 mb-6">
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent-bright border border-accent-bright/30 rounded-full px-3 py-1">
              Mobility Tier
            </span>
          </div>
          <h2 className="font-display text-4xl font-semibold tracking-tight mb-4">
            Cars are Data Centers.
          </h2>
          <p className="text-dim leading-relaxed mb-8">
            The next lock-in isn't in your pocket; it's in your garage. We analyze Electric Vehicles not just by range, 
            but by software openness, ADAS compute hardware, and charging interoperability. 
            Avoid the 4-wheeled walled gardens.
          </p>
          
          <div className="flex flex-wrap gap-4">
            <Link 
              href="/ecosystem/electric-vehicles"
              className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-ink text-surface font-semibold hover:opacity-90 transition-opacity"
            >
              Explore EVs
            </Link>
            <Link 
              href="/ecosystem/ev-charging"
              className="inline-flex items-center justify-center px-6 py-3 rounded-xl border border-edge hover:border-edge-strong transition-colors"
            >
              Charging Infra
            </Link>
          </div>
        </div>
        
        {/* Visual half */}
        <div className="relative min-h-[300px] md:min-h-full bg-[#0a0a0b] border-l border-edge flex items-center justify-center overflow-hidden">
          {/* Abstract EV / Tech visualization */}
          <div className="absolute inset-0 bg-gradient-to-br from-transparent to-accent/10" />
          
          <div className="relative w-64 h-64 border border-edge-strong rounded-full flex items-center justify-center">
            <div className="absolute inset-0 border border-accent-bright/20 rounded-full animate-[spin_10s_linear_infinite]" />
            <div className="absolute inset-4 border border-edge-strong rounded-full flex items-center justify-center">
              <div className="absolute inset-0 border border-accent-bright/40 rounded-full animate-[spin_15s_linear_infinite_reverse]" />
              <div className="w-16 h-16 bg-surface border border-accent-bright rounded-2xl rotate-45 flex items-center justify-center shadow-[0_0_30px_rgba(255,100,50,0.2)]">
                <span className="-rotate-45 font-mono text-xs text-accent-bright">EV</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
