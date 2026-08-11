"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { PILLARS, PILLAR_KEYS } from "@/lib/taxonomy";
import { Menu, X, ChevronDown } from "lucide-react";

// Rótulos curtos no nav — "Ecosystem & Mobility" não cabe em 375px.
const PRIMARY_NAV = [
  ...PILLAR_KEYS.map((key) => ({
    href: `/${PILLARS[key].slug}`,
    label: key === "ecosystem_mobility" ? "Ecosystem" : PILLARS[key].name,
  })),
  { href: "/compare", label: "Compare" },
];

// O resto das ferramentas virou dropdown.
const SECONDARY_NAV = [
  { href: "/calculator", label: "Calculator" },
  { href: "/api-calculator", label: "API Economics" },
  { href: "/playbooks", label: "Playbooks" },
  { href: "/copilot", label: "AI Copilot" },
  { href: "/submit", label: "Submit" },
  { href: "/trending", label: "Trending" },
  { href: "/glossary", label: "Glossary" },
  { href: "/profile", label: "My Stack" },
];

export function SiteHeader({ showSetups = false }: { showSetups?: boolean }) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const secondaryNav = showSetups ? [...SECONDARY_NAV, { href: "/setups", label: "Setups" }] : SECONDARY_NAV;

  return (
    <header className="sticky top-0 z-40 border-b border-edge bg-[color-mix(in_srgb,var(--fl-bg)_86%,transparent)] backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-6 px-5">
        <Link href="/" className="group flex items-center gap-2.5" aria-label="Fathom Layer — home" onClick={() => setIsMobileMenuOpen(false)}>
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

        {/* Desktop Navigation */}
        <nav aria-label="Primary Desktop" className="hidden md:flex items-center gap-6 text-sm">
          {PRIMARY_NAV.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`transition-colors duration-200 ${
                  active ? "text-ink font-medium" : "text-dim hover:text-ink"
                }`}
              >
                {item.label}
              </Link>
            );
          })}

          {/* Resources Dropdown */}
          <div className="relative group">
            <button className="flex items-center gap-1 text-dim hover:text-ink transition-colors duration-200 py-4 cursor-pointer">
              Resources
              <ChevronDown className="w-4 h-4 transition-transform duration-200 group-hover:rotate-180" />
            </button>
            <div className="absolute top-[calc(100%-8px)] right-0 w-48 py-2 rounded-lg border border-edge bg-surface shadow-xl opacity-0 invisible translate-y-2 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-200">
              {secondaryNav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block px-4 py-2 text-sm text-dim hover:text-ink hover:bg-edge/50 transition-colors"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </nav>

        {/* Mobile Menu Toggle */}
        <button 
          className="md:hidden p-2 -mr-2 text-dim hover:text-ink transition-colors"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Navigation Sheet */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-surface border-b border-edge shadow-xl max-h-[80vh] overflow-y-auto">
          <nav className="flex flex-col p-5 space-y-5">
            <div className="space-y-4">
              <p className="text-[10px] font-mono uppercase tracking-widest text-faint mb-2">Core</p>
              {PRIMARY_NAV.map((item) => {
                const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`block transition-colors duration-200 ${
                      active ? "text-ink font-medium" : "text-dim hover:text-ink"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>
            <div className="border-t border-edge pt-5 space-y-4">
              <p className="text-[10px] font-mono uppercase tracking-widest text-faint mb-2">Resources</p>
              {secondaryNav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block text-dim transition-colors hover:text-ink"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
