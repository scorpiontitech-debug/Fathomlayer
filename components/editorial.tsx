import Link from "next/link";
import { renderMarkdown } from "@/lib/markdown";
import type { EditorialPage } from "@/lib/queries";

// Selo de confiança do radar (design system §7): dessaturado, nunca alarme.
const CONFIDENCE_STYLE: Record<string, string> = {
  rumored: "text-faint border-edge",
  announced: "text-warn border-edge-strong",
  confirmed: "text-ok border-edge-strong",
};

export function LaunchMeta({ page }: { page: EditorialPage }) {
  if (page.content_type !== "launch") return null;
  return (
    <div className="flex flex-wrap items-center gap-3 font-mono text-xs uppercase tracking-[0.14em]">
      {page.launch_confidence ? (
        <span
          className={`rounded-full border px-3 py-1 ${
            CONFIDENCE_STYLE[page.launch_confidence] ?? "text-faint border-edge"
          }`}
        >
          {page.launch_confidence}
        </span>
      ) : null}
      {page.expected_release_date ? (
        <span className="tabular-nums text-dim">expected {page.expected_release_date}</span>
      ) : null}
      {page.source_url ? (
        <a
          href={page.source_url}
          rel="noopener nofollow"
          target="_blank"
          className="text-dim underline-offset-4 hover:underline"
        >
          source ↗
        </a>
      ) : null}
    </div>
  );
}

export function EditorialList({
  pages,
  basePath,
  emptyText,
}: {
  pages: EditorialPage[];
  basePath: string;
  emptyText: string;
}) {
  if (pages.length === 0) {
    return (
      <div className="rounded-lg border border-edge bg-surface px-6 py-14 text-center">
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-faint">In curation</p>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-dim">{emptyText}</p>
      </div>
    );
  }
  return (
    <ul className="reveal-stagger grid gap-4 sm:grid-cols-2">
      {pages.map((page) => (
        <li key={page.id}>
          <Link
            href={`${basePath}/${page.slug}`}
            data-spot
            data-tilt
            className="spot-card glow-hover tilt group flex min-h-[130px] flex-col justify-between rounded-lg border border-edge bg-surface p-6 hover:border-edge-strong"
          >
            <div>
              <h2 className="font-display text-lg font-semibold tracking-tight">{page.title}</h2>
              <div className="mt-2">
                <LaunchMeta page={page} />
              </div>
            </div>
            <div className="relative mt-4 h-5 overflow-hidden font-mono text-xs uppercase tracking-[0.14em]">
              <span className="absolute inset-x-0 text-faint transition-transform duration-300 ease-flow group-hover:-translate-y-5">
                {page.content_type}
              </span>
              <span className="absolute inset-x-0 translate-y-5 text-accent-bright transition-transform duration-300 ease-flow group-hover:translate-y-0">
                Read →
              </span>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}

export function EditorialArticle({
  page,
  listLabel,
  listPath,
}: {
  page: EditorialPage;
  listLabel: string;
  listPath: string;
}) {
  return (
    <article className="space-y-8">
      <nav aria-label="Breadcrumb" className="font-mono text-xs uppercase tracking-[0.14em]">
        <Link href={listPath} className="text-dim transition-colors hover:text-ink">
          {listLabel}
        </Link>
        <span className="mx-2 text-faint">/</span>
        <span className="text-ink">{page.title}</span>
      </nav>

      <header className="max-w-2xl space-y-4">
        <h1 className="font-display text-4xl font-semibold tracking-tight sm:text-5xl">
          {page.title}
        </h1>
        <LaunchMeta page={page} />
      </header>

      <div
        className="prose-nl max-w-2xl leading-relaxed [&_a]:text-accent-bright [&_a]:underline-offset-4 hover:[&_a]:underline [&_code]:font-mono [&_code]:text-sm [&_h2]:mt-8 [&_h2]:font-display [&_h2]:text-xl [&_h2]:font-semibold [&_h3]:mt-6 [&_h3]:font-display [&_h3]:font-semibold [&_li]:my-1 [&_p]:my-4 [&_p]:text-dim [&_strong]:text-ink [&_table]:w-full [&_table]:border-collapse [&_td]:border-b [&_td]:border-edge [&_td]:py-2 [&_th]:border-b [&_th]:border-edge-strong [&_th]:py-2 [&_th]:text-left [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:text-dim"
        dangerouslySetInnerHTML={{ __html: renderMarkdown(page.body_markdown) }}
      />
    </article>
  );
}
