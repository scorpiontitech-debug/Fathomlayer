import { ImageResponse } from "next/og";
import { getProductBySlug, getSoftwareBySlug } from "@/lib/queries";
import { specEntries } from "@/lib/spec-display";

// Cartão de Spec Compartilhável (content-spec 7.9 — "MVP, construir primeiro"):
// gerado via next/og, cacheável, pensado pra Reddit/X. Dobra como og:image.
export const alt = "Fathom Layer spec card";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function SpecCardImage({
  params,
}: {
  params: Promise<{ pillar: string; category: string; slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  const software = product ? null : await getSoftwareBySlug(slug);

  const title = product?.title ?? software?.name ?? "Fathom Layer";
  const score = product?.design_score ?? null;
  const subtitle = product?.brand ?? software?.pricing_model ?? "";
  const specs = specEntries(product?.specs ?? {}).slice(0, 4);
  if (!product && software?.price_text) {
    specs.push({ key: "price", label: "Pricing", value: software.price_text });
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0A0A0B",
          padding: 64,
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <div style={{ width: 48, height: 5, background: "#4D84FF", borderRadius: 3 }} />
            <div style={{ width: 38, height: 5, background: "#8A8A8E", borderRadius: 3 }} />
            <div style={{ width: 48, height: 5, background: "#55555A", borderRadius: 3 }} />
          </div>
          {score !== null ? (
            <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
              <span style={{ fontSize: 72, fontWeight: 700, color: "#4D84FF" }}>
                {score.toFixed(1)}
              </span>
              <span style={{ fontSize: 30, color: "#55555A" }}>/10</span>
            </div>
          ) : null}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <div
            style={{
              fontSize: title.length > 26 ? 54 : 68,
              fontWeight: 700,
              color: "#F5F5F7",
              letterSpacing: -2,
              lineHeight: 1.05,
            }}
          >
            {title}
          </div>
          {subtitle ? <div style={{ fontSize: 28, color: "#8A8A8E" }}>{subtitle}</div> : null}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          {specs.map((spec) => (
            <div
              key={spec.key}
              style={{
                display: "flex",
                justifyContent: "space-between",
                borderTop: "1px solid #2A2A30",
                padding: "14px 0",
                fontSize: 26,
              }}
            >
              <span style={{ color: "#8A8A8E" }}>{spec.label}</span>
              <span style={{ color: "#F5F5F7" }}>{spec.value}</span>
            </div>
          ))}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              borderTop: "1px solid #2A2A30",
              paddingTop: 20,
              fontSize: 22,
              color: "#55555A",
            }}
          >
            <span>fathomlayer.com</span>
            <span>Verified data · Fathom Layer index</span>
          </div>
        </div>
      </div>
    ),
    size
  );
}
