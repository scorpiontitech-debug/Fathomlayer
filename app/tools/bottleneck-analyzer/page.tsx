import React from 'react';
import Link from 'next/link';
import { BottleneckClient } from './BottleneckClient';

export const metadata = {
  title: 'Bottleneck Analyzer | Fathom Layer',
  description: 'Calculate CPU and GPU pairing bottlenecks to optimize performance.',
};

export default function BottleneckAnalyzerPage() {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-accent selection:text-white font-sans">
      {/* Header */}
      <header className="border-b border-white/10 bg-black/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
          <div>
            <Link href="/" className="font-mono text-xs uppercase tracking-widest text-dim hover:text-white transition-colors mb-2 block">
              ← Return to Fathom Layer
            </Link>
            <h1 className="text-3xl font-display font-bold uppercase tracking-tight">Bottleneck Analyzer</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Intro Column */}
          <div className="lg:col-span-4 space-y-6">
            <div className="p-6 border border-white/10 bg-white/5 rounded-2xl">
              <h2 className="text-xl font-display font-semibold mb-4 text-accent-bright">Matrix Architecture</h2>
              <p className="text-dim text-sm leading-relaxed mb-6 font-mono">
                System architecture is gated by the weakest computational link. Select your target CPU and GPU generation to evaluate the percentage of performance lost to architectural constraints.
              </p>
              
              <ul className="space-y-4 font-mono text-xs text-dim">
                <li className="flex gap-2">
                  <span className="text-red-400">&gt; 15%</span>
                  <span>Severe bottleneck. Compute resources are wasted.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-yellow-400">5% - 15%</span>
                  <span>Suboptimal. Minor thermal or pipeline constraints.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-green-400">&lt; 5%</span>
                  <span>Optimal pairing. Full bandwidth utilization.</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Interactive Matrix Column */}
          <div className="lg:col-span-8">
            <BottleneckClient />
          </div>
          
        </div>
      </main>
    </div>
  );
}
