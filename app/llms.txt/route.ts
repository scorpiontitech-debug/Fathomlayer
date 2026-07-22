import { getIndexableCategories } from "@/lib/queries";
import { SITE_URL } from "@/lib/seo";
import { pillarByKey } from "@/lib/taxonomy";

// /llms.txt — item deliberadamente de baixa prioridade (content-spec §9):
// barato de gerar, não é pilar da estratégia. Derivado do banco via RLS.
export const revalidate = 3600;

export async function GET() {
  const categories = await getIndexableCategories();

  const categoryLines = categories
    .map((c) => {
      const pillar = pillarByKey(c.pillar);
      if (!pillar) return null;
      return `- [${c.name}](${SITE_URL}/${pillar.slug}/${c.slug}): ${
        c.description ?? `${c.active_listing_count} human-reviewed items`
      }`;
    })
    .filter(Boolean)
    .join("\n");

  const body = `# Fathom Layer

> An independent technology index: hardware, software and AI evaluated with verified data and in-house editorial criteria. No paid rankings; every item is human-reviewed and design-scored (0-10).

## Index
${categoryLines || "- Catalog in curation — first cluster: local AI hardware."}

## Tools
- [Local AI Hardware Calculator](${SITE_URL}/calculator): pick a model, see the memory tier it needs and hardware that runs it.

## Trust
- [Methodology](${SITE_URL}/methodology): how the design score works and why placement is not for sale.
- [About](${SITE_URL}/about): who runs the index.
- [Affiliate disclosure](${SITE_URL}/affiliate-disclosure): how the site is funded.
`;

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
