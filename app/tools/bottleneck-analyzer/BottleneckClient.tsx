"use client";

import React, { useState, useMemo } from 'react';
import { Cpu, MonitorSmartphone, Activity } from 'lucide-react';

const CPUs = [
  { id: 'i9-14900k', name: 'Intel Core i9-14900K', tier: 10 },
  { id: 'i7-14700k', name: 'Intel Core i7-14700K', tier: 8 },
  { id: 'i5-14600k', name: 'Intel Core i5-14600K', tier: 6 },
  { id: 'r9-7950x3d', name: 'Ryzen 9 7950X3D', tier: 10 },
  { id: 'r7-7800x3d', name: 'Ryzen 7 7800X3D', tier: 9 },
  { id: 'r5-7600x', name: 'Ryzen 5 7600X', tier: 5 },
];

const GPUs = [
  { id: 'rtx-4090', name: 'NVIDIA RTX 4090', tier: 10 },
  { id: 'rtx-4080', name: 'NVIDIA RTX 4080 Super', tier: 8 },
  { id: 'rtx-4070', name: 'NVIDIA RTX 4070 Super', tier: 6 },
  { id: 'rx-7900-xtx', name: 'AMD RX 7900 XTX', tier: 9 },
  { id: 'rx-7800-xt', name: 'AMD RX 7800 XT', tier: 6 },
];

const RESOLUTIONS = [
  { id: '1080p', name: '1080p (FHD)', loadWeight: 0.5 },
  { id: '1440p', name: '1440p (QHD)', loadWeight: 0.8 },
  { id: '4k', name: '4K (UHD)', loadWeight: 1.2 },
];

export function BottleneckClient() {
  const [cpuId, setCpuId] = useState(CPUs[0].id);
  const [gpuId, setGpuId] = useState(GPUs[0].id);
  const [resolutionId, setResolutionId] = useState(RESOLUTIONS[1].id);

  const result = useMemo(() => {
    const cpu = CPUs.find(c => c.id === cpuId)!;
    const gpu = GPUs.find(g => g.id === gpuId)!;
    const res = RESOLUTIONS.find(r => r.id === resolutionId)!;

    // Algorithmic calculation simulating CPU vs GPU constraint
    // High res shifts load to GPU, reducing CPU bottleneck.
    // Low res shifts load to CPU, increasing CPU bottleneck.
    
    // Effective GPU tier adjusted for resolution
    const effectiveGpuTier = gpu.tier * res.loadWeight;
    
    // Gap calculation
    const gap = cpu.tier - effectiveGpuTier;
    
    let bottleneckType = 'Balanced';
    let percentage = 0;

    if (gap < -1) {
      bottleneckType = 'CPU Bottleneck';
      // GPU is waiting for CPU
      percentage = Math.min(Math.abs(gap) * 8.5, 45); 
    } else if (gap > 2) {
      bottleneckType = 'GPU Bottleneck';
      // CPU is waiting for GPU
      percentage = Math.min((gap - 2) * 7.2, 45);
    } else {
      // Balanced
      percentage = Math.max(0, Math.abs(gap) * 2.1);
    }

    return {
      type: percentage < 5 ? 'Optimal' : bottleneckType,
      percentage: percentage.toFixed(1),
      severity: percentage > 15 ? 'high' : percentage > 5 ? 'medium' : 'low'
    };
  }, [cpuId, gpuId, resolutionId]);

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-8 space-y-8">
      
      {/* Controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-3">
          <label className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-dim">
            <Cpu className="w-4 h-4" /> CPU
          </label>
          <select 
            value={cpuId} 
            onChange={e => setCpuId(e.target.value)}
            className="w-full bg-black/50 border border-white/20 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-accent transition-colors"
          >
            {CPUs.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>

        <div className="space-y-3">
          <label className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-dim">
            <Activity className="w-4 h-4" /> GPU
          </label>
          <select 
            value={gpuId} 
            onChange={e => setGpuId(e.target.value)}
            className="w-full bg-black/50 border border-white/20 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-accent transition-colors"
          >
            {GPUs.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
          </select>
        </div>

        <div className="space-y-3">
          <label className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-dim">
            <MonitorSmartphone className="w-4 h-4" /> Resolution
          </label>
          <select 
            value={resolutionId} 
            onChange={e => setResolutionId(e.target.value)}
            className="w-full bg-black/50 border border-white/20 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-accent transition-colors"
          >
            {RESOLUTIONS.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
          </select>
        </div>
      </div>

      {/* Result Display */}
      <div className="mt-12 pt-8 border-t border-white/10">
        <div className="flex flex-col items-center text-center">
          <span className="font-mono text-xs uppercase tracking-widest text-dim mb-4">Calculated Constraint</span>
          <div className={`text-6xl font-display font-black tracking-tighter mb-2 ${
            result.severity === 'high' ? 'text-red-400' :
            result.severity === 'medium' ? 'text-yellow-400' : 'text-green-400'
          }`}>
            {result.percentage}%
          </div>
          <div className="text-xl font-bold uppercase tracking-wide text-white">
            {result.type}
          </div>
        </div>
      </div>
    </div>
  );
}
