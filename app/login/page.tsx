"use client";

import { createBrowserClient } from "@supabase/ssr";
import { Github } from "lucide-react";
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
          <Github className="h-5 w-5" />
          {loading ? "Connecting..." : "Continue with GitHub"}
        </button>
      </div>
    </div>
  );
}
