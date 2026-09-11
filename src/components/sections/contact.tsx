"use client";

import { useLayoutEffect, useRef } from "react";
import { ArrowUpRight, Mail } from "lucide-react";
import { ensureGsapRegistered, gsap } from "@/lib/animation/gsap";
import { useReducedMotion } from "@/lib/animation/use-reduced-motion";
import { DURATION, EASE } from "@/lib/animation/motion-tokens";

/**
 * Contato/localização — seção clara (paper). Em vez de um mapa real (não
 * temos endereço/coordenada oficial ainda — ver CLAUDE.md > "O que NÃO
 * fazer") usamos um motivo gráfico minimalista de localização, decorativo.
 * E-mail é placeholder — trocar quando o contato oficial for definido.
 */
export function Contact() {
  const sectionRef = useRef<HTMLElement>(null);
  const eyebrowRef = useRef<HTMLSpanElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const graphicRef = useRef<HTMLDivElement>(null);

  const reducedMotion = useReducedMotion();

  useLayoutEffect(() => {
    ensureGsapRegistered();
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      const targets = [eyebrowRef.current, headlineRef.current, listRef.current, graphicRef.current];

      if (reducedMotion) {
        gsap.set(targets, { opacity: 1, y: 0, scale: 1 });
        return;
      }

      gsap.fromTo(
        [eyebrowRef.current, headlineRef.current, listRef.current],
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: DURATION.base,
          ease: EASE.out,
          stagger: 0.08,
          scrollTrigger: { trigger: headlineRef.current, start: "top 82%" },
        },
      );

      gsap.fromTo(
        graphicRef.current,
        { opacity: 0, scale: 0.94 },
        {
          opacity: 1,
          scale: 1,
          duration: DURATION.slow,
          ease: EASE.reveal,
          scrollTrigger: { trigger: graphicRef.current, start: "top 85%" },
        },
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section
      ref={sectionRef}
      id="contato"
      className="relative bg-paper px-6 py-28 md:px-10 md:py-36"
      aria-label="Contato e localização"
    >
      <div className="mx-auto grid w-full max-w-[1600px] grid-cols-1 items-center gap-16 md:grid-cols-12 md:gap-8">
        <div className="md:col-span-6">
          <span ref={eyebrowRef} className="mb-6 block text-xs tracking-[0.35em] text-muted uppercase">
            Contato
          </span>

          <h2
            ref={headlineRef}
            className="max-w-lg font-display text-[clamp(1.75rem,4vw,3.25rem)] leading-[1.15] font-normal text-ink"
          >
            Fale com a Central.
          </h2>

          <ul ref={listRef} className="mt-12 flex flex-col gap-6">
            <li className="border-t border-line pt-6">
              <span className="block text-xs tracking-[0.2em] text-muted uppercase">Localização</span>
              <span className="mt-1 block font-display text-lg text-ink">Zona Sul, São Paulo</span>
            </li>
            <li className="border-t border-line pt-6">
              <a
                href="https://instagram.com/imobcim"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3 text-ink transition-colors hover:text-gold-dim"
              >
                <span className="font-display text-lg">@imobcim</span>
                <ArrowUpRight className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
              </a>
            </li>
            <li className="border-t border-b border-line py-6">
              <a
                href="mailto:contato@centralimoveis.com.br"
                className="group flex items-center gap-3 text-ink transition-colors hover:text-gold-dim"
              >
                <Mail className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
                <span className="font-display text-lg">contato@centralimoveis.com.br</span>
              </a>
            </li>
          </ul>
        </div>

        <div className="md:col-span-6">
          <div ref={graphicRef} className="mx-auto aspect-square w-full max-w-md">
            <LocationMotif />
          </div>
        </div>
      </div>
    </section>
  );
}

/** Motivo gráfico decorativo — não é um mapa real, apenas sugere localização. */
function LocationMotif() {
  return (
    <svg viewBox="0 0 400 400" className="h-full w-full" aria-hidden="true">
      <circle cx="200" cy="200" r="160" fill="none" stroke="var(--color-line)" strokeWidth="1" />
      <circle cx="200" cy="200" r="100" fill="none" stroke="var(--color-line)" strokeWidth="1" />
      <line x1="200" y1="10" x2="200" y2="390" stroke="var(--color-line)" strokeWidth="1" />
      <line x1="10" y1="200" x2="390" y2="200" stroke="var(--color-line)" strokeWidth="1" />
      <circle cx="200" cy="200" r="6" fill="var(--color-gold)" />
      <circle cx="200" cy="200" r="28" fill="none" stroke="var(--color-gold)" strokeWidth="1.5" />
    </svg>
  );
}
