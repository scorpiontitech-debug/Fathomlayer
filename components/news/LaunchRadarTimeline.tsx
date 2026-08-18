import Link from "next/link";
import { pillarByKey } from "@/lib/taxonomy";

function formatRelativeTime(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  if (hours < 1) return "Just now";
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export function LaunchRadarTimeline({ launches }: { launches: any[] }) {
  if (!launches || launches.length === 0) return null;

  return (
    <div className="sticky top-24 rounded-3xl border border-white/10 bg-black/40 backdrop-blur-xl p-8 shadow-2xl">
      <div className="flex items-center gap-3 mb-8">
        <div className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
        </div>
        <h3 className="font-display text-2xl font-semibold text-white tracking-tight">
          Launch Radar
        </h3>
      </div>

      <div className="relative border-l border-white/10 ml-3 space-y-8 pb-4">
        {launches.map((item) => {
          const cat = item.categories;
          const pillar = pillarByKey(cat?.pillar);
          const href = pillar && cat ? `/${pillar.slug}/${cat.slug}/${item.slug}` : "#";
          
          let formattedPrice = item.price_text || null;
          if (item.price_from !== null && item.price_from !== undefined) {
            try {
              formattedPrice = new Intl.NumberFormat('en-US', { style: 'currency', currency: item.price_currency || 'USD', maximumFractionDigits: 0 }).format(item.price_from);
            } catch (e) {
              formattedPrice = `${item.price_currency || '$'}${item.price_from}`;
            }
          }

          return (
            <div key={item.id} className="relative pl-8">
              <div className="absolute -left-[5px] top-1.5 h-2.5 w-2.5 rounded-full border-2 border-black bg-white ring-4 ring-black" />
              
              <Link href={href} className="group block">
                <span className="font-mono text-[10px] text-accent-bright uppercase tracking-widest mb-1 block">
                  {formatRelativeTime(item.created_at)}
                </span>
                <h4 className="font-display text-lg font-bold text-white group-hover:text-accent transition-colors leading-tight">
                  {item.title}
                </h4>
                <div className="flex items-center gap-3 mt-2">
                  <span className="font-mono text-[10px] uppercase text-white/50">{cat?.name}</span>
                  {formattedPrice && (
                    <span className="rounded border border-white/10 bg-white/5 px-1.5 py-0.5 font-mono text-[10px] text-white/90">
                      {formattedPrice}
                    </span>
                  )}
                </div>
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
