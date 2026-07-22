import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy",
  description: "Fathom Layer privacy policy.",
};

export default function PrivacyPage() {
  return (
    <article className="max-w-2xl space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight">Privacy</h1>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold">What we collect</h2>
        <p className="text-[var(--fl-dim)]">
          Fathom Layer requires no account, sets no tracking cookies of its own and runs no
          analytics scripts in your browser. When you click a purchase link, we record a
          server-side click event with the originating page and the approximate country
          (derived in aggregate) — no IP address, no personal identifiers, no user profile.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold">Destination sites</h2>
        <p className="text-[var(--fl-dim)]">
          Once you leave Fathom Layer through a purchase link, the destination site&apos;s
          privacy policy applies (for example, Amazon). We recommend reviewing it.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold">Contact</h2>
        <p className="text-[var(--fl-dim)]">
          Privacy questions can be sent through the contact listed at fathomlayer.com.
        </p>
      </section>
    </article>
  );
}
