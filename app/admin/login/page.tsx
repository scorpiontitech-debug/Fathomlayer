import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { Lock } from "lucide-react";
import { requireAdmin } from "@/lib/supabase/auth";
import { supabaseAdmin } from "@/lib/supabase/server";

import { getSessionUser } from "@/lib/supabase/auth";

export default async function AdminLoginPage() {
  const user = await getSessionUser();

  if (user) {
    const adminEmail = process.env.ADMIN_EMAIL;
    if (adminEmail && user.email?.toLowerCase() === adminEmail.toLowerCase()) {
      redirect("/admin/dashboard");
    }
  }

  const origin = (await headers()).get("origin") || process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  return (
    <div className="flex min-h-[70vh] items-center justify-center">
      <div className="max-w-md w-full space-y-8 rounded-2xl border border-edge bg-surface p-10 text-center shadow-2xl">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-ink text-surface">
          <Lock className="h-8 w-8" />
        </div>
        <div>
          <h2 className="font-display text-3xl font-bold tracking-tight text-ink">
            Admin Portal
          </h2>
          <p className="mt-2 text-sm text-dim">
            Restricted access. Please sign in with the authorized administrator GitHub account.
          </p>
        </div>
        
        <form action="/auth/github" method="POST">
          <input type="hidden" name="next" value="/admin/dashboard" />
          <button
            type="submit"
            className="flex w-full items-center justify-center gap-3 rounded-lg bg-ink px-4 py-3 text-sm font-semibold text-surface transition-colors hover:bg-ink/90"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 fill-current">
              <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
            </svg>
            Sign in with GitHub
          </button>
        </form>

        {user && (
          <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-600">
            Current user ({user.email}) is not authorized as admin.
          </div>
        )}
      </div>
    </div>
  );
}
