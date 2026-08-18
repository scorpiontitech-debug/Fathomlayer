import Image from "next/image";
import Link from "next/link";
import { DataRing } from "@/components/DataRing";
import { HoverVideoPlayer } from "@/components/ui/HoverVideoPlayer";
import { pillarByKey } from "@/lib/taxonomy";

export function TopRankedShowcase({ products }: { products: any[] }) {
  if (!products || products.length === 0) return null;

  const topProduct = products[0];
  const restProducts = products.slice(1, 5);

  const getHref = (p: any) => {
    const cat = p.categories;
    const pillar = cat ? pillarByKey(cat.pillar) : null;
    return pillar && cat ? `/${pillar.slug}/${cat.slug}/${p.slug}` : "#";
  };

  const getFormattedPrice = (item: any) => {
    if (item.price_from !== null && item.price_from !== undefined) {
      try {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: item.price_currency || 'USD', maximumFractionDigits: 0 }).format(item.price_from);
      } catch (e) {
        return `${item.price_currency || '$'}${item.price_from}`;
      }
    }
    return item.price_text || null;
  };

  const topPrice = getFormattedPrice(topProduct);

  return (
    <section className="reveal space-y-8">
      <div className="flex items-baseline justify-between gap-4">
        <h2 className="font-display text-4xl font-semibold tracking-tight sm:text-5xl text-white">
          The Apex
        </h2>
        <span className="font-mono text-sm uppercase tracking-[0.2em] text-accent-bright">
          Highest Rated
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* HERO CARD (#1) */}
        {topProduct && (
          <Link
            href={getHref(topProduct)}
            className="group relative flex min-h-[500px] flex-col justify-between overflow-hidden rounded-2xl border border-white/10 bg-edge lg:col-span-2 shadow-2xl"
          >
            {topProduct.image_url ? (
              <HoverVideoPlayer 
                imageSrc={topProduct.image_url}
                videoSrc={topProduct.hero_video_url || "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4"} // Fallback tech-like video for the demo
                alt={topProduct.title}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
                sizes="(max-width: 1024px) 100vw, 66vw"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-edge-strong to-bg opacity-50" />
            )}
            
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-black/10 transition-opacity duration-500 group-hover:opacity-90" />

            {/* Top Bar */}
            <div className="relative z-10 flex items-start justify-between p-8">
              <div className="flex items-center gap-3 rounded-full bg-black/50 pr-4 pl-1.5 py-1.5 backdrop-blur-md border border-white/10 shadow-lg">
                <DataRing score={topProduct.design_score} size={48} strokeWidth={4} />
                <span className="font-mono text-xs uppercase tracking-widest text-white/90">
                  {topProduct.categories?.name}
                </span>
              </div>
              <span className="font-display text-8xl font-bold tracking-tighter text-white/95 drop-shadow-2xl">
                #1
              </span>
            </div>

            {/* Bottom Content */}
            <div className="relative z-10 p-8 pt-32">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <h3 className="font-display text-4xl font-bold tracking-tight text-white group-hover:text-accent-bright transition-colors sm:text-6xl">
                    {topProduct.title}
                  </h3>
                  <p className="mt-4 max-w-2xl text-lg text-white/70 line-clamp-2">
                    {topProduct.description}
                  </p>
                </div>
                {topPrice && (
                  <div className="mb-2 rounded border border-white/10 bg-black/60 px-4 py-2 backdrop-blur-md">
                    <span className="font-mono text-xl font-bold text-white">
                      {topPrice}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </Link>
        )}

        {/* REST OF THE PACK (#2 to #5) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6">
          {restProducts.map((p, i) => {
            const pPrice = getFormattedPrice(p);
            return (
            <Link
              key={p.id}
              href={getHref(p)}
              data-spot
              data-tilt
              className="spot-card glow-hover tilt group relative flex flex-col justify-between overflow-hidden rounded-xl border border-white/5 bg-edge p-6 transition-colors hover:border-accent"
            >
              {/* Background Image Subdued */}
              {p.image_url ? (
                <Image 
                  src={p.image_url} 
                  alt={p.title}
                  fill
                  className="object-cover opacity-30 transition-all duration-500 group-hover:opacity-40 group-hover:scale-110 saturate-0 group-hover:saturate-100"
                  sizes="(max-width: 1024px) 50vw, 33vw"
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent to-white/5 opacity-50" />
              )}
              
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-black/20" />

              <div className="relative z-10 flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <DataRing score={p.design_score} size={36} strokeWidth={3} />
                  <span className="font-mono text-[10px] uppercase tracking-widest text-faint">
                    {p.categories?.name}
                  </span>
                </div>
                <span className="font-display text-4xl font-bold tracking-tighter text-white/30 group-hover:text-white/90 transition-colors">
                  #{i + 2}
                </span>
              </div>
              
              <div className="relative z-10 mt-12">
                <div className="flex items-end justify-between gap-2">
                  <h3 className="font-display text-2xl font-semibold tracking-tight text-white group-hover:text-accent-bright transition-colors">
                    {p.title}
                  </h3>
                  {pPrice && (
                    <div className="shrink-0 rounded border border-white/10 bg-white/5 px-2 py-1 backdrop-blur-md">
                      <span className="font-mono text-xs font-medium text-white/90">
                        {pPrice}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </Link>
          )})}
        </div>
      </div>
    </section>
  );
}
