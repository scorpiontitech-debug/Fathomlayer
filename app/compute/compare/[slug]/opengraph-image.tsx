import { ImageResponse } from "next/og";
import { getProductBySlug } from "@/lib/queries";

export const runtime = "edge";

// Image metadata
export const alt = "Hardware Comparison";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const parts = slug.split("-vs-");
  
  if (parts.length !== 2) {
    return new ImageResponse(
      (
        <div style={{ background: 'black', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 60 }}>
          Fathom Layer
        </div>
      )
    );
  }

  const [p1Slug, p2Slug] = parts;
  const [productA, productB] = await Promise.all([
    getProductBySlug(p1Slug),
    getProductBySlug(p2Slug),
  ]);

  if (!productA || !productB) {
    return new ImageResponse(
      (
        <div style={{ background: 'black', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 60 }}>
          Fathom Layer Compute
        </div>
      )
    );
  }

  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(to bottom right, #0a0a0b, #1a1a24)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          padding: "60px",
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
          <div style={{ fontSize: 24, textTransform: 'uppercase', letterSpacing: '4px', color: '#00e5ff' }}>
            Compute Versus Engine
          </div>
        </div>

        <div style={{ display: "flex", flex: 1, alignItems: "center", justifyContent: "space-between", marginTop: "40px" }}>
          {/* Card A */}
          <div style={{ display: 'flex', flexDirection: 'column', width: '40%', alignItems: 'center', textAlign: 'center' }}>
            <div style={{ fontSize: 60, fontWeight: 'bold', lineHeight: 1.1 }}>{productA.title}</div>
            <div style={{ fontSize: 30, color: '#a1a1aa', marginTop: '20px' }}>Score: {productA.design_score}/10</div>
          </div>

          {/* VS Badge */}
          <div style={{ display: 'flex', fontSize: 80, fontWeight: 'bold', color: '#00e5ff', opacity: 0.8 }}>
            VS
          </div>

          {/* Card B */}
          <div style={{ display: 'flex', flexDirection: 'column', width: '40%', alignItems: 'center', textAlign: 'center' }}>
            <div style={{ fontSize: 60, fontWeight: 'bold', lineHeight: 1.1 }}>{productB.title}</div>
            <div style={{ fontSize: 30, color: '#a1a1aa', marginTop: '20px' }}>Score: {productB.design_score}/10</div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 'auto', borderTop: '2px solid rgba(255,255,255,0.1)', paddingTop: '30px' }}>
          <div style={{ fontSize: 30, color: '#e4e4e7' }}>
            fathomlayer.com/compute
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
