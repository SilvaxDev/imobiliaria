"use client";

import { useLayoutEffect, useRef } from "react";
import { ensureGsapRegistered, gsap } from "@/lib/animation/gsap";
import { useReducedMotion } from "@/lib/animation/use-reduced-motion";
import { DURATION, EASE } from "@/lib/animation/motion-tokens";
import { MediaFrame } from "@/components/ui/media-frame";

/**
 * Sobre a Central — seção clara (paper). Texto largo à esquerda + imagem
 * que "vaza" por cima da coluna de texto (sobreposição controlada, ver
 * CLAUDE.md > "Regras de design"), em vez de duas colunas estanques.
 * "1996" reaproveita o mesmo ano já estabelecido no Manifesto/Hero — não
 * inventa um novo dado comercial, só repete o já fixado no protótipo.
 */
export function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const eyebrowRef = useRef<HTMLSpanElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const quoteRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);

  const reducedMotion = useReducedMotion();

  useLayoutEffect(() => {
    ensureGsapRegistered();
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      if (reducedMotion) {
        gsap.set([eyebrowRef.current, textRef.current, quoteRef.current], { opacity: 1, y: 0 });
        gsap.set(frameRef.current, { scale: 1 });
        return;
      }

      gsap.set(frameRef.current, { scale: 1.08 });

      gsap.fromTo(
        [eyebrowRef.current, textRef.current],
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: DURATION.base,
          ease: EASE.out,
          stagger: 0.08,
          scrollTrigger: { trigger: textRef.current, start: "top 82%" },
        },
      );

      gsap.fromTo(
        quoteRef.current,
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: DURATION.base,
          ease: EASE.out,
          scrollTrigger: { trigger: quoteRef.current, start: "top 88%" },
        },
      );

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
    }, sectionRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section
      ref={sectionRef}
      id="sobre"
      className="relative overflow-hidden bg-paper py-28 md:py-36"
      aria-label="Sobre a Central"
    >
      <div className="mx-auto grid w-full max-w-[1600px] grid-cols-1 gap-16 px-6 md:grid-cols-12 md:gap-8 md:px-10">
        <div className="md:col-span-7 md:pr-8">
          <span ref={eyebrowRef} className="mb-6 block text-xs tracking-[0.35em] text-muted uppercase">
            Sobre a Central
          </span>

          <div ref={textRef}>
            <p className="max-w-xl font-display text-[clamp(1.5rem,3.2vw,2.5rem)] leading-[1.3] font-normal text-ink">
              Desde{" "}
              <span className="underline decoration-gold decoration-2 underline-offset-4">1996</span>,
              trabalhamos como uma casa pequena: poucas pessoas, decisões
              deliberadas, portfólio selecionado a dedo. Não vendemos o
              maior catálogo da cidade — vendemos atenção ao que o catálogo
              esconde.
            </p>
          </div>

          <div ref={quoteRef} className="mt-14 max-w-md border-l-2 border-gold pl-6">
            <p className="font-display text-xl leading-snug text-ink italic">
              &ldquo;Um bom corretor não empurra endereço. Escuta primeiro.&rdquo;
            </p>
            <span className="mt-3 block text-xs tracking-[0.2em] text-muted uppercase">
              — Equipe Central
            </span>
          </div>
        </div>

        <div className="md:col-span-5">
          <div className="relative md:-mt-16 md:mb-[-4rem] md:ml-8">
            <MediaFrame
              ref={frameRef}
              tone="on-paper"
              className="aspect-[4/5] w-full will-change-transform"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
