"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Apenas instanciar em desktops com hover habilitado
    if (window.matchMedia("(pointer: coarse)").matches) return;

    // Coordenadas iniciais do mouse no centro
    const mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const ring = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

    // Setters diretos do GSAP para performance extrema
    const xSetDot = gsap.quickSetter(dotRef.current, "x", "px");
    const ySetDot = gsap.quickSetter(dotRef.current, "y", "px");
    const xSetRing = gsap.quickSetter(ringRef.current, "x", "px");
    const ySetRing = gsap.quickSetter(ringRef.current, "y", "px");

    const onMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      
      // O dot segue instantaneamente
      xSetDot(mouse.x);
      ySetDot(mouse.y);
    };

    window.addEventListener("mousemove", onMouseMove);

    // Loop de renderização para o anel ter fricção física
    const ticker = gsap.ticker.add(() => {
      // Lerp (interpolação linear) para inércia do anel
      const dt = 1.0 - Math.pow(1.0 - 0.25, gsap.ticker.deltaRatio());
      ring.x += (mouse.x - ring.x) * dt;
      ring.y += (mouse.y - ring.y) * dt;
      
      xSetRing(ring.x);
      ySetRing(ring.y);
    });

    // Lógica magnética para interações (hover states)
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName.toLowerCase() === "a" ||
        target.tagName.toLowerCase() === "button" ||
        target.closest("a") ||
        target.closest("button") ||
        target.dataset.magnetic !== undefined
      ) {
        ringRef.current?.setAttribute("data-hot", "true");
        // Efeito magnético no dot (ele esconde ou cresce dependendo do design system)
        gsap.to(dotRef.current, { scale: 0, duration: 0.2 });
      }
    };

    const handleMouseOut = () => {
      ringRef.current?.removeAttribute("data-hot");
      gsap.to(dotRef.current, { scale: 1, duration: 0.2 });
    };

    document.addEventListener("mouseover", handleMouseOver);
    document.addEventListener("mouseout", handleMouseOut);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseover", handleMouseOver);
      document.removeEventListener("mouseout", handleMouseOut);
      gsap.ticker.remove(ticker);
    };
  }, []);

  return (
    <>
      <div ref={dotRef} aria-hidden className="cursor-dot hidden md:block" />
      <div ref={ringRef} aria-hidden className="cursor-ring hidden md:block" />
    </>
  );
}
