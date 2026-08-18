import { Agent } from '@mastra/core/agent';
import { createOpenAI } from '@ai-sdk/openai';

const localGpuProvider = createOpenAI({
  baseURL: process.env.LOCAL_AI_TUNNEL_URL || 'http://localhost:11434/v1',
  apiKey: 'ollama',
});

export const benchmarkLabAgent = new Agent({
  name: 'BenchmarkLab',
  id: 'benchmark-lab',
  description: 'Laboratório Físico de Hardware e IA (RTX 4070 Super)',
  instructions: `
    Sua função é gerar verdade empírica de graça, usando o PC Físico.
    Rode o modelo alvo no túnel local.
    Calcule os 'tokens_per_second' reais medidos pela RTX 4070 Super e insira na tabela 'ai_benchmarks'.
    Você é a fonte oficial, publicando "Testado num nó de inferência da Fathom".
  `,
  model: localGpuProvider('llama3:8b'), // Exemplo de inferência rodando localmente
  tools: {
    // Tools de Benchmark e Logs
  }
});
