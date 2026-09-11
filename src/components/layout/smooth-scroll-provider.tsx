"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { ensureGsapRegistered, gsap, ScrollTrigger } from "@/lib/animation/gsap";

/**
 * Liga o scroll suave (Lenis) ao ticker do GSAP para que ScrollTrigger
 * permaneça sincronizado quadro a quadro. Desativado por completo quando
 * o usuário pede `prefers-reduced-motion`, caso em que o scroll nativo
 * do navegador assume — mais previsível e acessível.
 */
export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    ensureGsapRegistered();

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReducedMotion) return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    function onTick(time: number) {
      lenis.raf(time * 1000);
    }

    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add(onTick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(onTick);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
