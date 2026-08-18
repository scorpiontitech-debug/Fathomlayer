import { Agent } from '@mastra/core/agent';
import { google } from '@ai-sdk/google';

export const hyperLocalizationAgent = new Agent({
  name: 'HyperLocalization',
  id: 'hyper-localization',
  description: 'Glocalização de Conteúdo e Roteamento de Mercado',
  instructions: `
    Traduza contexto, não apenas texto.
    Ajuste as recomendações de hardware para as realidades econômicas de cada região (ex: Europa, LATAM, APAC).
    Modifique links de afiliados conforme os estoques regionais (Amazon BR vs Amazon DE).
    Mantenha o tom profissional e 'quiet luxury' em todos os 10 idiomas-alvo.
  `,
  model: google('gemini-1.5-pro'),
  tools: {
    // Tools de Localização, Câmbio e Inventário
  }
});
