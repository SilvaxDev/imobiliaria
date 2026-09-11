"use client";

import { forwardRef } from "react";
import { ArrowDown } from "lucide-react";

/**
 * Indicador de scroll do Hero. O movimento (loop sutil) é aplicado pelo
 * componente pai via GSAP, para ficar no mesmo timeline/contexto da
 * animação de entrada. Aqui só existe a marcação e o estado estático.
 */
export const ScrollCue = forwardRef<HTMLDivElement, { className?: string }>(
  function ScrollCue({ className = "" }, ref) {
    return (
      <div
        ref={ref}
        className={`flex flex-col items-center gap-3 text-paper/80 ${className}`}
        aria-hidden="true"
      >
        <span className="text-[0.65rem] uppercase tracking-[0.3em]">Role</span>
        <span className="h-10 w-px bg-paper/40" />
        <ArrowDown className="h-3.5 w-3.5" strokeWidth={1.5} />
      </div>
    );
  },
);
