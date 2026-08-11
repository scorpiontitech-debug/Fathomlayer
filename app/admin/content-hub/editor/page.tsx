import { requireAdmin } from "@/lib/supabase/auth";
import { supabaseAdmin } from "@/lib/supabase/server";
import { EditorForm } from "./EditorForm";

export const dynamic = "force-dynamic";

export default async function ContentEditorPage() {
  await requireAdmin();
  
  const admin = supabaseAdmin();
  const { data: categories } = await admin!.from("content_categories" as any).select("id, name");

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-32">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Novo Artigo</h1>
          <p className="mt-1 text-sm text-dim">
            Redija o conteúdo utilizando Markdown.
          </p>
        </div>
      </div>

      <EditorForm categories={(categories as any) || []} />
    </div>
  );
}
