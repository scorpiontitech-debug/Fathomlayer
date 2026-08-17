"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] py-24 text-center px-4">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-edge border border-edge-strong mb-6 text-2xl">
        ⚠️
      </div>
      <h1 className="font-display text-3xl font-semibold tracking-tight">
        Something went wrong
      </h1>
      <p className="mt-3 max-w-md leading-relaxed text-dim">
        We encountered an unexpected error while processing your request.
      </p>
      <div className="mt-8 flex flex-col sm:flex-row gap-4">
        <button
          onClick={() => reset()}
          className="group inline-flex items-center justify-center gap-2 rounded-md bg-ink px-6 py-2.5 text-sm font-medium text-surface transition-colors hover:bg-dim active:scale-[0.98]"
        >
          Try again
        </button>
        <Link
          href="/"
          className="group inline-flex items-center justify-center gap-2 rounded-md border border-edge-strong bg-surface px-6 py-2.5 text-sm font-medium transition-[border-color,transform] duration-200 ease-flow hover:border-accent-bright active:scale-[0.98]"
        >
          Back to home
        </Link>
      </div>
    </div>
  );
}
