import { createWorkflow, createStep } from '@mastra/core/workflows';
import { z } from 'zod';
import { dataMiner, gatekeeper, sentinel } from '../../agents';

// Funil de ingestão: pesquisa -> avaliação -> auditoria.
//
// O arquivo anterior declarava `new Workflow({ name, id })` — propriedade que
// não existe na API do Mastra 1.57, então o build quebrava — e os passos
// estavam inteiros dentro de um bloco /* TODO */.
//
// O passo de publicação não existe de propósito. O funil termina em
// pending_review e um humano decide. Automatizar a última etapa foi
// exatamente o erro que o unlock-quality-gate.ts cometeu.

const research = createStep({
  id: 'research',
  description: 'Find a candidate item and stage it with its source.',
  inputSchema: z.object({
    brief: z.string().describe('What to research, e.g. "fill the ev-charging category".'),
  }),
  outputSchema: z.object({ report: z.string() }),
  execute: async ({ inputData }) => {
    const result = await dataMiner.generate(
      `Research brief: ${inputData.brief}\n\nFind items the catalog is missing, verify their specifications against first-party sources, and stage them. Report what you staged and what you could not verify.`
    );
    return { report: result.text };
  },
});

const evaluate = createStep({
  id: 'evaluate',
  description: 'Judge the staged item against the publishing bar.',
  inputSchema: z.object({ report: z.string() }),
  outputSchema: z.object({ report: z.string(), verdict: z.string() }),
  execute: async ({ inputData }) => {
    const result = await gatekeeper.generate(
      `Assess this staging report against the publishing bar. Return PASS or FAIL per item, with the failing criterion and the fix.\n\n${inputData.report}`
    );
    return { report: inputData.report, verdict: result.text };
  },
});

const audit = createStep({
  id: 'audit',
  description: 'Check the outcome against what is already live.',
  inputSchema: z.object({ report: z.string(), verdict: z.string() }),
  outputSchema: z.object({ report: z.string(), verdict: z.string(), audit: z.string() }),
  execute: async ({ inputData }) => {
    const result = await sentinel.generate(
      `Check these candidates against live content. Flag duplicates of items already published, language drift, and anything that reads as fabricated.\n\nStaged:\n${inputData.report}\n\nVerdict:\n${inputData.verdict}`
    );
    return { ...inputData, audit: result.text };
  },
});

export const swarmOrchestrationWorkflow = createWorkflow({
  id: 'swarm-orchestration',
  description: 'Research -> evaluate -> audit. Stops at pending_review; a human publishes.',
  inputSchema: z.object({ brief: z.string() }),
  outputSchema: z.object({
    report: z.string(),
    verdict: z.string(),
    audit: z.string(),
  }),
})
  .then(research)
  .then(evaluate)
  .then(audit)
  .commit();
