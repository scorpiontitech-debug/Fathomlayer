import React from 'react';
import { marked } from 'marked';

interface RichTextRendererProps {
  content: string;
}

export function RichTextRenderer({ content }: RichTextRendererProps) {
  if (!content) return null;

  // Em um ambiente de produção real Awwwards-level, substituiríamos
  // isso por uma integração customizada com mdx-remote ou tip-tap,
  // injetando tooltips de glossário interativo via regex.
  
  const html = marked.parse(content, { async: false }) as string;

  return (
    <div 
      className="content-renderer"
      dangerouslySetInnerHTML={{ __html: html }} 
    />
  );
}
