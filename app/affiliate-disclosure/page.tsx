import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Affiliate disclosure",
  description: "How Fathom Layer is funded: disclosure of affiliate relationships.",
  alternates: { canonical: "/affiliate-disclosure" },
};

// Roadmap #8: mandatory disclosure (Switzerland/EU/US).
// Roadmap #16: named network hierarchy — no single network is the engine.
export default function AffiliateDisclosurePage() {
  return (
    <article className="max-w-2xl space-y-8">
      <header>
        <p className="font-mono text-xs uppercase tracking-[0.22em] text-dim">Transparency</p>
        <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight">
          Affiliate disclosure
        </h1>
      </header>

      <p className="leading-relaxed text-dim">
        Fathom Layer participates in affiliate programs. When you buy a product through a link
        on this site, we may receive a commission from the destination store or platform. You
        never pay more because of it.
      </p>

      <section className="space-y-3">
        <h2 className="font-display text-lg font-semibold">Which networks we work with</h2>
        <p className="leading-relaxed text-dim">
          Commission comes from several independent networks — among them PartnerStack for
          software, Impact for specialist hardware retailers, and Amazon Associates as general
          coverage. No single network is the engine of this site, and some categories are
          indexed with no affiliate program attached at all.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="font-display text-lg font-semibold">How the links work</h2>
        <p className="leading-relaxed text-dim">
          Links that may earn a commission are labeled on the pages themselves and go through
          an internal redirect (<code className="font-mono text-sm">/out/…</code>), which we
          use to measure clicks in aggregate. No client-side tracking scripts are involved —
          what is and is not stored is set out in the{" "}
          <Link href="/privacy" className="text-ink underline-offset-4 hover:underline">
            privacy policy
          </Link>
          .
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="font-display text-lg font-semibold">What commission never buys</h2>
        <p className="leading-relaxed text-dim">
          Commissions fund the operation of the index and do not influence evaluations, design
          scores or the order in which items appear. An item with no affiliate link is ranked
          by exactly the same criteria as one that pays. The full criteria are on the{" "}
          <Link href="/methodology" className="text-ink underline-offset-4 hover:underline">
            methodology
          </Link>{" "}
          page.
        </p>
      </section>
    </article>
  );
}
