import type { Metadata } from "next";
import { Instrument_Sans, JetBrains_Mono, Space_Grotesk } from "next/font/google";
import { MotionLayer } from "@/components/motion/MotionLayer";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { JsonLd } from "@/components/JsonLd";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { SmoothScroll } from "@/components/SmoothScroll";
import { Preloader } from "@/components/Preloader";
import { CustomCursor } from "@/components/CustomCursor";
import { getEditorialPages, getPublishedSetups } from "@/lib/queries";
import { organizationLd, websiteLd } from "@/lib/seo";
import "./globals.css";

// Tipografia (design system seção 3): grotesca geométrica para headings,
// irmã humanista para corpo, mono para números/specs. Self-hosted via
// next/font — zero layout shift, zero request externo.
const grotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-grotesk",
  display: "swap",
});

const body = Instrument_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-body",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-jbmono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://fathomlayer.com"),
  title: {
    default: "Fathom Layer — The Global Phygital & Agentic AI Platform",
    template: "%s — Fathom Layer",
  },
  description:
    "An advanced cybernetic ecosystem bridging physical and digital worlds through Agentic AI (Mastra), WebNN Edge computing, and IoT Matter Digital Twins.",
  openGraph: {
    title: "Fathom Layer — The Global Phygital & Agentic AI Platform",
    description: "Bridging physical and digital worlds with Agentic AI and Digital Twins.",
    url: "https://fathomlayer.com",
    siteName: "Fathom Layer",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Fathom Layer — The Global Phygital & Agentic AI Platform",
    description: "Bridging physical and digital worlds with Agentic AI and Digital Twins.",
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || "add-your-google-site-verification-code-here",
  },
};

// Navegação consciente do acervo: seção sem nada publicado não vira item de
// menu. Uma porta que abre para "nada aqui" custa credibilidade em toda
// visita — e some sozinha do menu, sem ninguém precisar lembrar de editar
// esta lista quando o primeiro item entrar.
export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [setups, launches] = await Promise.all([
    getPublishedSetups(),
    getEditorialPages("launch"),
  ]);

  return (
    <html lang="en" className={`${grotesk.variable} ${body.variable} ${mono.variable}`}>
      <body className="flex min-h-screen flex-col antialiased">
        <SmoothScroll>
          <Preloader />
          <a
            href="#content"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-accent focus:px-3 focus:py-2 focus:text-white"
          >
            Skip to content
          </a>
          <JsonLd data={organizationLd()} />
          <JsonLd data={websiteLd()} />
          <MotionLayer />
          <div className="relative z-10 bg-[#0a0a0b] pb-24 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
            <SiteHeader showSetups={setups.length > 0} />
            <main id="content" className="mx-auto w-full max-w-6xl flex-1 px-5 pt-24">
              {children}
            </main>
          </div>
          <div className="sticky bottom-0 z-0">
            <SiteFooter showRadar={launches.length > 0} />
          </div>
          <CustomCursor />
        </SmoothScroll>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
