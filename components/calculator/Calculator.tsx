"use client";

import { useEffect, useRef, useState } from "react";
import { ProductCard } from "@/components/cards";
import { CALC_MODELS, TIERS, calculateRequiredVram } from "@/lib/calculator";
import type { Product } from "@/lib/queries";
import type { MemoryVizHandle } from "@/components/three/memoryViz";

export type CalculatorItem = { product: Product; href: string };

// Ferramenta interativa (content-spec seção 4). A seleção é um radio group
// HTML real — teclado nativo; a leitura acessível é a lista de escalões.
// O canvas 3D é reforço visual, aria-hidden, com dados espelhados em HTML.
export function Calculator({ items }: { items: CalculatorItem[] }) {
  const [modelId, setModelId] = useState("gemma-3-27b");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const vizRef = useRef<MemoryVizHandle | null>(null);
  const [vizReady, setVizReady] = useState(false);

  const model = CALC_MODELS.find((m) => m.id === modelId) ?? CALC_MODELS[0];
  const matches = items.filter(({ product }) => product.tags.includes(model.tag));
  const vramQ4 = calculateRequiredVram(model.paramsBillions, 4);
  const vramQ8 = calculateRequiredVram(model.paramsBillions, 8);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { createMemoryViz } = await import("@/components/three/memoryViz");
        if (cancelled || !canvasRef.current) return;
        vizRef.current = createMemoryViz(canvasRef.current);
        setVizReady(true);
      } catch (error) {
        // Sem WebGL: a lista de escalões em HTML carrega a informação inteira.
        console.error("[fathom-layer] memory viz init failed:", error);
      }
    })();
    return () => {
      cancelled = true;
      vizRef.current?.dispose();
      vizRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (vizReady) vizRef.current?.setModelTier(model.minTier);
  }, [vizReady, model.minTier]);

  return (
    <div className="space-y-12">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,360px)_1fr]">
        {/* Seleção de modelo */}
        <fieldset>
          <legend className="font-mono text-xs uppercase tracking-[0.18em] text-dim">
            Pick a model to run locally
          </legend>
          <div className="mt-4 space-y-1.5">
            {CALC_MODELS.map((m) => {
              const active = m.id === model.id;
              return (
                <label
                  key={m.id}
                  data-spot
                  className={`spot-card flex cursor-pointer items-baseline justify-between gap-3 rounded-md border px-4 py-2.5 transition-[border-color,background-color,transform] duration-300 ease-out-expo hover:translate-x-1 ${
                    active
                      ? "border-accent-bright bg-accent-soft"
                      : "border-edge bg-surface hover:border-edge-strong"
                  }`}
                >
                  <span className="flex items-baseline gap-2.5">
                    <input
                      type="radio"
                      name="calc-model"
                      value={m.id}
                      checked={active}
                      onChange={() => setModelId(m.id)}
                      className="sr-only"
                    />
                    <span
                      aria-hidden
                      className={`inline-block h-2 w-2 shrink-0 self-center rounded-full transition-colors ${
                        active ? "bg-accent-bright" : "bg-edge-strong"
                      }`}
                    />
                    <span className={active ? "font-medium" : "text-dim"}>{m.label}</span>
                  </span>
                  <span className="font-mono text-xs tabular-nums text-faint">{m.params}</span>
                </label>
              );
            })}
          </div>
        </fieldset>

        {/* Volumetria + espelho HTML */}
        <div className="space-y-4">
          <div className="relative aspect-[16/10] overflow-hidden rounded-lg border border-edge bg-surface">
            <canvas
              ref={canvasRef}
              aria-hidden
              className={`h-full w-full cursor-grab touch-none active:cursor-grabbing transition-opacity duration-500 ${
                vizReady ? "opacity-100" : "opacity-0"
              }`}
            />
            <p className="pointer-events-none absolute bottom-3 left-4 font-mono text-[10px] uppercase tracking-[0.18em] text-faint">
              Memory per tier · drag to rotate
            </p>
          </div>

          <div className="flex justify-between rounded-lg border border-accent bg-accent-soft p-4">
            <div>
              <p className="text-sm font-medium text-ink">Mathematical Requirement</p>
              <p className="mt-1 text-xs text-dim">Based on model architecture & context window</p>
            </div>
            <div className="text-right">
              <p className="font-mono text-sm font-bold text-accent-bright">{vramQ4} GB VRAM</p>
              <p className="font-mono text-[10px] uppercase text-faint">Using 4-bit Quantization</p>
            </div>
          </div>

          <ul className="grid gap-px overflow-hidden rounded-lg border border-edge bg-edge sm:grid-cols-2">
            {TIERS.map((tier, i) => {
              const fits = i >= model.minTier;
              return (
                <li key={tier.id} className="flex items-center justify-between gap-3 bg-bg px-4 py-3">
                  <div>
                    <p className="text-sm font-medium">{tier.label}</p>
                    <p className="font-mono text-xs tabular-nums text-faint">
                      {tier.memoryGb} GB {tier.memoryKind}
                    </p>
                  </div>
                  <span
                    className={`font-mono text-[11px] uppercase tracking-[0.14em] ${
                      fits ? "text-accent-bright" : "text-faint"
                    }`}
                  >
                    {fits ? "Runs it" : "Not enough"}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      {/* Recomendações reais do índice */}
      <section className="space-y-4">
        <div className="flex items-baseline justify-between gap-3">
          <h2 className="font-display text-xl font-semibold tracking-tight">
            Hardware from the index that runs {model.label}
          </h2>
          <span className="font-mono text-xs tabular-nums text-faint">
            {matches.length} match{matches.length === 1 ? "" : "es"}
          </span>
        </div>
        {matches.length > 0 ? (
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {matches.map(({ product, href }) => (
              <li key={product.id}>
                <ProductCard product={product} href={href} />
              </li>
            ))}
          </ul>
        ) : (
          <div className="rounded-lg border border-edge bg-surface px-6 py-10 text-center">
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-faint">
              In curation
            </p>
            <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-dim">
              Hardware picks for this model are in final editorial review and will appear here
              as items are published.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
