import Link from "next/link";
import { cardSpecs, tierLabel } from "@/lib/spec-display";
import type { Product, Software } from "@/lib/queries";

// Product Card (design system seção 7): título, design_score, 1 spec de
// destaque; o hover revela a 2ª spec — profundidade real, não troca de cor.

// Marcador de item descontinuado na listagem (roadmap #21). Deliberadamente
// discreto: informa sem transformar o card em alerta.
function DiscontinuedTag() {
  return (
    <span className="mt-1.5 inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-warn">
      <span aria-hidden className="h-1 w-1 rounded-full bg-warn" />
      Discontinued
    </span>
  );
}

export function ProductCard({ product, href }: { product: Product; href: string }) {
  const { primary, secondary } = cardSpecs(product.specs);
  const tier = tierLabel(product.specs);

  return (
    <Link
      href={href}
      data-spot
      data-tilt
      className="spot-card glow-hover tilt group flex flex-col justify-between rounded-lg border border-edge bg-surface p-5 hover:border-edge-strong"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-display font-semibold leading-snug">{product.title}</h3>
          {product.brand ? <p className="mt-0.5 text-sm text-dim">{product.brand}</p> : null}
          {product.status === "archived" ? <DiscontinuedTag /> : null}
        </div>
        {product.design_score !== null ? (
          <div className="shrink-0 text-right leading-none">
            <span className="font-mono text-lg tabular-nums text-accent-bright">
              {product.design_score.toFixed(1)}
            </span>
            <span className="font-mono text-xs text-faint">/10</span>
          </div>
        ) : null}
      </div>

      {product.image_url ? (
        <div className="mt-4 flex h-32 items-center justify-center p-2">
          <img
            src={product.image_url}
            alt={product.title}
            className="max-h-full w-auto object-contain mix-blend-screen"
            loading="lazy"
          />
        </div>
      ) : null}

      <div className="mt-6 space-y-2">
        {primary ? (
          <div className="flex items-baseline justify-between gap-3 text-sm">
            <span className="text-dim">{primary.label}</span>
            <span className="font-mono tabular-nums">{primary.value}</span>
          </div>
        ) : null}

        {/* Camada dupla: tier visível; hover desliza a 2ª spec para cima */}
        <div className="relative h-5 overflow-hidden text-sm">
          <div className="absolute inset-x-0 transition-transform duration-300 ease-flow group-hover:-translate-y-5">
            <span className="font-mono text-xs uppercase tracking-[0.14em] text-faint">
              {tier ?? "—"}
            </span>
          </div>
          <div className="absolute inset-x-0 flex translate-y-5 items-baseline justify-between gap-3 transition-transform duration-300 ease-flow group-hover:translate-y-0">
            {secondary ? (
              <>
                <span className="text-dim">{secondary.label}</span>
                <span className="font-mono tabular-nums">{secondary.value}</span>
              </>
            ) : (
              <span className="font-mono text-xs uppercase tracking-[0.14em] text-accent-bright">
                View →
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

export function SoftwareCard({ software, href }: { software: Software; href: string }) {
  return (
    <Link
      href={href}
      data-spot
      data-tilt
      className="spot-card glow-hover tilt group flex flex-col justify-between rounded-lg border border-edge bg-surface p-5 hover:border-edge-strong"
    >
      <div>
        <h3 className="font-display font-semibold leading-snug">{software.name}</h3>
        {software.status === "archived" ? <DiscontinuedTag /> : null}
        {software.description ? (
          <p className="mt-1 line-clamp-2 text-sm text-dim">{software.description}</p>
        ) : null}
      </div>

      {software.image_url ? (
        <div className="mt-4 flex h-32 items-center justify-center p-2">
          <img
            src={software.image_url}
            alt={software.name}
            className="max-h-full w-auto object-contain mix-blend-screen"
            loading="lazy"
          />
        </div>
      ) : null}

      <div className="relative mt-6 h-5 overflow-hidden text-sm">
        <div className="absolute inset-x-0 flex items-baseline justify-between gap-3 transition-transform duration-300 ease-flow group-hover:-translate-y-5">
          <span className="font-mono text-xs uppercase tracking-[0.14em] text-faint">
            {software.pricing_model ?? "—"}
          </span>
          {software.price_text ? (
            <span className="font-mono tabular-nums text-dim">{software.price_text}</span>
          ) : null}
        </div>
        <div className="absolute inset-x-0 translate-y-5 transition-transform duration-300 ease-flow group-hover:translate-y-0">
          <span className="font-mono text-xs uppercase tracking-[0.14em] text-accent-bright">
            View →
          </span>
        </div>
      </div>
    </Link>
  );
}
