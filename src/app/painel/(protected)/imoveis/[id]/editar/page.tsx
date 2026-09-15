import { notFound } from "next/navigation";
import { ImovelForm } from "@/components/painel/imovel-form";
import { getImovelById } from "@/lib/imoveis";
import { updateImovelAction } from "@/lib/imoveis-actions";

interface EditarImovelPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditarImovelPage({ params }: EditarImovelPageProps) {
  const { id } = await params;
  const imovel = await getImovelById(id);

  if (!imovel) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-10">
      <h1 className="font-display text-2xl text-ink">Editar imóvel</h1>
      <ImovelForm action={updateImovelAction.bind(null, id)} imovel={imovel} submitLabel="Salvar alterações" />
    </div>
  );
}
