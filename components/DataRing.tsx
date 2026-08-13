"use client";

import { useEffect, useState, useRef } from "react";

interface DataRingProps {
  score: number; // 0 to 10
  size?: number;
  strokeWidth?: number;
}

export function DataRing({ score, size = 64, strokeWidth = 6 }: DataRingProps) {
  const [offset, setOffset] = useState(0);
  const circleRef = useRef<SVGCircleElement>(null);

  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;

  useEffect(() => {
    // Animação de preenchimento após montagem
    const timer = setTimeout(() => {
      const progress = score / 10;
      setOffset(circumference - progress * circumference);
    }, 300);

    return () => clearTimeout(timer);
  }, [score, circumference]);

  // Cor baseada na nota
  let color = "text-accent-bright"; // Default blue
  if (score >= 9) color = "text-green-400";
  else if (score < 7) color = "text-yellow-400";

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg className="rotate-[-90deg]" width={size} height={size}>
        {/* Background track */}
        <circle
          className="text-white/10"
          strokeWidth={strokeWidth}
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        {/* Progress ring */}
        <circle
          ref={circleRef}
          className={`${color} transition-all duration-1000 ease-out`}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset === 0 ? circumference : offset}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
      </svg>
      {/* Score value in the middle */}
      <span className="absolute font-mono text-sm font-bold text-white">
        {score.toFixed(1)}
      </span>
    </div>
  );
}
