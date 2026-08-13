import { anthropic } from '@ai-sdk/anthropic';
import { streamText, tool } from 'ai';
import { z } from 'zod';
import { supabasePublic } from '@/lib/supabase/server';

export const maxDuration = 30;

// SYSTEM PROMPT MESTRE
const systemPrompt = `Você é a Fathom Consultant AI, a inteligência central da Fathom Layer.
Sua função é atuar como o mais inteligente, técnico e imparcial consultor de hardware e tecnologia do mundo.

DIRETRIZES:
1. NÚMEROS ANTES DE ADJETIVOS: Nunca use jargões de marketing vazios ("revolucionário", "incrível"). Use especificações técnicas (ex: "tem 24GB de VRAM GDDR6X", "pesa 1.2kg").
2. CONHECIMENTO DE MERCADO: Você tem acesso ao banco de dados da Fathom Layer, que cobre Ecosystem & Mobility (EVs, Smartphones), Compute (Workstations, Laptops) e Intelligence (Software AI).
3. USE AS FERRAMENTAS: Se o usuário pedir recomendações ou comparar hardwares, USE a ferramenta 'queryIndex' para ler os dados reais do banco. Nunca invente dados.
4. ESTILO DE COMUNICAÇÃO: Cinematográfico, direto, profissional, com tom de um "Oráculo Tecnológico" ou "Terminal de Dados". Formate sua resposta usando listas limpas.
5. IDIOMA: Responda em Português do Brasil a menos que especificado de outra forma.`;

export async function POST(req: Request) {
  const { messages, productContext } = await req.json();

  let finalSystemPrompt = systemPrompt;
  if (productContext) {
    finalSystemPrompt += `\n\nATENÇÃO: O usuário está atualmente visualizando o seguinte produto. Se ele fizer perguntas implícitas ("este notebook", "a bateria é boa?"), refira-se a este produto:\n${JSON.stringify(productContext, null, 2)}`;
  }

  const result = streamText({
    model: anthropic('claude-3-5-sonnet-latest'),
    system: finalSystemPrompt,
    messages,
    tools: {
      queryIndex: tool({
        description: 'Busca hardwares ou softwares no banco de dados da Fathom Layer baseando-se no tipo de produto (categoria) ou palavras-chave. Retorna uma lista dos itens mais relevantes (specs, prós, contras e preço de referência).',
        parameters: z.object({
          query: z.string().describe('O que o usuário está buscando (ex: laptop para IA, EV, fone com cancelamento de ruído)'),
          type: z.enum(['product', 'software', 'all']).describe('Filtra entre hardware(product) ou software, ou ambos(all)'),
          limit: z.number().optional().default(5).describe('Número máximo de resultados')
        }),
        // @ts-ignore: AI SDK typing glitch
        execute: async ({ query, type, limit }: any) => {
          const client = supabasePublic();
          let results = [];
          
          if (type === 'product' || type === 'all') {
            const { data: products } = await client
              .from('products')
              .select('id, title, brand, price_from, design_score, specs, pros, cons, ideal_for')
              .eq('status', 'published')
              .ilike('title', `%${query}%`)
              .order('design_score', { ascending: false })
              .limit(limit);
              
            if (products) results.push(...products.map(p => ({ ...p, entity: 'product' })));
          }

          if (type === 'software' || type === 'all') {
            const { data: software } = await client
              .from('software')
              .select('id, name, price_text, pros, cons, ideal_for')
              .eq('status', 'published')
              .ilike('name', `%${query}%`)
              .limit(limit);
              
            if (software) results.push(...software.map(s => ({ ...s, entity: 'software' })));
          }

          return results as any;
        },
      }),
      checkRadar: tool({
        description: 'Consulta o calendário e o radar de lançamentos da tecnologia para prever se um equipamento ficará obsoleto em breve.',
        parameters: z.object({
          keyword: z.string().describe('A marca ou o tipo de tecnologia (ex: RTX 5090, Apple M4, Tesla)')
        }),
        // @ts-ignore: AI SDK typing glitch
        execute: async ({ keyword }: any) => {
          const client = supabasePublic();
          const { data } = await client
            .from('editorial_pages')
            .select('title, expected_release_date, launch_confidence')
            .eq('content_type', 'launch')
            .ilike('title', `%${keyword}%`)
            .eq('status', 'published')
            .limit(3);
            
          return (data ?? []) as any;
        },
      }),
    },
  });

  return result.toTextStreamResponse();
}
