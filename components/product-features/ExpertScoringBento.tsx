export function ExpertScoringBento({
  overall,
  performance,
  battery,
  value
}: {
  overall?: number;
  performance?: number;
  battery?: number;
  value?: number;
}) {
  if (!overall && !performance && !battery && !value) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Big Score */}
      <div className="rounded-xl border border-edge bg-surface/50 p-6 flex flex-col items-center justify-center text-center">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-faint mb-2">Fathom Score</p>
        <div className="relative flex items-center justify-center w-32 h-32 rounded-full border-4 border-edge-strong">
          <svg className="absolute inset-0 w-full h-full -rotate-90">
            <circle cx="60" cy="60" r="58" fill="none" stroke="currentColor" strokeWidth="4" className="text-accent-bright" strokeDasharray="364" strokeDashoffset={364 - (364 * (overall || 0)) / 10} />
          </svg>
          <span className="font-display text-5xl font-bold tracking-tighter text-strong">
            {overall?.toFixed(1) || 'N/A'}
          </span>
        </div>
      </div>

      {/* Breakdown */}
      <div className="rounded-xl border border-edge bg-surface/50 p-6 flex flex-col justify-center gap-6">
        {performance !== undefined && performance !== null && (
          <div>
            <div className="flex justify-between text-xs mb-1.5 font-mono uppercase tracking-widest text-dim">
              <span>Performance</span>
              <span className="text-strong">{performance.toFixed(1)}</span>
            </div>
            <div className="h-1.5 w-full bg-edge-strong rounded-full overflow-hidden">
              <div className="h-full bg-blue-400 rounded-full" style={{ width: `${performance * 10}%` }} />
            </div>
          </div>
        )}
        {battery !== undefined && battery !== null && (
          <div>
            <div className="flex justify-between text-xs mb-1.5 font-mono uppercase tracking-widest text-dim">
              <span>Battery & Life</span>
              <span className="text-strong">{battery.toFixed(1)}</span>
            </div>
            <div className="h-1.5 w-full bg-edge-strong rounded-full overflow-hidden">
              <div className="h-full bg-emerald-400 rounded-full" style={{ width: `${battery * 10}%` }} />
            </div>
          </div>
        )}
        {value !== undefined && value !== null && (
          <div>
            <div className="flex justify-between text-xs mb-1.5 font-mono uppercase tracking-widest text-dim">
              <span>Value for Money</span>
              <span className="text-strong">{value.toFixed(1)}</span>
            </div>
            <div className="h-1.5 w-full bg-edge-strong rounded-full overflow-hidden">
              <div className="h-full bg-purple-400 rounded-full" style={{ width: `${value * 10}%` }} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
