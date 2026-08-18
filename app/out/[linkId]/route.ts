import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin, supabasePublic } from "@/lib/supabase/server";

// /out/{link_id}: registra o clique e responde 302 para a URL de afiliado.
// Zero JavaScript client-side; funciona com ad-blocker (roadmap #4).
// A URL de destino vive no banco — trocável sem reindexar páginas.

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function GET(
  req: NextRequest,
  ctx: { params: Promise<{ linkId: string }> }
) {
  const { linkId } = await ctx.params;
  if (!UUID_RE.test(linkId)) {
    return NextResponse.redirect(new URL("/", req.url), 302);
  }

  const admin = supabaseAdmin();
  const db = admin ?? supabasePublic();

  const { data: link } = await db
    .from("links")
    .select("id, url")
    .eq("id", linkId)
    .maybeSingle();

  if (!link) {
    return NextResponse.redirect(new URL("/", req.url), 302);
  }

  // Tracking nunca pode impedir o redirect: receita > analytics.
  if (admin) {
    let referrerPath: string | null = null;
    const referer = req.headers.get("referer");
    if (referer) {
      try {
        referrerPath = new URL(referer).pathname;
      } catch {
        referrerPath = null;
      }
    }
    try {
      await admin.from("link_clicks").insert({
        link_id: link.id,
        referrer_path: referrerPath,
        region_detected: req.headers.get("x-vercel-ip-country"),
      });
    } catch {
      // silencioso por design
    }
  }

  return NextResponse.redirect(link.url, 302);
}
