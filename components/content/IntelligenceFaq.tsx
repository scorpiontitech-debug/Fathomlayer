"use client";

import { useState } from "react";
import { INTELLIGENCE_FAQS } from "./intelligenceFaqData";

export function IntelligenceFaq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="reveal py-12">
      <div className="mb-10">
        <h2 className="font-display text-3xl font-semibold tracking-tight">
          Frequently Asked Questions
        </h2>
        <p className="mt-2 text-dim">
          Technical context for the modern AI stack.
        </p>
      </div>

      <div className="space-y-4">
        {INTELLIGENCE_FAQS.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <div 
              key={index}
              className={`rounded-xl border transition-colors duration-300 ${isOpen ? "border-accent bg-accent/5" : "border-edge bg-surface hover:border-edge-strong"}`}
            >
              <button
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className="flex w-full items-center justify-between p-6 text-left"
                aria-expanded={isOpen}
              >
                <h3 className={`font-display text-lg font-medium ${isOpen ? "text-accent-bright" : "text-ink"}`}>
                  {faq.question}
                </h3>
                <span className="ml-6 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-edge text-dim">
                  {isOpen ? "−" : "+"}
                </span>
              </button>
              
              <div 
                className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}
              >
                <p className="p-6 pt-0 text-sm leading-relaxed text-dim">
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
