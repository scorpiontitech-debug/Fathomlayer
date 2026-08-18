import { Agent } from '@mastra/core/agent';
import { createOpenAI } from '@ai-sdk/openai';

// O provedor local aponta para o túnel do PC com a RTX 4070 Super
const localGpuProvider = createOpenAI({
  baseURL: process.env.LOCAL_AI_TUNNEL_URL || 'http://localhost:11434/v1',
  apiKey: 'ollama', // Ollama não exige chave real, mas a lib exige a string
});

export const knowledgeGraphAgent = new Agent({
  name: 'KnowledgeGraphArchitect',
  id: 'knowledge-graph',
  description: 'Arquitetura de Memória e Embeddings Vetoriais via 4070 Super',
  instructions: `
    Construa o tecido conjuntivo da plataforma sem gastar tokens na nuvem.
    Receba JSON de hardwares/softwares, converta textos longos em Embeddings.
    Sua força computacional vem do Nó Físico (4070 Super). Use o modelo nomic-embed-text.
  `,
  model: localGpuProvider('nomic-embed-text'), // Usando a placa local para vetorização
  tools: {
    // Vector Generators RPC tools
  }
});
