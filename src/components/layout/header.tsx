"use client";

import { useEffect, useRef } from "react";
import { Menu } from "lucide-react";
import { ensureGsapRegistered, ScrollTrigger } from "@/lib/animation/gsap";
import { Mark } from "@/components/ui/mark";

/**
 * Cabeçalho fixo e transparente sobre o Hero, que ganha fundo sólido ao
 * rolar. O toggle de classe é feito diretamente no DOM pelo ScrollTrigger
 * (sem estado em React) para não causar re-render a cada frame de scroll.
 * O botão de menu é um placeholder visual — a navegação (drawer/overlay)
 * entra numa etapa futura, junto das demais seções.
 */
export function Header() {
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    ensureGsapRegistered();
    if (!headerRef.current) return;

    const trigger = ScrollTrigger.create({
      start: "top -80",
      end: 99999,
      toggleClass: { targets: headerRef.current, className: "is-scrolled" },
    });

    return () => trigger.kill();
  }, []);

  return (
    <header
      ref={headerRef}
      className="site-header fixed inset-x-0 top-0 z-50"
    >
      <div className="mx-auto flex max-w-[1600px] items-center justify-between px-6 py-5 md:px-10">
        <a
          href="#"
          className="flex items-center gap-3 text-paper"
          aria-label="Central Imóveis — início"
        >
          <Mark tone="light" />
          <span className="font-display text-sm tracking-[0.18em] uppercase">
            Central Imóveis
          </span>
        </a>

        <button
          type="button"
          className="flex items-center gap-2 text-paper/90 transition-colors hover:text-gold"
          aria-label="Abrir menu"
        >
          <span className="hidden text-xs uppercase tracking-[0.25em] sm:inline">
            Menu
          </span>
          <Menu className="h-5 w-5" strokeWidth={1.5} />
        </button>
      </div>
    </header>
  );
}
