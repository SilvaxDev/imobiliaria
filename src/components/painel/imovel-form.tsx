"use client";

import { useActionState } from "react";
import Image from "next/image";
import { Trash2 } from "lucide-react";
import type { ImovelDetail } from "@/lib/imoveis";
import type { ImovelFormState } from "@/lib/imoveis-actions";
import { deleteFotoAction } from "@/lib/imoveis-actions";

interface ImovelFormProps {
  action: (prevState: ImovelFormState | undefined, formData: FormData) => Promise<ImovelFormState>;
  imovel?: ImovelDetail;
  submitLabel: string;
}

const inputClass =
  "border border-line bg-paper px-4 py-3 text-ink outline-none focus-visible:border-ink";
const labelClass = "text-xs tracking-[0.2em] text-muted uppercase";

export function ImovelForm({ action, imovel, submitLabel }: ImovelFormProps) {
  const [state, formAction, pending] = useActionState(action, undefined);

  return (
    <form action={formAction} className="flex flex-col gap-8">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="flex flex-col gap-2 sm:col-span-2">
          <label htmlFor="titulo" className={labelClass}>
            Título
          </label>
          <input
            id="titulo"
            name="titulo"
            type="text"
            required
            defaultValue={imovel?.titulo}
            className={inputClass}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="bairro" className={labelClass}>
            Bairro
          </label>
          <input id="bairro" name="bairro" type="text" required defaultValue={imovel?.bairro} className={inputClass} />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="status" className={labelClass}>
            Status
          </label>
          <select id="status" name="status" defaultValue={imovel?.status ?? "ATIVO"} className={inputClass}>
            <option value="ATIVO">Ativo</option>
            <option value="INATIVO">Inativo</option>
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="valor" className={labelClass}>
            Valor (R$)
          </label>
          <input
            id="valor"
            name="valor"
            type="number"
            min="0"
            step="0.01"
            required
            defaultValue={imovel?.valor}
            className={inputClass}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="taxas" className={labelClass}>
            Taxas (R$) — opcional
          </label>
          <input
            id="taxas"
            name="taxas"
            type="number"
            min="0"
            step="0.01"
            defaultValue={imovel?.taxas ?? undefined}
            className={inputClass}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="quartos" className={labelClass}>
            Quartos
          </label>
          <input
            id="quartos"
            name="quartos"
            type="number"
            min="0"
            max="20"
            required
            defaultValue={imovel?.quartos ?? 1}
            className={inputClass}
          />
        </div>

        <div className="flex items-center gap-3 pt-7">
          <input
            id="temGaragem"
            name="temGaragem"
            type="checkbox"
            defaultChecked={imovel?.temGaragem}
            className="h-5 w-5 accent-ink"
          />
          <label htmlFor="temGaragem" className={labelClass}>
            Possui garagem
          </label>
        </div>

        <div className="flex flex-col gap-2 sm:col-span-2">
          <label htmlFor="descricao" className={labelClass}>
            Descrição
          </label>
          <textarea
            id="descricao"
            name="descricao"
            required
            rows={6}
            defaultValue={imovel?.descricao}
            className={inputClass}
          />
        </div>

        <div className="flex flex-col gap-2 sm:col-span-2">
          <label htmlFor="fotos" className={labelClass}>
            {imovel ? "Adicionar fotos" : "Fotos"}
          </label>
          <input id="fotos" name="fotos" type="file" accept="image/jpeg,image/png,image/webp" multiple className={inputClass} />
        </div>

        {imovel && imovel.fotos.length > 0 ? (
          <div className="flex flex-col gap-3 sm:col-span-2">
            <span className={labelClass}>Fotos atuais</span>
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
              {imovel.fotos.map((foto) => (
                <div key={foto.id} className="relative aspect-square overflow-hidden border border-line">
                  <Image src={foto.url} alt="" fill className="object-cover" sizes="120px" />
                  <form
                    action={deleteFotoAction.bind(null, foto.id, imovel.id)}
                    className="absolute top-1 right-1"
                  >
                    <button
                      type="submit"
                      aria-label="Excluir foto"
                      className="flex h-7 w-7 items-center justify-center bg-ink/80 text-paper hover:bg-gold-dim"
                    >
                      <Trash2 className="h-3.5 w-3.5" strokeWidth={1.5} />
                    </button>
                  </form>
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </div>

      {state?.error ? (
        <p role="alert" className="border-l-2 border-gold-dim py-1 pl-4 text-sm text-ink">
          {state.error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="w-fit bg-ink px-6 py-4 text-xs tracking-[0.25em] text-paper uppercase transition-colors hover:bg-gold-dim disabled:opacity-60"
      >
        {pending ? "Salvando…" : submitLabel}
      </button>
    </form>
  );
}
