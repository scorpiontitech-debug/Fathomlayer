import Link from "next/link";
import Image from "next/image";

function formatDate(dateStr: string) {
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(new Date(dateStr));
}

export function LatestNewsFeed({ posts }: { posts: any[] }) {
  if (!posts || posts.length === 0) return null;

  return (
    <section className="reveal space-y-5">
      <div className="flex items-baseline justify-between gap-4">
        <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          Market Pulse
        </h2>
        <Link href="/news" className="font-mono text-xs uppercase tracking-[0.18em] text-accent-bright hover:text-white transition-colors">
          All news →
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {posts.map((post) => (
          <Link
            key={post.id}
            href={`/news/${post.slug}`}
            data-spot
            data-tilt
            className="spot-card glow-hover tilt group relative flex flex-col justify-between rounded-lg border border-edge backdrop-blur-2xl bg-white/5 overflow-hidden hover:border-edge-strong"
          >
            {post.cover_image && (
              <div className="relative h-40 w-full overflow-hidden border-b border-edge bg-edge">
                <Image
                  src={post.cover_image}
                  alt={post.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 25vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
              </div>
            )}
            <div className="flex flex-1 flex-col p-5">
              <span className="font-mono text-[10px] uppercase tracking-widest text-faint mb-2">
                {post.published_at ? formatDate(post.published_at) : 'Just now'}
              </span>
              <h3 className="font-display text-lg font-semibold leading-snug tracking-tight text-ink group-hover:text-white transition-colors">
                {post.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-dim line-clamp-2">
                {post.excerpt}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
