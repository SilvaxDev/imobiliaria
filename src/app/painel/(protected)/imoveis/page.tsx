import Link from "next/link";
import { Plus, Pencil } from "lucide-react";
import { listImoveisAdmin } from "@/lib/imoveis";
import { DeleteImovelButton } from "@/components/painel/delete-imovel-button";

export default async function PainelImoveisPage() {
  const imoveis = await listImoveisAdmin();

  return (
    <div className="flex flex-col gap-10">
      <div className="flex items-center justify-between gap-4">
        <h1 className="font-display text-2xl text-ink">Imóveis</h1>
        <Link
          href="/painel/imoveis/novo"
          className="flex items-center gap-2 bg-ink px-5 py-3 text-xs tracking-[0.2em] text-paper uppercase transition-colors hover:bg-gold-dim"
        >
          <Plus className="h-4 w-4" strokeWidth={1.5} />
          Novo imóvel
        </Link>
      </div>

      {imoveis.length === 0 ? (
        <p className="text-sm text-muted">Nenhum imóvel cadastrado ainda.</p>
      ) : (
        <ul className="flex flex-col divide-y divide-line border-t border-b border-line">
          {imoveis.map((imovel) => (
            <li key={imovel.id} className="flex items-center justify-between gap-4 py-5">
              <div className="min-w-0">
                <span className="block text-xs tracking-[0.15em] text-muted uppercase">
                  {imovel.bairro} · {imovel.status === "ATIVO" ? "Ativo" : "Inativo"}
                </span>
                <span className="mt-1 block truncate font-display text-lg text-ink">{imovel.titulo}</span>
              </div>

              <div className="flex shrink-0 items-center gap-3">
                <Link
                  href={`/painel/imoveis/${imovel.id}/editar`}
                  aria-label={`Editar ${imovel.titulo}`}
                  className="flex h-9 w-9 items-center justify-center border border-line text-ink transition-colors hover:border-ink"
                >
                  <Pencil className="h-4 w-4" strokeWidth={1.5} />
                </Link>

                <DeleteImovelButton id={imovel.id} titulo={imovel.titulo} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
