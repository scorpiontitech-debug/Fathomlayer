import { renderMarkdown } from "@/lib/markdown";

export function VideoEmbed({ url }: { url: string }) {
  // Extract YouTube ID if it's a YouTube URL
  let embedUrl = url;
  if (url.includes("youtube.com") || url.includes("youtu.be")) {
    const videoId = url.split("v=")[1]?.split("&")[0] || url.split("youtu.be/")[1]?.split("?")[0];
    if (videoId) {
      embedUrl = `https://www.youtube-nocookie.com/embed/${videoId}`;
    }
  }

  return (
    <section className="reveal max-w-4xl overflow-hidden rounded-xl border border-edge bg-surface shadow-lg">
      <div className="relative aspect-video w-full bg-black">
        <iframe
          src={embedUrl}
          title="Video review"
          className="absolute inset-0 h-full w-full border-0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    </section>
  );
}

export function KeyFeatures({ features }: { features: string[] }) {
  if (!features || features.length === 0) return null;
  return (
    <section className="reveal max-w-2xl">
      <h2 className="font-display text-xl font-semibold tracking-tight">Key Features</h2>
      <ul className="mt-4 space-y-3">
        {features.map((feature, i) => (
          <li key={i} className="flex items-start gap-3 rounded-lg border border-edge bg-surface p-4">
            <span className="mt-0.5 text-accent-bright">✦</span>
            <span className="text-sm leading-relaxed text-dim">{feature}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function DeepDive({ markdown }: { markdown: string }) {
  if (!markdown) return null;
  return (
    <section className="reveal max-w-2xl border-t border-edge pt-8">
      <h2 className="font-display text-2xl font-semibold tracking-tight">In-Depth Review</h2>
      <div
        className="prose-nl mt-6 leading-relaxed [&_a]:text-accent-bright [&_a]:underline-offset-4 hover:[&_a]:underline [&_code]:font-mono [&_code]:text-sm [&_h2]:mt-8 [&_h2]:font-display [&_h2]:text-xl [&_h2]:font-semibold [&_h3]:mt-6 [&_h3]:font-display [&_h3]:font-semibold [&_li]:my-1 [&_p]:my-4 [&_p]:text-dim [&_strong]:text-ink [&_table]:w-full [&_table]:border-collapse [&_td]:border-b [&_td]:border-edge [&_td]:py-2 [&_th]:border-b [&_th]:border-edge-strong [&_th]:py-2 [&_th]:text-left [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:text-dim"
        dangerouslySetInnerHTML={{ __html: renderMarkdown(markdown) }}
      />
    </section>
  );
}

export function FaqSection({ faqs }: { faqs: unknown }) {
  // Assume faqs is an array of { question: string, answer: string }
  if (!Array.isArray(faqs) || faqs.length === 0) return null;
  return (
    <section className="reveal max-w-2xl border-t border-edge pt-8">
      <h2 className="font-display text-2xl font-semibold tracking-tight">Frequently Asked Questions</h2>
      <div className="mt-6 divide-y divide-edge">
        {faqs.map((faq: any, i: number) => (
          <details key={i} className="group py-4">
            <summary className="flex cursor-pointer items-center justify-between font-medium text-ink outline-none marker:content-none hover:text-accent-bright">
              {faq.question}
              <span className="text-dim transition-transform duration-200 group-open:rotate-180">↓</span>
            </summary>
            <div className="mt-3 text-sm leading-relaxed text-dim">
              {faq.answer}
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}
