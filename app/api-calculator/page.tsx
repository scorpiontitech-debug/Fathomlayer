import type { Metadata } from "next";
import { ApiOptimizer } from "@/components/calculator/ApiOptimizer";

export const metadata: Metadata = {
  title: "AI API Economics Optimizer",
  description:
    "Calculate and rank the exact monthly costs for OpenAI, Anthropic, DeepSeek, and Gemini based on your traffic.",
  alternates: { canonical: "/api-calculator" },
};

export default function ApiCalculatorPage() {
  return (
    <div className="space-y-12 pb-24">
      <header className="rise-group max-w-3xl">
        <p className="font-mono text-xs uppercase tracking-[0.22em] text-dim">
          Interactive Utility
        </p>
        <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight sm:text-5xl">
          AI API Economics Optimizer
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-dim">
          Stop burning money on the wrong LLM. Input your expected daily API traffic, and our engine will calculate the exact monthly cost across the top foundation models, ranking them from cheapest to most expensive.
        </p>
      </header>

      <div className="reveal">
        <ApiOptimizer />
      </div>

      <section className="reveal max-w-2xl border-t border-edge pt-12">
        <h2 className="font-display text-2xl font-semibold tracking-tight">
          How this calculation works
        </h2>
        <div className="mt-4 space-y-4 text-sm leading-relaxed text-dim">
          <p>
            This calculator uses the exact raw token pricing directly from the providers (OpenAI, Anthropic, Google, and DeepSeek) as of 2026.
          </p>
          <p>
            It assumes a 30-day billing cycle. It does <strong>not</strong> account for advanced discounting mechanics like Anthropic's Prompt Caching, OpenAI's Batch API (which cuts costs by 50%), or fine-tuned model pricing, as those vary heavily based on implementation.
          </p>
          <p>
            If you are building an agentic workflow with high token velocity, consider evaluating the speed and reasoning capabilities (which you can find in our Software Index) alongside the raw cost.
          </p>
        </div>
      </section>
    </div>
  );
}
