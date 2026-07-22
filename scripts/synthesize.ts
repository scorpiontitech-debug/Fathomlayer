/**
 * Pipeline de síntese (roadmap #1): processa ingestion_staging.
 *
 * pending -> [gera description] -> synthesized -> [promove p/ products
 * como pending_review] -> approved. A publicação continua 100% humana,
 * no /admin/review.
 *
 * REGRA DURA (gaps-roadmap #1): a IA só escreve o que está em raw_payload.
 * Qualquer número no texto que não exista na fonte é rejeitado pelo próprio
 * pipeline e o item cai no template mecânico — regra de sistema, não sugestão.
 *
 * Uso: npm run synthesize
 * Env: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SECRET_KEY (obrigatórias),
 *      ANTHROPIC_API_KEY (opcional — sem ela usa template mecânico).
 */

import fs from "node:fs";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";
import Anthropic from "@anthropic-ai/sdk";
import type { Database, Json } from "../lib/database.types";
import { findBannedPhrases } from "../lib/banned-phrases";

// --- .env.local loader (sem dependência externa) ---
function loadEnvLocal() {
  const file = path.join(process.cwd(), ".env.local");
  if (!fs.existsSync(file)) return;
  for (const line of fs.readFileSync(file, "utf8").split(/\r?\n/)) {
    const match = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);
    if (!match) continue;
    const [, key, rawValue] = match;
    if (process.env[key] !== undefined) continue;
    process.env[key] = rawValue.replace(/^["']|["']$/g, "");
  }
}
loadEnvLocal();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const secretKey = process.env.SUPABASE_SECRET_KEY;
if (!supabaseUrl || !secretKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SECRET_KEY in .env.local");
  process.exit(1);
}

const db = createClient<Database>(supabaseUrl, secretKey, {
  auth: { persistSession: false },
});

const anthropicKey = process.env.ANTHROPIC_API_KEY;
const anthropic = anthropicKey ? new Anthropic({ apiKey: anthropicKey }) : null;

type ProductPayload = {
  title?: string;
  slug?: string;
  brand?: string;
  specs?: Record<string, unknown>;
  tags?: string[];
  price_from?: number;
  release_year?: number;
  source_note?: string;
};

type Synthesis = {
  description: string;
  pros: string[];
  cons: string[];
  ideal_for: string[];
  method: "claude" | "template";
};

// Template mecânico: 100% derivado do payload, zero geração.
function mechanicalDescription(payload: ProductPayload): string {
  const specs = payload.specs ?? {};
  const parts = Object.entries(specs)
    .filter(([key]) => key !== "tier")
    .map(([key, value]) => `${key.replace(/_/g, " ")}: ${value}`);
  return `${payload.title ?? "Unknown"} — ${parts.join("; ")}.`;
}

// Checagem de aterramento: todo número da descrição precisa existir na fonte.
function numbersAreGrounded(description: string, payload: ProductPayload): boolean {
  const source = JSON.stringify(payload).toLowerCase();
  const numbers = description.match(/\d+(?:[.,]\d+)?/g) ?? [];
  return numbers.every((n) => source.includes(n.replace(",", ".")) || source.includes(n));
}

const SYNTHESIS_SYSTEM = `You write structured product analysis for Fathom Layer, an independent technology index.
HARD RULE: use ONLY facts present in the JSON payload the user provides. Never introduce numbers, model names, benchmarks, or claims that are not literally in the payload.
Style: quiet authority — verified numbers before adjectives; no marketing language; no superlatives; English.
Output:
- description: 40-80 words, starts with what the product is and who it serves based strictly on the payload's tier/specs.
- pros / cons: 2-4 short factual statements each, every one derivable from the payload (a con can be a structural trade-off visible in the specs, e.g. non-upgradeable unified memory).
- ideal_for: 1-3 short audience phrases grounded in tier/specs.`;

const fallback = (payload: ProductPayload): Synthesis => ({
  description: mechanicalDescription(payload),
  pros: [],
  cons: [],
  ideal_for: [],
  method: "template",
});

async function synthesize(payload: ProductPayload): Promise<Synthesis> {
  if (!anthropic) return fallback(payload);
  try {
    const response = await anthropic.messages.create({
      model: "claude-opus-4-8",
      max_tokens: 2048,
      system: SYNTHESIS_SYSTEM,
      output_config: {
        format: {
          type: "json_schema",
          schema: {
            type: "object",
            properties: {
              description: { type: "string" },
              pros: { type: "array", items: { type: "string" } },
              cons: { type: "array", items: { type: "string" } },
              ideal_for: { type: "array", items: { type: "string" } },
            },
            required: ["description", "pros", "cons", "ideal_for"],
            additionalProperties: false,
          },
        },
      },
      messages: [{ role: "user", content: JSON.stringify(payload) }],
    });
    if (response.stop_reason === "refusal") return fallback(payload);
    const text = response.content.find((b) => b.type === "text")?.text ?? "";
    const parsed = JSON.parse(text) as Omit<Synthesis, "method">;
    const allTexts = [parsed.description, ...parsed.pros, ...parsed.cons, ...parsed.ideal_for];

    // Gates do pipeline: sem frases banidas, sem números fora da fonte —
    // em TODOS os campos gerados, não só na descrição.
    const violates = allTexts.some(
      (t) => findBannedPhrases(t).length > 0 || !numbersAreGrounded(t, payload)
    );
    if (violates) {
      console.warn(`  rejected AI output (banned phrase or ungrounded number) — using template`);
      return fallback(payload);
    }
    return {
      description: parsed.description.trim(),
      pros: parsed.pros.map((s) => s.trim()).filter(Boolean),
      cons: parsed.cons.map((s) => s.trim()).filter(Boolean),
      ideal_for: parsed.ideal_for.map((s) => s.trim()).filter(Boolean),
      method: "claude",
    };
  } catch (error) {
    console.warn(`  Claude call failed (${(error as Error).message}) — using template`);
    return fallback(payload);
  }
}

async function main() {
  const { data: rows, error } = await db
    .from("ingestion_staging")
    .select("*")
    .eq("status", "pending")
    .order("fetched_at");
  if (error) throw error;

  if (!rows || rows.length === 0) {
    console.log("No pending staging rows.");
  }

  for (const row of rows ?? []) {
    if (row.target_table !== "products") {
      console.log(`skip ${row.id}: target_table=${row.target_table} not handled yet`);
      continue;
    }
    const payload = row.raw_payload as ProductPayload;
    if (!payload.title || !payload.slug || !row.proposed_category_id) {
      console.log(`skip ${row.id}: payload missing title/slug or no proposed_category_id`);
      continue;
    }

    console.log(`synthesizing: ${payload.title}`);
    const synthesis = await synthesize(payload);

    const { error: updateError } = await db
      .from("ingestion_staging")
      .update({
        ai_synthesis: synthesis as unknown as Json,
        status: "synthesized",
      })
      .eq("id", row.id);
    if (updateError) throw updateError;
  }

  // Promove tudo que está synthesized para products como pending_review.
  const { data: synthesized, error: synthError } = await db
    .from("ingestion_staging")
    .select("*")
    .eq("status", "synthesized")
    .eq("target_table", "products");
  if (synthError) throw synthError;

  for (const row of synthesized ?? []) {
    const payload = row.raw_payload as ProductPayload;
    const synthesis = row.ai_synthesis as Partial<Synthesis> | null;
    if (!payload.slug || !payload.title || !row.proposed_category_id) continue;

    const { error: insertError } = await db.from("products").insert({
      category_id: row.proposed_category_id,
      title: payload.title,
      slug: payload.slug,
      brand: payload.brand ?? null,
      description: synthesis?.description ?? null,
      pros: synthesis?.pros ?? [],
      cons: synthesis?.cons ?? [],
      ideal_for: synthesis?.ideal_for ?? [],
      price_from: payload.price_from ?? null,
      release_year: payload.release_year ?? null,
      specs: (payload.specs ?? {}) as Json,
      tags: payload.tags ?? [],
      status: "pending_review",
    });
    // 23505 = slug já existe (re-execução) — marca como promovido mesmo assim.
    if (insertError && insertError.code !== "23505") {
      console.error(`promote failed for ${payload.slug}: ${insertError.message}`);
      continue;
    }

    const { error: approveError } = await db
      .from("ingestion_staging")
      .update({ status: "approved" })
      .eq("id", row.id);
    if (approveError) throw approveError;

    console.log(`promoted to pending_review: ${payload.slug}`);
  }

  console.log("Done. Review at /admin/review.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
