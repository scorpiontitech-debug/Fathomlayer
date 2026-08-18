import { anthropic } from '@ai-sdk/anthropic';
import { streamText, tool } from 'ai';
import { z } from 'zod';
import { supabaseAdmin, supabasePublic } from '@/lib/supabase/server';

export const maxDuration = 30;

// Endpoint público que chama um LLM pago. Sem teto, um laço de requisições
// cai direto na fatura. Janela fixa por IP, contada no banco — contador em
// memória não serve porque cada instância serverless teria a sua.
const RATE_LIMIT = { calls: 12, windowSeconds: 60 * 10 };

// Tetos de payload: independem do rate limit e cortam o abuso mais barato,
// que é mandar uma conversa gigante de uma vez só.
const MAX_MESSAGES = 24;
const MAX_CHARS_PER_MESSAGE = 4000;

const systemPrompt = `You are the Fathom Layer Consultant — the platform's technical advisor on hardware, software and consumer technology.

GUIDELINES
1. NUMBERS BEFORE ADJECTIVES. Never use empty marketing language ("revolutionary", "amazing"). Use specifications ("24GB of GDDR6X", "1.2kg", "18 TOPS").
2. THE CATALOG IS THE SOURCE OF TRUTH. Call 'searchCatalog' before recommending anything. If it returns nothing, say the catalog does not cover it yet — never invent a product, a price or a spec.
3. NAME THE TRADE-OFF. Every recommendation states who it is wrong for, not only who it is right for. If two items are close, say what separates them.
4. STAY IN SCOPE. The catalog covers Compute (workstations, laptops, peripherals), Intelligence (AI software, agent frameworks, MCP servers) and Ecosystem & Mobility (smartphones, audio, wearables, AR, EVs, smart home).
5. TONE. Direct, technical, unhurried. Clean lists over dense paragraphs. No preamble.
6. LANGUAGE. Answer in the language the reader used.`;

type ChatMessage = { role: string; content: unknown };

function clientKey(req: Request): string {
  const forwarded = req.headers.get('x-forwarded-for');
  const ip = forwarded?.split(',')[0]?.trim() || req.headers.get('x-real-ip') || 'unknown';
  return `chat:${ip}`;
}

export async function POST(req: Request) {
  const { messages, productContext } = await req.json();

  if (!Array.isArray(messages) || messages.length === 0) {
    return new Response('No messages provided.', { status: 400 });
  }
  if (messages.length > MAX_MESSAGES) {
    return new Response('Conversation too long. Start a new one.', { status: 413 });
  }
  const oversized = (messages as ChatMessage[]).some(
    (m) => typeof m.content === 'string' && m.content.length > MAX_CHARS_PER_MESSAGE
  );
  if (oversized) {
    return new Response('Message too long.', { status: 413 });
  }

  // O contador vive numa tabela com RLS fechada, então prefere a service key.
  // Sem ela (dev sem .env completo) o gate simplesmente não roda — melhor que
  // derrubar o chat inteiro em ambiente local.
  const limiter = supabaseAdmin();
  if (limiter) {
    const { data: allowed, error } = await limiter.rpc('consume_rate_limit', {
      p_bucket: clientKey(req),
      p_limit: RATE_LIMIT.calls,
      p_window_seconds: RATE_LIMIT.windowSeconds,
    });
    // Erro no gate não pode derrubar o chat; só a negação explícita bloqueia.
    if (!error && allowed === false) {
      return new Response(
        'You have reached the request limit for the Consultant. Try again in a few minutes.',
        { status: 429, headers: { 'Retry-After': String(RATE_LIMIT.windowSeconds) } }
      );
    }
  }

  let finalSystemPrompt = systemPrompt;
  if (productContext) {
    finalSystemPrompt += `\n\nThe reader is currently viewing this item. Resolve implicit references ("this laptop", "is the battery good?") against it:\n${JSON.stringify(productContext, null, 2)}`;
  }

  const result = streamText({
    model: anthropic('claude-opus-5'),
    system: finalSystemPrompt,
    messages,
    tools: {
      searchCatalog: tool({
        description:
          'Search published hardware and software in the Fathom Layer catalog. Accepts a natural-language need ("laptop for running local models", "noise cancelling headphones") — it expands intent to domain terms, so pass the reader\'s actual question rather than a single keyword.',
        inputSchema: z.object({
          query: z.string().describe('What the reader is looking for, in their own words.'),
          limit: z.number().int().min(1).max(10).optional()
            .describe('How many results to return. Defaults to 6.'),
        }),
        execute: async ({ query, limit }) => {
          const { data, error } = await supabasePublic().rpc('search_catalog', {
            q: query,
            max_results: limit ?? 6,
          });
          if (error) return { error: 'Catalog search failed.', results: [] };
          return {
            results: data ?? [],
            note: (data?.length ?? 0) === 0
              ? 'Nothing in the catalog matches. Say so — do not substitute outside knowledge as if it were catalog data.'
              : undefined,
          };
        },
      }),
      checkRadar: tool({
        description:
          'Check the launch radar to see whether a replacement or successor is expected soon — use it before recommending a purchase that might be about to be superseded.',
        inputSchema: z.object({
          keyword: z.string().describe('Brand, product line or technology (e.g. "RTX 5090", "Apple M4", "Tesla").'),
        }),
        execute: async ({ keyword }) => {
          const { data } = await supabasePublic()
            .from('editorial_pages')
            .select('title, expected_release_date, launch_confidence, slug')
            .eq('content_type', 'launch')
            .eq('status', 'published')
            .ilike('title', `%${keyword}%`)
            .limit(3);
          return { launches: data ?? [] };
        },
      }),
    },
  });

  return result.toUIMessageStreamResponse({
    onError: (error) => {
      const message = error instanceof Error ? error.message : String(error);
      if (message.includes('rate_limit') || message.includes('overloaded')) {
        return 'The Consultant is at capacity right now. Try again in a moment.';
      }
      return 'Something went wrong reaching the Consultant.';
    },
  });
}
