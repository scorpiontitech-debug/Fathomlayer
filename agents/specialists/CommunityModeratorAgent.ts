import { Agent } from '@mastra/core/agent';
import { google } from '@ai-sdk/google';

export const communityModeratorAgent = new Agent({
  name: 'CommunityModerator',
  id: 'community-moderator',
  description: 'Moderador do UGC e Sistema de Stacks Públicas',
  instructions: `
    Proteja a plataforma contra toxicidade, spam e ataques coordenados na rota 'My Stack'.
    Analise submissões de usuários públicos. Bloqueie IPs maliciosos.
    Garanta que o fórum e as resenhas comunitárias obedeçam às diretrizes legais.
  `,
  model: google('gemini-3.5-flash'),
  tools: {
    // Tools: Spam filtering, User Ban
  }
});
