import { createBrowserClient } from "@supabase/ssr";

// Cliente de navegador — usado apenas no login do /admin.
export function supabaseBrowser() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
  );
}
