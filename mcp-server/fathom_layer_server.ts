#!/usr/bin/env node
/**
 * Fathom Layer MCP Server
 *
 * Expõe o catálogo verificado como ferramentas MCP, para que um agente rodando
 * no Cursor, no Claude Code ou em qualquer cliente MCP possa consultar dados de
 * hardware e software sem sair do editor.
 *
 * Por que isso importa: é o caminho mais curto para a plataforma deixar de ser
 * "mais um site de reviews" e virar infraestrutura de decisão. Um dev que
 * pergunta "qual GPU roda Llama 70B?" dentro do editor recebe os nossos dados
 * — com a atribuição e o link de afiliado junto.
 *
 * O arquivo anterior era um console.log e um comentário descrevendo isto.
 *
 * Uso (stdio):
 *   npm run mcp
 *
 * Configuração no cliente MCP:
 *   { "fathom-layer": { "command": "npx", "args": ["tsx", "mcp-server/fathom_layer_server.ts"] } }
 */

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';
import type { Database } from '../lib/database.types';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://fathomlayer.com';

const PILLAR_PATH: Record<string, string> = {
  intelligence: 'intelligence',
  compute: 'compute',
  ecosystem_mobility: 'ecosystem',
};

// Chave publicável de propósito: a RLS já garante que só conteúdo aprovado
// pelos quality gates sai daqui. O servidor MCP não precisa — e não deve —
// carregar a service key.
function db() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) {
    throw new Error(
      'Missing NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY in the environment.'
    );
  }
  return createClient<Database>(url, key, { auth: { persistSession: false } });
}

const json = (value: unknown) => ({
  content: [{ type: 'text' as const, text: JSON.stringify(value, null, 2) }],
});

const server = new McpServer({
  name: 'fathom-layer',
  version: '1.0.0',
});

server.registerTool(
  'fathom_search_catalog',
  {
    title: 'Search the Fathom Layer catalog',
    description:
      'Search verified hardware and software by natural-language need — "laptop for running Llama 70B locally", "MCP server for GitHub", "noise cancelling headphones". Returns specs, pros, cons, pricing and the canonical URL. Every entry has passed an editorial review; nothing here is auto-generated.',
    inputSchema: {
      query: z.string().describe('What you are looking for, in plain language.'),
      limit: z.number().int().min(1).max(20).optional().describe('Max results. Defaults to 6.'),
    },
  },
  async ({ query, limit }) => {
    const { data, error } = await db().rpc('search_catalog', {
      q: query,
      max_results: limit ?? 6,
    });
    if (error) return json({ error: error.message, results: [] });

    const results = (data ?? []).map((r) => ({
      entity: r.entity,
      title: r.title,
      brand: r.brand,
      price_from: r.price_from,
      design_score: r.design_score,
      specs: r.specs,
      pros: r.pros,
      cons: r.cons,
      ideal_for: r.ideal_for,
      url: `${SITE_URL}/${PILLAR_PATH[r.pillar] ?? r.pillar}/${r.category_slug}/${r.slug}`,
    }));

    return json({
      results,
      source: 'Fathom Layer — editorially reviewed catalog',
      note: results.length === 0 ? 'Nothing in the catalog matches this query.' : undefined,
    });
  }
);

server.registerTool(
  'fathom_get_item',
  {
    title: 'Get one catalog item in full',
    description:
      'Fetch the complete verified record for a single product or software entry by slug, including the full editorial assessment and the date the data was last verified.',
    inputSchema: {
      slug: z.string().describe('The item slug, e.g. "nvidia-geforce-rtx-5090".'),
    },
  },
  async ({ slug }) => {
    const client = db();
    const { data: product } = await client
      .from('products')
      .select('*, categories(slug, name, pillar)')
      .eq('slug', slug)
      .eq('status', 'published')
      .maybeSingle();

    const row =
      product ??
      (
        await client
          .from('software')
          .select('*, categories(slug, name, pillar)')
          .eq('slug', slug)
          .eq('status', 'published')
          .maybeSingle()
      ).data;

    if (!row) return json({ error: `No published item with slug "${slug}".` });

    const rel = (row as { categories?: unknown }).categories;
    const cat = (Array.isArray(rel) ? rel[0] : rel) as
      | { slug: string; name: string; pillar: string }
      | null;

    return json({
      ...row,
      url: cat
        ? `${SITE_URL}/${PILLAR_PATH[cat.pillar] ?? cat.pillar}/${cat.slug}/${slug}`
        : null,
    });
  }
);

server.registerTool(
  'fathom_compare',
  {
    title: 'Compare catalog items side by side',
    description:
      'Compare two or more items by slug, returning their specs, scores, pricing and stated trade-offs together so the differences are readable at a glance.',
    inputSchema: {
      slugs: z.array(z.string()).min(2).max(5).describe('Two to five item slugs to compare.'),
    },
  },
  async ({ slugs }) => {
    const client = db();
    const { data: products } = await client
      .from('products')
      .select('slug, title, brand, price_from, design_score, specs, pros, cons, ideal_for')
      .in('slug', slugs)
      .eq('status', 'published');
    const { data: software } = await client
      .from('software')
      .select('slug, name, price_from, price_text, pros, cons, ideal_for, key_features')
      .in('slug', slugs)
      .eq('status', 'published');

    const found = [...(products ?? []), ...(software ?? [])];
    const missing = slugs.filter((s) => !found.some((f) => f.slug === s));

    return json({
      items: found,
      missing: missing.length ? missing : undefined,
      note: missing.length
        ? 'Some slugs are not in the published catalog — they are omitted rather than guessed.'
        : undefined,
    });
  }
);

server.registerTool(
  'fathom_launch_radar',
  {
    title: 'Check the launch radar',
    description:
      'Check whether a successor or replacement is expected for a product line, so a recommendation is not made days before it is superseded. Every radar entry carries a source; rumours without one are not published.',
    inputSchema: {
      keyword: z.string().describe('Brand, product line or technology, e.g. "RTX 5090", "Apple M4".'),
    },
  },
  async ({ keyword }) => {
    const { data } = await db()
      .from('editorial_pages')
      .select('title, slug, expected_release_date, launch_confidence, source_url')
      .eq('content_type', 'launch')
      .eq('status', 'published')
      .ilike('title', `%${keyword}%`)
      .limit(5);

    return json({
      launches: (data ?? []).map((l) => ({
        ...l,
        url: `${SITE_URL}/radar/${l.slug}`,
      })),
    });
  }
);

server.registerTool(
  'fathom_list_categories',
  {
    title: 'List catalog categories',
    description:
      'List the categories the catalog currently covers, with how many published items each holds. Useful for understanding coverage before asking a question the catalog cannot answer.',
    inputSchema: {},
  },
  async () => {
    const { data } = await db()
      .from('categories')
      .select('slug, name, pillar, active_listing_count')
      .order('pillar');

    return json({
      categories: (data ?? []).map((c) => ({
        slug: c.slug,
        name: c.name,
        pillar: c.pillar,
        published_items: c.active_listing_count,
        url: `${SITE_URL}/${PILLAR_PATH[c.pillar] ?? c.pillar}/${c.slug}`,
      })),
    });
  }
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  // stderr de propósito: stdout é o canal JSON-RPC e qualquer coisa impressa
  // ali corrompe o protocolo.
  console.error('Fathom Layer MCP server ready on stdio.');
}

main().catch((error) => {
  console.error('Fathom Layer MCP server failed to start:', error);
  process.exit(1);
});
