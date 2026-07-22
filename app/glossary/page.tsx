import type { Metadata } from "next";
import { EditorialList } from "@/components/editorial";
import { getEditorialPages } from "@/lib/queries";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Glossary",
  description:
    "Short technical definitions — VRAM, MCP, on-device AI and more — written to be precise, not promotional.",
  alternates: { canonical: "/glossary" },
};

export default async function GlossaryPage() {
  const pages = await getEditorialPages("glossary");
  return (
    <div className="space-y-10">
      <header className="rise-group max-w-2xl">
        <p className="font-mono text-xs uppercase tracking-[0.22em] text-dim">Reference</p>
        <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight sm:text-5xl">
          Glossary
        </h1>
        <p className="mt-3 text-lg leading-relaxed text-dim">
          Short technical definitions — what the terms actually mean, without vendor spin.
        </p>
      </header>
      <EditorialList
        pages={pages}
        basePath="/glossary"
        emptyText="Definitions are in editorial review and will appear here as they are published."
      />
    </div>
  );
}
