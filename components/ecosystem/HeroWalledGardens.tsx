"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const NODES = [
  { id: "apple", label: "Apple", x: 20, y: 30, type: "locked" },
  { id: "iphone", label: "iPhone", x: 10, y: 15, type: "device", parent: "apple" },
  { id: "watch", label: "Apple Watch", x: 30, y: 15, type: "device", parent: "apple" },
  { id: "airpods", label: "AirPods", x: 20, y: 10, type: "device", parent: "apple" },
  
  { id: "samsung", label: "Samsung", x: 80, y: 40, type: "locked" },
  { id: "galaxy", label: "Galaxy S", x: 70, y: 20, type: "device", parent: "samsung" },
  { id: "buds", label: "Galaxy Buds", x: 90, y: 25, type: "device", parent: "samsung" },

  { id: "google", label: "Google", x: 50, y: 70, type: "locked" },
  { id: "pixel", label: "Pixel", x: 40, y: 85, type: "device", parent: "google" },

  { id: "matter", label: "Matter Hub", x: 50, y: 40, type: "open" },
  { id: "light", label: "Smart Light", x: 40, y: 25, type: "device", parent: "matter" },
  { id: "lock", label: "Smart Lock", x: 60, y: 25, type: "device", parent: "matter" },
];

export function HeroWalledGardens() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="w-[600px] h-[600px] opacity-0" />;

  return (
    <div className="relative w-[600px] h-[600px] opacity-80 hidden md:block">
      {/* Edges */}
      <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 0 }}>
        {NODES.map((node) => {
          if (!node.parent) return null;
          const parent = NODES.find((n) => n.id === node.parent);
          if (!parent) return null;

          const isLocked = parent.type === "locked";
          const strokeColor = isLocked ? "rgba(255, 50, 50, 0.3)" : "rgba(50, 255, 100, 0.4)";
          const strokeWidth = isLocked ? 2 : 1.5;
          const dashArray = isLocked ? "none" : "4 4";

          return (
            <motion.line
              key={`${node.id}-${parent.id}`}
              x1={`${node.x}%`}
              y1={`${node.y}%`}
              x2={`${parent.x}%`}
              y2={`${parent.y}%`}
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              strokeDasharray={dashArray}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 1.5, ease: "easeInOut", delay: 0.5 }}
            />
          );
        })}
      </svg>

      {/* Nodes */}
      {NODES.map((node, i) => {
        const isCenter = node.type === "locked" || node.type === "open";
        const isLocked = node.type === "locked";
        const isOpen = node.type === "open";

        let bgColor = "bg-surface border border-edge-strong";
        if (isLocked) bgColor = "bg-[#1a0505] border border-red-500/30 text-red-200";
        if (isOpen) bgColor = "bg-[#051a0a] border border-green-500/40 text-green-200";

        return (
          <motion.div
            key={node.id}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              duration: 0.8,
              ease: [0.16, 1, 0.3, 1],
              delay: isCenter ? 0 : 0.8 + i * 0.1,
            }}
            className={`absolute flex items-center justify-center rounded-full backdrop-blur-md whitespace-nowrap shadow-xl ${bgColor}`}
            style={{
              left: `${node.x}%`,
              top: `${node.y}%`,
              transform: "translate(-50%, -50%)",
              padding: isCenter ? "1rem 1.5rem" : "0.5rem 1rem",
              zIndex: isCenter ? 10 : 5,
            }}
          >
            {isLocked && (
              <span className="absolute -inset-1 rounded-full border border-red-500/20 animate-ping opacity-20" style={{ animationDuration: '3s' }} />
            )}
            {isOpen && (
              <span className="absolute -inset-2 rounded-full border border-green-500/20 animate-pulse opacity-40" style={{ animationDuration: '4s' }} />
            )}
            <span className={`font-mono tracking-widest uppercase ${isCenter ? 'text-xs font-semibold' : 'text-[10px] text-faint'}`}>
              {node.label}
            </span>
          </motion.div>
        );
      })}
    </div>
  );
}
