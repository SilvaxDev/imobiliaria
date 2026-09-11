type MarkProps = {
  className?: string;
  tone?: "light" | "dark";
};

/**
 * Placeholder do logotipo circular da Central Imóveis. Substituir por
 * `public/brand/mark.svg` (logo oficial) quando o arquivo for entregue —
 * ver CLAUDE.md > "Regras para assets".
 */
export function Mark({ className = "", tone = "light" }: MarkProps) {
  const ring = tone === "light" ? "border-paper/70" : "border-ink/70";
  const text = tone === "light" ? "text-paper" : "text-ink";

  return (
    <span
      className={`inline-flex h-9 w-9 items-center justify-center rounded-full border ${ring} ${className}`}
      aria-hidden="true"
    >
      <span className={`font-display text-[0.7rem] tracking-[0.08em] ${text}`}>CI</span>
    </span>
  );
}
