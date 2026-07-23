"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { PILLARS, PILLAR_KEYS } from "@/lib/taxonomy";

// Rótulos curtos no nav — "Ecosystem & Mobility" não cabe em 375px.
const NAV = [
  ...PILLAR_KEYS.map((key) => ({
    href: `/${PILLARS[key].slug}`,
    label: key === "ecosystem_mobility" ? "Ecosystem" : PILLARS[key].name,
  })),
  { href: "/calculator", label: "Calculator" },
  { href: "/api-calculator", label: "API Economics" },
  { href: "/playbooks", label: "Playbooks" },
  { href: "/compare", label: "Compare" },
  { href: "/copilot", label: "AI Copilot" },
  { href: "/submit", label: "Submit" },
  { href: "/trending", label: "Trending" },
  { href: "/glossary", label: "Glossary" },
  { href: "/profile", label: "My Stack" },
];

// `showSetups` vem do layout: Setups só entra no menu quando existe pelo
// menos um setup publicado. Um setup é montado a partir de itens já no
// índice, então antes do primeiro produto essa página não tem como ter
// conteúdo — e menu que leva a página vazia queima confiança.
export function SiteHeader({ showSetups = false }: { showSetups?: boolean }) {
  const pathname = usePathname();
  const nav = showSetups ? [...NAV, { href: "/setups", label: "Setups" }] : NAV;

  return (
    <header className="sticky top-0 z-40 border-b border-edge bg-[color-mix(in_srgb,var(--fl-bg)_86%,transparent)] backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-6 px-5">
        <Link href="/" className="group flex items-center gap-2.5" aria-label="Fathom Layer — home">
          {/* Símbolo oficial da marca (fundo removido para dark mode) */}
          <Image
            src="/fathom-layer-symbol.png"
            alt=""
            width={473}
            height={497}
            priority
            className="h-8 w-auto shrink-0 transition-transform duration-300 ease-flow group-hover:-translate-y-0.5"
          />
          <span className="font-display text-[15px] font-semibold tracking-tight">
            Fathom Layer
          </span>
        </Link>

        <nav
          aria-label="Primary"
          className="flex min-w-0 items-center gap-5 overflow-x-auto whitespace-nowrap text-sm [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {nav.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                data-active={active}
                className={`nav-link transition-colors duration-200 ${
                  active ? "text-ink" : "text-dim hover:text-ink"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
