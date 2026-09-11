"use client";

import { useLayoutEffect, useRef } from "react";
import { ensureGsapRegistered, gsap } from "@/lib/animation/gsap";
import { useReducedMotion } from "@/lib/animation/use-reduced-motion";
import { DURATION, EASE } from "@/lib/animation/motion-tokens";

type ManifestoLine = {
  key: string;
  content: React.ReactNode;
};

const LINES: ManifestoLine[] = [
  { key: "l1", content: "Um imóvel não é vitrine." },
  { key: "l2", content: "É decisão que atravessa anos." },
  {
    key: "l3",
    content: (
      <>
        Desde{" "}
        <span className="underline decoration-gold decoration-2 underline-offset-4">
          1996
        </span>
        , tratamos cada endereço
      </>
    ),
  },
  { key: "l4", content: "como quem vai morar nele." },
];

/**
 * Manifesto — seção clara (paper), contraponto ao Hero escuro.
 *
 * Três camadas de movimento, todas via GSAP/ScrollTrigger (sem Three.js —
 * não há necessidade de WebGL aqui, ver CLAUDE.md > Stack):
 *  1. Cada linha "acende" (opacity 0.22 → 1) conforme cruza o centro do
 *     viewport — reveal guiado por scroll, sem pinning.
 *  2. O bloco de texto ganha profundidade 3D real (rotateX + translateZ
 *     via CSS transform, não WebGL) que se resolve conforme a seção entra
 *     em cena — só em telas ≥768px (gsap.matchMedia), mais pesado para
 *     mobile.
 *  3. Um numeral "1996" decorativo ao fundo se desloca num ritmo mais
 *     lento que o texto — o parallax de profundidade da seção.
 *
 * O destaque em "1996" é um sublinhado `gold`, não texto `gold` — texto
 * dourado sobre `paper` não atinge contraste mínimo (ver CLAUDE.md >
 * Acessibilidade).
 */
export function Manifesto() {
  const sectionRef = useRef<HTMLElement>(null);
  const eyebrowRef = useRef<HTMLSpanElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const watermarkRef = useRef<HTMLSpanElement>(null);
  const lineRefs = useRef<Array<HTMLSpanElement | null>>([]);

  const reducedMotion = useReducedMotion();

  useLayoutEffect(() => {
    ensureGsapRegistered();
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      if (reducedMotion) {
        gsap.set([eyebrowRef.current, ...lineRefs.current], { opacity: 1, y: 0 });
        gsap.set(stageRef.current, { rotateX: 0, z: 0 });
        gsap.set(watermarkRef.current, { yPercent: 0 });
        return;
      }

      gsap.fromTo(
        eyebrowRef.current,
        { opacity: 0, y: 14 },
        {
          opacity: 1,
          y: 0,
          duration: DURATION.base,
          ease: EASE.out,
          scrollTrigger: { trigger: eyebrowRef.current, start: "top 85%" },
        },
      );

      lineRefs.current.forEach((line) => {
        if (!line) return;
        gsap.fromTo(
          line,
          { opacity: 0.22 },
          {
            opacity: 1,
            ease: "none",
            scrollTrigger: {
              trigger: line,
              start: "top 80%",
              end: "top 45%",
              scrub: true,
            },
          },
        );
      });

      const mm = gsap.matchMedia();

      mm.add("(min-width: 768px)", () => {
        gsap.fromTo(
          stageRef.current,
          { rotateX: 8, z: -120, transformPerspective: 1000 },
          {
            rotateX: 0,
            z: 0,
            ease: "none",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 95%",
              end: "top 35%",
              scrub: true,
            },
          },
        );

        gsap.to(watermarkRef.current, {
          yPercent: 20,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        });
      });

      mm.add("(max-width: 767px)", () => {
        gsap.to(watermarkRef.current, {
          yPercent: 8,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-screen items-center overflow-hidden bg-paper px-6 py-28 md:px-10"
      aria-label="Manifesto"
    >
      <span
        ref={watermarkRef}
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 -right-6 -translate-y-1/2 leading-none font-display text-[clamp(8rem,28vw,22rem)] text-ink/5 select-none md:right-10"
      >
        1996
      </span>

      <div className="relative mx-auto w-full max-w-[1600px]">
        <span
          ref={eyebrowRef}
          className="mb-10 block text-xs tracking-[0.35em] text-muted uppercase"
        >
          Manifesto
        </span>

        <div
          ref={stageRef}
          className="max-w-4xl will-change-transform"
          style={{ transformStyle: "preserve-3d" }}
        >
          <h2 className="font-display text-[clamp(1.75rem,4.2vw,3.75rem)] leading-[1.15] font-normal">
            {LINES.map((line, i) => (
              <span
                key={line.key}
                ref={(el) => {
                  lineRefs.current[i] = el;
                }}
                className="block"
              >
                {line.content}
              </span>
            ))}
          </h2>
        </div>
      </div>
    </section>
  );
}
