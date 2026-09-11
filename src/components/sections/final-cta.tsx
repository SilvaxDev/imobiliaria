"use client";

import { useLayoutEffect, useRef } from "react";
import { ensureGsapRegistered, gsap } from "@/lib/animation/gsap";
import { useReducedMotion } from "@/lib/animation/use-reduced-motion";
import { DURATION, EASE, STAGGER } from "@/lib/animation/motion-tokens";

/**
 * CTA final — fecha o mesmo tom escuro (ink) do Hero, dando "bookend" à
 * rolagem. O rodapé de verdade vive em `components/layout/footer.tsx`
 * (chrome, fora do fluxo das 8 seções), em `paper` — contraste com este
 * bloco antes de fechar a página.
 */
export function FinalCta() {
  const sectionRef = useRef<HTMLElement>(null);
  const eyebrowRef = useRef<HTMLSpanElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const ctaRef = useRef<HTMLAnchorElement>(null);

  const reducedMotion = useReducedMotion();

  useLayoutEffect(() => {
    ensureGsapRegistered();
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      const targets = [eyebrowRef.current, headlineRef.current, ctaRef.current];

      if (reducedMotion) {
        gsap.set(targets, { opacity: 1, y: 0 });
        return;
      }

      gsap.fromTo(
        targets,
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: DURATION.base,
          ease: EASE.out,
          stagger: STAGGER.base,
          scrollTrigger: { trigger: sectionRef.current, start: "top 75%" },
        },
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section
      ref={sectionRef}
      className="relative bg-ink px-6 py-28 md:px-10 md:py-36"
      aria-label="Fale com a Central"
    >
      <div className="mx-auto w-full max-w-[1600px]">
        <span ref={eyebrowRef} className="mb-8 block text-xs tracking-[0.35em] text-gold uppercase">
          Central Imóveis
        </span>

        <h2
          ref={headlineRef}
          className="max-w-3xl font-display text-[clamp(2rem,5.5vw,5rem)] leading-[1.05] font-normal text-paper"
        >
          Antes do endereço, uma <span className="text-gold">conversa</span>.
        </h2>

        <a
          ref={ctaRef}
          href="https://instagram.com/imobcim"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-12 inline-flex items-center border border-gold px-8 py-4 text-xs tracking-[0.25em] text-gold uppercase transition-colors hover:bg-gold hover:text-ink"
        >
          Falar no Instagram
        </a>
      </div>
    </section>
  );
}
