import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Methodology",
  description:
    "How Fathom Layer evaluates products and software: design score criteria, quality gates and editorial independence.",
};

// Roadmap #7: trust page. Fixed editorial content, linked from every footer.
// Tone: quiet authority — facts, not promises.
export default function MethodologyPage() {
  return (
    <article className="max-w-2xl space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight">Methodology</h1>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold">What Fathom Layer is</h2>
        <p className="text-[var(--fl-dim)]">
          An independent technology curation index. We are not a store: there is no
          inventory, no cart, no direct sales. Every listed item went through our own
          editorial evaluation before being published.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold">Design score</h2>
        <p className="text-[var(--fl-dim)]">
          The 0–10 score shown on items is assigned manually by Fathom Layer&apos;s curation. It
          weighs build quality, how coherent the product is with its intended use, and the
          real-world setup and operating experience. The score is not influenced by affiliate
          programs, manufacturers or advertisers.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold">No one buys placement</h2>
        <p className="text-[var(--fl-dim)]">
          We do not sell ranking positions, scores or badges. If sponsored content ever
          appears, it will be labeled as such and kept separate from the editorial index.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold">Quality gate</h2>
        <p className="text-[var(--fl-dim)]">
          A category only enters the public index with at least 3 published, evaluated items.
          An item is only published with verified technical specifications and a completed
          editorial note. Specifications come from primary sources (manufacturer, technical
          documentation) — we prefer a verified number over an adjective.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold">Affiliate links</h2>
        <p className="text-[var(--fl-dim)]">
          Some purchase links earn Fathom Layer a commission, at no extra cost to the buyer.
          These links are labeled and never affect an item&apos;s score or position. Details
          in the affiliate disclosure.
        </p>
      </section>
    </article>
  );
}
