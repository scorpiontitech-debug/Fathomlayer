import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const scoreParam = searchParams.get("score") || "9.0";
  const score = parseFloat(scoreParam).toFixed(1);

  // A sleek, Awwwards-style SVG badge
  const svg = `
    <svg width="240" height="60" viewBox="0 0 240 60" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="240" height="60" rx="12" fill="#0C0C0C" />
      <rect x="0.5" y="0.5" width="239" height="59" rx="11.5" stroke="#222222" />
      <text fill="#FFFFFF" xml:space="preserve" style="white-space: pre" font-family="Inter, system-ui, sans-serif" font-size="14" font-weight="600" letter-spacing="0em"><tspan x="20" y="27">FEATURED ON</tspan></text>
      <text fill="#A3A3A3" xml:space="preserve" style="white-space: pre" font-family="Inter, system-ui, sans-serif" font-size="14" font-weight="500" letter-spacing="0em"><tspan x="20" y="45">Fathom Layer</tspan></text>
      <rect x="170" y="10" width="50" height="40" rx="8" fill="#1A1A1A" />
      <text fill="#E5E5E5" xml:space="preserve" style="white-space: pre" font-family="Inter, system-ui, sans-serif" font-size="18" font-weight="700" letter-spacing="-0.02em"><tspan x="179" y="36">${score}</tspan></text>
    </svg>
  `;

  return new NextResponse(svg.trim(), {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=86400, stale-while-revalidate=3600",
    },
  });
}
