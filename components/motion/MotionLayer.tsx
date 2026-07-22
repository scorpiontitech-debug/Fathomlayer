"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Camada de interação global (design system 5.4): cursor autoral com
 * inércia, tilt 3D nos cards, botões magnéticos e o toggle de movimento.
 *
 * Tudo por delegação — um punhado de listeners para o site inteiro, e
 * só escreve custom properties que o CSS consome em transform/opacity
 * (compositor thread). Nada de layout thrashing.
 */
export function MotionLayer() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [motionOff, setMotionOff] = useState(false);

  // Preferência persistida do usuário — decisão consciente, não a do SO.
  useEffect(() => {
    const saved = localStorage.getItem("fl-motion");
    if (saved === "off") {
      document.documentElement.classList.add("motion-off");
      setMotionOff(true);
    }
  }, []);

  function toggleMotion() {
    const next = !motionOff;
    setMotionOff(next);
    document.documentElement.classList.toggle("motion-off", next);
    localStorage.setItem("fl-motion", next ? "off" : "on");
  }

  // Cursor: ponto acompanha direto, anel segue com spring (peso real)
  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const target = { x: innerWidth / 2, y: innerHeight / 2 };
    const ring = { x: target.x, y: target.y };
    let raf = 0;
    let running = true;

    function onMove(e: PointerEvent) {
      target.x = e.clientX;
      target.y = e.clientY;
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      }
      const hot = (e.target as HTMLElement)?.closest?.("a, button, [data-hot]");
      if (ringRef.current) {
        ringRef.current.dataset.hot = hot ? "true" : "false";
      }
    }

    function frame() {
      if (!running) return;
      ring.x += (target.x - ring.x) * 0.16;
      ring.y += (target.y - ring.y) * 0.16;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ring.x}px, ${ring.y}px, 0)`;
      }
      raf = requestAnimationFrame(frame);
    }

    window.addEventListener("pointermove", onMove, { passive: true });
    raf = requestAnimationFrame(frame);
    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  // Tilt 3D + magnético + spotlight: um listener, delegação para o site todo
  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;

    function onMove(e: PointerEvent) {
      const el = e.target as HTMLElement;

      const tilt = el?.closest?.<HTMLElement>("[data-tilt]");
      if (tilt) {
        const r = tilt.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        tilt.style.setProperty("--rx", `${px * 7}deg`);
        tilt.style.setProperty("--ry", `${-py * 7}deg`);
      }

      const mag = el?.closest?.<HTMLElement>("[data-magnetic]");
      if (mag) {
        const r = mag.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2);
        const dy = e.clientY - (r.top + r.height / 2);
        mag.style.setProperty("--dx", `${dx * 0.22}px`);
        mag.style.setProperty("--dy", `${dy * 0.28}px`);
      }

      const spot = el?.closest?.<HTMLElement>("[data-spot]");
      if (spot) {
        const r = spot.getBoundingClientRect();
        spot.style.setProperty("--mx", `${e.clientX - r.left}px`);
        spot.style.setProperty("--my", `${e.clientY - r.top}px`);
      }
    }

    // Zera ao sair, senão o card fica "torto" depois do hover
    function onOut(e: PointerEvent) {
      const el = e.target as HTMLElement;
      const tilt = el?.closest?.<HTMLElement>("[data-tilt]");
      if (tilt) {
        tilt.style.setProperty("--rx", "0deg");
        tilt.style.setProperty("--ry", "0deg");
      }
      const mag = el?.closest?.<HTMLElement>("[data-magnetic]");
      if (mag) {
        mag.style.setProperty("--dx", "0px");
        mag.style.setProperty("--dy", "0px");
      }
    }

    document.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerout", onOut, { passive: true });
    return () => {
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerout", onOut);
    };
  }, []);

  return (
    <>
      <div ref={dotRef} className="cursor-dot" aria-hidden />
      <div ref={ringRef} className="cursor-ring" aria-hidden />

      {/* Barra de progresso de leitura — scroll-driven, CSS puro */}
      <div
        aria-hidden
        className="scroll-progress fixed inset-x-0 top-0 z-50 h-px origin-left bg-accent-bright"
      />

      <button
        type="button"
        onClick={toggleMotion}
        aria-pressed={motionOff}
        className="fixed bottom-4 right-4 z-50 rounded-full border border-edge bg-surface/80 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-faint backdrop-blur transition-colors hover:text-dim"
      >
        {motionOff ? "Motion off" : "Motion on"}
      </button>
    </>
  );
}
