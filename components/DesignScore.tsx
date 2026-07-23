import { Zap } from "lucide-react";

export function DesignScore({ score }: { score: number }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-accent/20 bg-accent/5 p-3 w-16">
      <span className="font-display text-xl font-bold text-accent">{score}</span>
      <span className="text-[10px] uppercase tracking-wider text-accent-bright font-mono">Score</span>
    </div>
  );
}
