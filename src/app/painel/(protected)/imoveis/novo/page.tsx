import { ImovelForm } from "@/components/painel/imovel-form";
import { createImovelAction } from "@/lib/imoveis-actions";

export default function NovoImovelPage() {
  return (
    <div className="flex flex-col gap-10">
      <h1 className="font-display text-2xl text-ink">Novo imóvel</h1>
      <ImovelForm action={createImovelAction} submitLabel="Criar imóvel" />
    </div>
  );
}
