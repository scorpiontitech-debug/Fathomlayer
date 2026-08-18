"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { TextPlugin } from "gsap/TextPlugin";

if (typeof window !== "undefined") {
  gsap.registerPlugin(TextPlugin);
}

const MOCK_EVENTS = [
  "[LIVE] Anthropic releases Claude 3.5 Sonnet context expansion",
  "[MARKET] Cursor adoption grows 25% among enterprise devs",
  "[UPDATE] New Editor's Pick: Mastra Agent Framework",
  "[LIVE] 14 new MCP Servers indexed in the last 24 hours",
  "[TRENDING] Local Llama 3 surpasses 1M downloads this week"
];

export function IntelligenceTicker() {
  const textRef = useRef<HTMLSpanElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!textRef.current) return;

    const currentText = MOCK_EVENTS[currentIndex];
    
    // Typewriter animation
    const tl = gsap.timeline({
      onComplete: () => {
        gsap.delayedCall(3, () => {
          gsap.to(textRef.current, {
            duration: 1,
            text: "",
            ease: "none",
            onComplete: () => {
              setCurrentIndex((prev) => (prev + 1) % MOCK_EVENTS.length);
            }
          });
        });
      }
    });

    tl.to(textRef.current, {
      duration: currentText.length * 0.04,
      text: currentText,
      ease: "none",
    });

    return () => {
      tl.kill();
    };
  }, [currentIndex]);

  return (
    <div className="mx-auto mt-6 flex max-w-2xl items-center justify-center gap-3 opacity-80 backdrop-blur-md rounded-full px-4 py-1.5 border border-edge/30">
      <div className="h-2 w-2 animate-pulse rounded-full bg-accent-bright" />
      <div className="h-5 overflow-hidden font-mono text-xs uppercase tracking-widest text-accent-bright/80 sm:text-sm">
        <span ref={textRef}></span>
        <span className="ml-1 animate-pulse border-r-2 border-accent-bright/80" />
      </div>
    </div>
  );
}
