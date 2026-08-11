"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

export function EmbedBadge({ itemSlug }: { itemSlug: string }) {
  const [copied, setCopied] = useState(false);

  const embedCode = `<a href="https://fathomlayer.com/software/${itemSlug}" target="_blank" rel="noopener noreferrer"><img src="https://fathomlayer.com/fathom-badge.svg" alt="Featured on Fathom Layer" width="250" height="54" /></a>`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(embedCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy embed code", err);
    }
  };

  return (
    <div className="mt-8 p-6 rounded-xl border border-edge/50 bg-subtle/30">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-medium text-ink">Ego-Bait Embed Badge</h3>
          <p className="text-xs text-dim mt-1">Founders: Add this to your site to show you're featured on Fathom Layer.</p>
        </div>
        <img src="/fathom-badge.svg" alt="Preview" width="150" className="opacity-80" />
      </div>
      <div className="relative group">
        <pre className="p-4 rounded-lg bg-surface border border-edge text-xs text-dim overflow-x-auto font-mono">
          {embedCode}
        </pre>
        <button
          onClick={handleCopy}
          className="absolute top-2 right-2 p-2 rounded-md bg-subtle hover:bg-edge/50 text-ink transition-colors border border-edge/50 backdrop-blur-sm"
          title="Copy HTML"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
}
