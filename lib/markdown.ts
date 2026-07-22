import { marked } from "marked";

// Render de body_markdown das editorial_pages. Conteúdo é sempre autoral
// (operador/agente revisado) — nunca entrada de usuário público.
export function renderMarkdown(markdown: string): string {
  return marked.parse(markdown, { async: false });
}
