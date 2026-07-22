import { ImageResponse } from "next/og";

// Cartão OG da marca (raiz) — páginas de item têm o próprio spec card.
export const alt = "Fathom Layer — independent technology index";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
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
          padding: 72,
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <div style={{ width: 64, height: 6, background: "#4D84FF", borderRadius: 3 }} />
          <div style={{ width: 52, height: 6, background: "#8A8A8E", borderRadius: 3 }} />
          <div style={{ width: 64, height: 6, background: "#55555A", borderRadius: 3 }} />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ fontSize: 84, fontWeight: 700, color: "#F5F5F7", letterSpacing: -3 }}>
            Fathom Layer
          </div>
          <div style={{ fontSize: 32, color: "#8A8A8E" }}>
            The technology index built on verified numbers.
          </div>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            borderTop: "1px solid #2A2A30",
            paddingTop: 28,
            fontSize: 24,
            color: "#55555A",
          }}
        >
          <span>fathomlayer.com</span>
          <span>No paid rankings · human-reviewed</span>
        </div>
      </div>
    ),
    size
  );
}
