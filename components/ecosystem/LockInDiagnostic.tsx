"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const QUESTIONS = [
  {
    id: "phone",
    title: "What is your primary smartphone?",
    options: [
      { label: "iPhone", score: 30, color: "border-red-500/50" },
      { label: "Samsung Galaxy", score: 20, color: "border-yellow-500/50" },
      { label: "Google Pixel", score: 15, color: "border-yellow-500/50" },
      { label: "Other Android", score: 5, color: "border-green-500/50" }
    ]
  },
  {
    id: "watch",
    title: "Which smartwatch do you use?",
    options: [
      { label: "Apple Watch", score: 25, color: "border-red-500/50" },
      { label: "Galaxy Watch", score: 15, color: "border-yellow-500/50" },
      { label: "Garmin", score: 5, color: "border-green-500/50" },
      { label: "None / Mechanical", score: 0, color: "border-edge" }
    ]
  },
  {
    id: "audio",
    title: "What are your primary wireless earbuds?",
    options: [
      { label: "AirPods", score: 20, color: "border-red-500/50" },
      { label: "Galaxy Buds", score: 15, color: "border-yellow-500/50" },
      { label: "Sony / Sennheiser", score: 5, color: "border-green-500/50" },
      { label: "Wired IEMs", score: 0, color: "border-edge" }
    ]
  },
  {
    id: "cloud",
    title: "Where do your photos auto-backup?",
    options: [
      { label: "iCloud", score: 25, color: "border-red-500/50" },
      { label: "Google Photos", score: 25, color: "border-red-500/50" },
      { label: "OneDrive", score: 15, color: "border-yellow-500/50" },
      { label: "Local NAS / Ente", score: 0, color: "border-green-500/50" }
    ]
  }
];

export function LockInDiagnostic() {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [step, setStep] = useState(0);

  const handleSelect = (score: number) => {
    setAnswers(prev => ({ ...prev, [QUESTIONS[step].id]: score }));
    if (step < QUESTIONS.length) {
      setTimeout(() => setStep(s => s + 1), 300);
    }
  };

  const isFinished = step >= QUESTIONS.length;
  const totalScore = Object.values(answers).reduce((a, b) => a + b, 0);

  let resultTier = "Independent";
  let resultColor = "text-green-400";
  let resultText = "You own your hardware. You can switch phones tomorrow and lose nothing.";
  
  if (totalScore > 75) {
    resultTier = "Heavily Locked";
    resultColor = "text-red-400";
    resultText = "You are deeply entrenched. Switching platforms will require replacing thousands of dollars in hardware and navigating complex data exports.";
  } else if (totalScore > 40) {
    resultTier = "Moderately Locked";
    resultColor = "text-yellow-400";
    resultText = "You have some cross-platform flexibility, but core services will cause friction if you try to leave.";
  }

  return (
    <div className="bg-surface/30 border border-edge rounded-3xl p-8 backdrop-blur-md relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-edge">
        <motion.div 
          className="h-full bg-accent-bright"
          initial={{ width: 0 }}
          animate={{ width: `${(Math.min(step, QUESTIONS.length) / QUESTIONS.length) * 100}%` }}
        />
      </div>

      <div className="max-w-2xl mx-auto py-8">
        <AnimatePresence mode="wait">
          {!isFinished ? (
            <motion.div
              key={`step-${step}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <span className="font-mono text-xs uppercase tracking-widest text-faint block mb-4">
                Diagnostic {step + 1} of {QUESTIONS.length}
              </span>
              <h3 className="font-display text-3xl font-semibold mb-8">
                {QUESTIONS[step].title}
              </h3>
              <div className="grid sm:grid-cols-2 gap-4">
                {QUESTIONS[step].options.map((opt) => (
                  <button
                    key={opt.label}
                    onClick={() => handleSelect(opt.score)}
                    className="p-6 text-left rounded-xl border border-edge hover:border-accent-bright bg-surface transition-all duration-200 hover:scale-[1.02]"
                  >
                    <span className="font-semibold text-ink">{opt.label}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center"
            >
              <span className="font-mono text-xs uppercase tracking-widest text-faint block mb-6">
                Lock-in Score: {totalScore}%
              </span>
              <h3 className={`font-display text-5xl font-semibold mb-4 ${resultColor}`}>
                {resultTier}
              </h3>
              <p className="text-lg text-dim leading-relaxed max-w-lg mx-auto mb-8">
                {resultText}
              </p>
              <button 
                onClick={() => { setStep(0); setAnswers({}); }}
                className="font-mono text-xs uppercase tracking-widest text-ink hover:text-accent-bright transition-colors"
              >
                [ Recalculate ]
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
