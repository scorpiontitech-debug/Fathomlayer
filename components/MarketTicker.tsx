"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { TextPlugin } from "gsap/TextPlugin";

if (typeof window !== "undefined") {
  gsap.registerPlugin(TextPlugin);
}

const MOCK_EVENTS = [
  "[LIVE] John_D just rated RTX 4080 Super: 9/10",
  "[MARKET] Price drop detected: Sony WH-1000XM5 (-12%)",
  "[UPDATE] New Editorial Guide: The local LLM hardware stack",
  "[LIVE] 142 new CPUs indexed in the last 24 hours",
];

export function MarketTicker() {
  const textRef = useRef<HTMLSpanElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!textRef.current) return;

    const currentText = MOCK_EVENTS[currentIndex];
    
    // Animação Typewriter
    const tl = gsap.timeline({
      onComplete: () => {
        // Pausa no final, depois apaga
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
      duration: currentText.length * 0.05,
      text: currentText,
      ease: "none",
    });

    return () => {
      tl.kill();
    };
  }, [currentIndex]);

  return (
    <div className="mx-auto mt-6 flex max-w-2xl items-center justify-center gap-3 opacity-80">
      <div className="h-2 w-2 animate-pulse rounded-full bg-accent-bright" />
      <div className="h-5 overflow-hidden font-mono text-xs uppercase tracking-widest text-accent-bright/80 sm:text-sm">
        <span ref={textRef}></span>
        {/* Blinking cursor */}
        <span className="ml-1 animate-pulse border-r-2 border-accent-bright/80" />
      </div>
    </div>
  );
}
