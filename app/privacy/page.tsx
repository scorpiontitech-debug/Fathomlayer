import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy",
  description:
    "What Fathom Layer stores and what it does not: no account, no tracking cookies, no analytics scripts.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <article className="max-w-2xl space-y-8">
      <header>
        <p className="font-mono text-xs uppercase tracking-[0.22em] text-dim">Legal</p>
        <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight">Privacy</h1>
      </header>

      <section className="space-y-3">
        <h2 className="font-display text-lg font-semibold">What we collect</h2>
        <p className="leading-relaxed text-dim">
          Fathom Layer requires no account, sets no tracking cookies of its own and runs no
          analytics scripts in your browser. When you click a purchase link, we record a
          server-side click event with the originating page and the approximate country
          (derived in aggregate) — no IP address, no personal identifiers, no user profile.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="font-display text-lg font-semibold">Destination sites</h2>
        <p className="leading-relaxed text-dim">
          Once you leave Fathom Layer through a purchase link, the destination site&apos;s
          privacy policy applies (for example, Amazon). We recommend reviewing it.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="font-display text-lg font-semibold">Contact</h2>
        <p className="leading-relaxed text-dim">
          Privacy questions, corrections and removal requests can be sent through the{" "}
          <Link href="/contact" className="text-ink underline-offset-4 hover:underline">
            contact page
          </Link>
          .
        </p>
      </section>
    </article>
  );
}
