import { requireAdmin } from "@/lib/supabase/auth";
import { supabaseAdmin } from "@/lib/supabase/server";
import { EditorialAdmin, type EditorialRow } from "./EditorialAdmin";

export const dynamic = "force-dynamic";

export default async function EditorialAdminPage() {
  await requireAdmin();

  const admin = supabaseAdmin();
  if (!admin) {
    return (
      <div className="max-w-xl py-16">
        <h1 className="text-xl font-semibold">Editorial</h1>
        <p className="mt-3 text-dim">
          <code className="font-mono">SUPABASE_SECRET_KEY</code> is not configured in{" "}
          <code className="font-mono">.env.local</code>.
        </p>
      </div>
    );
  }

  const { data } = await admin
    .from("editorial_pages")
    .select(
      "id, content_type, title, slug, body_markdown, tags, status, expected_release_date, launch_confidence, source_url, updated_at"
    )
    .order("content_type")
    .order("title");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold">Editorial</h1>
        <p className="mt-1 text-sm text-dim">
          Glossary, buying guides and launch radar — the authority layer. Launch entries
          require a linked source.
        </p>
      </div>
      <EditorialAdmin rows={(data ?? []) as EditorialRow[]} />
    </div>
  );
}
