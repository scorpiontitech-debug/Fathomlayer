import type { Metadata } from "next";
import { EditorialList } from "@/components/editorial";
import { getEditorialPages } from "@/lib/queries";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Launch radar",
  description:
    "Upcoming technology: rumored, announced and confirmed launches — every entry with a linked source.",
  alternates: { canonical: "/radar" },
};

export default async function RadarPage() {
  const pages = await getEditorialPages("launch");
  return (
    <div className="space-y-10">
      <header className="rise-group max-w-2xl">
        <p className="font-mono text-xs uppercase tracking-[0.22em] text-dim">Editorial</p>
        <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight sm:text-5xl">
          Launch radar
        </h1>
        <p className="mt-3 text-lg leading-relaxed text-dim">
          What&apos;s coming — rumored, announced and confirmed. Never a rumor without a
          linked source.
        </p>
      </header>
      <EditorialList
        pages={pages}
        basePath="/radar"
        emptyText="Nothing on the radar yet — entries appear as they pass editorial review."
      />
    </div>
  );
}
