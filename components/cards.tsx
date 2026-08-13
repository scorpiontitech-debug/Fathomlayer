import Link from "next/link";
import Image from "next/image";
import { cardSpecs, tierLabel } from "@/lib/spec-display";
import type { Product, Software } from "@/lib/queries";

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
      className="spot-card glow-hover tilt group flex flex-col rounded-xl border border-edge bg-surface overflow-hidden hover:border-edge-strong transition-all duration-300"
    >
      {/* Hero Image Stage */}
      {product.image_url ? (
        <div className="relative aspect-[4/3] w-full overflow-hidden border-b border-edge">
          <Image
            src={product.image_url}
            alt={product.title}
            fill
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
        </div>
      ) : (
        <div className="aspect-[4/3] w-full border-b border-edge bg-edge/10 flex items-center justify-center">
          <span className="text-faint font-mono text-xs uppercase tracking-widest">No Image</span>
        </div>
      )}

      {/* Content */}
      <div className="flex flex-1 flex-col justify-between p-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="font-display font-semibold leading-snug">{product.title}</h3>
            {product.brand ? <p className="mt-1 text-sm text-dim">{product.brand}</p> : null}
            {product.status === "archived" ? <DiscontinuedTag /> : null}
          </div>
          {product.design_score !== null ? (
            <div className="shrink-0 text-right leading-none">
              <span className="font-mono text-lg tabular-nums text-accent-bright">
                {product.design_score.toFixed(1)}
              </span>
              <span className="font-mono text-[10px] text-faint block mt-1 uppercase tracking-widest">Score</span>
            </div>
          ) : null}
        </div>

        <div className="mt-8 space-y-3 pt-4 border-t border-edge/50">
          {primary ? (
            <div className="flex items-baseline justify-between gap-3 text-sm">
              <span className="text-dim">{primary.label}</span>
              <span className="font-mono tabular-nums text-ink">{primary.value}</span>
            </div>
          ) : null}

          {/* Camada dupla: tier visível; hover desliza a 2ª spec para cima */}
          <div className="relative h-5 overflow-hidden text-sm">
            <div className="absolute inset-x-0 transition-transform duration-300 ease-flow group-hover:-translate-y-5">
              <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-faint">
                {tier ?? "—"}
              </span>
            </div>
            <div className="absolute inset-x-0 flex translate-y-5 items-baseline justify-between gap-3 transition-transform duration-300 ease-flow group-hover:translate-y-0">
              {secondary ? (
                <>
                  <span className="text-dim">{secondary.label}</span>
                  <span className="font-mono tabular-nums text-ink">{secondary.value}</span>
                </>
              ) : (
                <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-accent-bright">
                  View Details →
                </span>
              )}
            </div>
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
      className="spot-card glow-hover tilt group flex flex-col rounded-xl border border-edge bg-surface overflow-hidden hover:border-edge-strong transition-all duration-300"
    >
      {/* Hero Image Stage */}
      {software.image_url ? (
        <div className="relative aspect-[4/3] w-full overflow-hidden border-b border-edge">
          <Image
            src={software.image_url}
            alt={software.name}
            fill
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
        </div>
      ) : (
        <div className="aspect-[4/3] w-full border-b border-edge bg-edge/10 flex items-center justify-center">
          <span className="text-faint font-mono text-xs uppercase tracking-widest">No Image</span>
        </div>
      )}

      <div className="flex flex-1 flex-col justify-between p-6">
        <div>
          <h3 className="font-display font-semibold leading-snug text-lg">{software.name}</h3>
          {software.status === "archived" ? <DiscontinuedTag /> : null}
          {software.description ? (
            <p className="mt-2 line-clamp-2 text-sm text-dim leading-relaxed">{software.description}</p>
          ) : null}
        </div>

        <div className="relative mt-8 pt-4 border-t border-edge/50 h-9 overflow-hidden text-sm">
          <div className="absolute inset-x-0 flex items-baseline justify-between gap-3 transition-transform duration-300 ease-flow group-hover:-translate-y-9">
            <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-faint">
              {software.pricing_model ?? "—"}
            </span>
            {software.price_text ? (
              <span className="font-mono tabular-nums text-dim">{software.price_text}</span>
            ) : null}
          </div>
          <div className="absolute inset-x-0 translate-y-9 transition-transform duration-300 ease-flow group-hover:translate-y-0">
            <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-accent-bright">
              View Details →
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
