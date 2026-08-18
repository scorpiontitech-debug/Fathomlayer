"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/supabase/auth";
import { supabaseAdmin } from "@/lib/supabase/server";

export type LinkResult = { ok: boolean; error?: string; id?: string };

export type LinkInput = {
  id?: string;
  entity_type: "product" | "software";
  entity_id: string;
  program_name: string;
  url: string;
  label: string | null;
  region: string;
  is_primary: boolean;
};

// Afiliado exige HTTPS: um link http quebra o selo de segurança do navegador
// no exato momento em que o leitor decide gastar dinheiro.
function validateUrl(raw: string): { ok: true; url: string } | { ok: false; error: string } {
  const value = raw.trim();
  if (!value) return { ok: false, error: "Destination URL is required." };
  let parsed: URL;
  try {
    parsed = new URL(value);
  } catch {
    return { ok: false, error: "Destination URL is not a valid URL (include https://)." };
  }
  if (parsed.protocol !== "https:") {
    return { ok: false, error: "Destination URL must use https://." };
  }
  return { ok: true, url: parsed.toString() };
}

// Só um link primário por item: é ele que ganha o botão de destaque na página.
// Dois primários fazem a página escolher em silêncio — e a escolha silenciosa
// sempre acaba sendo a errada.
async function demoteSiblings(
  admin: NonNullable<ReturnType<typeof supabaseAdmin>>,
  entityType: string,
  entityId: string,
  keepId?: string
) {
  let q = admin
    .from("links")
    .update({ is_primary: false })
    .eq("entity_type", entityType)
    .eq("entity_id", entityId);
  if (keepId) q = q.neq("id", keepId);
  await q;
}

export async function saveLink(input: LinkInput): Promise<LinkResult> {
  await requireAdmin();
  const admin = supabaseAdmin();
  if (!admin) return { ok: false, error: "SUPABASE_SECRET_KEY is not configured." };

  if (!input.entity_id) return { ok: false, error: "Pick the product or software this link points to." };

  const program = input.program_name.trim();
  if (!program) return { ok: false, error: "Program name is required — it is what the disclosure names." };

  const checked = validateUrl(input.url);
  if (!checked.ok) return { ok: false, error: checked.error };

  const payload = {
    entity_type: input.entity_type,
    entity_id: input.entity_id,
    program_name: program,
    url: checked.url,
    label: input.label?.trim() || null,
    region: input.region.trim().toLowerCase() || "global",
    is_primary: input.is_primary,
  };

  if (input.id) {
    const { error } = await admin.from("links").update(payload).eq("id", input.id);
    if (error) return { ok: false, error: error.message };
    if (payload.is_primary) {
      await demoteSiblings(admin, payload.entity_type, payload.entity_id, input.id);
    }
    revalidatePath("/", "layout");
    return { ok: true, id: input.id };
  }

  const { data, error } = await admin.from("links").insert(payload).select("id").single();
  if (error) return { ok: false, error: error.message };
  if (payload.is_primary) {
    await demoteSiblings(admin, payload.entity_type, payload.entity_id, data.id);
  }
  revalidatePath("/", "layout");
  return { ok: true, id: data.id };
}

export async function deleteLink(id: string): Promise<LinkResult> {
  await requireAdmin();
  const admin = supabaseAdmin();
  if (!admin) return { ok: false, error: "SUPABASE_SECRET_KEY is not configured." };

  const { error } = await admin.from("links").delete().eq("id", id);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/", "layout");
  return { ok: true };
}

export async function makePrimary(id: string): Promise<LinkResult> {
  await requireAdmin();
  const admin = supabaseAdmin();
  if (!admin) return { ok: false, error: "SUPABASE_SECRET_KEY is not configured." };

  const { data: link, error: readErr } = await admin
    .from("links")
    .select("id, entity_type, entity_id")
    .eq("id", id)
    .maybeSingle();
  if (readErr) return { ok: false, error: readErr.message };
  if (!link) return { ok: false, error: "Link no longer exists." };

  await demoteSiblings(admin, link.entity_type, link.entity_id, id);
  const { error } = await admin.from("links").update({ is_primary: true }).eq("id", id);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/", "layout");
  return { ok: true };
}
