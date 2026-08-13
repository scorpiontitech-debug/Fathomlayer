"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

export function Preloader() {
  const [isComplete, setIsComplete] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Esconder o scroll nativo enquanto o preloader está ativo
    document.body.style.overflow = "hidden";
    
    // Timeline de Animação Nível Awwwards
    const tl = gsap.timeline({
      onComplete: () => {
        document.body.style.overflow = "";
        setIsComplete(true);
      }
    });

    // 1. Barra de progresso cruza a tela super rápido
    tl.to(progressRef.current, {
      scaleX: 1,
      duration: 1.2,
      ease: "power4.inOut"
    })
    // 2. O texto principal revela (fade in + subida suave)
    .to(textRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: "power3.out"
    }, "-=0.4")
    // 3. Pequena pausa para impacto dramático
    .to({}, { duration: 0.5 })
    // 4. Texto desaparece
    .to(textRef.current, {
      opacity: 0,
      scale: 1.1,
      duration: 0.5,
      ease: "power2.inOut"
    })
    // 5. Container principal sobe e libera a visualização da plataforma
    .to(containerRef.current, {
      yPercent: -100,
      duration: 1,
      ease: "expo.inOut",
      borderRadius: "0 0 50% 50%" // Efeito de cortina elástica (típico awwwards)
    }, "-=0.2");

    return () => {
      tl.kill();
      document.body.style.overflow = "";
    };
  }, []);

  if (isComplete) return null;

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black text-white"
    >
      <div 
        ref={textRef} 
        className="opacity-0 translate-y-8 flex flex-col items-center gap-4"
      >
        <span className="font-display text-4xl tracking-tighter sm:text-7xl font-semibold">
          Fathom Layer
        </span>
        <span className="font-mono text-xs uppercase tracking-[0.3em] text-accent-bright">
          The Technology Index
        </span>
      </div>

      <div className="absolute bottom-0 left-0 w-full h-1 bg-white/10">
        <div 
          ref={progressRef} 
          className="h-full bg-sky-500 origin-left scale-x-0"
        />
      </div>
    </div>
  );
}
