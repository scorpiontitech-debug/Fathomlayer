import { getTrendingItems } from "@/lib/queries";
import Link from "next/link";
import { Flame } from "lucide-react";

export default async function TrendingPage() {
  const items = await getTrendingItems();

  return (
    <div className="space-y-12 pb-24 max-w-4xl mx-auto">
      <header className="rise-group border-b border-edge pb-10">
        <h1 className="font-display text-4xl font-semibold tracking-tight sm:text-5xl text-ink flex items-center gap-3">
          <Flame className="h-10 w-10 text-accent-bright" />
          Trending This Week
        </h1>
        <p className="mt-4 text-xl text-dim">
          The most saved and reviewed tools on Fathom Layer over the last 7 days.
        </p>
      </header>

      <section className="reveal">
        {items.length === 0 ? (
          <div className="rounded-xl border border-dashed border-edge-strong bg-surface p-12 text-center">
            <p className="text-dim">Not enough data to calculate trending items yet.</p>
          </div>
        ) : (
          <ul className="space-y-4">
            {items.map((item: any, index: number) => (
              <li key={item.id} className="group">
                <Link
                  href={item.type === "product" ? `/hardware/gpu/${item.slug}` : `/software/ai/${item.slug}`} // Mock routing for MVP
                  className="flex items-center gap-6 rounded-xl border border-edge bg-surface p-6 transition hover:border-accent-bright"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-ink text-surface font-display font-bold text-lg">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <h2 className="font-display text-2xl font-semibold text-ink group-hover:text-accent-bright transition-colors">
                      {item.title}
                    </h2>
                    <p className="text-sm text-dim uppercase tracking-wider font-mono mt-1">
                      {item.type}
                    </p>
                  </div>
                  <div className="hidden sm:block text-right">
                    {item.price_text && <p className="font-mono text-dim">{item.price_text}</p>}
                    <span className="text-accent-bright text-sm mt-1 inline-block">Explore →</span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
