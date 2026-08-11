"use client";

import { useActionState, useEffect } from "react";
import { savePost } from "./actions";

export function EditorForm({ categories }: { categories: any[] }) {
  const [state, formAction, isPending] = useActionState(savePost, null);

  useEffect(() => {
    if (state?.error) {
      alert(`Erro: ${state.error}`);
    }
  }, [state]);

  return (
    <form action={formAction} className="flex flex-col gap-6">
      <div className="flex items-center justify-between -mt-16 mb-8">
        <div className="opacity-0 pointer-events-none">Spacer</div>
        <div className="flex items-center gap-2">
          <button 
            type="submit"
            name="action"
            value="draft"
            disabled={isPending}
            className="bg-surface border border-edge text-ink px-4 py-2 text-sm rounded font-medium hover:bg-subtle transition-colors disabled:opacity-50"
          >
            Salvar Rascunho
          </button>
          <button 
            type="submit"
            name="action"
            value="publish"
            disabled={isPending}
            className="bg-accent text-surface px-4 py-2 text-sm rounded font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {isPending ? "Salvando..." : "Publicar"}
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="title" className="text-sm font-medium text-dim">Título</label>
        <input 
          type="text" 
          id="title" 
          name="title" 
          required
          className="w-full bg-surface border border-edge rounded p-3 text-ink focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all"
          placeholder="Ex: O Futuro da Inteligência Artificial Generativa..."
        />
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="flex flex-col gap-2">
          <label htmlFor="slug" className="text-sm font-medium text-dim">Slug URL</label>
          <input 
            type="text" 
            id="slug" 
            name="slug" 
            required
            className="w-full bg-surface border border-edge rounded p-3 text-ink font-mono text-sm focus:border-accent outline-none"
            placeholder="futuro-da-ia-generativa"
          />
        </div>
        
        <div className="flex flex-col gap-2">
          <label htmlFor="category" className="text-sm font-medium text-dim">Categoria</label>
          <select 
            id="category" 
            name="category" 
            className="w-full bg-surface border border-edge rounded p-3 text-ink focus:border-accent outline-none appearance-none"
          >
            <option value="">Selecione uma categoria...</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="excerpt" className="text-sm font-medium text-dim">Resumo (Excerpt)</label>
        <textarea 
          id="excerpt" 
          name="excerpt" 
          rows={2}
          className="w-full bg-surface border border-edge rounded p-3 text-ink focus:border-accent outline-none resize-none"
          placeholder="Um breve resumo para SEO e listagem no grid..."
        />
      </div>

      <div className="flex flex-col gap-2 flex-1">
        <div className="flex items-center justify-between">
          <label htmlFor="content" className="text-sm font-medium text-dim">Conteúdo (Markdown)</label>
          <a href="https://www.markdownguide.org/cheat-sheet/" target="_blank" rel="noreferrer" className="text-xs text-accent hover:underline">
            Markdown Cheat Sheet
          </a>
        </div>
        <textarea 
          id="content" 
          name="content" 
          required
          rows={15}
          className="w-full bg-surface border border-edge rounded p-4 text-ink font-mono text-sm focus:border-accent outline-none"
          placeholder="Comece a escrever aqui..."
        />
      </div>
    </form>
  );
}
