import { requireAdmin } from "@/lib/supabase/auth";
import { supabaseAdmin } from "@/lib/supabase/server";
import { ReviewQueue, type ReviewItem } from "./ReviewQueue";

// Fila de revisão do operador (dashboard-spec 2.2). Sempre dinâmica.
export const dynamic = "force-dynamic";

const countSpecs = (specs: unknown) =>
  specs && typeof specs === "object" && !Array.isArray(specs) ? Object.keys(specs).length : 0;

export default async function ReviewPage() {
  await requireAdmin();

  const admin = supabaseAdmin();
  if (!admin) {
    return (
      <div className="max-w-xl py-16">
        <h1 className="text-xl font-semibold">Review queue</h1>
        <p className="mt-3 text-dim">
          <code className="font-mono">SUPABASE_SECRET_KEY</code> is not configured in{" "}
          <code className="font-mono">.env.local</code>. The review queue needs it to read
          items in <code className="font-mono">pending_review</code>.
        </p>
      </div>
    );
  }

  const [productsRes, softwareRes, stagingRes] = await Promise.all([
    admin
      .from("products")
      .select(
        "id, title, brand, description, editorial_notes, design_score, specs, tags, pros, cons, ideal_for, price_from, release_year, categories(name)"
      )
      .eq("status", "pending_review")
      .order("created_at"),
    admin
      .from("software")
      .select(
        "id, name, description, editorial_notes, pricing_model, price_text, tags, pros, cons, ideal_for, price_from, release_year, categories(name)"
      )
      .eq("status", "pending_review")
      .order("created_at"),
    admin.from("ingestion_staging").select("status"),
  ]);

  const items: ReviewItem[] = [
    ...(productsRes.data ?? []).map((p) => ({
      kind: "product" as const,
      id: p.id,
      title: p.title,
      subtitle: p.brand ?? "",
      category: p.categories?.name ?? "—",
      specsJson: JSON.stringify(p.specs, null, 2),
      specCount: countSpecs(p.specs),
      tags: p.tags,
      description: p.description ?? "",
      editorialNotes: p.editorial_notes ?? "",
      designScore: p.design_score,
      pros: p.pros,
      cons: p.cons,
      idealFor: p.ideal_for,
      priceFrom: p.price_from,
      releaseYear: p.release_year,
    })),
    ...(softwareRes.data ?? []).map((s) => ({
      kind: "software" as const,
      id: s.id,
      title: s.name,
      subtitle: [s.pricing_model, s.price_text].filter(Boolean).join(" · "),
      category: s.categories?.name ?? "—",
      specsJson: "",
      specCount: 0,
      tags: s.tags,
      description: s.description ?? "",
      editorialNotes: s.editorial_notes ?? "",
      designScore: null,
      pros: s.pros,
      cons: s.cons,
      idealFor: s.ideal_for,
      priceFrom: s.price_from,
      releaseYear: s.release_year,
    })),
  ];

  const stagingCounts = (stagingRes.data ?? []).reduce<Record<string, number>>((acc, row) => {
    acc[row.status] = (acc[row.status] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold">Review queue</h1>
        <p className="mt-1 text-sm text-dim">
          Staging: {stagingCounts["pending"] ?? 0} pending · {stagingCounts["synthesized"] ?? 0}{" "}
          synthesized · {stagingCounts["approved"] ?? 0} promoted ·{" "}
          {stagingCounts["rejected"] ?? 0} rejected — run{" "}
          <code className="font-mono">npm run synthesize</code> to process pending rows.
        </p>
        <p className="mt-1 font-mono text-xs text-faint">
          Publishing pace (roadmap #11): 10–25 new indexable pages/week to start; +25%/week max;
          halve below 50% indexation; stop below 30%.
        </p>
      </div>
      <ReviewQueue items={items} />
    </div>
  );
}
