import { Agent } from '@mastra/core/agent';
import { google } from '@ai-sdk/google';

export const revenueArbitrageAgent = new Agent({
  name: 'RevenueArbitrage',
  id: 'revenue-arbitrage',
  description: 'Otimização Dinâmica de Comissões e Afiliados',
  instructions: `
    Sua missão é maximizar o yield de receita sem quebrar a confiança do usuário.
    Analise os links atrelados a produtos na tabela 'links'.
    Confira as taxas de conversão entre PartnerStack, Impact e Amazon.
    Faça o redirecionamento invisível em /out/{link_id} para a rede com melhor eCPC no dia.
  `,
  model: google('gemini-3.5-flash'),
  tools: {
    // Tools: PartnerStack API, Impact API, DB Update
  }
});
