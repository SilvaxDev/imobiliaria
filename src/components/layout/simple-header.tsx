import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Mark } from "@/components/ui/mark";

/**
 * Cabeçalho estático (sem transição de scroll) para rotas que não abrem
 * com um Hero escuro em tela cheia — ex.: `/imovel/[id]`. O `Header`
 * principal depende de um fundo escuro inicial (texto sempre `paper`,
 * ver header.tsx); aqui o fundo já nasce sólido em `ink`.
 */
export function SimpleHeader() {
  return (
    <header className="bg-ink px-6 py-5 md:px-10">
      <div className="mx-auto flex max-w-[1600px] items-center justify-between">
        <Link href="/" className="flex items-center gap-3 text-paper" aria-label="Central Imóveis — início">
          <Mark tone="light" />
          <span className="font-display text-sm tracking-[0.18em] uppercase">Central Imóveis</span>
        </Link>

        <Link
          href="/#imoveis"
          className="flex items-center gap-2 text-xs tracking-[0.25em] text-paper/90 uppercase transition-colors hover:text-gold"
        >
          <ArrowLeft className="h-4 w-4" strokeWidth={1.5} />
          Voltar aos imóveis
        </Link>
      </div>
    </header>
  );
}
