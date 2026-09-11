"use client";

import { useLayoutEffect, useRef } from "react";
import { ensureGsapRegistered, gsap } from "@/lib/animation/gsap";
import { useReducedMotion } from "@/lib/animation/use-reduced-motion";
import { DURATION, EASE } from "@/lib/animation/motion-tokens";
import { MediaFrame } from "@/components/ui/media-frame";

type Step = { number: string; title: string; description: string };

const STEPS: Step[] = [
  {
    number: "01",
    title: "Curadoria",
    description: "Cada imóvel passa por um filtro editorial antes de chegar até você.",
  },
  {
    number: "02",
    title: "Visita",
    description: "Conduzida com calma — tempo para notar o que a foto não mostra.",
  },
  {
    number: "03",
    title: "Negociação",
    description: "Acompanhamento em cada etapa, da proposta à assinatura.",
  },
  {
    number: "04",
    title: "Depois da chave",
    description: "O contato continua depois da mudança.",
  },
];

/**
 * Experiência — seção clara (paper). Lista numerada (não ícones — ver
 * CLAUDE.md > "Regras de design") à esquerda, imagem com parallax contido
 * à direita. Grid assimétrico 5/7, coluna de imagem oculta em mobile para
 * não pesar o scroll em telas pequenas.
 */
export function Experience() {
  const sectionRef = useRef<HTMLElement>(null);
  const eyebrowRef = useRef<HTMLSpanElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const rowRefs = useRef<Array<HTMLLIElement | null>>([]);
  const frameRef = useRef<HTMLDivElement>(null);

  const reducedMotion = useReducedMotion();

  useLayoutEffect(() => {
    ensureGsapRegistered();
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      if (reducedMotion) {
        gsap.set([eyebrowRef.current, headlineRef.current, ...rowRefs.current], {
          opacity: 1,
          y: 0,
        });
        gsap.set(frameRef.current, { yPercent: 0 });
        return;
      }

      gsap.fromTo(
        [eyebrowRef.current, headlineRef.current],
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: DURATION.base,
          ease: EASE.out,
          scrollTrigger: { trigger: headlineRef.current, start: "top 85%" },
        },
      );

      rowRefs.current.forEach((row) => {
        if (!row) return;
        gsap.fromTo(
          row,
          { opacity: 0, y: 28 },
          {
            opacity: 1,
            y: 0,
            duration: DURATION.base,
            ease: EASE.out,
            scrollTrigger: { trigger: row, start: "top 90%" },
          },
        );
      });

      const mm = gsap.matchMedia();
      mm.add("(min-width: 768px)", () => {
        gsap.fromTo(
          frameRef.current,
          { yPercent: -6 },
          {
            yPercent: 6,
            ease: "none",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          },
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section
      ref={sectionRef}
      className="relative bg-paper px-6 py-28 md:px-10 md:py-36"
      aria-label="Experiência"
    >
      <div className="mx-auto grid w-full max-w-[1600px] grid-cols-1 gap-16 md:grid-cols-12 md:gap-8">
        <div className="md:col-span-5">
          <span ref={eyebrowRef} className="mb-6 block text-xs tracking-[0.35em] text-muted uppercase">
            Experiência
          </span>
          <h2
            ref={headlineRef}
            className="max-w-md font-display text-[clamp(1.75rem,3.6vw,3rem)] leading-[1.15] font-normal text-ink"
          >
            Do primeiro contato à chave na mão.
          </h2>

          <ol className="mt-14">
            {STEPS.map((step, i) => (
              <li
                key={step.number}
                ref={(el) => {
                  rowRefs.current[i] = el;
                }}
                className={`flex items-start gap-6 py-6 ${i === 0 ? "border-t border-line" : ""} border-b border-line`}
              >
                <span className="font-display text-3xl leading-none text-ink/15 md:text-4xl">
                  {step.number}
                </span>
                <div>
                  <h3 className="font-display text-lg text-ink">{step.title}</h3>
                  <p className="mt-2 max-w-xs text-sm leading-relaxed text-muted">{step.description}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <div className="hidden md:col-span-7 md:block">
          <div className="relative h-full min-h-140 overflow-hidden">
            <MediaFrame
              ref={frameRef}
              tone="on-paper"
              className="absolute inset-x-0 -top-[8%] h-[116%] w-full will-change-transform"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
