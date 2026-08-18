import Image from "next/image";
import { Metadata } from "next";
import Link from "next/link";
import { getPublishedPosts, getRecommendedPosts } from "@/lib/content-queries";
import { getLatestLaunches, getTopRankedProducts } from "@/lib/queries";
import ZeroUIVoiceInterface from "@/components/ui/ZeroUIVoiceInterface";
import { NewsHeroBento } from "@/components/news/NewsHeroBento";
import { LaunchRadarTimeline } from "@/components/news/LaunchRadarTimeline";

export const metadata: Metadata = {
  title: "Intelligence & Radar | Fathom Layer",
  description: "Advanced technology updates, real-time product launches, and deep insights.",
};

export default async function NewsFeedPage(props: { searchParams: Promise<{ tab?: string }> }) {
  const searchParams = await props.searchParams;
  const tab = searchParams?.tab;
  const isForYou = tab === "foryou";
  
  let posts: any[] = [];
  if (isForYou) {
    const dummyVector = Array.from({ length: 1536 }, () => Math.random() * 2 - 1);
    const result = await getRecommendedPosts(dummyVector, 20);
    posts = result.data || [];
  } else {
    posts = await getPublishedPosts(20);
  }

  // Fetch new data for the right rail and bento side
  const [launches, topRanked] = await Promise.all([
    getLatestLaunches(8),
    getTopRankedProducts(5)
  ]);

  const bentoPosts = posts.slice(0, 3);
  const remainingPosts = posts.slice(3);

  // JSON-LD structured data for NewsHub
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Fathom Layer Intelligence",
    "description": "Real-time technology insights and hardware launches.",
    "url": "https://fathomlayer.com/news",
    "hasPart": posts.map(p => ({
      "@type": "NewsArticle",
      "headline": p.title,
      "datePublished": p.published_at || p.created_at,
      "url": `https://fathomlayer.com/news/${p.slug}`
    }))
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="flex flex-col gap-12 pt-8 pb-32">
        <ZeroUIVoiceInterface />
        
        <header className="flex flex-col gap-6">
          <h1 className="font-display text-5xl font-bold tracking-tight text-white md:text-7xl">
            Intelligence <br /> <span className="text-accent-bright">Hub</span>
          </h1>
          <p className="max-w-2xl text-lg text-white/70">
            Mapeamento em tempo real das mudanças que importam. Lançamentos de Hardware, Software e IA destilados em sinais de alto impacto.
          </p>
        </header>

        {/* Tabs Server-Side via Query Params */}
        <div className="flex items-center gap-6 border-b border-white/10 pb-4 text-sm font-medium font-mono uppercase tracking-widest">
          <Link 
            href="/news" 
            className={`pb-4 -mb-[17px] transition-colors ${!isForYou ? 'text-white border-b-2 border-accent-bright' : 'text-white/40 hover:text-white/70'}`}
          >
            Últimas Notícias
          </Link>
          <Link 
            href="/news?tab=foryou" 
            className={`pb-4 -mb-[17px] transition-colors ${isForYou ? 'text-white border-b-2 border-accent-bright' : 'text-white/40 hover:text-white/70'}`}
          >
            Para Você (IA)
          </Link>
        </div>

        {/* Top Bento Section */}
        {!isForYou && bentoPosts.length > 0 && (
          <section>
            <NewsHeroBento posts={bentoPosts} topRanked={topRanked} />
          </section>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mt-8">
          {/* Main Feed Column (70%) */}
          <div className="lg:col-span-8 flex flex-col gap-8">
            <h3 className="font-display text-3xl font-semibold text-white">
              {isForYou ? "Sinais Curados" : "Updates Anteriores"}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {(isForYou ? posts : remainingPosts).map((post) => (
                <Link
                  key={post.id}
                  href={`/news/${post.slug}`}
                  className="group flex flex-col gap-4 relative overflow-hidden rounded-2xl border border-white/10 bg-edge p-6 transition-all hover:border-accent"
                  data-tilt
                  data-spot
                >
                  <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-faint">
                    <span>{post.category?.name || "Uncategorized"}</span>
                    <span className="w-1 h-1 rounded-full bg-white/20"></span>
                    <span>{new Date(post.published_at || post.created_at).toLocaleDateString()}</span>
                  </div>
                  
                  <h2 className="font-display text-2xl font-semibold text-white leading-tight group-hover:text-accent-bright transition-colors">
                    {post.title}
                  </h2>
                  
                  {post.excerpt && (
                    <p className="text-white/60 line-clamp-3 leading-relaxed mt-2 text-sm">
                      {post.excerpt}
                    </p>
                  )}
                </Link>
              ))}

              {posts.length === 0 && (
                <div className="col-span-full py-24 text-center text-white/40 font-mono">
                  // Aguardando sinais do futuro... Nenhum artigo publicado.
                </div>
              )}
            </div>
          </div>

          {/* Right Rail (30%) */}
          <div className="lg:col-span-4 relative">
            <LaunchRadarTimeline launches={launches} />
          </div>
        </div>
      </div>
    </>
  );
}
