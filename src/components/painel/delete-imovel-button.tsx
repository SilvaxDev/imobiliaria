"use client";

import { Trash2 } from "lucide-react";
import { deleteImovelAction } from "@/lib/imoveis-actions";

export function DeleteImovelButton({ id, titulo }: { id: string; titulo: string }) {
  return (
    <form
      action={deleteImovelAction.bind(null, id)}
      onSubmit={(event) => {
        if (!confirm(`Excluir o imóvel "${titulo}"? Esta ação não pode ser desfeita.`)) {
          event.preventDefault();
        }
      }}
    >
      <button
        type="submit"
        aria-label={`Excluir ${titulo}`}
        className="flex h-9 w-9 items-center justify-center border border-line text-ink transition-colors hover:border-ink"
      >
        <Trash2 className="h-4 w-4" strokeWidth={1.5} />
      </button>
    </form>
  );
}
