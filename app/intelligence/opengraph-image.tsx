import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Intelligence Hub — Fathom Layer";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#080808", // match bg-background
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "space-between",
          padding: "80px",
          fontFamily: "sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Glow Effects (Simplified for Satori) */}
        <div
          style={{
            position: "absolute",
            top: "-10%",
            right: "-10%",
            width: "600px",
            height: "600px",
            background: "rgba(0, 82, 255, 0.1)",
            borderRadius: "50%",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-20%",
            left: "-10%",
            width: "800px",
            height: "800px",
            background: "rgba(200, 200, 200, 0.05)",
            borderRadius: "50%",
          }}
        />

        {/* Top Header */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div
            style={{
              width: "24px",
              height: "24px",
              background: "#0052FF",
              borderRadius: "4px",
            }}
          />
          <span
            style={{
              color: "#E2E2E2",
              fontSize: "24px",
              fontWeight: 600,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
            }}
          >
            Fathom Layer
          </span>
        </div>

        {/* Main Title Area */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px", zIndex: 10 }}>
          <span
            style={{
              color: "#0052FF",
              fontSize: "32px",
              fontWeight: 500,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
            }}
          >
            Terminal / 02
          </span>
          <h1
            style={{
              color: "#ffffff",
              fontSize: "110px",
              fontWeight: 800,
              lineHeight: 1.1,
              letterSpacing: "-0.04em",
              margin: 0,
            }}
          >
            Intelligence
          </h1>
          <p
            style={{
              color: "#888888",
              fontSize: "42px",
              fontWeight: 400,
              maxWidth: "800px",
              lineHeight: 1.4,
              margin: 0,
              marginTop: "16px",
            }}
          >
            Curadoria tática de Agent Frameworks, MCP Servers e Infraestrutura IA.
          </p>
        </div>

        {/* Bottom Footer */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "32px",
            borderTop: "2px solid rgba(255,255,255,0.1)",
            paddingTop: "40px",
            width: "100%",
            zIndex: 10,
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <span style={{ color: "#555", fontSize: "18px", textTransform: "uppercase", letterSpacing: "0.1em" }}>Module</span>
            <span style={{ color: "#E2E2E2", fontSize: "28px", fontWeight: 500 }}>Live Radar</span>
          </div>
          <div style={{ width: "2px", height: "40px", background: "rgba(255,255,255,0.1)" }} />
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <span style={{ color: "#555", fontSize: "18px", textTransform: "uppercase", letterSpacing: "0.1em" }}>Status</span>
            <span style={{ color: "#E2E2E2", fontSize: "28px", fontWeight: 500 }}>Indexing</span>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
