import Link from "next/link";
import Image from "next/image";

export function SetupsShowcase({ setups }: { setups: any[] }) {
  if (!setups || setups.length === 0) return null;

  return (
    <section className="reveal space-y-8 py-8 border-t border-white/5 mt-16">
      <div className="flex items-baseline justify-between gap-4">
        <h2 className="font-display text-4xl font-semibold tracking-tight text-white">
          Curated Setups
        </h2>
        <span className="font-mono text-sm uppercase tracking-[0.2em] text-accent-bright">
          Lookbooks
        </span>
      </div>

      <div className="w-full overflow-x-auto pb-8 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <div className="flex items-stretch gap-6">
          {setups.map((setup) => (
            <Link
              key={setup.id}
              href={`/setups/${setup.slug}`}
              className="group relative flex w-[320px] sm:w-[420px] flex-shrink-0 flex-col overflow-hidden rounded-2xl border border-white/10 bg-edge transition-colors hover:border-accent"
            >
              <div className="relative h-[340px] w-full">
                {setup.cover_image_url ? (
                  <Image
                    src={setup.cover_image_url}
                    alt={setup.title}
                    fill
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    sizes="(max-width: 768px) 320px, 420px"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-tr from-edge-strong to-bg" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent opacity-90 group-hover:opacity-100 transition-opacity" />
                <div className="absolute bottom-6 left-6 right-6 z-10">
                  <div className="mb-3 inline-block rounded-full border border-white/10 bg-black/50 px-3 py-1 text-xs font-semibold text-white/80 backdrop-blur-md">
                    {setup.tags?.[0] || "Featured"}
                  </div>
                  <h3 className="font-display text-2xl font-bold tracking-tight text-white group-hover:text-accent-bright transition-colors">
                    {setup.title}
                  </h3>
                  {setup.description && (
                    <p className="mt-2 text-sm text-white/70 line-clamp-2">
                      {setup.description}
                    </p>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
