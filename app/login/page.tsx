"use client";

import { createBrowserClient } from "@supabase/ssr";

import { useState } from "react";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
  );

  const handleLogin = async () => {
    setLoading(true);
    await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center p-4">
      <div className="w-full max-w-sm rounded-xl border border-edge bg-surface p-8 shadow-lg text-center">
        <h1 className="font-display text-2xl font-bold text-ink">Join Fathom Layer</h1>
        <p className="mt-2 text-sm text-dim">
          Create an account to save tools to your Stack and leave reviews.
        </p>
        <button
          onClick={handleLogin}
          disabled={loading}
          className="mt-8 flex w-full items-center justify-center gap-2 rounded-lg bg-ink px-4 py-3 text-sm font-medium text-surface transition hover:bg-ink/90 disabled:opacity-50"
        >
          {loading ? (
            <span className="w-5 h-5 border-2 border-surface border-t-transparent rounded-full animate-spin"></span>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
          )}
          {loading ? "Connecting..." : "Continue with GitHub"}
        </button>
      </div>
    </div>
  );
}
