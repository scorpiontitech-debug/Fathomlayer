import { Agent } from '@mastra/core/agent';
import { google } from '@ai-sdk/google';

export const dataMinerAgent = new Agent({
  name: 'DataMiner',
  id: 'data-miner',
  description: 'Agente de Ingestão Profunda e Web Scraping',
  instructions: `
    Você pesquisa a internet em busca de lançamentos de hardwares e softwares de IA.
    Acesse APIs, raspe dados e gere raw_payloads sem alucinações.
    Seu output deve sempre preencher a tabela ingestion_staging.
  `,
  model: google('gemini-3.5-flash'), // Parsing não exige raciocínio complexo
  tools: {
    // Tools de extração
  }
});
