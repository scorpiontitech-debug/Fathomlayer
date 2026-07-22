import type { Metadata } from "next";
import { Calculator, type CalculatorItem } from "@/components/calculator/Calculator";
import { getIndexableCategories } from "@/lib/queries";
import { supabasePublic } from "@/lib/supabase/server";
import { pillarByKey } from "@/lib/taxonomy";

// Página flagship (design system 5.1): ferramenta interativa da calculadora.
// Lê produtos publicados do pilar compute; o quality gate decide o que aparece.
export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Local AI Hardware Calculator",
  description:
    "Pick the model you want to run locally and see which memory tier it needs — with hardware picks from the index that actually run it.",
  alternates: { canonical: "/calculator" },
};

export default async function CalculatorPage() {
  const categories = await getIndexableCategories();
  const computeCategories = categories.filter((c) => c.pillar === "compute");
  const categoryById = new Map(computeCategories.map((c) => [c.id, c]));

  let items: CalculatorItem[] = [];
  if (computeCategories.length > 0) {
    const { data: products } = await supabasePublic()
      .from("products")
      .select("*")
      .in(
        "category_id",
        computeCategories.map((c) => c.id)
      )
      .order("design_score", { ascending: false, nullsFirst: false });

    items = (products ?? []).flatMap((product) => {
      const category = categoryById.get(product.category_id);
      const pillar = category ? pillarByKey(category.pillar) : null;
      if (!category || !pillar) return [];
      return [{ product, href: `/${pillar.slug}/${category.slug}/${product.slug}` }];
    });
  }

  return (
    <div className="space-y-12">
      <header className="rise-group max-w-2xl">
        <p className="font-mono text-xs uppercase tracking-[0.22em] text-dim">
          Interactive tool
        </p>
        <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight sm:text-5xl">
          Local AI Hardware Calculator
        </h1>
        <p className="mt-3 text-lg leading-relaxed text-dim">
          Pick the model you want to run on your own machine. The calculator shows which
          memory tier it needs — and which hardware in this index actually runs it, based on
          verified specifications.
        </p>
      </header>

      <Calculator items={items} />

      <p className="max-w-2xl text-sm leading-relaxed text-faint">
        Tier requirements reflect the model-to-hardware pairings documented in this index's
        research: quantized inference with usable throughput, not theoretical minimums.
        Details in the{" "}
        <a href="/methodology" className="text-dim underline-offset-4 hover:underline">
          methodology
        </a>
        .
      </p>
    </div>
  );
}
