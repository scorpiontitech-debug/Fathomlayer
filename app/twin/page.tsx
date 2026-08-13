"use client";

import React, { useEffect, useState } from "react";
import { DigitalTwinViewer } from "@/components/DigitalTwinViewer";
import { l4s } from "@/lib/network/l4s-client";
import { Activity, Heart, ThermometerSun, ShieldCheck, Wifi, Zap } from "lucide-react";

interface TwinState {
  heartRate: number;
  hrv: number;
  glucose: number;
  stressScore: number;
  timestamp: string;
}

export default function TwinDashboard() {
  const [twinState, setTwinState] = useState<TwinState | null>(null);
  const [l4sActive, setL4sActive] = useState(false);

  useEffect(() => {
    // Initial fetch/simulation via L4S Client
    const fetchData = async () => {
      try {
        // In a real prod environment we'd await l4s.fetchTwinState('/api/twin')
        // For the UI demonstration, we use the deterministic L4S simulator
        const state = l4s.simulateBioState();
        setTwinState(state);
        // Simulate L4S ECN marking (Sub-10ms ping indication)
        setL4sActive(true);
      } catch (error) {
        console.error("Twin fetch error", error);
      }
    };

    fetchData();

    // Poll every 2 seconds to simulate continuous stream from biometric wearables
    const interval = setInterval(fetchData, 2000);
    return () => clearInterval(interval);
  }, []);

  if (!twinState) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white">
        <p className="animate-pulse tracking-widest text-sm">INITIALIZING BIOMETRIC LINK...</p>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-black text-slate-100 overflow-hidden font-sans selection:bg-sky-500/30">
      
      {/* 3D WebGL Background Viewer */}
      <DigitalTwinViewer 
        stressScore={twinState.stressScore} 
        heartRate={twinState.heartRate} 
      />

      {/* Glassmorphism Overlay UI */}
      <main className="relative z-10 flex flex-col min-h-screen p-6 md:p-12 pointer-events-none">
        
        {/* Header HUD */}
        <header className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-light tracking-tighter">Gêmeo Digital</h1>
            <p className="text-sky-400/80 text-sm tracking-widest mt-1 flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-500"></span>
              </span>
              SINKRONIZATION ACTIVE
            </p>
          </div>

          <div className="flex gap-4">
            <div className="backdrop-blur-xl bg-white/5 border border-white/10 px-4 py-2 rounded-2xl flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-medium tracking-wide">PQC SECURED</span>
            </div>
            <div className={`backdrop-blur-xl border px-4 py-2 rounded-2xl flex items-center gap-2 transition-colors duration-500 ${l4sActive ? 'bg-sky-500/10 border-sky-500/30' : 'bg-white/5 border-white/10'}`}>
              <Wifi className={`w-4 h-4 ${l4sActive ? 'text-sky-400 animate-pulse' : 'text-slate-400'}`} />
              <span className="text-xs font-medium tracking-wide">L4S LINK</span>
            </div>
          </div>
        </header>

        {/* Telemetry Panels */}
        <div className="mt-auto grid grid-cols-1 md:grid-cols-4 gap-4 pointer-events-auto">
          
          {/* Heart Rate Panel */}
          <div className="backdrop-blur-2xl bg-black/40 border border-white/10 p-6 rounded-3xl hover:bg-black/50 transition-colors">
            <div className="flex items-center gap-3 text-rose-400 mb-4">
              <Heart className="w-5 h-5 animate-pulse" />
              <span className="text-sm font-semibold tracking-wider">BATIMENTO (BPM)</span>
            </div>
            <div className="text-5xl font-light tabular-nums tracking-tighter">
              {twinState.heartRate.toFixed(0)}
            </div>
            <div className="mt-2 text-xs text-slate-400 flex justify-between">
              <span>HRV (Variabilidade)</span>
              <span className="text-slate-200">{twinState.hrv.toFixed(1)} ms</span>
            </div>
          </div>

          {/* Metabolism / Glucose Panel */}
          <div className="backdrop-blur-2xl bg-black/40 border border-white/10 p-6 rounded-3xl hover:bg-black/50 transition-colors">
            <div className="flex items-center gap-3 text-amber-400 mb-4">
              <Zap className="w-5 h-5" />
              <span className="text-sm font-semibold tracking-wider">GLICOSE (CGM)</span>
            </div>
            <div className="text-5xl font-light tabular-nums tracking-tighter">
              {twinState.glucose.toFixed(0)} <span className="text-xl text-slate-500">mg/dL</span>
            </div>
            <div className="mt-2 text-xs text-slate-400 flex justify-between">
              <span>Tendência</span>
              <span className="text-emerald-400">Estável</span>
            </div>
          </div>

          {/* IoT Matter Automation Panel */}
          <div className="backdrop-blur-2xl bg-black/40 border border-white/10 p-6 rounded-3xl hover:bg-black/50 transition-colors md:col-span-2">
            <div className="flex items-center gap-3 text-sky-400 mb-4">
              <ThermometerSun className="w-5 h-5" />
              <span className="text-sm font-semibold tracking-wider">AUTOMAÇÃO AMBIENTAL (MATTER)</span>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-xs text-slate-400 mb-1">Carga Cognitiva/Estresse</div>
                <div className="text-2xl font-light">
                  {twinState.stressScore.toFixed(1)}%
                </div>
                {/* Progress bar */}
                <div className="w-full bg-slate-800 rounded-full h-1.5 mt-2">
                  <div 
                    className="bg-gradient-to-r from-sky-400 to-rose-400 h-1.5 rounded-full transition-all duration-1000" 
                    style={{ width: `${Math.min(100, twinState.stressScore)}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="border-l border-white/10 pl-4">
                <div className="text-xs text-slate-400 mb-1">Ações do Agente Mastra</div>
                <ul className="text-sm space-y-1 mt-2">
                  <li className="flex items-center gap-2 text-emerald-400/90">
                    <Activity className="w-3 h-3" /> Climatização reduzida (-2°C)
                  </li>
                  <li className="flex items-center gap-2 text-slate-300">
                    <Activity className="w-3 h-3" /> Bloqueio de notificações ativo
                  </li>
                </ul>
              </div>
            </div>
          </div>

        </div>
      </main>

    </div>
  );
}
