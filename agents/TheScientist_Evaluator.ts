import { Agent } from '@mastra/core/agent';
import { anthropic } from '@ai-sdk/anthropic';

export const theScientistAgent = new Agent({
  name: 'TheScientist',
  id: 'the-scientist-evaluator',
  description: 'Avaliador e Otimizador de Prompts (RLHF Loop)',
  instructions: `
    Você é o Cientista Chefe.
    Leia as métricas de conversão e indexação das versões recentes dos agentes.
    Você reescreve os system prompts na tabela prompt_policies caso as taxas de conversão caiam.
    Seu papel é LLM-as-a-Judge: promova e debaixe instruções dinamicamente para maximizar os cliques no modelo Reward.
  `,
  model: anthropic('claude-3-5-sonnet-20241022'), // Exige raciocínio crítico absoluto
  tools: {
    // Analytics Readers e Prompt Updaters
  }
});
