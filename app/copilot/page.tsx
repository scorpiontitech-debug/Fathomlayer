"use client";

import { useState } from "react";
import { Sparkles, Send, Bot, User } from "lucide-react";

type Message = { role: "user" | "assistant"; content: string };

export default function CopilotPage() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hello! I am the Fathom Layer AI Copilot. Tell me about the project you are building, your team size, or your budget, and I will recommend the perfect stack from our database.",
    }
  ]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...messages, userMessage] }),
      });

      if (!response.ok) throw new Error("Failed to fetch");
      
      const data = await response.json();
      setMessages((prev) => [...prev, { role: "assistant", content: data.message }]);
    } catch (error) {
      setMessages((prev) => [...prev, { role: "assistant", content: "Sorry, I am having trouble connecting to the database right now. Please check your Anthropic API Key." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-24 h-[85vh] flex flex-col">
      <header className="rise-group border-b border-edge pb-6">
        <h1 className="font-display text-4xl font-semibold tracking-tight text-ink flex items-center gap-3">
          <Sparkles className="h-8 w-8 text-accent-bright" />
          Stack Copilot
        </h1>
        <p className="mt-2 text-dim">
          Consult with AI to find the best tools in the Fathom Layer index.
        </p>
      </header>

      <div className="flex-1 overflow-y-auto py-8 space-y-6 reveal pr-4">
        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-4 ${msg.role === "assistant" ? "" : "flex-row-reverse"}`}>
            <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${msg.role === "assistant" ? "bg-accent/10" : "bg-ink"}`}>
              {msg.role === "assistant" ? <Bot className="h-6 w-6 text-accent" /> : <User className="h-5 w-5 text-surface" />}
            </div>
            <div className={`max-w-[80%] rounded-2xl p-5 ${msg.role === "assistant" ? "bg-surface border border-edge" : "bg-ink text-surface"}`}>
              <div 
                className="prose prose-sm prose-invert"
                dangerouslySetInnerHTML={{ __html: msg.content.replace(/\n/g, "<br/>") }}
              />
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent/10">
              <Bot className="h-6 w-6 text-accent" />
            </div>
            <div className="bg-surface border border-edge rounded-2xl p-5 flex items-center gap-2">
              <div className="h-2 w-2 bg-accent rounded-full animate-bounce" />
              <div className="h-2 w-2 bg-accent rounded-full animate-bounce [animation-delay:0.2s]" />
              <div className="h-2 w-2 bg-accent rounded-full animate-bounce [animation-delay:0.4s]" />
            </div>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="mt-4 flex gap-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="e.g., What is the best vector database for a low-budget startup?"
          className="flex-1 rounded-xl border border-edge bg-surface px-6 py-4 text-ink focus:border-accent-bright focus:outline-none focus:ring-1 focus:ring-accent-bright shadow-sm text-lg"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="flex h-auto w-16 items-center justify-center rounded-xl bg-ink text-surface transition hover:bg-ink/90 disabled:opacity-50"
        >
          <Send className="h-6 w-6" />
        </button>
      </form>
    </div>
  );
}
