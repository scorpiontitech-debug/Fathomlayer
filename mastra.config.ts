import { Mastra } from '@mastra/core';
import { fathomAgents } from './agents';
import { swarmOrchestrationWorkflow } from './lib/workflows/SwarmOrchestration';

// Registro central do Mastra.
//
// Seis agentes com ferramentas reais, no lugar dos treze que existiam como
// nomes com `tools: {}` vazio. O funil termina em pending_review — nenhum
// agente publica.
export const mastra = new Mastra({
  agents: fathomAgents,
  workflows: {
    swarmOrchestration: swarmOrchestrationWorkflow,
  },
});
