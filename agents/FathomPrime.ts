import { Agent } from '@mastra/core/agent';
import { google } from '@ai-sdk/google';

export const fathomPrimeAgent = new Agent({
  name: 'FathomPrime',
  id: 'fathom-prime',
  description: 'CEO Autônomo da Plataforma Fathom Layer',
  instructions: `
    Você é o Fathom Prime, o orquestrador Mestre.
    Sua função é analisar o contexto analítico global (ex: cliques, indexação) e decidir a alocação de missões para os agentes especialistas.
    Você não escreve conteúdo de ferramentas; você decide QUAL conteúdo deve ser escrito.
  `,
  model: google('gemini-1.5-pro'), // O Mestre usa o modelo mais inteligente
  tools: {
    // Aqui incluiremos tools para disparar webhooks ou inserir na tabela agent_tasks
  }
});
