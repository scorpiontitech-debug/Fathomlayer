"use client";

import { useState, useMemo } from "react";
import { Cpu, MemoryStick, HardDrive, Info } from "lucide-react";
import { motion } from "framer-motion";

const MODELS = [
  { name: "Llama 3.1 (8B)", params: 8 },
  { name: "DeepSeek R1 Distill (14B)", params: 14 },
  { name: "Mistral Large (24B)", params: 24 },
  { name: "Llama 3.3 (70B)", params: 70 },
  { name: "DeepSeek V3 (671B MoE)", params: 671, activeParams: 37 }, // Special case for MoE
];

const QUANTIZATIONS = [
  { name: "Uncompressed (FP16)", bytesPerParam: 2, label: "Studio Grade" },
  { name: "8-bit (Q8_0)", bytesPerParam: 1, label: "Near Perfect" },
  { name: "4-bit (Q4_K_M)", bytesPerParam: 0.55, label: "Standard Local" },
  { name: "3-bit (IQ3_XXS)", bytesPerParam: 0.38, label: "Aggressive" },
];

export function LocalAiSizerClient() {
  const [modelIdx, setModelIdx] = useState(0);
  const [quantIdx, setQuantIdx] = useState(2); // default Q4
  const [contextSize, setContextSize] = useState(8); // 8k default

  const selectedModel = MODELS[modelIdx];
  const selectedQuant = QUANTIZATIONS[quantIdx];

  // Logic: 
  // Base VRAM = Params (in Billions) * BytesPerParam
  // KV Cache VRAM = ~ (Context Size in K) * (Params / 10) * 0.001 (rough generic heuristic for KV cache per layer)
  // We use a simplified generic heuristic: ~0.1 GB per 1000 tokens for an 8B model. 
  // It scales roughly with param size.
  const baseVramGb = selectedModel.params * selectedQuant.bytesPerParam;
  
  // KV cache is usually unquantized (FP16 = 2 bytes) or 8-bit.
  // Approximation: 1M tokens on 8B is ~4GB. So 8k tokens on 8B is ~0.03GB.
  // Let's use a simpler heuristic for the UI: Context Buffer = Params * ContextSize * 0.0005
  const kvCacheGb = selectedModel.params * contextSize * 0.0005;
  
  const totalVramNeeded = baseVramGb + kvCacheGb + 1; // +1GB for OS/PyTorch overhead
  const totalRamNeeded = totalVramNeeded + 4; // OS needs breathing room

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Controls */}
      <div className="lg:col-span-7 space-y-8 bg-surface/30 p-8 rounded-2xl border border-edge">
        
        {/* Model Selection */}
        <div>
          <label className="text-xs font-mono uppercase tracking-widest text-faint mb-4 block">Target Model Size</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {MODELS.map((m, idx) => (
              <button
                key={m.name}
                onClick={() => setModelIdx(idx)}
                className={`p-4 text-left rounded-xl border transition-all ${
                  modelIdx === idx 
                    ? "border-accent bg-accent/10 shadow-[0_0_15px_rgba(0,100,255,0.1)]" 
                    : "border-edge bg-surface/50 hover:border-edge-strong"
                }`}
              >
                <div className={`font-display font-medium ${modelIdx === idx ? "text-accent-bright" : "text-ink"}`}>
                  {m.name}
                </div>
                <div className="text-xs font-mono text-dim mt-1">{m.params}B Params</div>
              </button>
            ))}
          </div>
        </div>

        {/* Quantization Selection */}
        <div>
          <label className="text-xs font-mono uppercase tracking-widest text-faint mb-4 block">Quantization (Compression)</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {QUANTIZATIONS.map((q, idx) => (
              <button
                key={q.name}
                onClick={() => setQuantIdx(idx)}
                className={`p-4 text-left rounded-xl border transition-all ${
                  quantIdx === idx 
                    ? "border-ok bg-ok/10 shadow-[0_0_15px_rgba(0,255,100,0.1)]" 
                    : "border-edge bg-surface/50 hover:border-edge-strong"
                }`}
              >
                <div className={`font-display font-medium ${quantIdx === idx ? "text-ok" : "text-ink"}`}>
                  {q.name}
                </div>
                <div className="text-xs font-mono text-dim mt-1">{q.label} • {q.bytesPerParam} bpw</div>
              </button>
            ))}
          </div>
        </div>

        {/* Context Window Slider */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <label className="text-xs font-mono uppercase tracking-widest text-faint">Context Window</label>
            <span className="font-mono text-ink bg-white/5 px-2 py-1 rounded text-sm">{contextSize}K Tokens</span>
          </div>
          <input 
            type="range" 
            min="2" 
            max="128" 
            step="2"
            value={contextSize}
            onChange={(e) => setContextSize(parseInt(e.target.value))}
            className="w-full h-1 bg-subtle rounded-full appearance-none cursor-pointer accent-accent"
          />
          <div className="flex justify-between mt-2 text-[10px] font-mono text-dim uppercase">
            <span>2K (Chat)</span>
            <span>128K (Book)</span>
          </div>
        </div>
      </div>

      {/* Results / Visualizer */}
      <div className="lg:col-span-5">
        <div className="sticky top-24 space-y-6">
          <div className="bg-surface/50 border border-edge rounded-2xl p-6">
            <h3 className="font-display text-xl font-semibold mb-6 flex items-center gap-2 text-ink">
              <Cpu className="w-5 h-5 text-accent-bright" /> 
              Hardware Requirements
            </h3>

            <div className="space-y-6">
              {/* VRAM Bar */}
              <div>
                <div className="flex justify-between items-end mb-2">
                  <span className="text-sm font-mono text-dim uppercase tracking-widest">Min. VRAM (GPU)</span>
                  <span className="text-2xl font-mono text-ink">{totalVramNeeded.toFixed(1)} GB</span>
                </div>
                <div className="h-4 w-full bg-subtle rounded-full overflow-hidden flex">
                  <motion.div 
                    layout
                    initial={false}
                    animate={{ width: `${Math.min((baseVramGb / 24) * 100, 100)}%` }} 
                    className="bg-accent h-full"
                    title="Model Weights"
                  />
                  <motion.div 
                    layout
                    initial={false}
                    animate={{ width: `${Math.min((kvCacheGb / 24) * 100, 100)}%` }} 
                    className="bg-ok h-full"
                    title="KV Cache"
                  />
                  <motion.div 
                    layout
                    initial={false}
                    animate={{ width: `${Math.min((1 / 24) * 100, 100)}%` }} 
                    className="bg-white/20 h-full"
                    title="OS Overhead"
                  />
                </div>
                <div className="flex gap-4 mt-2 text-[10px] font-mono uppercase text-dim">
                  <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-accent" /> Weights</span>
                  <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-ok" /> Context</span>
                  <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-white/20" /> Overhead</span>
                </div>
              </div>

              <div className="h-px w-full bg-edge/50" />

              {/* System RAM */}
              <div>
                <div className="flex justify-between items-end mb-2">
                  <span className="text-sm font-mono text-dim uppercase tracking-widest">Sys RAM (CPU)</span>
                  <span className="text-xl font-mono text-ink">{totalRamNeeded.toFixed(1)} GB</span>
                </div>
                <p className="text-xs text-dim leading-relaxed">
                  Required if offloading layers to CPU via llama.cpp. Will result in significantly slower inference (tokens/sec) compared to pure GPU VRAM.
                </p>
              </div>
            </div>
          </div>

          {/* Recommendations Block */}
          <div className="bg-accent/5 border border-accent/20 rounded-2xl p-6">
            <h4 className="font-mono text-xs uppercase tracking-widest text-accent-bright mb-3">Deterministic Verdict</h4>
            <p className="text-sm text-ink leading-relaxed">
              {totalVramNeeded <= 8 && "Any modern laptop with an RTX 4060 or Mac with 16GB Unified Memory can run this perfectly."}
              {totalVramNeeded > 8 && totalVramNeeded <= 16 && "Requires a high-end gaming laptop (RTX 4080 Mobile) or a desktop GPU like the RTX 4070 Ti Super. Mac users need 24GB Unified Memory."}
              {totalVramNeeded > 16 && totalVramNeeded <= 24 && "Demands an enthusiast flagship GPU (RTX 4090 / 3090) or a Mac Studio / MacBook Pro with 36GB+ Unified Memory."}
              {totalVramNeeded > 24 && "Exceeds standard consumer GPUs. Requires dual-GPU setups (e.g. 2x RTX 3090), high-end Macs (64GB+), or enterprise cards (A6000)."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
