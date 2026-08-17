import { marked } from "marked";
import { supabasePublic } from "@/lib/supabase/server";
import { unstable_cache } from "next/cache";

const getGlossaryTerms = unstable_cache(
  async () => {
    const { data } = await supabasePublic()
      .from("editorial_pages")
      .select("title, slug")
      .eq("content_type", "glossary")
      .eq("status", "published");
    return data || [];
  },
  ["glossary-terms"],
  { revalidate: 3600 }
);

const renderer = new marked.Renderer();
renderer.image = ({ href, title, text }) => {
  return `<img src="${href || ""}" alt="${text || ""}" title="${title || ""}" loading="lazy" decoding="async" />`;
};

marked.use({ renderer });

// Render de body_markdown das editorial_pages. Conteúdo é sempre autoral
// (operador/agente revisado) — nunca entrada de usuário público.
export async function renderMarkdown(markdown: string): Promise<string> {
  let html = marked.parse(markdown, { async: false }) as string;

  try {
    const terms = await getGlossaryTerms();
    if (terms && terms.length > 0) {
      // Ordenar por tamanho decrescente para não sobrescrever partes de palavras compostas
      const sortedTerms = [...terms].sort((a, b) => b.title.length - a.title.length);

      // Divisão rudimentar por tags HTML para substituir apenas em text nodes
      const parts = html.split(/(<[^>]*>)/);
      let insideLinkOrCodeOrHeading = false;

      for (let i = 0; i < parts.length; i++) {
        const part = parts[i];
        const lowerPart = part.toLowerCase();

        if (lowerPart.startsWith("<a ") || lowerPart.startsWith("<code") || lowerPart.match(/^<h[1-6]/)) {
          insideLinkOrCodeOrHeading = true;
        } else if (lowerPart.startsWith("</a") || lowerPart.startsWith("</code") || lowerPart.match(/^<\/h[1-6]/)) {
          insideLinkOrCodeOrHeading = false;
        } else if (!part.startsWith("<") && !insideLinkOrCodeOrHeading) {
          let text = part;
          sortedTerms.forEach((term) => {
            const escapedTerm = term.title.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
            // Substituir termo exato (case-insensitive), apenas uma vez por bloco para não poluir
            const regex = new RegExp(`\\b(${escapedTerm})\\b`, "i");
            if (regex.test(text)) {
              text = text.replace(regex, `<a href="/glossary/${term.slug}" class="auto-link border-b border-dashed border-primary/50 hover:border-primary transition-colors">$1</a>`);
            }
          });
          parts[i] = text;
        }
      }
      html = parts.join("");
    }
  } catch (err) {
    console.error("Auto-linker failed:", err);
  }

  return html;
}
