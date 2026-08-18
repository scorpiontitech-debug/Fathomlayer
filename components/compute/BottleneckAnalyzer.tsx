"use client";

import { useState } from "react";

type HardwareType = "GPU" | "CPU" | "RAM";

interface ComponentSelector {
  id: string;
  type: HardwareType;
  name: string;
  bandwidthGBs: number;
}

const MOCK_DB: Record<HardwareType, ComponentSelector[]> = {
  GPU: [
    { id: "g1", type: "GPU", name: "NVIDIA RTX 4090 (24GB)", bandwidthGBs: 1008 },
    { id: "g2", type: "GPU", name: "NVIDIA RTX 4080 (16GB)", bandwidthGBs: 717 },
    { id: "g3", type: "GPU", name: "AMD RX 7900 XTX (24GB)", bandwidthGBs: 960 },
    { id: "g4", type: "GPU", name: "No Dedicated GPU", bandwidthGBs: 0 },
  ],
  CPU: [
    { id: "c1", type: "CPU", name: "Intel Core i9-14900K", bandwidthGBs: 89.6 },
    { id: "c2", type: "CPU", name: "AMD Ryzen 9 7950X", bandwidthGBs: 83.2 },
    { id: "c3", type: "CPU", name: "Apple M3 Max (Unified)", bandwidthGBs: 400 },
    { id: "c4", type: "CPU", name: "Apple M2 Ultra (Unified)", bandwidthGBs: 800 },
  ],
  RAM: [
    { id: "r1", type: "RAM", name: "DDR5-6000 (Dual Channel)", bandwidthGBs: 96 },
    { id: "r2", type: "RAM", name: "DDR4-3200 (Dual Channel)", bandwidthGBs: 51.2 },
    { id: "r3", type: "RAM", name: "Apple Unified Memory", bandwidthGBs: 800 }, // Apple is special
  ]
};

export function BottleneckAnalyzer() {
  const [gpu, setGpu] = useState<ComponentSelector>(MOCK_DB.GPU[0]);
  const [cpu, setCpu] = useState<ComponentSelector>(MOCK_DB.CPU[0]);
  const [ram, setRam] = useState<ComponentSelector>(MOCK_DB.RAM[0]);

  // Logic to calculate bottleneck
  const isAppleUnified = cpu.name.includes("Apple");
  
  // If unified, RAM bandwidth = CPU bandwidth, GPU bandwidth is irrelevant for "offloading"
  const maxInferenceBandwidth = isAppleUnified ? cpu.bandwidthGBs : Math.min(gpu.bandwidthGBs || ram.bandwidthGBs, 1500); // simplified logic
  
  // Calculate a generic "Tokens per sec" potential for a 7B model Q4 (~4GB weight size)
  const theoreticalTokens = Math.round(maxInferenceBandwidth / 4);

  return (
    <div className="rounded-2xl border border-edge bg-surface overflow-hidden shadow-2xl">
      <div className="border-b border-edge bg-surface-dim p-6">
        <h2 className="font-display text-2xl font-semibold">The Bottleneck Analyzer</h2>
        <p className="text-dim text-sm mt-1">Select your architecture to reveal memory bandwidth limitations.</p>
      </div>

      <div className="grid md:grid-cols-2">
        <div className="p-6 space-y-6 border-r border-edge">
          {/* Seletor GPU */}
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-widest text-faint font-mono">GPU / Accelerator</label>
            <select 
              className="w-full bg-black/50 border border-edge rounded-lg p-3 text-sm text-white focus:border-accent-bright outline-none"
              value={gpu.id}
              onChange={(e) => setGpu(MOCK_DB.GPU.find(g => g.id === e.target.value)!)}
              disabled={isAppleUnified}
            >
              {MOCK_DB.GPU.map(g => <option key={g.id} value={g.id}>{g.name} - {g.bandwidthGBs} GB/s</option>)}
            </select>
          </div>

          {/* Seletor CPU */}
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-widest text-faint font-mono">Processor</label>
            <select 
              className="w-full bg-black/50 border border-edge rounded-lg p-3 text-sm text-white focus:border-accent-bright outline-none"
              value={cpu.id}
              onChange={(e) => {
                const c = MOCK_DB.CPU.find(c => c.id === e.target.value)!;
                setCpu(c);
                if (c.name.includes("Apple")) setRam(MOCK_DB.RAM[2]); // Auto select Unified
              }}
            >
              {MOCK_DB.CPU.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>

          {/* Seletor RAM */}
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-widest text-faint font-mono">System Memory</label>
            <select 
              className="w-full bg-black/50 border border-edge rounded-lg p-3 text-sm text-white focus:border-accent-bright outline-none"
              value={ram.id}
              onChange={(e) => setRam(MOCK_DB.RAM.find(r => r.id === e.target.value)!)}
              disabled={isAppleUnified}
            >
              {MOCK_DB.RAM.map(r => <option key={r.id} value={r.id}>{r.name} - {r.bandwidthGBs} GB/s</option>)}
            </select>
          </div>
        </div>

        {/* Results Panel */}
        <div className="p-6 bg-[#0a0a0b] flex flex-col justify-center">
          <div className="space-y-8">
            <div className="text-center">
              <p className="font-mono text-xs uppercase tracking-widest text-faint mb-2">Maximum Memory Bandwidth</p>
              <div className="flex items-baseline justify-center gap-2">
                <span className="font-display text-5xl font-bold text-accent-bright">{maxInferenceBandwidth}</span>
                <span className="text-xl text-dim font-mono">GB/s</span>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
              <p className="font-mono text-[10px] uppercase tracking-widest text-dim mb-1">Theoretical 7B Inference (Q4)</p>
              <p className="font-mono text-2xl text-white">{theoreticalTokens} t/s</p>
            </div>

            {/* Analysis text */}
            <div className="text-sm text-dim leading-relaxed border-l-2 border-accent-bright pl-4">
              {isAppleUnified ? (
                <span><strong>Architecture: Unified Memory.</strong> The Apple Silicon chip provides massive uniform bandwidth across the system. There are no PCIe bottlenecks. Excellent for models that exceed VRAM limits of consumer GPUs.</span>
              ) : gpu.bandwidthGBs === 0 ? (
                <span><strong>Architecture: CPU Only.</strong> You are entirely limited by system RAM bandwidth ({ram.bandwidthGBs} GB/s). Inference will be extremely slow.</span>
              ) : (
                <span><strong>Architecture: Discrete GPU.</strong> You have {gpu.bandwidthGBs} GB/s of VRAM bandwidth. Models that fit entirely in VRAM will fly. If a model spills over to system RAM, performance will crash down to {ram.bandwidthGBs} GB/s.</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
