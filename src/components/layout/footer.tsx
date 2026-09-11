"use client";

import { useLayoutEffect, useRef } from "react";
import { ensureGsapRegistered, gsap } from "@/lib/animation/gsap";
import { useReducedMotion } from "@/lib/animation/use-reduced-motion";
import { DURATION, EASE } from "@/lib/animation/motion-tokens";
import { Mark } from "@/components/ui/mark";

const NAV_LINKS = [
  { label: "Início", href: "#inicio" },
  { label: "Imóveis", href: "#imoveis" },
  { label: "Sobre", href: "#sobre" },
  { label: "Contato", href: "#contato" },
];

/**
 * Rodapé — chrome persistente (como o Header), fora do fluxo das 8 seções
 * da landing. Em `paper`, contraste com o CTA final (ink) que vem antes.
 */
export function Footer() {
  const footerRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const reducedMotion = useReducedMotion();

  useLayoutEffect(() => {
    ensureGsapRegistered();
    if (!footerRef.current) return;

    const ctx = gsap.context(() => {
      if (reducedMotion) {
        gsap.set(contentRef.current, { opacity: 1, y: 0 });
        return;
      }

      gsap.fromTo(
        contentRef.current,
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: DURATION.base,
          ease: EASE.out,
          scrollTrigger: { trigger: footerRef.current, start: "top 90%" },
        },
      );
    }, footerRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <footer ref={footerRef} className="relative bg-paper px-6 py-16 md:px-10 md:py-20">
      <div ref={contentRef} className="mx-auto w-full max-w-[1600px]">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <a href="#inicio" className="flex items-center gap-3 text-ink" aria-label="Central Imóveis — início">
              <Mark tone="dark" />
              <span className="font-display text-sm tracking-[0.18em] uppercase">Central Imóveis</span>
            </a>
            <p className="mt-5 max-w-xs text-sm text-muted">
              Curadoria imobiliária, desde 1996.
            </p>
          </div>

          <nav className="md:col-span-3" aria-label="Navegação">
            <span className="block text-xs tracking-[0.2em] text-muted uppercase">Navegação</span>
            <ul className="mt-5 flex flex-col gap-3">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="text-sm text-ink transition-colors hover:text-gold-dim">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="md:col-span-4">
            <span className="block text-xs tracking-[0.2em] text-muted uppercase">Contato</span>
            <ul className="mt-5 flex flex-col gap-3">
              <li>
                <a
                  href="https://instagram.com/imobcim"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-ink transition-colors hover:text-gold-dim"
                >
                  @imobcim
                </a>
              </li>
              <li>
                <a
                  href="mailto:contato@centralimoveis.com.br"
                  className="text-sm text-ink transition-colors hover:text-gold-dim"
                >
                  contato@centralimoveis.com.br
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-line pt-8 text-xs text-muted md:flex-row md:items-center md:justify-between">
          <span>© Central Imóveis. Todos os direitos reservados.</span>
          <span>Zona Sul, São Paulo</span>
        </div>
      </div>
    </footer>
  );
}
