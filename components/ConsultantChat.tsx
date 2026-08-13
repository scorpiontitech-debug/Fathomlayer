"use client";

import { useChat } from '@ai-sdk/react';
import { useEffect, useRef } from 'react';
import { Loader2, Sparkles, Database, Search } from 'lucide-react';

export function ConsultantChat({ productContext }: { productContext?: any }) {
  const chat = useChat({
    api: '/api/chat',
    body: { productContext },
  } as any) as any;

  const messages = chat?.messages || [];
  const input = chat?.input || "";
  const handleInputChange = chat?.handleInputChange || (() => {});
  const handleSubmit = chat?.handleSubmit || ((e: any) => e.preventDefault());
  const isLoading = chat?.isLoading || false;

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll para a última mensagem
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div className="flex flex-col h-[600px] w-full max-w-2xl mx-auto rounded-2xl border border-white/10 bg-black/60 backdrop-blur-2xl shadow-2xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-white/5">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent/20">
            <Sparkles className="w-4 h-4 text-accent-bright" />
          </div>
          <div>
            <h3 className="font-display font-semibold text-white">Fathom Consultant AI</h3>
            <p className="font-mono text-[10px] uppercase tracking-widest text-accent-bright">Online • Market Aware</p>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-4 opacity-50">
            <Database className="w-12 h-12 text-dim" />
            <p className="font-mono text-sm text-dim max-w-xs">
              Conectado ao Índice da Fathom Layer. Me pergunte sobre setups, hardwares ou previsões de lançamento.
            </p>
          </div>
        )}

        {messages.map((m: any) => (
          <div key={m.id} className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
            <div 
              className={`max-w-[85%] rounded-2xl px-5 py-3 ${
                m.role === 'user' 
                  ? 'bg-accent text-white rounded-tr-sm' 
                  : 'bg-white/10 text-ink rounded-tl-sm'
              }`}
            >
              {m.content && (
                <div className="prose prose-invert prose-sm max-w-none font-sans leading-relaxed">
                  {m.content}
                </div>
              )}

              {/* Renderização de Tools / Generative UI */}
              {m.toolInvocations?.map((toolInvocation: any) => {
                const toolCallId = toolInvocation.toolCallId;
                
                // Tool Call em andamento
                if (!('result' in toolInvocation)) {
                  return (
                    <div key={toolCallId} className="mt-3 flex items-center gap-2 rounded-lg bg-black/40 px-3 py-2 border border-white/10 font-mono text-xs text-accent-bright">
                      <Loader2 className="w-3 h-3 animate-spin" />
                      {toolInvocation.toolName === 'queryIndex' && <span>Acessando Índice Fathom...</span>}
                      {toolInvocation.toolName === 'checkRadar' && <span>Analisando Radar de Lançamentos...</span>}
                    </div>
                  );
                }
                
                // Resultado da Tool
                return (
                  <div key={toolCallId} className="mt-3 flex items-center gap-2 rounded-lg bg-green-500/10 px-3 py-2 border border-green-500/20 font-mono text-xs text-green-400">
                    <Search className="w-3 h-3" />
                    <span>Dados obtidos. Processando resposta...</span>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <form onSubmit={handleSubmit} className="p-4 bg-white/5 border-t border-white/10">
        <div className="relative flex items-center">
          <input
            className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-3 pr-12 font-sans text-sm text-white placeholder-dim focus:outline-none focus:border-accent-bright transition-colors"
            value={input}
            placeholder="Qual hardware você está buscando?"
            onChange={handleInputChange}
            disabled={isLoading}
          />
          <button 
            type="submit" 
            disabled={isLoading || !input?.trim()}
            className="absolute right-2 flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-white transition-all hover:bg-accent-bright disabled:opacity-50"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <span className="font-mono text-xs font-bold">↑</span>}
          </button>
        </div>
      </form>
    </div>
  );
}
