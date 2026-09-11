"use client";

import { forwardRef } from "react";

type MediaFrameProps = {
  className?: string;
  tone?: "on-ink" | "on-paper";
};

/**
 * Placeholder de fotografia — bloco em gradiente até a foto definitiva
 * chegar (ver CLAUDE.md > "Regras para assets"; mesmo espírito do
 * TODO(assets) que o Hero usava antes de receber `hero-desktop.png`).
 * Sem opinião sobre animação: a seção-pai controla scale/parallax via
 * `ref`, como o Hero faz com `bgRef`.
 */
export const MediaFrame = forwardRef<HTMLDivElement, MediaFrameProps>(
  function MediaFrame({ className = "", tone = "on-paper" }, ref) {
    const gradient =
      tone === "on-ink"
        ? "bg-[linear-gradient(155deg,var(--color-ink-2)_0%,var(--color-ink)_55%,#1c1a14_100%)]"
        : "bg-[linear-gradient(155deg,var(--color-paper-2)_0%,#e4ddcd_55%,var(--color-paper-2)_100%)]";

    return (
      <div
        ref={ref}
        aria-hidden="true"
        className={`relative overflow-hidden ${gradient} ${className}`}
      >
        <div className="absolute inset-0 bg-[linear-gradient(115deg,transparent_35%,rgba(226,180,38,0.07)_50%,transparent_65%)]" />
      </div>
    );
  },
);
