'use client';

import { useState, useEffect } from 'react';
import { edgeAiRuntime } from '@/lib/edge-ai/webnn-runtime';

// Interface Zero-UI (Invisível) para intenções vocais.
export default function ZeroUIVoiceInterface() {
  const [listening, setListening] = useState(false);
  const [localSupport, setLocalSupport] = useState(false);

  useEffect(() => {
    setLocalSupport(edgeAiRuntime.isSupported);
  }, []);

  const toggleListen = async () => {
    if (!listening) {
      setListening(true);
      // Aqui integrariamos a Web Audio API para streaming
      // O processamento semântico ocorreria na NPU se suportado:
      const result = await edgeAiRuntime.processIntentLocal(null);
      console.log('Intenção interceptada (Zero-UI):', result);
      setTimeout(() => setListening(false), 2000);
    } else {
      setListening(false);
    }
  };

  // Zero-UI significa que a interface gráfica é minimalista ou invisível.
  // Pode ser ativada por comandos de ativação ("wake words") via WebNN.
  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button 
        onClick={toggleListen}
        className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
          listening ? 'bg-red-500 animate-pulse' : 'bg-slate-800/80 hover:bg-slate-700 backdrop-blur-md border border-slate-700/50'
        }`}
        title="Microfone (Zero-UI)"
      >
        <span className="text-xl">{listening ? '🎙️' : '🎤'}</span>
      </button>
      {localSupport && (
        <span className="absolute -top-6 right-0 text-[10px] text-emerald-400 font-mono tracking-widest uppercase">
          Edge AI On
        </span>
      )}
    </div>
  );
}
