import Link from "next/link";

export function EditorialGrid({ editorials }: { editorials: any[] }) {
  if (!editorials || editorials.length === 0) return null;

  return (
    <section className="reveal space-y-5">
      <div className="flex items-baseline justify-between gap-4">
        <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          Deep Dives & Guides
        </h2>
        <span className="font-mono text-xs uppercase tracking-[0.18em] text-faint">
          Editorial
        </span>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {editorials.map((page) => {
          const typeLabel = page.content_type === "guide" ? "Buying Guide" : "Launch Radar";
          const baseUrl = page.content_type === "guide" ? "/guides" : "/radar";
          const desc = page.body_markdown ? page.body_markdown.replace(/[#*_`>[\]]/g, "").slice(0, 120) + '...' : '';

          return (
            <Link
              key={page.id}
              href={`${baseUrl}/${page.slug}`}
              data-spot
              data-tilt
              className="spot-card glow-hover tilt group relative flex flex-col justify-between rounded-lg border border-edge backdrop-blur-2xl bg-white/5 p-6 hover:border-edge-strong"
            >
              <div className="relative">
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent-bright">
                  {typeLabel}
                </span>
                <h3 className="mt-3 font-display text-2xl font-semibold tracking-tight text-white group-hover:text-accent-bright transition-colors">
                  {page.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-dim">
                  {desc}
                </p>
              </div>
              <div className="relative mt-6 h-5 overflow-hidden font-mono text-xs uppercase tracking-[0.14em]">
                <span className="absolute inset-x-0 text-faint transition-transform duration-300 ease-flow group-hover:-translate-y-5">
                  Read full article
                </span>
                <span className="absolute inset-x-0 translate-y-5 text-accent-bright transition-transform duration-300 ease-flow group-hover:translate-y-0">
                  Read →
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
