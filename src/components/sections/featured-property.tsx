"use client";

import { useLayoutEffect, useRef } from "react";
import { ensureGsapRegistered, gsap } from "@/lib/animation/gsap";
import { useReducedMotion } from "@/lib/animation/use-reduced-motion";
import { DURATION, EASE } from "@/lib/animation/motion-tokens";
import { MediaFrame } from "@/components/ui/media-frame";

/**
 * Imóvel em destaque — spotlight de um único imóvel, full-bleed, mesma
 * gramática visual do Hero (imagem + overlay + texto ancorado embaixo) mas
 * estática, sem vídeo/pin — evita repetir a peça mais "cara" da página e
 * mantém o ritmo (ver CLAUDE.md > "Regras de animação" sobre não abusar de
 * pinning).
 */
export function FeaturedProperty() {
  const sectionRef = useRef<HTMLElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const reducedMotion = useReducedMotion();

  useLayoutEffect(() => {
    ensureGsapRegistered();
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      if (reducedMotion) {
        gsap.set(frameRef.current, { scale: 1 });
        gsap.set(contentRef.current, { opacity: 1, y: 0 });
        return;
      }

      gsap.set(frameRef.current, { scale: 1.1 });

      gsap.to(frameRef.current, {
        scale: 1,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });

      gsap.fromTo(
        contentRef.current,
        { opacity: 0, y: 32 },
        {
          opacity: 1,
          y: 0,
          duration: DURATION.slow,
          ease: EASE.reveal,
          scrollTrigger: { trigger: sectionRef.current, start: "top 65%" },
        },
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-[85svh] items-end overflow-hidden bg-ink"
      aria-label="Imóvel em destaque"
    >
      <MediaFrame ref={frameRef} tone="on-ink" className="absolute inset-0 h-full w-full will-change-transform" />

      <div
        ref={overlayRef}
        className="absolute inset-0 bg-linear-to-t from-ink via-ink/50 to-ink/5"
      />

      <div ref={contentRef} className="relative z-10 w-full px-6 pb-16 md:px-10 md:pb-24">
        <div className="mx-auto w-full max-w-[1600px]">
          <span className="mb-6 block text-xs tracking-[0.35em] text-gold uppercase">
            Imóvel em destaque
          </span>

          <h2 className="max-w-3xl font-display text-[clamp(2rem,5.5vw,4.75rem)] leading-[1.05] font-normal text-paper">
            Uma casa pensada para durar.
          </h2>

          <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-line-dark pt-6 text-sm text-muted-dark">
            <span>Zona Sul, São Paulo</span>
            <span>180 m²</span>
            <span>3 suítes</span>
            <span>2 vagas</span>
          </div>

          <a
            href="#contato"
            className="mt-10 inline-flex items-center border border-paper/60 px-7 py-3 text-xs tracking-[0.25em] text-paper uppercase transition-colors hover:border-gold hover:bg-gold hover:text-ink"
          >
            Conhecer este imóvel
          </a>
        </div>
      </div>
    </section>
  );
}
