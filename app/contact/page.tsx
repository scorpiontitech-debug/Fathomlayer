import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Report a broken link, an outdated price or an incorrect specification on Fathom Layer, or request removal of data.",
  alternates: { canonical: "/contact" },
};

// Roadmap #20: canal de contato mínimo. E-mail direto, sem sistema de ticket —
// reportes de dado incorreto entram na mesma Fila de Revisão, como origem
// "reporte de usuário", não em um processo separado.
const CONTACT_EMAIL = "contact@fathomlayer.com";

export default function ContactPage() {
  return (
    <article className="max-w-2xl space-y-8">
      <header>
        <p className="font-mono text-xs uppercase tracking-[0.22em] text-dim">Contact</p>
        <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight">
          Corrections and enquiries
        </h1>
        <p className="mt-4 leading-relaxed text-dim">
          Specifications drift, prices change and links break. If something on this index is
          wrong, telling us is the fastest way to get it fixed — every report goes into the
          same review queue an item passes through before it is published.
        </p>
      </header>

      <section className="space-y-3">
        <h2 className="font-display text-lg font-semibold">Write to us</h2>
        <p className="leading-relaxed text-dim">
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="font-mono text-ink underline-offset-4 hover:underline"
          >
            {CONTACT_EMAIL}
          </a>
        </p>
        <p className="leading-relaxed text-dim">
          Include the URL of the page in question and, where you can, the source that shows
          the correct figure — a manufacturer&apos;s spec sheet or product page settles most
          corrections in one exchange. Every published number is checked against a primary
          source, so a citation lets us verify and republish rather than open an
          investigation.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="font-display text-lg font-semibold">What to expect</h2>
        <p className="leading-relaxed text-dim">
          Fathom Layer is a small operation. Messages are read and answered on a best-effort
          basis, with no guaranteed response time. Corrections to published data are
          prioritised over everything else.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="font-display text-lg font-semibold">Removal requests</h2>
        <p className="leading-relaxed text-dim">
          Manufacturers and vendors may request removal or correction of data concerning
          their own products through the same address. See the{" "}
          <Link href="/privacy" className="text-ink underline-offset-4 hover:underline">
            privacy policy
          </Link>{" "}
          for what this site stores.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="font-display text-lg font-semibold">What this address is not</h2>
        <p className="leading-relaxed text-dim">
          Placement in this index is not for sale, so paid-listing and sponsored-review
          proposals are declined without exception — the{" "}
          <Link href="/methodology" className="text-ink underline-offset-4 hover:underline">
            methodology
          </Link>{" "}
          and the{" "}
          <Link
            href="/affiliate-disclosure"
            className="text-ink underline-offset-4 hover:underline"
          >
            affiliate disclosure
          </Link>{" "}
          explain how items are selected and how this site is funded.
        </p>
      </section>
    </article>
  );
}
