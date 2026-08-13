// Servidor MCP (Model Context Protocol) da Fathom Layer
// Permite que Agentes (como o Mastra) interajam com nosso contexto (Supabase) sob regras estritas.

import { createServer } from 'http';

const MCP_PORT = process.env.MCP_PORT || 3005;

// Este é um stub inicial arquitetural.
// O servidor validará tokens MCP e fornecerá "ferramentas" e "recursos" do banco de dados 
// para a rede de agentes, mantendo a camada de IA desacoplada do acesso a dados cru.
const server = createServer((req, res) => {
  if (req.url === '/mcp/tools' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      tools: [
        {
          name: 'query_supabase',
          description: 'Executa queries via RCP no Supabase de forma sanitizada.'
        }
      ]
    }));
  } else {
    res.writeHead(404);
    res.end();
  }
});

server.listen(MCP_PORT, () => {
  console.log(`[MCP Server] Rodando na porta ${MCP_PORT}`);
  console.log(`[MCP Server] Preparado para servir contexto ao Mastra e Vercel AI.`);
});
