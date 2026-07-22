import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Methodology",
  description:
    "How Fathom Layer evaluates products and software: design score criteria, quality gates and editorial independence.",
  alternates: { canonical: "/methodology" },
};

// Roadmap #7: trust page. Fixed editorial content, linked from every footer
// and from the design score on every item page.
// Tone: quiet authority — facts, not promises.
export default function MethodologyPage() {
  return (
    <article className="max-w-2xl space-y-8">
      <header>
        <p className="font-mono text-xs uppercase tracking-[0.22em] text-dim">Public criteria</p>
        <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight">Methodology</h1>
      </header>

      <section className="space-y-3">
        <h2 className="font-display text-lg font-semibold">What Fathom Layer is</h2>
        <p className="leading-relaxed text-dim">
          An independent technology curation index. We are not a store: there is no
          inventory, no cart, no direct sales. Every listed item went through our own
          editorial evaluation before being published — carried out by a named editor, not
          anonymously. Who that is, and why it is stated publicly, is on the{" "}
          <Link href="/about" className="text-ink underline-offset-4 hover:underline">
            about page
          </Link>
          .
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="font-display text-lg font-semibold">Design score</h2>
        <p className="leading-relaxed text-dim">
          The 0–10 score shown on items is assigned manually by Fathom Layer&apos;s curation. It
          weighs build quality, how coherent the product is with its intended use, and the
          real-world setup and operating experience. The score is not influenced by affiliate
          programs, manufacturers or advertisers.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="font-display text-lg font-semibold">No one buys placement</h2>
        <p className="leading-relaxed text-dim">
          We do not sell ranking positions, scores or badges. If sponsored content ever
          appears, it will be labeled as such and kept separate from the editorial index.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="font-display text-lg font-semibold">Quality gate</h2>
        <p className="leading-relaxed text-dim">
          A category only enters the public index with at least 3 published, evaluated items.
          An item is only published with verified technical specifications and a completed
          editorial note. Specifications come from primary sources (manufacturer, technical
          documentation) — we prefer a verified number over an adjective. The{" "}
          <Link href="/glossary" className="text-ink underline-offset-4 hover:underline">
            glossary
          </Link>{" "}
          exists for the same reason: a term is defined once, precisely, instead of being
          approximated on every page that uses it.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="font-display text-lg font-semibold">Affiliate links</h2>
        <p className="leading-relaxed text-dim">
          Some purchase links earn Fathom Layer a commission, at no extra cost to the buyer.
          These links are labeled and never affect an item&apos;s score or position. The full
          terms are in the{" "}
          <Link
            href="/affiliate-disclosure"
            className="text-ink underline-offset-4 hover:underline"
          >
            affiliate disclosure
          </Link>
          .
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="font-display text-lg font-semibold">When we get something wrong</h2>
        <p className="leading-relaxed text-dim">
          Specifications drift and links break. Corrections reported through the{" "}
          <Link href="/contact" className="text-ink underline-offset-4 hover:underline">
            contact page
          </Link>{" "}
          go into the same review queue an item passes through before publication — a
          correction is held to the criteria above, not waved through because it is a fix.
        </p>
      </section>
    </article>
  );
}
