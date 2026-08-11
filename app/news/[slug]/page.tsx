import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPostBySlug } from "@/lib/content-queries";
import { RichTextRenderer } from "@/components/content/RichTextRenderer";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return {
      title: "Not Found",
    };
  }

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt || undefined,
      images: post.cover_image_url ? [post.cover_image_url] : [],
      type: "article",
      publishedTime: post.published_at || post.created_at,
      authors: post.author?.name ? [post.author.name] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt || undefined,
      images: post.cover_image_url ? [post.cover_image_url] : [],
    }
  };
}

export default async function NewsArticlePage({ params }: Props) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <article className="flex flex-col gap-12 pt-8 pb-32 max-w-3xl mx-auto">
      {/* JSON-LD Script for SEO E-E-A-T */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "NewsArticle",
            "headline": post.title,
            "image": post.cover_image_url ? [post.cover_image_url] : [],
            "datePublished": post.published_at || post.created_at,
            "dateModified": post.updated_at,
            "author": [{
              "@type": "Person",
              "name": post.author?.name || "Fathom Layer",
              "url": post.author?.social_links?.x || ""
            }],
            "description": post.excerpt
          })
        }}
      />

      <header className="flex flex-col gap-8">
        <div className="flex items-center gap-3 text-sm font-mono uppercase tracking-widest text-accent">
          <span>{post.category?.name || "Uncategorized"}</span>
          <span className="w-1 h-1 rounded-full bg-edge"></span>
          <time dateTime={post.published_at || post.created_at}>
            {new Date(post.published_at || post.created_at).toLocaleDateString()}
          </time>
        </div>

        <h1 className="font-grotesk text-4xl font-bold tracking-tight text-strong md:text-6xl text-balance">
          {post.title}
        </h1>

        {post.excerpt && (
          <p className="text-xl text-dim leading-relaxed text-balance">
            {post.excerpt}
          </p>
        )}

        {/* E-E-A-T Author Block */}
        <div className="flex items-center gap-4 mt-4 py-4 border-y border-edge">
          {post.author?.avatar_url ? (
            <img src={post.author.avatar_url} alt={post.author.name} className="w-12 h-12 rounded-full object-cover bg-edge" />
          ) : (
            <div className="w-12 h-12 rounded-full bg-edge" />
          )}
          <div className="flex flex-col">
            <span className="font-medium text-strong">{post.author?.name || "Editorial Team"}</span>
            <span className="text-sm text-faint">{post.author?.bio || "Fathom Layer Expert"}</span>
          </div>
          
          {/* Audio Player Placeholder (Zero-UI) */}
          {post.audio_url && (
            <button className="ml-auto flex items-center gap-2 rounded-full bg-surface/50 border border-edge px-4 py-2 hover:bg-surface/80 transition-colors" data-magnetic>
              <span className="font-mono text-xs uppercase tracking-widest text-accent">Ouvir Artigo</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
            </button>
          )}
        </div>
      </header>

      {post.cover_image_url && (
        <figure className="w-full aspect-[21/9] rounded-2xl overflow-hidden bg-edge relative" data-tilt>
          <img src={post.cover_image_url} alt={post.title} className="w-full h-full object-cover" />
        </figure>
      )}

      {/* Main Content */}
      <div className="prose prose-invert prose-lg max-w-none prose-headings:font-grotesk prose-headings:font-bold prose-a:text-accent-bright prose-a:no-underline hover:prose-a:underline">
        <RichTextRenderer content={post.content || ""} />
      </div>
    </article>
  );
}
