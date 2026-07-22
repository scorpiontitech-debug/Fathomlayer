"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { href: "/admin/review", label: "Review queue" },
  { href: "/admin/editorial", label: "Editorial" },
];

// Escondida no login: quem não autenticou não deve ver navegação interna.
export function AdminNav() {
  const pathname = usePathname();
  if (pathname.startsWith("/admin/login")) return null;

  return (
    <nav aria-label="Admin" className="flex flex-wrap gap-2 border-b border-edge pb-3">
      {TABS.map((tab) => {
        const active = pathname.startsWith(tab.href);
        return (
          <Link
            key={tab.href}
            href={tab.href}
            aria-current={active ? "page" : undefined}
            className={`rounded px-3 py-1.5 text-sm transition-colors ${
              active ? "bg-surface text-ink" : "text-dim hover:bg-surface hover:text-ink"
            }`}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
