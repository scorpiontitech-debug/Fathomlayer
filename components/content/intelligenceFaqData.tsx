import Link from "next/link";
import React from "react";

export type FaqItem = {
  question: string;
  answer: React.ReactNode;
  rawText: string;
};

export const INTELLIGENCE_FAQS: FaqItem[] = [
  {
    question: "What is the Model Context Protocol (MCP)?",
    rawText: "The Model Context Protocol (MCP) is an open standard that allows developers to securely connect AI models to external data sources and tools. Instead of writing custom API integrations for every LLM, you run an MCP Server that exposes your data (like local files, databases, or SaaS tools), and any compatible agent or IDE (like Claude Desktop or Cursor) can access it using a unified protocol.",
    answer: (
      <>
        The Model Context Protocol (MCP) is an open standard that allows developers to securely connect AI models to external data sources and tools. Instead of writing custom API integrations for every LLM, you run an <Link href="/intelligence/mcp-servers" className="text-accent hover:underline">MCP Server</Link> that exposes your data (like local files, databases, or SaaS tools), and any compatible agent or IDE (like Claude Desktop or <Link href="/intelligence/ai-software/cursor" className="text-accent hover:underline">Cursor</Link>) can access it using a unified protocol.
      </>
    )
  },
  {
    question: "What is the difference between an Agent Framework and a traditional LLM wrapper?",
    rawText: "A simple wrapper just formats prompts and sends them to an API. An Agent Framework (like Mastra, LangChain, or SmolAgents) provides orchestration: memory management across sessions, autonomous tool selection, state machines for multi-step reasoning, and built-in telemetry to trace execution paths.",
    answer: (
      <>
        A simple wrapper just formats prompts and sends them to an API. An <Link href="/intelligence/agent-frameworks" className="text-accent hover:underline">Agent Framework</Link> (like <Link href="/intelligence/agent-frameworks/mastra" className="text-accent hover:underline">Mastra</Link>, LangChain, or SmolAgents) provides orchestration: memory management across sessions, autonomous tool selection, state machines for multi-step reasoning, and built-in telemetry to trace execution paths.
      </>
    )
  },
  {
    question: "How do I choose between cloud AI APIs and running local models?",
    rawText: "Cloud APIs (like GPT-4o or Claude 3.5 Sonnet) offer the highest reasoning capabilities and massive context windows (up to 2M tokens) without hardware overhead. Local models (like Llama 3 running on Ollama) are essential when privacy is strictly mandated, latency must be absolute zero, or you want to avoid recurring token costs, though they require significant GPU memory.",
    answer: (
      <>
        Cloud APIs (like GPT-4o or Claude 3.5 Sonnet) offer the highest reasoning capabilities and massive context windows (up to 2M tokens) without hardware overhead. Local models (like Llama 3 running on Ollama) are essential when privacy is strictly mandated, latency must be absolute zero, or you want to avoid recurring token costs, though they require significant GPU memory. <Link href="/compute/local-ai-workstations" className="text-accent hover:underline">See local AI hardware.</Link>
      </>
    )
  }
];

export function generateFaqSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: INTELLIGENCE_FAQS.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.rawText
      }
    }))
  };
}
