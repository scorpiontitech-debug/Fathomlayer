"use server";

import { revalidatePath } from "next/cache";
import { findBannedPhrases } from "@/lib/banned-phrases";
import { requireAdmin } from "@/lib/supabase/auth";
import { supabaseAdmin } from "@/lib/supabase/server";

export type ActionResult = { ok: boolean; error?: string };

export type PublishInput = {
  kind: "product" | "software";
  id: string;
  description: string;
  editorial_notes: string;
  design_score: number | null;
  pros: string[];
  cons: string[];
  ideal_for: string[];
  price_from: number | null;
  release_year: number | null;
};

// Publicar = único caminho para `published`. Aplica no servidor:
// - Unique Data Gate (design_score + editorial_notes)
// - Banned-Phrase Blocklist
// - Gate #11 de densidade de dados (pSEO): ≥5 campos combinados de
//   specs + pros + cons + ideal_for — abaixo disso não publica, nunca.
export async function publishItem(input: PublishInput): Promise<ActionResult> {
  await requireAdmin();
  const admin = supabaseAdmin();
  if (!admin) return { ok: false, error: "SUPABASE_SECRET_KEY is not configured." };

  const description = (input.description ?? "").trim();
  const notes = (input.editorial_notes ?? "").trim();
  const pros = (input.pros ?? []).map((s) => s.trim()).filter(Boolean);
  const cons = (input.cons ?? []).map((s) => s.trim()).filter(Boolean);
  const idealFor = (input.ideal_for ?? []).map((s) => s.trim()).filter(Boolean);

  if (!notes) {
    return { ok: false, error: "Editorial note is required before publishing (Unique Data Gate)." };
  }
  if (
    input.kind === "product" &&
    (input.design_score === null || Number.isNaN(input.design_score))
  ) {
    return { ok: false, error: "Design score is required before publishing (Unique Data Gate)." };
  }
  if (
    input.design_score !== null &&
    (input.design_score < 0 || input.design_score > 10)
  ) {
    return { ok: false, error: "Design score must be between 0 and 10." };
  }

  const banned = findBannedPhrases(
    [description, notes, ...pros, ...cons, ...idealFor].join(" ")
  );
  if (banned.length > 0) {
    return { ok: false, error: `Banned phrases found: ${banned.join(", ")}` };
  }

  // Gate #11: densidade mínima de dados por página (specs contadas do banco,
  // não do cliente — o servidor é a fonte da verdade).
  const table = input.kind === "product" ? "products" : "software";
  let specCount = 0;
  if (input.kind === "product") {
    const { data: row } = await admin.from("products").select("specs").eq("id", input.id).maybeSingle();
    if (!row) return { ok: false, error: "Item not found." };
    specCount =
      row.specs && typeof row.specs === "object" && !Array.isArray(row.specs)
        ? Object.keys(row.specs).length
        : 0;
  }
  const combined = specCount + pros.length + cons.length + idealFor.length;
  if (combined < 5) {
    return {
      ok: false,
      error: `pSEO data gate: needs ≥5 combined specs/pros/cons/ideal-for entries — this item has ${combined}. Add structured data before publishing.`,
    };
  }

  const publishedAt = new Date().toISOString();
  const sharedPatch = {
    description,
    editorial_notes: notes,
    pros,
    cons,
    ideal_for: idealFor,
    price_from: input.price_from,
    release_year: input.release_year,
    status: "published",
    is_indexable: true,
    published_at: publishedAt,
    // Publicar É o ato de verificação humana — o selo público parte daqui
    // (content-spec 7.4; atualização automática só na Camada 2).
    last_verified_at: publishedAt,
  };

  if (input.kind === "product") {
    const { error, count } = await admin
      .from("products")
      .update({ ...sharedPatch, design_score: input.design_score }, { count: "exact" })
      .eq("id", input.id)
      .eq("status", "pending_review");
    if (error) return { ok: false, error: error.message };
    if (count === 0) return { ok: false, error: "Item not found or not in pending_review." };
  } else {
    const { error, count } = await admin
      .from("software")
      .update(sharedPatch, { count: "exact" })
      .eq("id", input.id)
      .eq("status", "pending_review");
    if (error) return { ok: false, error: error.message };
    if (count === 0) return { ok: false, error: "Item not found or not in pending_review." };
  }

  revalidatePath("/", "layout");
  return { ok: true };
}

// Rejeitar devolve para draft — o item sai da fila mas não é destruído.
export async function rejectItem(kind: "product" | "software", id: string): Promise<ActionResult> {
  await requireAdmin();
  const admin = supabaseAdmin();
  if (!admin) return { ok: false, error: "SUPABASE_SECRET_KEY is not configured." };

  const { error } =
    kind === "product"
      ? await admin.from("products").update({ status: "draft" }).eq("id", id)
      : await admin.from("software").update({ status: "draft" }).eq("id", id);
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}
