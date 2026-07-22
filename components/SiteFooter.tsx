import Image from "next/image";
import Link from "next/link";

// Global disclosure required by roadmap item #8 (legal obligation CH/EU/US),
// plus the credibility pages (#7).
export function SiteFooter() {
  return (
    <footer className="border-t border-edge">
      <div className="mx-auto grid max-w-6xl gap-8 px-5 py-10 text-sm sm:grid-cols-[1fr_auto]">
        <div className="max-w-md space-y-3">
          {/* Lockup oficial completo — o rodapé tem espaço para a marca inteira */}
          <Image
            src="/fathom-layer-lockup.png"
            alt="Fathom Layer"
            width={1200}
            height={366}
            className="h-9 w-auto"
          />
          <p className="text-dim leading-relaxed">
            Fathom Layer may earn a commission on purchases made through links on this site.
            This never affects how an item is scored or ranked.
          </p>
          <p className="font-mono text-xs text-faint">
            © {new Date().getFullYear()} Fathom Layer · fathomlayer.com
          </p>
        </div>
        <nav aria-label="Legal" className="flex flex-col gap-2 sm:text-right">
          <Link href="/about" className="text-dim transition-colors hover:text-ink">
            About
          </Link>
          <Link href="/glossary" className="text-dim transition-colors hover:text-ink">
            Glossary
          </Link>
          <Link href="/guides" className="text-dim transition-colors hover:text-ink">
            Buying guides
          </Link>
          <Link href="/radar" className="text-dim transition-colors hover:text-ink">
            Launch radar
          </Link>
          <Link href="/methodology" className="text-dim transition-colors hover:text-ink">
            Methodology
          </Link>
          <Link href="/affiliate-disclosure" className="text-dim transition-colors hover:text-ink">
            Affiliate disclosure
          </Link>
          <Link href="/privacy" className="text-dim transition-colors hover:text-ink">
            Privacy
          </Link>
          <Link href="/contact" className="text-dim transition-colors hover:text-ink">
            Contact
          </Link>
        </nav>
      </div>
    </footer>
  );
}
