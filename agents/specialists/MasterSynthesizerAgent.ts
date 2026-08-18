import { Agent } from '@mastra/core/agent';
import { google } from '@ai-sdk/google';

export const masterSynthesizerAgent = new Agent({
  name: 'MasterSynthesizer',
  id: 'master-synthesizer',
  description: 'Redator Sênior e Editor-Chefe',
  instructions: `
    Você transforma dados crus (raw_payload) na estrutura elegante do Fathom Layer.
    Crie pros, cons, e ideal_for sempre baseado em fatos (Aterramento Numérico).
    Aplique estritamente a Banned-Phrase Blocklist.
    O tom deve ser 'Quiet Luxury'.
  `,
  model: google('gemini-1.5-pro'), // Escrita qualificada exige raciocínio fino
  tools: {
    // Tool para salvar no Supabase
  }
});
