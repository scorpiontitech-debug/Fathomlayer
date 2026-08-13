import React from "react";
import { AlertCircle, Battery, Cpu, Box, PenTool, CheckCircle2 } from "lucide-react";

export function LifecycleBadge({ status }: { status?: string | null }) {
  if (!status) return null;

  const config = {
    buy_now: {
      color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
      icon: <CheckCircle2 className="w-4 h-4" />,
      label: "Buy Now",
      desc: "Great time to buy. Recently updated or priced well.",
    },
    dont_buy_updates_soon: {
      color: "text-red-500 bg-red-500/10 border-red-500/20",
      icon: <AlertCircle className="w-4 h-4" />,
      label: "Wait",
      desc: "Update expected soon. Hold your purchase.",
    },
    neutral: {
      color: "text-amber-500 bg-amber-500/10 border-amber-500/20",
      icon: <AlertCircle className="w-4 h-4" />,
      label: "Mid-Cycle",
      desc: "Good product, but halfway through its lifecycle.",
    },
  }[status];

  if (!config) return null;

  return (
    <div className={`flex items-start gap-3 p-4 rounded-xl border ${config.color} mb-6`}>
      <div className="mt-0.5">{config.icon}</div>
      <div>
        <h4 className="font-mono text-sm uppercase tracking-wider font-semibold">
          {config.label}
        </h4>
        <p className="text-sm opacity-80 mt-1">{config.desc}</p>
      </div>
    </div>
  );
}

export function FathomScores({
  design,
  battery,
  value,
  performance,
}: {
  design?: number | null;
  battery?: number | null;
  value?: number | null;
  performance?: number | null;
}) {
  const scores = [
    { label: "Performance", value: performance },
    { label: "Battery/Efficiency", value: battery },
    { label: "Value", value: value },
    { label: "Design & Build", value: design },
  ].filter((s) => s.value !== null && s.value !== undefined) as { label: string; value: number }[];

  if (scores.length === 0) return null;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      {scores.map((s, i) => (
        <div key={i} className="rounded-xl border border-edge bg-surface/50 p-4 flex flex-col items-center justify-center text-center">
          <span className="font-mono text-xs uppercase tracking-widest text-faint mb-2">{s.label}</span>
          <span className="font-mono text-3xl tabular-nums text-accent-bright">{s.value.toFixed(1)}</span>
        </div>
      ))}
    </div>
  );
}

export function HumanTranslation({ data }: { data: any }) {
  if (!data || typeof data !== 'object' || Object.keys(data).length === 0) return null;

  return (
    <section className="mb-12 reveal">
      <h2 className="font-display text-xl font-semibold tracking-tight mb-6">What this means for you</h2>
      <div className="grid gap-4 md:grid-cols-2">
        {Object.entries(data).map(([key, value]) => (
          <div key={key} className="p-5 rounded-2xl bg-surface border border-edge">
            <h4 className="font-semibold text-sm text-dim mb-2">{key}</h4>
            <p className="text-sm leading-relaxed">{String(value)}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export function PurchaseEssentials({
  colors,
  inTheBox,
  repairability,
}: {
  colors?: string[] | null;
  inTheBox?: string[] | null;
  repairability?: number | null;
}) {
  const hasContent = (colors && colors.length > 0) || (inTheBox && inTheBox.length > 0) || repairability !== null;
  if (!hasContent) return null;

  return (
    <section className="mb-12 reveal">
      <h2 className="font-display text-xl font-semibold tracking-tight mb-6">Purchase Essentials</h2>
      <div className="grid md:grid-cols-3 gap-4">
        
        {inTheBox && inTheBox.length > 0 && (
          <div className="p-5 rounded-xl border border-edge bg-surface/30">
            <div className="flex items-center gap-2 mb-4 text-dim">
              <Box className="w-4 h-4" />
              <h4 className="font-mono text-xs uppercase tracking-widest">In the Box</h4>
            </div>
            <ul className="space-y-2">
              {inTheBox.map((item, i) => (
                <li key={i} className="text-sm flex items-start gap-2">
                  <span className="text-accent-bright mt-0.5">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {colors && colors.length > 0 && (
          <div className="p-5 rounded-xl border border-edge bg-surface/30">
            <div className="flex items-center gap-2 mb-4 text-dim">
              <PenTool className="w-4 h-4" />
              <h4 className="font-mono text-xs uppercase tracking-widest">Colors</h4>
            </div>
            <div className="flex flex-wrap gap-2">
              {colors.map((color, i) => (
                <span key={i} className="inline-block px-3 py-1 bg-surface border border-edge rounded-full text-xs font-medium">
                  {color}
                </span>
              ))}
            </div>
          </div>
        )}

        {repairability !== null && repairability !== undefined && (
          <div className="p-5 rounded-xl border border-edge bg-surface/30">
            <div className="flex items-center gap-2 mb-4 text-dim">
              <Cpu className="w-4 h-4" />
              <h4 className="font-mono text-xs uppercase tracking-widest">Repairability</h4>
            </div>
            <div className="flex items-end gap-2">
              <span className="font-mono text-4xl text-ink">{repairability}</span>
              <span className="text-sm text-faint mb-1">/ 10</span>
            </div>
            <p className="text-xs text-dim mt-2">iFixit scale. Higher is easier to repair.</p>
          </div>
        )}

      </div>
    </section>
  );
}
