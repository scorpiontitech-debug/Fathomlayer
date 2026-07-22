"use client";

import { useEffect, useRef, useState } from "react";
import type { HeroSceneHandle } from "./heroScene";

// Monta a peça 3D do hero. Three.js entra por chunk assíncrono — a página
// fica interativa antes. A cena anima por padrão; quem desliga é o toggle
// global de movimento (MotionLayer), não a media query do SO.
// Todo o conteúdo real está no HTML ao redor (acessibilidade WebGL,
// design system 5.2) — o canvas é aria-hidden.
export function HeroCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const handleRef = useRef<HeroSceneHandle | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const { createHeroScene } = await import("./heroScene");
        if (cancelled || !canvasRef.current) return;
        // Estado inicial segue a escolha persistida do usuário
        const off = document.documentElement.classList.contains("motion-off");
        handleRef.current = createHeroScene(canvasRef.current, { reducedMotion: off });
        setReady(true);
      } catch (error) {
        // WebGL indisponível: o fundo CSS (.layer-field) segura o hero sozinho.
        console.error("[fathom-layer] hero scene init failed:", error);
      }
    })();

    // Acompanha o toggle global: pausa/retoma a cena junto do resto do site
    const observer = new MutationObserver(() => {
      const off = document.documentElement.classList.contains("motion-off");
      handleRef.current?.setPaused(off);
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => {
      cancelled = true;
      observer.disconnect();
      handleRef.current?.dispose();
      handleRef.current = null;
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className={`pointer-events-none absolute inset-0 h-full w-full transition-opacity duration-1000 ${
        ready ? "opacity-100" : "opacity-0"
      }`}
    />
  );
}
