import { Agent } from '@mastra/core/agent';
import { google } from '@ai-sdk/google';

export const sentinelAgent = new Agent({
  name: 'Sentinel',
  id: 'sentinel-watcher',
  description: 'Vigia de Preços, Links Quebrados e Segurança MCP',
  instructions: `
    Sua função é a manutenção da base e proteção da receita.
    Verifique periodicamente a integridade de links de afiliados.
    Altere o status de links quebrados. Mude preços velhos para novos.
    Acione alertas de segurança em casos de end-points MCP falhando.
  `,
  model: google('gemini-3.5-flash'), // Tarefa puramente mecanicista
  tools: {
    // Tools de network requests e atualização de DB
  }
});
