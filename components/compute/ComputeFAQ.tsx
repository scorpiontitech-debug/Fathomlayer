"use client";

import { useState } from "react";
import { JsonLd } from "@/components/JsonLd";

const FAQS = [
  {
    question: "How much VRAM do I need to run Llama 3 70B locally?",
    answer: "To run Llama 3 70B at a usable 4-bit quantization (Q4_K_M), you need approximately 40GB to 48GB of VRAM. This typically requires either a Mac Studio M2/M3 Ultra with unified memory, or a multi-GPU setup like 2x RTX 4090 or 2x RTX 3090.",
  },
  {
    question: "Is Apple Unified Memory better than dedicated VRAM for AI?",
    answer: "Apple's Unified Memory offers massive capacity at a lower price point than enterprise GPUs, making it excellent for running huge models (like 70B or 104B parameters) that wouldn't fit on a single consumer GPU. However, for smaller models that fit entirely within a single RTX 4090 (24GB), the dedicated GPU will offer significantly faster token generation speeds.",
  },
  {
    question: "Can I use regular system RAM (DDR5) instead of VRAM?",
    answer: "Yes, you can offload layers to system RAM using frameworks like llama.cpp. However, system RAM bandwidth is typically around 50-90 GB/s, whereas a dedicated GPU like the RTX 4090 provides over 1000 GB/s. Offloading to system RAM will cause a massive bottleneck, resulting in very slow token generation speeds.",
  },
  {
    question: "What is the best budget GPU for Local AI?",
    answer: "Currently, the best budget GPU for Local AI is a used RTX 3090 (24GB VRAM). It offers the same VRAM capacity as the RTX 4090 at a fraction of the cost, making it the king of budget inference. For brand new options, the RTX 4060 Ti 16GB offers a good entry point.",
  }
];

export function ComputeFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": FAQS.map((faq) => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  return (
    <section className="reveal max-w-3xl mx-auto py-16 border-t border-edge">
      <JsonLd data={faqSchema} />
      
      <div className="text-center mb-12">
        <h2 className="font-display text-3xl font-semibold tracking-tight">Frequently Asked Questions</h2>
        <p className="mt-2 font-mono text-xs uppercase tracking-widest text-dim">Local AI Architecture</p>
      </div>

      <div className="space-y-4">
        {FAQS.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div 
              key={idx} 
              className={`rounded-xl border transition-colors duration-300 overflow-hidden ${isOpen ? 'border-accent-bright bg-white/[0.02]' : 'border-edge bg-surface hover:border-white/20'}`}
            >
              <button
                className="w-full text-left px-6 py-5 flex items-center justify-between focus:outline-none"
                onClick={() => setOpenIndex(isOpen ? null : idx)}
              >
                <span className="font-medium text-white pr-8">{faq.question}</span>
                <span className={`text-accent-bright transition-transform duration-300 font-mono ${isOpen ? 'rotate-180' : ''}`}>
                  ↓
                </span>
              </button>
              
              <div 
                className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 pb-6 opacity-100' : 'max-h-0 opacity-0'}`}
              >
                <p className="text-dim leading-relaxed text-sm">
                  {faq.answer}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
