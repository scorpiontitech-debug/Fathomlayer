import { createTool } from '@mastra/core/tools';
import { z } from 'zod';
import { createClient } from '@supabase/supabase-js';
import type { Database } from '../../lib/database.types';

// Ferramentas reais para os agentes. Antes deste arquivo, todo agente
// registrado no mastra.config.ts tinha `tools: {}` vazio com um comentário
// no lugar da implementação — ou seja, nenhum deles podia fazer nada.
//
// Todas as escritas param em pending_review por design. O erro que derrubou
// a credibilidade da plataforma foi um script que publicava direto; nenhum
// agente recebe esse poder de volta.

function db() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY;
  if (!url || !key) {
    throw new Error('Supabase credentials missing: set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SECRET_KEY.');
  }
  return createClient<Database>(url, key, { auth: { persistSession: false } });
}

export const searchCatalogTool = createTool({
  id: 'search-catalog',
  description:
    'Search published products and software by natural-language need. Returns scored matches with specs, pros, cons and pricing. Use before claiming anything about what the catalog covers.',
  inputSchema: z.object({
    query: z.string().describe('What to look for, in plain language.'),
    limit: z.number().int().min(1).max(20).optional(),
  }),
  execute: async ({ query, limit }) => {
    const { data, error } = await db().rpc('search_catalog', {
      q: query,
      max_results: limit ?? 8,
    });
    if (error) return { error: error.message, results: [] };
    return { results: data ?? [] };
  },
});

export const catalogGapsTool = createTool({
  id: 'catalog-gaps',
  description:
    'Report where the catalog is thin: categories below the indexability threshold, published items missing specs, prices, images or an editorial note. This is the work queue — read it before deciding what to research next.',
  inputSchema: z.object({}),
  execute: async () => {
    const client = db();
    const [{ data: categories }, { data: products }] = await Promise.all([
      client.from('categories').select('slug, name, pillar, active_listing_count, is_indexable'),
      client
        .from('products')
        .select('slug, title, specs, price_from, image_url, editorial_notes')
        .eq('status', 'published'),
    ]);

    const belowThreshold = (categories ?? [])
      .filter((c) => !c.is_indexable)
      .map((c) => ({ slug: c.slug, name: c.name, listings: c.active_listing_count, needed: Math.max(0, 3 - (c.active_listing_count ?? 0)) }));

    const incomplete = (products ?? [])
      .map((p) => {
        const missing: string[] = [];
        if (!p.specs || Object.keys(p.specs as object).length === 0) missing.push('specs');
        if (p.price_from == null) missing.push('price');
        if (!p.image_url) missing.push('image');
        if ((p.editorial_notes?.length ?? 0) < 200) missing.push('editorial note');
        return missing.length ? { slug: p.slug, title: p.title, missing } : null;
      })
      .filter(Boolean);

    return { categoriesBelowThreshold: belowThreshold, incompleteProducts: incomplete };
  },
});

export const monetisationCoverageTool = createTool({
  id: 'monetisation-coverage',
  description:
    'Report which published items have no affiliate link, and click totals for the ones that do. Items with no link earn nothing regardless of traffic.',
  inputSchema: z.object({}),
  execute: async () => {
    const client = db();
    const [{ data: products }, { data: software }, { data: links }, { data: clicks }] = await Promise.all([
      client.from('products').select('id, slug, title, price_from').eq('status', 'published'),
      client.from('software').select('id, slug, name').eq('status', 'published'),
      client.from('links').select('id, entity_type, entity_id, program_name'),
      client.from('link_clicks').select('link_id'),
    ]);

    const linked = new Set((links ?? []).map((l) => `${l.entity_type}:${l.entity_id}`));
    const uncovered = [
      ...(products ?? [])
        .filter((p) => !linked.has(`product:${p.id}`))
        .map((p) => ({ type: 'product', slug: p.slug, title: p.title, price: p.price_from })),
      ...(software ?? [])
        .filter((s) => !linked.has(`software:${s.id}`))
        .map((s) => ({ type: 'software', slug: s.slug, title: s.name, price: null })),
    ];

    return {
      totalLinks: links?.length ?? 0,
      totalClicks: clicks?.length ?? 0,
      uncoveredCount: uncovered.length,
      // Maior ticket primeiro: é onde a ausência de link custa mais.
      uncovered: uncovered.sort((a, b) => (b.price ?? 0) - (a.price ?? 0)).slice(0, 40),
    };
  },
});

export const stagePendingItemTool = createTool({
  id: 'stage-pending-item',
  description:
    'Stage a researched item into ingestion_staging for human review. Never publishes. Every factual claim must carry the manufacturer URL it came from — an item without a source is rejected.',
  inputSchema: z.object({
    title: z.string(),
    brand: z.string().optional(),
    categorySlug: z.string().describe('Existing category slug the item belongs to.'),
    sourceUrl: z.string().url().describe('Manufacturer or first-party page the specs were read from.'),
    specs: z.record(z.string(), z.string()).describe('Only specifications present on the source page.'),
    summary: z.string().min(80).describe('What this is and who it is for, in plain English.'),
  }),
  execute: async (input) => {
    const client = db();
    const { data: category } = await client
      .from('categories')
      .select('id, slug')
      .eq('slug', input.categorySlug)
      .maybeSingle();
    if (!category) {
      return { ok: false, error: `Unknown category "${input.categorySlug}". Stage only into categories that exist.` };
    }

    const { error } = await client.from('ingestion_staging').insert({
      source_url: input.sourceUrl,
      raw_payload: {
        title: input.title,
        brand: input.brand ?? null,
        category_id: category.id,
        category_slug: category.slug,
        specs: input.specs,
        summary: input.summary,
      },
      status: 'pending',
    } as never);

    if (error) return { ok: false, error: error.message };
    return { ok: true, staged: input.title, note: 'Queued for human review. Not published.' };
  },
});

export const catalogTools = {
  searchCatalog: searchCatalogTool,
  catalogGaps: catalogGapsTool,
  monetisationCoverage: monetisationCoverageTool,
  stagePendingItem: stagePendingItemTool,
};
