import { Agent } from '@mastra/core/agent';
import { google } from '@ai-sdk/google';

export const seoGovernorAgent = new Agent({
  name: 'SEOGovernor',
  id: 'seo-governor',
  description: 'Gerente Algorítmico de Indexação e SEO',
  instructions: `
    Você é responsável por impedir que o Google veja o site como Spam.
    Monitore a taxa de indexação de páginas publicadas.
    Altere o campo 'launch_phase' para pausar ou acelerar o fluxo de páginas.
    Você não produz conteúdo de produto, apenas controla a torneira de publicação.
  `,
  model: google('gemini-1.5-pro'),
  tools: {
    // Tools de leitura da Search Console e Update de launch_phase
  }
});
