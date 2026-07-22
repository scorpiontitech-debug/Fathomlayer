import type { Metadata } from "next";
import Link from "next/link";
import { getPublishedSetups } from "@/lib/queries";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Setups",
  description:
    "Hand-curated guides: hardware and software combinations that work together, with the reasoning behind each pick.",
  alternates: { canonical: "/setups" },
};

export default async function SetupsPage() {
  const setups = await getPublishedSetups();

  return (
    <div className="space-y-10">
      <header className="rise-group max-w-2xl">
        <p className="font-mono text-xs uppercase tracking-[0.22em] text-dim">Editorial</p>
        <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight sm:text-5xl">
          Setups
        </h1>
        <p className="mt-3 text-lg leading-relaxed text-dim">
          Hand-curated combinations of hardware and software that work together, with the
          reasoning behind each pick.
        </p>
      </header>

      {setups.length > 0 ? (
        <ul className="reveal-stagger grid gap-4 sm:grid-cols-2">
          {setups.map((s) => (
            <li key={s.id}>
              <Link
                href={`/setups/${s.slug}`}
                data-spot
                data-tilt
                className="spot-card glow-hover tilt group flex min-h-[150px] flex-col justify-between rounded-lg border border-edge bg-surface p-6 hover:border-edge-strong"
              >
                <div>
                  <h2 className="font-display text-lg font-semibold tracking-tight">
                    {s.title}
                  </h2>
                  {s.description ? (
                    <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-dim">
                      {s.description}
                    </p>
                  ) : null}
                </div>
                <div className="relative mt-5 h-5 overflow-hidden font-mono text-xs uppercase tracking-[0.14em]">
                  <span className="absolute inset-x-0 text-faint transition-transform duration-300 ease-flow group-hover:-translate-y-5">
                    Curated guide
                  </span>
                  <span className="absolute inset-x-0 translate-y-5 text-accent-bright transition-transform duration-300 ease-flow group-hover:translate-y-0">
                    Read →
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <div className="rounded-lg border border-edge bg-surface px-6 py-14 text-center">
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-faint">In curation</p>
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-dim">
            No setups published yet. Each one is assembled by hand from items already in the
            index.
          </p>
        </div>
      )}
    </div>
  );
}
