import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center py-24 text-center">
      <p className="font-mono text-xs uppercase tracking-[0.22em] text-faint">404</p>
      <h1 className="mt-4 font-display text-3xl font-semibold tracking-tight">
        Page not found
      </h1>
      <p className="mt-3 max-w-md leading-relaxed text-dim">
        This item may have been removed from the index or hasn&apos;t been published yet.
      </p>
      <Link
        href="/"
        className="group mt-8 inline-flex items-center gap-2 rounded-md border border-edge-strong px-5 py-2.5 text-sm font-medium transition-[border-color,transform] duration-200 ease-flow hover:border-accent-bright active:scale-[0.98]"
      >
        Back to the index
        <span aria-hidden className="transition-transform duration-200 ease-flow group-hover:translate-x-0.5">
          →
        </span>
      </Link>
    </div>
  );
}
