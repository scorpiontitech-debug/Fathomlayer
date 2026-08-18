// @ts-nocheck
"use client";

import { useEffect, useRef, useState } from 'react';
import { Loader2, Sparkles, Database, Search, AlertTriangle } from 'lucide-react';
import { marked } from 'marked';

export function ConsultantChat({ productContext, className }: { productContext?: any, className?: string }) {
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const submitMessage = async () => {
    if (!input.trim() || isLoading) return;
    
    const content = input;
    setInput('');
    setIsLoading(true);
    setError(null);
    
    const newMessages = [...messages, { id: Date.now().toString(), role: 'user', content }];
    setMessages(newMessages);
    
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages, productContext })
      });
      
      if (!response.ok) {
        throw new Error(`API returned ${response.status}`);
      }
      
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      
      if (!reader) throw new Error("No response body");
      
      setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: 'assistant', content: '', toolInvocations: [] }]);
      
      let buffer = '';
      let streamError: string | null = null;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;

          const payload = line.slice(6).trim();
          if (!payload || payload === '[DONE]') continue;

          let part: any;
          try {
            part = JSON.parse(payload);
          } catch {
            continue;
          }

          if (part.type === 'text-delta') {
            setMessages(prev => {
              const updated = [...prev];
              const last = { ...updated[updated.length - 1] };
              last.content += part.delta ?? '';
              updated[updated.length - 1] = last;
              return updated;
            });
          } else if (part.type === 'tool-input-available') {
            setMessages(prev => {
              const updated = [...prev];
              const last = { ...updated[updated.length - 1] };
              last.toolInvocations = [
                ...(last.toolInvocations ?? []),
                { toolCallId: part.toolCallId, toolName: part.toolName, args: part.input },
              ];
              updated[updated.length - 1] = last;
              return updated;
            });
          } else if (part.type === 'tool-output-available') {
            setMessages(prev => {
              const updated = [...prev];
              const last = { ...updated[updated.length - 1] };
              last.toolInvocations = (last.toolInvocations ?? []).map((t: any) =>
                t.toolCallId === part.toolCallId ? { ...t, result: part.output ?? 'success' } : t
              );
              updated[updated.length - 1] = last;
              return updated;
            });
          } else if (part.type === 'error') {
            streamError = part.errorText || 'The AI service returned an error.';
          }
        }
      }

      if (streamError) throw new Error(streamError);
    } catch (err: any) {
      console.error("Fetch error:", err);
      setError(err);
      setInput(content);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      submitMessage();
    }
  };

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [userIsScrolling, setUserIsScrolling] = useState(false);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const isNearBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 100;
      setUserIsScrolling(!isNearBottom);
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!userIsScrolling && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, userIsScrolling]);

  return (
    <div className={`flex flex-col mx-auto border-4 border-black bg-[#f4f4f0] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] ${className || 'h-[600px] w-full max-w-2xl'}`}>
      <div className="flex items-center justify-between px-6 py-4 border-b-4 border-black bg-black text-white">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 overflow-hidden items-center justify-center bg-black border-2 border-white">
            <img src="/oracle_avatar.jpg" alt="Fathom Oracle" className="object-cover w-full h-full" />
          </div>
          <div>
            <h3 className="font-display font-black tracking-tight text-xl uppercase">Fathom Oracle</h3>
            <p className="font-mono text-[10px] uppercase tracking-widest text-[#E5F520]">Status: Online</p>
          </div>
        </div>
      </div>

      <div ref={scrollContainerRef} className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-6">
            <img src="/oracle_avatar.jpg" alt="Oracle Avatar" className="w-24 h-24 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] object-cover" />
            <p className="font-mono text-sm text-black font-bold uppercase max-w-xs border-4 border-black p-4 bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              System Ready. Query the database for hardware analysis.
            </p>
          </div>
        )}

        {messages.map((m: any) => (
          <div key={m.id} className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
            <div 
              className={`max-w-[85%] px-5 py-4 border-4 border-black font-sans font-medium text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ${
                m.role === 'user' 
                  ? 'bg-[#E5F520]' 
                  : 'bg-white'
              }`}
            >
              {m.content && (
                <div 
                  className="prose prose-sm max-w-none text-black leading-relaxed font-semibold prose-a:text-blue-600 prose-a:underline"
                  dangerouslySetInnerHTML={{ __html: marked.parse(m.content) as string }}
                />
              )}

              {m.toolInvocations?.map((toolInvocation: any) => {
                const toolCallId = toolInvocation.toolCallId;
                
                if (!('result' in toolInvocation)) {
                  return (
                    <div key={toolCallId} className="mt-4 flex items-center gap-3 bg-black px-4 py-3 font-mono text-xs text-white border-2 border-black">
                      <Loader2 className="w-4 h-4 animate-spin text-[#E5F520]" />
                      {toolInvocation.toolName === 'queryIndex' && <span className="font-bold tracking-widest">QUERYING INDEX...</span>}
                      {toolInvocation.toolName === 'checkRadar' && <span className="font-bold tracking-widest">SCANNING RADAR...</span>}
                    </div>
                  );
                }
                
                return (
                  <div key={toolCallId} className="mt-4 flex items-center gap-3 bg-[#E5F520] border-2 border-black px-4 py-3 font-mono text-xs text-black font-bold uppercase">
                    <Search className="w-4 h-4" />
                    <span className="tracking-widest">Data Retrieved</span>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
        {error && (
          <div className="flex flex-col items-center justify-center p-4 border-4 border-black bg-[#FF3366] text-white font-mono mt-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-6 h-6" />
              <span className="font-black uppercase text-lg">System Error</span>
            </div>
            <span className="text-sm font-bold">{error.message}</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-5 bg-white border-t-4 border-black">
        <div className="relative flex items-center">
          <input
            autoFocus
            className="w-full bg-white border-4 border-black px-5 py-4 pr-16 font-mono text-sm text-black font-bold focus:outline-none focus:ring-0 focus:bg-[#f4f4f0] transition-colors placeholder:text-gray-400"
            value={input}
            placeholder="ENTER COMMAND..."
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
          />
          <button 
            type="button" 
            onClick={submitMessage}
            disabled={isLoading || !input?.trim()}
            className="absolute right-3 flex h-10 w-10 items-center justify-center bg-black text-[#E5F520] hover:bg-[#E5F520] hover:text-black border-4 border-transparent hover:border-black transition-colors disabled:opacity-50 cursor-pointer z-10"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <span className="font-mono text-lg font-black pointer-events-none">↵</span>}
          </button>
        </div>
      </div>
    </div>
  );
}
