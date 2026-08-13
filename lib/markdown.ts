import { marked } from "marked";

const renderer = new marked.Renderer();
renderer.image = ({ href, title, text }) => {
  return `<img src="${href || ""}" alt="${text || ""}" title="${title || ""}" loading="lazy" decoding="async" />`;
};

marked.use({ renderer });

// Render de body_markdown das editorial_pages. Conteúdo é sempre autoral
// (operador/agente revisado) — nunca entrada de usuário público.
export function renderMarkdown(markdown: string): string {
  return marked.parse(markdown, { async: false }) as string;
}
