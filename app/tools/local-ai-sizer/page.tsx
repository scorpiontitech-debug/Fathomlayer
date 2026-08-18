import type { Metadata } from "next";
import { LocalAiSizerClient } from "@/components/tools/LocalAiSizerClient";

export const metadata: Metadata = {
  title: "Local AI Hardware Sizer | Fathom Layer",
  description: "Calculate exact VRAM and system memory requirements for running LLMs like Llama 3 and DeepSeek locally.",
};

export default function LocalAiSizerPage() {
  return (
    <div className="max-w-4xl mx-auto px-5 py-24">
      <div className="mb-12">
        <h1 className="font-display text-4xl font-semibold tracking-tight text-ink mb-4">
          Local AI Hardware Sizer
        </h1>
        <p className="text-lg text-dim">
          Stop guessing. Deterministically calculate the exact VRAM and System RAM required to run open-weight models locally based on quantization and context windows.
        </p>
      </div>

      <LocalAiSizerClient />
    </div>
  );
}
