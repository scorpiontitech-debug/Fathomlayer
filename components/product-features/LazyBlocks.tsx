"use client";

import dynamic from "next/dynamic";

// Fronteira de cliente só para carregar sob demanda os blocos pesados da
// página de produto. `ssr: false` exige um Client Component — a página em si
// é Server Component e não pode declarar isso.
//
// Motivo: a página de produto carregava 408 kB de JS, quatro vezes o bundle
// compartilhado. DigitalTwinViewer sozinho arrasta Three.js + GSAP para todas
// as 76 páginas, mesmo aparecendo só em wearables. As calculadoras e o chat
// ficam abaixo da dobra e quase nunca são abertos.

const Skeleton = ({ height }: { height: number }) => (
  <div
    aria-hidden
    className="w-full animate-pulse rounded-xl border border-edge bg-surface/40"
    style={{ height }}
  />
);

export const DigitalTwinViewer = dynamic(
  () => import("@/components/DigitalTwinViewer").then((m) => m.DigitalTwinViewer),
  { ssr: false, loading: () => <Skeleton height={200} /> }
);

export const ConsultantChat = dynamic(
  () => import("@/components/ConsultantChat").then((m) => m.ConsultantChat),
  { ssr: false, loading: () => <Skeleton height={320} /> }
);

export const ProROICalculator = dynamic(
  () => import("@/components/tools/ProROICalculator").then((m) => m.ProROICalculator),
  { ssr: false, loading: () => <Skeleton height={280} /> }
);

export const EcosystemTCO = dynamic(
  () => import("@/components/tools/EcosystemTCO").then((m) => m.EcosystemTCO),
  { ssr: false, loading: () => <Skeleton height={280} /> }
);
