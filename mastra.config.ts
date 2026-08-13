import { Mastra } from '@mastra/core';
import { contentResearcherAgent } from './agents/ContentResearcherAgent';

// Configuração central do framework Mastra
export const mastra = new Mastra({
  agents: {
    contentResearcher: contentResearcherAgent,
  },
  // Opcionalmente podemos configurar workflows persistentes
  workflows: {
    // Definiremos os workflows baseados em grafo (Zod + State Machine)
  },
  // telemetry option removed due to strict typing constraints
});
