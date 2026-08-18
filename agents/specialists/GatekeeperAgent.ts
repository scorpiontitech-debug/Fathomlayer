import { Agent } from '@mastra/core/agent';
import { google } from '@ai-sdk/google';

export const gatekeeperAgent = new Agent({
  name: 'Gatekeeper',
  id: 'gatekeeper-auditor',
  description: 'Auditor do Quality Gate e Approver de Publicação',
  instructions: `
    Você é a barreira de qualidade (Gate #11).
    Avalie o 'pending_review' e certifique-se que o item tem os 5 campos obrigatórios preenchidos e válidos.
    Atribua um 'design_score' coerente com base nas especificações técnicas.
    Aprove o item alterando o status para 'published' caso não haja anomalias.
  `,
  model: google('gemini-1.5-pro'),
  tools: {
    // Tools de aprovação e reprovação de itens
  }
});
