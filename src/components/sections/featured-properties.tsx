"use client";

import { useLayoutEffect, useRef } from "react";
import { ArrowRight } from "lucide-react";
import { ensureGsapRegistered, gsap } from "@/lib/animation/gsap";
import { useReducedMotion } from "@/lib/animation/use-reduced-motion";
import { DURATION, EASE, STAGGER } from "@/lib/animation/motion-tokens";
import { MediaFrame } from "@/components/ui/media-frame";
import { FEATURED_PROPERTIES } from "@/data/properties";

/**
 * Imóveis em destaque — seção escura (ink), contraponto ao Manifesto claro.
 * Grid assimétrico: um item grande (7/12) + dois empilhados (5/12) — nunca
 * três colunas simétricas (ver CLAUDE.md > "Regras de design"). Cada item é
 * imagem + legenda abaixo (sem card, sem sombra, sem borda arredondada),
 * revelado com fade/translate ao entrar no viewport.
 */
export function FeaturedProperties() {
  const sectionRef = useRef<HTMLElement>(null);
  const eyebrowRef = useRef<HTMLSpanElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const itemRefs = useRef<Array<HTMLDivElement | null>>([]);
  const frameRefs = useRef<Array<HTMLDivElement | null>>([]);
  const linkRef = useRef<HTMLAnchorElement>(null);

  const reducedMotion = useReducedMotion();

  useLayoutEffect(() => {
    ensureGsapRegistered();
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      const allTargets = [eyebrowRef.current, headlineRef.current, ...itemRefs.current, linkRef.current];

      if (reducedMotion) {
        gsap.set(allTargets, { opacity: 1, y: 0 });
        gsap.set(frameRefs.current, { scale: 1 });
        return;
      }

      gsap.set(frameRefs.current, { scale: 1.06 });

      gsap.fromTo(
        [eyebrowRef.current, headlineRef.current],
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: DURATION.base,
          ease: EASE.out,
          stagger: STAGGER.tight,
          scrollTrigger: { trigger: headlineRef.current, start: "top 85%" },
        },
      );

      itemRefs.current.forEach((item, i) => {
        if (!item) return;
        gsap.fromTo(
          item,
          { opacity: 0, y: 48 },
          {
            opacity: 1,
            y: 0,
            duration: DURATION.base,
            ease: EASE.out,
            scrollTrigger: { trigger: item, start: "top 88%" },
          },
        );
        gsap.to(frameRefs.current[i], {
          scale: 1,
          duration: DURATION.slow,
          ease: EASE.inOut,
          scrollTrigger: { trigger: item, start: "top 88%" },
        });
      });

      gsap.fromTo(
        linkRef.current,
        { opacity: 0, y: 16 },
        {
          opacity: 1,
          y: 0,
          duration: DURATION.base,
          ease: EASE.out,
          scrollTrigger: { trigger: linkRef.current, start: "top 92%" },
        },
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  const [first, second, third] = FEATURED_PROPERTIES;

  return (
    <section
      ref={sectionRef}
      id="imoveis"
      className="relative bg-ink px-6 py-28 md:px-10 md:py-36"
      aria-label="Imóveis em destaque"
    >
      <div className="mx-auto w-full max-w-[1600px]">
        <span
          ref={eyebrowRef}
          className="mb-6 block text-xs tracking-[0.35em] text-gold uppercase"
        >
          Imóveis em destaque
        </span>

        <h2
          ref={headlineRef}
          className="max-w-2xl font-display text-[clamp(1.75rem,4.2vw,3.5rem)] leading-[1.12] font-normal text-paper"
        >
          Um recorte da carteira atual.
        </h2>

        <div className="mt-16 grid grid-cols-1 gap-12 md:mt-20 md:grid-cols-12 md:gap-8">
          <PropertyItem
            className="md:col-span-7"
            frameClassName="aspect-[4/5] md:aspect-[3/4]"
            itemRef={(el) => {
              itemRefs.current[0] = el;
            }}
            frameRef={(el) => {
              frameRefs.current[0] = el;
            }}
            property={first}
          />

          <div className="flex flex-col gap-12 md:col-span-5">
            <PropertyItem
              frameClassName="aspect-[4/3]"
              itemRef={(el) => {
                itemRefs.current[1] = el;
              }}
              frameRef={(el) => {
                frameRefs.current[1] = el;
              }}
              property={second}
            />
            <PropertyItem
              frameClassName="aspect-[4/3]"
              itemRef={(el) => {
                itemRefs.current[2] = el;
              }}
              frameRef={(el) => {
                frameRefs.current[2] = el;
              }}
              property={third}
            />
          </div>
        </div>

        <a
          ref={linkRef}
          href="#contato"
          className="mt-16 inline-flex items-center gap-2 border-t border-line-dark pt-6 text-xs tracking-[0.25em] text-paper uppercase transition-colors hover:text-gold md:mt-20"
        >
          Ver todos os imóveis
          <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.5} />
        </a>
      </div>
    </section>
  );
}

function PropertyItem({
  property,
  className = "",
  frameClassName = "",
  itemRef,
  frameRef,
}: {
  property: (typeof FEATURED_PROPERTIES)[number];
  className?: string;
  frameClassName?: string;
  itemRef: (el: HTMLDivElement | null) => void;
  frameRef: (el: HTMLDivElement | null) => void;
}) {
  return (
    <div ref={itemRef} className={className}>
      <MediaFrame ref={frameRef} tone="on-ink" className={`w-full will-change-transform ${frameClassName}`} />
      <div className="mt-5 flex items-baseline justify-between gap-4 border-t border-line-dark pt-4">
        <div>
          <span className="block text-xs tracking-[0.2em] text-muted-dark uppercase">
            {property.category} · {property.location}
          </span>
          <h3 className="mt-1 font-display text-xl text-paper">{property.title}</h3>
        </div>
        <span className="shrink-0 text-xs text-muted-dark">{property.highlight}</span>
      </div>
    </div>
  );
}
