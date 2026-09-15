import Link from "next/link";
import { LogOut } from "lucide-react";
import { Mark } from "@/components/ui/mark";
import { logout } from "@/lib/auth/actions";

export function PainelHeader() {
  return (
    <header className="bg-ink px-6 py-5 md:px-10">
      <div className="mx-auto flex max-w-5xl items-center justify-between">
        <Link href="/painel/imoveis" className="flex items-center gap-3 text-paper" aria-label="Painel — início">
          <Mark tone="light" />
          <span className="font-display text-sm tracking-[0.18em] uppercase">Painel</span>
        </Link>

        <form action={logout}>
          <button
            type="submit"
            className="flex items-center gap-2 text-xs tracking-[0.25em] text-paper/90 uppercase transition-colors hover:text-gold"
          >
            <LogOut className="h-4 w-4" strokeWidth={1.5} />
            Sair
          </button>
        </form>
      </div>
    </header>
  );
}
