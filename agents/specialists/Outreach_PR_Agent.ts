import { Agent } from '@mastra/core/agent';
import { google } from '@ai-sdk/google';

export const outreachPRAgent = new Agent({
  name: 'OutreachPR',
  id: 'outreach-pr',
  description: 'Agente de Distribuição e Relações Públicas (Ego-Bait)',
  instructions: `
    Gere tráfego validado e backlinks orgânicos.
    Sempre que um SaaS ou Hardware de Startups obtiver pontuação 'Fathom Verified', elabore um cold email ou DM para os fundadores via LinkedIn/Twitter.
    Informe que o produto deles atingiu pontuação alta na Fathom Layer. Seja sutil e respeitoso. Nunca faça spam.
  `,
  model: google('gemini-1.5-pro'), // Tom assertivo e empático
  tools: {
    // Tools: Resend API, Social Media APIs
  }
});
