import { Mastra } from '@mastra/core';
import { contentResearcherAgent } from './agents/ContentResearcherAgent';
import { fathomPrimeAgent } from './agents/FathomPrime';
import { theScientistAgent } from './agents/TheScientist_Evaluator';
import { dataMinerAgent } from './agents/specialists/DataMinerAgent';
import { masterSynthesizerAgent } from './agents/specialists/MasterSynthesizerAgent';
import { gatekeeperAgent } from './agents/specialists/GatekeeperAgent';
import { sentinelAgent } from './agents/specialists/SentinelAgent';
import { seoGovernorAgent } from './agents/specialists/SEO_GovernorAgent';
import { benchmarkLabAgent } from './agents/specialists/BenchmarkLabAgent';
import { knowledgeGraphAgent } from './agents/specialists/KnowledgeGraphAgent';
import { hyperLocalizationAgent } from './agents/specialists/HyperLocalizationAgent';
import { revenueArbitrageAgent } from './agents/specialists/RevenueArbitrageAgent';
import { outreachPRAgent } from './agents/specialists/Outreach_PR_Agent';
import { communityModeratorAgent } from './agents/specialists/CommunityModeratorAgent';
import { swarmOrchestrationWorkflow } from './lib/workflows/SwarmOrchestration';

// Configuração central do framework Mastra
export const mastra = new Mastra({
  agents: {
    contentResearcher: contentResearcherAgent, // Legacy agent, maintained for safety
    fathomPrime: fathomPrimeAgent,
    theScientist: theScientistAgent,
    dataMiner: dataMinerAgent,
    masterSynthesizer: masterSynthesizerAgent,
    gatekeeper: gatekeeperAgent,
    sentinel: sentinelAgent,
    seoGovernor: seoGovernorAgent,
    benchmarkLab: benchmarkLabAgent,
    knowledgeGraph: knowledgeGraphAgent,
    hyperLocalization: hyperLocalizationAgent,
    revenueArbitrage: revenueArbitrageAgent,
    outreachPR: outreachPRAgent,
    communityModerator: communityModeratorAgent,
  },
  workflows: {
    swarmOrchestration: swarmOrchestrationWorkflow,
  },
});
