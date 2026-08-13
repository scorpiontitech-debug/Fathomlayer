import { Agent } from '@mastra/core/agent';
import { z } from 'zod';

import { anthropic } from '@ai-sdk/anthropic';

// Criação do Agente Corporativo com Mastra
// Este agente substitui o fluxo de execução linear (antigo deep-research.ts)
// Ele possui ferramentas (tools) e estado de memória.

export const contentResearcherAgent = new Agent({
  name: 'ContentResearcher',
  id: 'content-researcher',
  description: 'Pesquisa e escreve artigos de inovação e tecnologia',
  instructions: `
    Você é um redator sênior de inovação corporativa.
    Pesquise o tema, rascunhe a estrutura, e antes de publicar, salve o rascunho.
    Sempre respeite as regras de tipagem do Supabase (Zod schemas).
  `,
  model: anthropic('claude-3-5-sonnet-20241022'),
  tools: {
    saveDraft: {
      description: 'Salva um rascunho de artigo na base de dados para aprovação humana.',
      inputSchema: z.object({
        title: z.string().describe('O título chamativo do artigo'),
        content: z.string().describe('O conteúdo Markdown do artigo'),
        categoryId: z.string().uuid().describe('A categoria UUID relacionada'),
      }),
      execute: async ({ context }: { context: any }) => {
        // Mock ou chamada MCP real para inserir na base de dados
        console.log(`Salvando rascunho (Human-in-the-loop pending): ${context.title}`);
        
        // Em um cenário real, aqui seria feita uma RPC via Supabase
        // await supabase.from('content_posts').insert({...})
        
        return { success: true, status: 'draft_saved' };
      }
    }
  }
});
