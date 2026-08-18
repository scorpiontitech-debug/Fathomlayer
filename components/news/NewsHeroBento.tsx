import Link from "next/link";
import Image from "next/image";
import { pillarByKey } from "@/lib/taxonomy";

export function NewsHeroBento({ posts, topRanked }: { posts: any[], topRanked: any[] }) {
  if (!posts || posts.length === 0) return null;

  const heroPost = posts[0];
  const sidePosts = posts.slice(1, 3);
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full">
      {/* Main Hero News */}
      <Link 
        href={`/news/${heroPost.slug}`}
        className="group relative lg:col-span-8 flex flex-col justify-end min-h-[500px] lg:min-h-[600px] rounded-3xl overflow-hidden border border-white/10 bg-edge shadow-2xl"
      >
        {heroPost.cover_image_url || heroPost.cover_image ? (
          <Image
            src={heroPost.cover_image_url || heroPost.cover_image}
            alt={heroPost.title}
            fill
            className="object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
            sizes="(max-width: 1024px) 100vw, 66vw"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-tr from-edge-strong to-bg" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent transition-opacity duration-500 group-hover:opacity-90" />
        
        <div className="relative z-10 p-8 md:p-12">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-xs font-mono text-accent-bright backdrop-blur-md shadow-lg">
            <span className="w-1.5 h-1.5 rounded-full bg-accent-bright animate-pulse" />
            LIVE INSIGHT
          </div>
          <h2 className="font-display text-4xl md:text-6xl font-bold text-white tracking-tight group-hover:text-accent-bright transition-colors text-balance">
            {heroPost.title}
          </h2>
          {heroPost.excerpt && (
            <p className="mt-4 max-w-2xl text-lg text-white/70 line-clamp-2">
              {heroPost.excerpt}
            </p>
          )}
        </div>
      </Link>

      {/* Side Column */}
      <div className="lg:col-span-4 flex flex-col gap-6">
        {/* Side Posts */}
        {sidePosts.map((post) => (
          <Link
            key={post.id}
            href={`/news/${post.slug}`}
            className="group relative flex-1 flex flex-col justify-end min-h-[250px] rounded-3xl overflow-hidden border border-white/10 bg-edge shadow-lg"
          >
            {post.cover_image_url || post.cover_image ? (
              <Image
                src={post.cover_image_url || post.cover_image}
                alt={post.title}
                fill
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105 opacity-60 group-hover:opacity-100 saturate-0 group-hover:saturate-100"
                sizes="(max-width: 1024px) 100vw, 33vw"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-tr from-edge-strong to-bg" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/95 to-black/20" />
            
            <div className="relative z-10 p-6">
              <h3 className="font-display text-2xl font-semibold text-white tracking-tight group-hover:text-accent-bright transition-colors">
                {post.title}
              </h3>
            </div>
          </Link>
        ))}

        {/* Trending Ticker */}
        {topRanked && topRanked.length > 0 && (
          <div className="flex-1 rounded-3xl border border-white/5 bg-white/5 p-6 backdrop-blur-sm flex flex-col justify-center">
            <h4 className="font-mono text-xs uppercase tracking-widest text-faint mb-4 flex items-center gap-2">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>
              Trending Now
            </h4>
            <ul className="space-y-4">
              {topRanked.slice(0, 3).map((item, idx) => {
                const cat = item.categories;
                const pillar = pillarByKey(cat?.pillar);
                const href = pillar && cat ? `/${pillar.slug}/${cat.slug}/${item.slug}` : "#";
                return (
                  <li key={item.id} className="flex items-start gap-4">
                    <span className="font-display text-xl text-white/20 font-bold">0{idx + 1}</span>
                    <Link href={href} className="flex-1 group">
                      <h5 className="font-semibold text-white/90 group-hover:text-accent-bright transition-colors line-clamp-1">
                        {item.title}
                      </h5>
                      <p className="text-[10px] uppercase tracking-widest text-white/40 font-mono mt-1">{cat?.name}</p>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
