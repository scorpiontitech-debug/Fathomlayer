import type { Metadata } from "next";
import { Instrument_Sans, JetBrains_Mono, Space_Grotesk } from "next/font/google";
import { MotionLayer } from "@/components/motion/MotionLayer";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { getEditorialPages, getPublishedSetups } from "@/lib/queries";
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
    default: "Fathom Layer — independent technology index",
    template: "%s — Fathom Layer",
  },
  description:
    "An independent technology index: hardware, software and AI evaluated with verified data and in-house editorial criteria.",
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
        <a
          href="#content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-accent focus:px-3 focus:py-2 focus:text-white"
        >
          Skip to content
        </a>
        <MotionLayer />
        <SiteHeader showSetups={setups.length > 0} />
        <main id="content" className="mx-auto w-full max-w-6xl flex-1 px-5 pb-24 pt-10">
          {children}
        </main>
        <SiteFooter showRadar={launches.length > 0} />
      </body>
    </html>
  );
}
