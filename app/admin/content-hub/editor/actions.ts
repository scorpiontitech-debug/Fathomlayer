"use server";

import { requireAdmin } from "@/lib/supabase/auth";
import { supabaseAdmin } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function savePost(prevState: any, formData: FormData) {
  await requireAdmin();
  const admin = supabaseAdmin();
  
  if (!admin) {
    return { error: "Supabase admin client not initialized." };
  }

  const title = formData.get("title") as string;
  const slug = formData.get("slug") as string;
  const category_id = formData.get("category") as string;
  const excerpt = formData.get("excerpt") as string;
  const content = formData.get("content") as string;
  const action = formData.get("action") as string; // 'draft' or 'publish'

  if (!title || !slug || !content) {
    return { error: "Título, Slug e Conteúdo são obrigatórios." };
  }

  // Get the first author for now (fallback since we don't have an author select yet)
  const { data: authors } = await admin.from("content_authors" as any).select("id").limit(1);
  const author_id = authors && (authors as any[]).length > 0 ? (authors as any[])[0].id : null;

  if (!author_id) {
    return { error: "Nenhum autor cadastrado. Crie um autor no banco de dados primeiro." };
  }

  const status = action === 'publish' ? 'published' : 'draft';
  const published_at = action === 'publish' ? new Date().toISOString() : null;

  const { error } = await admin.from("content_posts" as any).upsert({
    title,
    slug,
    category_id: category_id || null,
    excerpt,
    content,
    author_id,
    status,
    published_at,
    updated_at: new Date().toISOString(),
  }, { onConflict: 'slug' });

  if (error) {
    console.error("Erro ao salvar post:", error);
    return { error: error.message };
  }

  revalidatePath("/admin/content-hub");
  revalidatePath("/news");
  
  redirect("/admin/content-hub");
}
