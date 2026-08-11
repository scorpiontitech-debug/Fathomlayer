"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

interface CopyPromptButtonProps {
  promptText: string;
}

export default function CopyPromptButton({ promptText }: CopyPromptButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(promptText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy!", err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="absolute top-3 right-3 p-2 rounded-md bg-surface border border-edge hover:bg-subtle hover:text-ink text-faint transition-colors"
      title="Copy to clipboard"
    >
      {copied ? <Check className="w-4 h-4 text-accent" /> : <Copy className="w-4 h-4" />}
    </button>
  );
}
