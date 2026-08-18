"use client";

import { useState } from "react";

type Framework = {
  id: string;
  name: string;
  description: string;
};

type McpServer = {
  id: string;
  name: string;
  command: string;
  args: string[];
};

const FRAMEWORKS: Framework[] = [
  { id: "mastra", name: "Mastra", description: "Opinionated, typed agent framework" },
  { id: "langchain", name: "LangChain", description: "Versatile orchestration for LLMs" },
  { id: "smolagents", name: "SmolAgents", description: "Lightweight HuggingFace agents" },
];

const MCP_SERVERS: McpServer[] = [
  { id: "github", name: "GitHub", command: "npx", args: ["-y", "@modelcontextprotocol/server-github"] },
  { id: "postgres", name: "PostgreSQL", command: "npx", args: ["-y", "@modelcontextprotocol/server-postgres", "postgres://localhost/db"] },
  { id: "brave", name: "Brave Search", command: "npx", args: ["-y", "@modelcontextprotocol/server-brave-search"] },
  { id: "filesystem", name: "Filesystem", command: "npx", args: ["-y", "@modelcontextprotocol/server-filesystem", "./data"] },
];

export function McpStackBuilder() {
  const [selectedFramework, setSelectedFramework] = useState<string>("mastra");
  const [selectedServers, setSelectedServers] = useState<string[]>(["github"]);

  const toggleServer = (id: string) => {
    setSelectedServers((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const generateConfig = () => {
    const servers: Record<string, any> = {};
    selectedServers.forEach((id) => {
      const server = MCP_SERVERS.find((s) => s.id === id);
      if (server) {
        servers[server.id] = {
          command: server.command,
          args: server.args,
          env: {},
        };
      }
    });

    const config = {
      mcpServers: servers,
    };
    return JSON.stringify(config, null, 2);
  };

  return (
    <div id="stack-builder" className="reveal relative overflow-hidden rounded-2xl border border-edge bg-surface/50 p-6 md:p-10">
      <div className="mb-8 max-w-2xl">
        <h2 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">
          MCP Stack Builder
        </h2>
        <p className="mt-2 text-dim">
          Assemble your autonomous agent stack. Select a core framework and attach MCP servers to instantly generate your configuration.
        </p>
      </div>

      <div className="grid gap-10 lg:grid-cols-2">
        <div className="space-y-8">
          {/* Framework Selection */}
          <div>
            <h3 className="mb-4 font-mono text-xs uppercase tracking-widest text-faint">
              1. Select Core Framework
            </h3>
            <div className="grid gap-3 sm:grid-cols-2">
              {FRAMEWORKS.map((fw) => (
                <button
                  key={fw.id}
                  onClick={() => setSelectedFramework(fw.id)}
                  className={`flex flex-col items-start gap-1 rounded-lg border p-4 text-left transition-all ${
                    selectedFramework === fw.id
                      ? "border-accent bg-accent/10"
                      : "border-edge bg-surface hover:border-edge-strong"
                  }`}
                >
                  <span className={`font-medium ${selectedFramework === fw.id ? "text-accent-bright" : "text-ink"}`}>
                    {fw.name}
                  </span>
                  <span className="text-xs text-dim">{fw.description}</span>
                </button>
              ))}
            </div>
          </div>

          {/* MCP Servers Selection */}
          <div>
            <h3 className="mb-4 font-mono text-xs uppercase tracking-widest text-faint">
              2. Attach MCP Servers
            </h3>
            <div className="grid gap-3 sm:grid-cols-2">
              {MCP_SERVERS.map((server) => {
                const isSelected = selectedServers.includes(server.id);
                return (
                  <button
                    key={server.id}
                    onClick={() => toggleServer(server.id)}
                    className={`flex items-center gap-3 rounded-lg border p-4 transition-all ${
                      isSelected
                        ? "border-accent bg-accent/5"
                        : "border-edge bg-surface hover:border-edge-strong"
                    }`}
                  >
                    <div
                      className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border ${
                        isSelected ? "border-accent bg-accent text-surface" : "border-faint"
                      }`}
                    >
                      {isSelected && (
                        <svg width="10" height="10" viewBox="0 0 15 15" fill="none">
                          <path d="M11.4669 3.72684C11.7558 3.91574 11.8369 4.30308 11.648 4.59198L7.39799 11.092C7.29783 11.2452 7.13556 11.3467 6.95402 11.3699C6.77247 11.3931 6.58989 11.3355 6.45446 11.2124L3.70446 8.71241C3.44905 8.48022 3.43023 8.08494 3.66242 7.82953C3.89461 7.57412 4.28989 7.55529 4.5453 7.78749L6.75292 9.79441L10.6018 3.90792C10.7907 3.61902 11.178 3.53795 11.4669 3.72684Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
                        </svg>
                      )}
                    </div>
                    <span className="text-sm font-medium text-ink">{server.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Output Panel */}
        <div className="flex h-full flex-col overflow-hidden rounded-xl border border-edge bg-[#0d0d10]">
          <div className="flex items-center justify-between border-b border-edge/50 bg-[#121216] px-4 py-3">
            <span className="font-mono text-xs text-dim">{selectedFramework === 'mastra' ? 'mcp.json' : 'config.json'}</span>
            <button
              onClick={() => {
                navigator.clipboard.writeText(generateConfig());
              }}
              className="text-xs font-mono text-accent hover:text-accent-bright transition-colors"
            >
              [Copy]
            </button>
          </div>
          <div className="flex-1 overflow-auto p-4">
            <pre className="font-mono text-sm leading-relaxed text-dim">
              <code dangerouslySetInnerHTML={{ __html: syntaxHighlight(generateConfig()) }} />
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}

function syntaxHighlight(json: string) {
  let colored = json.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  return colored.replace(
    /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
    function (match) {
      let cls = "text-[#E5B567]"; // String
      if (/^"/.test(match)) {
        if (/:$/.test(match)) {
          cls = "text-[#A5D6FF]"; // Key
        }
      } else if (/true|false/.test(match)) {
        cls = "text-[#79C0FF]"; // Boolean
      } else if (/null/.test(match)) {
        cls = "text-[#FF7B72]"; // Null
      } else {
        cls = "text-[#79C0FF]"; // Number
      }
      return '<span class="' + cls + '">' + match + "</span>";
    }
  );
}
