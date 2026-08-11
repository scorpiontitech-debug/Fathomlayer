import type { Metadata } from "next";
import Link from "next/link";
import { SITE_NAME } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Compare AI Tools & Hardware",
  description: "Head-to-head comparisons of the best AI tools, software, and local hardware.",
  alternates: { canonical: "/compare" },
};

export default function CompareIndexPage() {
  const popularComparisons = [
    { title: "Zapier vs n8n", slug: "zapier-vs-n8n", desc: "The ultimate automation showdown." },
    { title: "GitHub Copilot vs Cursor", slug: "github-copilot-vs-cursor", desc: "Which AI coding assistant boosts productivity the most?" },
    { title: "ChatGPT vs Claude", slug: "chatgpt-vs-claude", desc: "The battle of the frontier LLMs." },
    { title: "Mac Studio vs Threadripper", slug: "mac-studio-vs-threadripper", desc: "Local AI compute: Apple Silicon vs x86." },
  ];

  return (
    <div className="space-y-12 pb-24">
      <header className="rise-group max-w-3xl">
        <p className="font-mono text-xs uppercase tracking-[0.22em] text-dim">
          Versus Engine
        </p>
        <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight sm:text-5xl">
          Head-to-Head Comparisons
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-dim">
          Don't guess. Compare specs, pricing, and capabilities side-by-side to make the right choice for your stack.
        </p>
      </header>

      <div className="reveal grid gap-4 sm:grid-cols-2 max-w-4xl">
        {popularComparisons.map((comp) => (
          <Link
            key={comp.slug}
            href={`/compare/${comp.slug}`}
            className="group flex flex-col justify-between rounded-xl border border-edge bg-surface p-6 transition-colors hover:border-accent"
          >
            <div>
              <h2 className="font-display text-xl font-semibold text-ink group-hover:text-accent transition-colors">
                {comp.title}
              </h2>
              <p className="mt-2 text-sm text-dim">{comp.desc}</p>
            </div>
            <div className="mt-6 flex items-center text-sm font-medium text-accent">
              Compare <span className="ml-2 transition-transform group-hover:translate-x-1">→</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
