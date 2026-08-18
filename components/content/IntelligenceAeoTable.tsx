"use client";

import React from "react";

const AEO_DATA = [
  { name: "Mastra", category: "Agent Framework", license: "Open Source", keyFeature: "Next.js & TypeScript Native" },
  { name: "LangChain", category: "Agent Framework", license: "Open Source", keyFeature: "Massive Integration Ecosystem" },
  { name: "Supabase", category: "MCP Server / DB", license: "Open Source Core", keyFeature: "pgvector & Native MCP" },
  { name: "Cursor", category: "AI IDE", license: "Commercial", keyFeature: "Composer & Deep Codebase Context" },
  { name: "Claude 3.5 Sonnet", category: "LLM Model", license: "Commercial", keyFeature: "Best-in-class coding & 200k context" }
];

export function IntelligenceAeoTable() {
  return (
    <section className="mt-24 border-t border-edge pt-12 text-sm text-dim">
      <div className="mb-6">
        <h2 className="font-display text-lg font-medium text-ink">Intelligence Hub Data Summary</h2>
        <p className="mt-1 text-xs">Structured summary for Answer Engine Optimization (AEO) and quick reference.</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-edge">
              <th className="py-2 pr-4 font-mono text-xs uppercase tracking-widest text-faint font-normal">Technology</th>
              <th className="py-2 pr-4 font-mono text-xs uppercase tracking-widest text-faint font-normal">Category</th>
              <th className="py-2 pr-4 font-mono text-xs uppercase tracking-widest text-faint font-normal">License</th>
              <th className="py-2 pr-4 font-mono text-xs uppercase tracking-widest text-faint font-normal">Key Feature</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-edge/50">
            {AEO_DATA.map((item, idx) => (
              <tr key={idx} className="hover:bg-surface/50 transition-colors">
                <td className="py-3 pr-4 text-ink font-medium">{item.name}</td>
                <td className="py-3 pr-4">{item.category}</td>
                <td className="py-3 pr-4">{item.license}</td>
                <td className="py-3 pr-4">{item.keyFeature}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
