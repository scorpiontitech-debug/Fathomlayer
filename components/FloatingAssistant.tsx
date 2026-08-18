"use client";

import { useState } from "react";
import { Sparkles, X, MessageSquare } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ConsultantChat } from "./ConsultantChat";

export function FloatingAssistant() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed bottom-24 right-6 z-50 w-[400px] origin-bottom-right"
          >
            <div className="relative shadow-[0_0_80px_rgba(0,100,255,0.15)] rounded-2xl overflow-hidden border border-white/10">
              <div className="absolute top-4 right-4 z-10">
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-full bg-black/40 text-dim hover:text-white transition-colors border border-white/10"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <ConsultantChat className="h-[550px] w-full rounded-none border-none" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 group flex items-center justify-center w-14 h-14 rounded-full bg-accent hover:bg-accent-bright text-white shadow-[0_0_30px_rgba(0,100,255,0.3)] transition-all duration-300 hover:scale-110"
      >
        <span className="absolute inset-0 rounded-full border-2 border-accent-bright/50 animate-ping opacity-50"></span>
        {isOpen ? <X className="w-6 h-6" /> : <Sparkles className="w-6 h-6" />}
      </button>
    </>
  );
}
