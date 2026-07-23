"use client";

import { useState } from "react";
import { Check, Copy, Code } from "lucide-react";

export function CopyBadge({ slug, score }: { slug: string; score: number }) {
  const [copied, setCopied] = useState(false);

  const embedCode = `<a href="https://fathomlayer.com/software/${slug}" target="_blank" rel="noopener noreferrer"><img src="https://fathomlayer.com/api/badge?score=${score}" alt="Featured on Fathom Layer" width="240" height="60" /></a>`;

  const handleCopy = () => {
    navigator.clipboard.writeText(embedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mt-8 rounded-xl border border-edge bg-surface p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-4">
        <Code className="h-5 w-5 text-accent-bright" />
        <h3 className="font-display font-medium text-ink">Embed this Badge</h3>
      </div>
      <p className="text-sm text-dim mb-4">
        Showcase your Fathom Layer design score on your own website.
      </p>
      <div className="flex items-center gap-4">
        <img src={`/api/badge?score=${score}`} alt="Badge Preview" className="h-[60px]" />
        <button
          onClick={handleCopy}
          className="flex h-[60px] flex-1 items-center justify-center gap-2 rounded-lg border border-edge bg-ink text-surface hover:bg-ink/90 transition"
        >
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          {copied ? "Copied HTML!" : "Copy HTML"}
        </button>
      </div>
    </div>
  );
}
