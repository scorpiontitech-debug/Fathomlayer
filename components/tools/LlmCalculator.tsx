"use client";

import { useState } from "react";

type ModelPricing = {
  id: string;
  name: string;
  provider: string;
  inputCostPerM: number;
  outputCostPerM: number;
  contextWindow: string;
};

const MODELS: ModelPricing[] = [
  { id: "claude-3-5-sonnet", name: "Claude 3.5 Sonnet", provider: "Anthropic", inputCostPerM: 3.00, outputCostPerM: 15.00, contextWindow: "200K" },
  { id: "gpt-4o", name: "GPT-4o", provider: "OpenAI", inputCostPerM: 5.00, outputCostPerM: 15.00, contextWindow: "128K" },
  { id: "gpt-4o-mini", name: "GPT-4o mini", provider: "OpenAI", inputCostPerM: 0.15, outputCostPerM: 0.60, contextWindow: "128K" },
  { id: "gemini-1-5-pro", name: "Gemini 1.5 Pro", provider: "Google", inputCostPerM: 3.50, outputCostPerM: 10.50, contextWindow: "2M" },
  { id: "gemini-1-5-flash", name: "Gemini 1.5 Flash", provider: "Google", inputCostPerM: 0.075, outputCostPerM: 0.30, contextWindow: "1M" },
];

export function LlmCalculator() {
  const [inputTokens, setInputTokens] = useState<number>(100000);
  const [outputTokens, setOutputTokens] = useState<number>(10000);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 3,
      maximumFractionDigits: 3,
    }).format(value);
  };

  return (
    <div className="reveal mt-12 overflow-hidden rounded-2xl border border-edge bg-surface/50 p-6 md:p-10">
      <div className="mb-8 max-w-2xl">
        <h2 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">
          LLM Token Calculator
        </h2>
        <p className="mt-2 text-dim">
          Estimate API costs across major foundational models. Enter your expected usage to see real-time price comparisons.
        </p>
      </div>

      <div className="grid gap-10 lg:grid-cols-12">
        {/* Controls */}
        <div className="space-y-6 lg:col-span-4">
          <div>
            <label className="mb-2 block font-mono text-xs uppercase tracking-widest text-faint">
              Input Tokens (Millions)
            </label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="0.1"
                max="10"
                step="0.1"
                aria-label="Input Tokens in millions"
                value={inputTokens / 1000000}
                onChange={(e) => setInputTokens(parseFloat(e.target.value) * 1000000)}
                className="w-full accent-accent"
              />
              <span className="w-16 text-right font-mono text-sm font-medium text-ink">
                {(inputTokens / 1000000).toFixed(1)}M
              </span>
            </div>
          </div>

          <div>
            <label className="mb-2 block font-mono text-xs uppercase tracking-widest text-faint">
              Output Tokens (Millions)
            </label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="0.1"
                max="5"
                step="0.1"
                aria-label="Output Tokens in millions"
                value={outputTokens / 1000000}
                onChange={(e) => setOutputTokens(parseFloat(e.target.value) * 1000000)}
                className="w-full accent-accent"
              />
              <span className="w-16 text-right font-mono text-sm font-medium text-ink">
                {(outputTokens / 1000000).toFixed(1)}M
              </span>
            </div>
          </div>
          
          <div className="rounded-lg border border-edge/50 bg-surface p-4">
             <p className="text-xs leading-relaxed text-faint">
               Prices are based on standard API rates and do not include batch discounts or cached prompt savings (e.g. Anthropic Prompt Caching).
             </p>
          </div>
        </div>

        {/* Results */}
        <div className="lg:col-span-8">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-edge">
                  <th className="pb-3 font-mono text-xs font-normal uppercase tracking-widest text-faint">Model</th>
                  <th className="pb-3 text-right font-mono text-xs font-normal uppercase tracking-widest text-faint">Context</th>
                  <th className="pb-3 text-right font-mono text-xs font-normal uppercase tracking-widest text-faint">Cost</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-edge/50">
                {MODELS.map((model) => {
                  const cost =
                    (inputTokens / 1000000) * model.inputCostPerM +
                    (outputTokens / 1000000) * model.outputCostPerM;
                  
                  return (
                    <tr key={model.id} className="group transition-colors hover:bg-surface">
                      <td className="py-4">
                        <div className="flex items-center gap-3">
                          <span className="font-medium text-ink">{model.name}</span>
                          <span className="hidden rounded-full border border-edge bg-surface/50 px-2 py-0.5 text-[10px] text-faint sm:inline-block">
                            {model.provider}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 text-right">
                        <span className="font-mono text-dim">{model.contextWindow}</span>
                      </td>
                      <td className="py-4 text-right">
                        <span className="font-mono text-lg font-medium text-accent-bright">
                          {formatCurrency(cost)}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
