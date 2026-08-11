import { Metadata } from "next";
import Link from "next/link";
import { getPublishedPosts, getRecommendedPosts } from "@/lib/content-queries";

export const metadata: Metadata = {
  title: "News & Insights",
  description: "Advanced technology updates, tutorials, and deep insights.",
};

export default async function NewsFeedPage(props: { searchParams: Promise<{ tab?: string }> }) {
  const searchParams = await props.searchParams;
  const tab = searchParams?.tab;
  const isForYou = tab === "foryou";
  
  let posts = [];

  if (isForYou) {
    // Simulando o vetor de preferências do usuário (em um sistema real, viria do histórico do Auth/User)
    // Estamos passando um vetor dummy para que o PostgreSQL pgvector retorne recomendações reais baseadas nisso.
    const dummyVector = Array.from({ length: 1536 }, () => Math.random() * 2 - 1);
    const result = await getRecommendedPosts(dummyVector, 20);
    posts = result.data || [];
  } else {
    posts = await getPublishedPosts(20);
  }

  return (
    <div className="flex flex-col gap-16 pt-8 pb-32">
      <header className="flex flex-col gap-6">
        <h1 className="font-grotesk text-5xl font-bold tracking-tight text-strong md:text-7xl">
          Insights & <br /> Delta Signals
        </h1>
        <p className="max-w-2xl text-lg text-dim">
          Mapeamento em tempo real das mudanças que importam. IA, Hardware e o futuro da interação Humano-Computador, destilado em sinais de alto impacto.
        </p>
      </header>

      {/* Tabs Server-Side via Query Params */}
      <div className="flex items-center gap-4 border-b border-edge pb-4 text-sm font-medium">
        <Link 
          href="/news" 
          className={`pb-4 -mb-[17px] transition-colors ${!isForYou ? 'text-strong border-b-2 border-accent-bright' : 'text-faint hover:text-dim'}`}
        >
          Últimas Notícias
        </Link>
        <Link 
          href="/news?tab=foryou" 
          className={`pb-4 -mb-[17px] transition-colors ${isForYou ? 'text-strong border-b-2 border-accent-bright' : 'text-faint hover:text-dim'}`}
        >
          Para Você (IA)
        </Link>
        <Link 
          href="/news?tab=tutorials" 
          className="text-faint hover:text-dim pb-4 -mb-[17px] transition-colors"
        >
          Tutoriais
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map((post) => (
          <Link
            key={post.id}
            href={`/news/${post.slug}`}
            className="group flex flex-col gap-4 relative overflow-hidden rounded-xl border border-edge bg-surface/50 p-6 transition-all hover:bg-surface/80"
            data-tilt
            data-spot
          >
            {/* Spotlight effect background */}
            <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" 
                 style={{ background: 'radial-gradient(600px circle at var(--mx) var(--my), rgba(255,255,255,0.06), transparent 40%)' }} />
            
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-accent">
              <span>{post.category?.name || "Uncategorized"}</span>
              <span className="w-1 h-1 rounded-full bg-edge"></span>
              <span>{new Date(post.published_at || post.created_at).toLocaleDateString()}</span>
            </div>
            
            <h2 className="font-grotesk text-2xl font-semibold text-strong leading-tight group-hover:text-accent-bright transition-colors">
              {post.title}
            </h2>
            
            {post.excerpt && (
              <p className="text-dim line-clamp-3 leading-relaxed">
                {post.excerpt}
              </p>
            )}

            <div className="mt-auto pt-6 flex items-center gap-3">
              {post.author?.avatar_url ? (
                <img src={post.author.avatar_url} alt={post.author.name} className="w-8 h-8 rounded-full bg-edge object-cover" />
              ) : (
                <div className="w-8 h-8 rounded-full bg-edge" />
              )}
              <div className="flex flex-col">
                <span className="text-sm font-medium text-strong">{post.author?.name || "Fathom Layer"}</span>
              </div>
            </div>
          </Link>
        ))}

        {posts.length === 0 && (
          <div className="col-span-full py-24 text-center text-dim font-mono">
            // Aguardando sinais do futuro... Nenhum artigo publicado ainda.
          </div>
        )}
      </div>
    </div>
  );
}
