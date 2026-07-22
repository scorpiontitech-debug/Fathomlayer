"use server";

import { revalidatePath } from "next/cache";
import { findBannedPhrases } from "@/lib/banned-phrases";
import { requireAdmin } from "@/lib/supabase/auth";
import { supabaseAdmin } from "@/lib/supabase/server";

export type EditorialResult = { ok: boolean; error?: string; id?: string };

export type EditorialInput = {
  id?: string;
  content_type: "glossary" | "guide" | "launch";
  title: string;
  slug: string;
  body_markdown: string;
  tags: string[];
  expected_release_date: string | null;
  launch_confidence: "rumored" | "announced" | "confirmed" | null;
  source_url: string | null;
};

const slugify = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);

// Cria ou atualiza uma página editorial. Mesma disciplina do resto do
// sistema: blocklist aplicada no servidor, nunca no cliente.
export async function saveEditorial(input: EditorialInput): Promise<EditorialResult> {
  await requireAdmin();
  const admin = supabaseAdmin();
  if (!admin) return { ok: false, error: "SUPABASE_SECRET_KEY is not configured." };

  const title = input.title.trim();
  const body = input.body_markdown.trim();
  const slug = (input.slug.trim() || slugify(title)) as string;

  if (!title) return { ok: false, error: "Title is required." };
  if (!body) return { ok: false, error: "Body is required." };
  if (!slug) return { ok: false, error: "Slug could not be derived from the title." };

  const banned = findBannedPhrases(`${title} ${body}`);
  if (banned.length > 0) {
    return { ok: false, error: `Banned phrases found: ${banned.join(", ")}` };
  }

  // Radar de lançamento sem fonte é rumor sem procedência (content-spec 7.3)
  if (input.content_type === "launch" && !input.source_url?.trim()) {
    return { ok: false, error: "Launch entries require a source URL — never publish a rumour without one." };
  }

  const payload = {
    content_type: input.content_type,
    title,
    slug,
    body_markdown: body,
    tags: input.tags.map((t) => t.trim().toLowerCase()).filter(Boolean),
    expected_release_date: input.content_type === "launch" ? input.expected_release_date : null,
    launch_confidence: input.content_type === "launch" ? input.launch_confidence : null,
    source_url: input.source_url?.trim() || null,
  };

  if (input.id) {
    const { error } = await admin.from("editorial_pages").update(payload).eq("id", input.id);
    if (error) return { ok: false, error: error.message };
    revalidatePath("/", "layout");
    return { ok: true, id: input.id };
  }

  const { data, error } = await admin
    .from("editorial_pages")
    .insert(payload)
    .select("id")
    .single();
  if (error) {
    return {
      ok: false,
      error: error.code === "23505" ? `Slug "${slug}" already exists.` : error.message,
    };
  }
  revalidatePath("/", "layout");
  return { ok: true, id: data.id };
}

export async function setEditorialStatus(
  id: string,
  publish: boolean
): Promise<EditorialResult> {
  await requireAdmin();
  const admin = supabaseAdmin();
  if (!admin) return { ok: false, error: "SUPABASE_SECRET_KEY is not configured." };

  const { error } = await admin
    .from("editorial_pages")
    .update({
      status: publish ? "published" : "draft",
      is_indexable: publish,
      published_at: publish ? new Date().toISOString() : null,
    })
    .eq("id", id);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/", "layout");
  return { ok: true };
}

export async function deleteEditorial(id: string): Promise<EditorialResult> {
  await requireAdmin();
  const admin = supabaseAdmin();
  if (!admin) return { ok: false, error: "SUPABASE_SECRET_KEY is not configured." };

  const { error } = await admin.from("editorial_pages").delete().eq("id", id);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/", "layout");
  return { ok: true };
}
