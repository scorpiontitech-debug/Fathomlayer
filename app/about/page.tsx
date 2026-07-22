import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About",
  description:
    "Who is behind Fathom Layer: Marcos Guimarães, CEO of Infinity Soluções and Fathom Layer. Real operation, named editorial responsibility.",
  alternates: { canonical: "/about" },
};

// Roadmap #7: E-E-A-T — curadoria anônima é o padrão que algoritmos de
// qualidade penalizam. Identidade real + ligação transparente com a Infinity.
export default function AboutPage() {
  return (
    <article className="max-w-2xl space-y-8">
      <header>
        <p className="font-mono text-xs uppercase tracking-[0.22em] text-dim">About</p>
        <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight">
          Who is behind Fathom Layer
        </h1>
      </header>

      <section className="space-y-3">
        <h2 className="font-display text-lg font-semibold">Marcos Guimarães</h2>
        <p className="leading-relaxed text-dim">
          Fathom Layer is run by Marcos Guimarães, CEO of{" "}
          <a
            href="https://infinitysolucoes.com"
            rel="noopener"
            target="_blank"
            className="text-ink underline-offset-4 hover:underline"
          >
            Infinity Soluções
          </a>
          , a digital strategy and applied-AI agency, and CEO of Fathom Layer. Every design
          score and editorial note published in this index carries his editorial
          responsibility — no anonymous curation.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="font-display text-lg font-semibold">Built and operated by Infinity Soluções</h2>
        <p className="leading-relaxed text-dim">
          Fathom Layer is developed and operated by Infinity Soluções. The connection is
          deliberate and transparent: the same team that builds AI-driven products for
          clients applies that discipline here — a real operation, publicly accountable, not
          a disposable affiliate site.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="font-display text-lg font-semibold">How the index stays independent</h2>
        <p className="leading-relaxed text-dim">
          Ranking positions, scores and badges are not for sale, and affiliate commissions
          never change how an item is evaluated. The criteria are public — read the{" "}
          <Link href="/methodology" className="text-ink underline-offset-4 hover:underline">
            methodology
          </Link>{" "}
          and the{" "}
          <Link
            href="/affiliate-disclosure"
            className="text-ink underline-offset-4 hover:underline"
          >
            affiliate disclosure
          </Link>
          .
        </p>
      </section>
    </article>
  );
}
