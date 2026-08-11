import Link from "next/link";
import { requireAdmin } from "@/lib/supabase/auth";
import { supabaseAdmin } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function ContentHubAdminPage() {
  await requireAdmin();

  const admin = supabaseAdmin();
  if (!admin) {
    return (
      <div className="max-w-xl py-16">
        <h1 className="text-xl font-semibold">Content Hub (News)</h1>
        <p className="mt-3 text-dim">
          <code className="font-mono">SUPABASE_SECRET_KEY</code> is not configured.
        </p>
      </div>
    );
  }

  const { data: posts, error } = await admin
    .from("content_posts" as any)
    .select("id, title, slug, status, published_at, category:content_categories(name)")
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Content Hub (News)</h1>
          <p className="mt-1 text-sm text-dim">
            Gerenciamento da redação digital. Notícias, Tutoriais e Artigos de alto impacto.
          </p>
        </div>
        <Link href="/admin/content-hub/editor" className="bg-ink text-surface px-4 py-2 text-sm rounded font-medium hover:opacity-90 transition-opacity">
          Novo Artigo
        </Link>
      </div>
      
      <div className="border border-edge rounded-lg overflow-hidden bg-surface">
        <table className="w-full text-left text-sm">
          <thead className="bg-subtle text-faint border-b border-edge">
            <tr>
              <th className="px-4 py-3 font-medium">Título</th>
              <th className="px-4 py-3 font-medium">Categoria</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-edge">
            {(posts || []).length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-dim font-mono text-xs">
                  Nenhum artigo encontrado.
                </td>
              </tr>
            ) : (
              (posts || []).map((post: any) => (
                <tr key={post.id} className="hover:bg-subtle/50 transition-colors">
                  <td className="px-4 py-3 font-medium text-strong">
                    {post.title}
                  </td>
                  <td className="px-4 py-3 text-dim">
                    {post.category?.name || "Sem categoria"}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2 py-1 rounded text-[10px] uppercase font-mono tracking-wider ${
                      post.status === 'published' ? 'bg-green-500/10 text-green-500' : 
                      post.status === 'review' ? 'bg-yellow-500/10 text-yellow-500' : 
                      'bg-edge text-dim'
                    }`}>
                      {post.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button className="text-accent hover:underline text-xs">Editar</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
