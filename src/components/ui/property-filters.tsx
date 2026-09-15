"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";

const OPCOES_QUARTOS = [1, 2, 3, 4];

export function PropertyFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const quartosAtivos = new Set(
    searchParams.getAll("quartos").map((value) => Number(value)).filter((value) => !Number.isNaN(value)),
  );
  const garagem = searchParams.get("garagem");

  function updateParams(mutate: (params: URLSearchParams) => void) {
    const params = new URLSearchParams(searchParams.toString());
    mutate(params);
    router.push(`${pathname}${params.toString() ? `?${params.toString()}` : ""}#imoveis`, { scroll: false });
  }

  function toggleQuarto(valor: number) {
    updateParams((params) => {
      const atuais = new Set(quartosAtivos);
      if (atuais.has(valor)) {
        atuais.delete(valor);
      } else {
        atuais.add(valor);
      }
      params.delete("quartos");
      atuais.forEach((q) => params.append("quartos", String(q)));
    });
  }

  function setGaragem(valor: "com" | "sem" | null) {
    updateParams((params) => {
      if (valor === null || garagem === valor) {
        params.delete("garagem");
      } else {
        params.set("garagem", valor);
      }
    });
  }

  return (
    <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
      <fieldset className="flex flex-wrap items-center gap-2">
        <legend className="mb-2 w-full text-xs tracking-[0.2em] text-muted uppercase">Quartos</legend>
        {OPCOES_QUARTOS.map((valor) => {
          const ativo = quartosAtivos.has(valor);
          return (
            <button
              key={valor}
              type="button"
              aria-pressed={ativo}
              onClick={() => toggleQuarto(valor)}
              className={`h-9 min-w-9 border px-3 text-sm transition-colors ${
                ativo
                  ? "border-ink bg-ink text-paper"
                  : "border-line text-ink hover:border-ink"
              }`}
            >
              {valor}
              {valor === 4 ? "+" : ""}
            </button>
          );
        })}
      </fieldset>

      <fieldset className="flex flex-wrap items-center gap-2">
        <legend className="mb-2 w-full text-xs tracking-[0.2em] text-muted uppercase">Garagem</legend>
        <button
          type="button"
          aria-pressed={garagem === "com"}
          onClick={() => setGaragem(garagem === "com" ? null : "com")}
          className={`h-9 border px-3 text-sm transition-colors ${
            garagem === "com" ? "border-ink bg-ink text-paper" : "border-line text-ink hover:border-ink"
          }`}
        >
          Com garagem
        </button>
        <button
          type="button"
          aria-pressed={garagem === "sem"}
          onClick={() => setGaragem(garagem === "sem" ? null : "sem")}
          className={`h-9 border px-3 text-sm transition-colors ${
            garagem === "sem" ? "border-ink bg-ink text-paper" : "border-line text-ink hover:border-ink"
          }`}
        >
          Sem garagem
        </button>
      </fieldset>
    </div>
  );
}
