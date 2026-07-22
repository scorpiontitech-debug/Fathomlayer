import type { Metadata } from "next";
import { EditorialList } from "@/components/editorial";
import { getEditorialPages } from "@/lib/queries";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Buying guides",
  description:
    "Editorial guides on timing and decisions — when to buy, what actually matters, backed by verified data.",
  alternates: { canonical: "/guides" },
};

export default async function GuidesPage() {
  const pages = await getEditorialPages("guide");
  return (
    <div className="space-y-10">
      <header className="rise-group max-w-2xl">
        <p className="font-mono text-xs uppercase tracking-[0.22em] text-dim">Editorial</p>
        <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight sm:text-5xl">
          Buying guides
        </h1>
        <p className="mt-3 text-lg leading-relaxed text-dim">
          Timing and decision guides — when to buy, what actually matters.
        </p>
      </header>
      <EditorialList
        pages={pages}
        basePath="/guides"
        emptyText="Guides are in editorial review and will appear here as they are published."
      />
    </div>
  );
}
