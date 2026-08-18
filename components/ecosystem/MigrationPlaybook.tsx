"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Circle, ArrowRight } from "lucide-react";

const PLAYBOOKS: Record<string, { title: string, steps: string[] }> = {
  "icloud-to-local": {
    title: "Escape iCloud to Local NAS (Immich)",
    steps: [
      "Purchase a Synology or build a TrueNAS core server.",
      "Install Docker and deploy the Immich server stack.",
      "Go to privacy.apple.com and request a complete export of all your photos.",
      "Wait 3-7 days for Apple to prepare the multi-GB zip files.",
      "Download all zip files to a local machine.",
      "Use the open-source 'icloud-photos-downloader' script to preserve exact EXIF metadata.",
      "Upload the directory using the Immich CLI bulk uploader.",
      "Install the Immich app on iOS/Android and enable background sync."
    ]
  },
  "apple-to-android": {
    title: "Migrate from iPhone to Google Pixel",
    steps: [
      "Disable iMessage on your iPhone before turning it off (Critical: or you will lose texts).",
      "Upload all iPhone contacts to Google Contacts.",
      "Connect the two phones via USB-C cable during the Pixel initial setup.",
      "Transfer local WhatsApp chats using the official iOS to Android tool.",
      "Cancel Apple One subscriptions that are useless on Android (Apple Arcade, etc).",
      "Export Apple Notes to Google Keep or Obsidian using a third-party exporter tool."
    ]
  }
};

export function MigrationPlaybook() {
  const [selected, setSelected] = useState<string>("icloud-to-local");
  const [checkedSteps, setCheckedSteps] = useState<Record<string, boolean>>({});

  const playbook = PLAYBOOKS[selected];

  const toggleStep = (idx: number) => {
    setCheckedSteps(prev => ({ ...prev, [`${selected}-${idx}`]: !prev[`${selected}-${idx}`] }));
  };

  const progress = (Object.keys(checkedSteps).filter(k => k.startsWith(selected) && checkedSteps[k]).length / playbook.steps.length) * 100;

  return (
    <div className="border border-edge rounded-3xl overflow-hidden bg-black/20">
      <div className="grid md:grid-cols-[300px_1fr] h-full">
        {/* Sidebar */}
        <div className="bg-surface/50 p-6 border-r border-edge">
          <h3 className="font-mono text-xs uppercase tracking-widest text-faint mb-6">Playbooks</h3>
          <div className="flex flex-col gap-2">
            {Object.entries(PLAYBOOKS).map(([key, pb]) => (
              <button
                key={key}
                onClick={() => setSelected(key)}
                className={`text-left px-4 py-3 rounded-xl text-sm transition-colors ${
                  selected === key 
                    ? 'bg-accent/20 text-accent-bright border border-accent/30' 
                    : 'text-dim hover:bg-surface border border-transparent'
                }`}
              >
                {pb.title}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-8 lg:p-12">
          <h2 className="font-display text-2xl font-semibold mb-2">{playbook.title}</h2>
          <p className="text-dim text-sm mb-8">Follow this verified path to migrate your data without losing metadata or getting trapped by format lock-ins.</p>

          <div className="mb-8 bg-surface border border-edge rounded-full h-2 overflow-hidden">
            <motion.div 
              className="h-full bg-accent-bright"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>

          <div className="space-y-3">
            <AnimatePresence mode="wait">
              {playbook.steps.map((step, i) => {
                const isChecked = checkedSteps[`${selected}-${i}`];
                return (
                  <motion.div 
                    key={`${selected}-step-${i}`}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    onClick={() => toggleStep(i)}
                    className={`flex gap-4 p-4 rounded-xl border cursor-pointer transition-all ${
                      isChecked 
                        ? 'bg-green-500/5 border-green-500/20 text-dim' 
                        : 'bg-surface/30 border-edge hover:border-accent-bright text-ink'
                    }`}
                  >
                    <div className="mt-0.5 shrink-0">
                      {isChecked ? <CheckCircle2 className="w-5 h-5 text-green-500" /> : <Circle className="w-5 h-5 text-faint" />}
                    </div>
                    <span className={`text-sm leading-relaxed ${isChecked ? 'line-through opacity-50' : ''}`}>
                      {step}
                    </span>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
