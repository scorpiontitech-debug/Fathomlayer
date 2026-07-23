"use client";

import { useState } from "react";
import { API_MODELS, type ApiModel } from "@/lib/api-pricing";

export function ApiOptimizer() {
  const [requestsPerDay, setRequestsPerDay] = useState(1000);
  const [inputTokens, setInputTokens] = useState(500);
  const [outputTokens, setOutputTokens] = useState(250);

  // Math
  const daysInMonth = 30;
  const totalRequestsPerMonth = requestsPerDay * daysInMonth;
  const totalInputTokensMillions = (totalRequestsPerMonth * inputTokens) / 1000000;
  const totalOutputTokensMillions = (totalRequestsPerMonth * outputTokens) / 1000000;

  const results = API_MODELS.map((model) => {
    const cost = 
      totalInputTokensMillions * model.inputCostPer1M + 
      totalOutputTokensMillions * model.outputCostPer1M;
    return { model, cost };
  }).sort((a, b) => a.cost - b.cost); // sort cheapest to most expensive

  return (
    <div className="space-y-12">
      <div className="grid gap-8 lg:grid-cols-[300px_1fr]">
        
        {/* Controls */}
        <div className="space-y-6">
          <fieldset className="rounded-xl border border-edge bg-surface p-6 shadow-sm">
            <legend className="font-mono text-[11px] uppercase tracking-[0.18em] text-dim">
              Your API Traffic
            </legend>
            <div className="mt-4 space-y-5">
              
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-ink">Requests per Day</span>
                <input 
                  type="number"
                  min={1}
                  value={requestsPerDay}
                  onChange={(e) => setRequestsPerDay(Number(e.target.value))}
                  className="w-full rounded-md border border-edge-strong bg-bg px-3 py-2 text-sm focus:border-accent-bright focus:outline-none focus:ring-1 focus:ring-accent-bright"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-ink">Avg. Input Tokens / Req</span>
                <input 
                  type="number"
                  min={1}
                  value={inputTokens}
                  onChange={(e) => setInputTokens(Number(e.target.value))}
                  className="w-full rounded-md border border-edge-strong bg-bg px-3 py-2 text-sm focus:border-accent-bright focus:outline-none focus:ring-1 focus:ring-accent-bright"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-ink">Avg. Output Tokens / Req</span>
                <input 
                  type="number"
                  min={1}
                  value={outputTokens}
                  onChange={(e) => setOutputTokens(Number(e.target.value))}
                  className="w-full rounded-md border border-edge-strong bg-bg px-3 py-2 text-sm focus:border-accent-bright focus:outline-none focus:ring-1 focus:ring-accent-bright"
                />
              </label>

            </div>
          </fieldset>

          <div className="rounded-xl border border-edge bg-surface p-6">
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-faint">Monthly Volume</p>
            <div className="mt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-dim">Input Tokens:</span>
                <span className="font-mono tabular-nums">{totalInputTokensMillions.toFixed(2)}M</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-dim">Output Tokens:</span>
                <span className="font-mono tabular-nums">{totalOutputTokensMillions.toFixed(2)}M</span>
              </div>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="space-y-4">
          <div className="flex items-baseline justify-between gap-3 px-2">
            <h2 className="font-display text-xl font-semibold tracking-tight">
              Estimated Monthly Cost
            </h2>
            <span className="font-mono text-xs tabular-nums text-faint">
              {results.length} models ranked
            </span>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {results.map(({ model, cost }, index) => {
              const isWinner = index === 0;
              return (
                <div 
                  key={model.id}
                  className={`group relative overflow-hidden rounded-xl border p-5 transition-all duration-300 ${
                    isWinner 
                      ? "border-accent-bright bg-accent-soft/30 shadow-[0_0_20px_rgba(var(--color-accent-bright),0.1)]" 
                      : "border-edge bg-surface hover:border-edge-strong hover:-translate-y-1"
                  }`}
                >
                  {isWinner && (
                    <div className="absolute right-0 top-0 rounded-bl-lg bg-accent-bright px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-bg">
                      Cheapest
                    </div>
                  )}
                  
                  <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-faint">
                    {model.provider}
                  </p>
                  <h3 className="mt-1 font-display text-lg font-semibold tracking-tight text-ink">
                    {model.name}
                  </h3>
                  <p className="mt-2 text-sm text-dim leading-relaxed min-h-[40px]">
                    {model.description}
                  </p>

                  <div className="mt-6 flex items-end justify-between border-t border-edge pt-4">
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-faint mb-1">Total Cost</p>
                      <p className={`font-mono text-2xl tracking-tight ${isWinner ? "text-accent-bright font-semibold" : "text-ink"}`}>
                        ${cost.toFixed(2)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] uppercase tracking-wider text-faint mb-1">Pricing (In/Out per 1M)</p>
                      <p className="font-mono text-xs text-dim">
                        ${model.inputCostPer1M} / ${model.outputCostPer1M}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
