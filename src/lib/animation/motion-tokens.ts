/**
 * Vocabulário de animação compartilhado. Novas seções devem reutilizar
 * estes tokens em vez de valores soltos, para manter o ritmo cinematográfico
 * consistente em todo o site (ver CLAUDE.md > "Regras de animação").
 */
export const EASE = {
  out: "power3.out",
  inOut: "power2.inOut",
  reveal: "power4.out",
} as const;

export const DURATION = {
  fast: 0.4,
  base: 0.9,
  slow: 1.6,
} as const;

export const STAGGER = {
  tight: 0.06,
  base: 0.1,
} as const;
