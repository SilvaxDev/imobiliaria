"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { verifySession } from "@/lib/auth/dal";
import { parseImovelFormData } from "@/lib/imoveis-schema";
import { createImovel, updateImovel, deleteImovel, addFoto, deleteFoto } from "@/lib/imoveis";
import { uploadFotoImovel } from "@/lib/upload";

export interface ImovelFormState {
  error?: string;
}

async function uploadFotosEnviadas(imovelId: string, formData: FormData) {
  const arquivos = formData.getAll("fotos").filter((item): item is File => item instanceof File && item.size > 0);
  for (const [index, arquivo] of arquivos.entries()) {
    const url = await uploadFotoImovel(imovelId, arquivo);
    await addFoto(imovelId, url, index);
  }
}

export async function createImovelAction(
  _prevState: ImovelFormState | undefined,
  formData: FormData,
): Promise<ImovelFormState> {
  await verifySession();

  const validated = parseImovelFormData(formData);
  if (!validated.success) {
    return { error: validated.error.issues[0]?.message ?? "Dados inválidos." };
  }

  let imovelId: string;
  try {
    imovelId = await createImovel(validated.data);
    await uploadFotosEnviadas(imovelId, formData);
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Erro ao criar imóvel." };
  }

  revalidatePath("/painel/imoveis");
  revalidatePath("/");
  redirect("/painel/imoveis");
}

export async function updateImovelAction(
  id: string,
  _prevState: ImovelFormState | undefined,
  formData: FormData,
): Promise<ImovelFormState> {
  await verifySession();

  const validated = parseImovelFormData(formData);
  if (!validated.success) {
    return { error: validated.error.issues[0]?.message ?? "Dados inválidos." };
  }

  try {
    await updateImovel(id, validated.data);
    await uploadFotosEnviadas(id, formData);
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Erro ao atualizar imóvel." };
  }

  revalidatePath("/painel/imoveis");
  revalidatePath(`/imovel/${id}`);
  revalidatePath("/");
  redirect("/painel/imoveis");
}

export async function deleteImovelAction(id: string) {
  await verifySession();
  await deleteImovel(id);
  revalidatePath("/painel/imoveis");
  revalidatePath("/");
}

export async function deleteFotoAction(fotoId: string, imovelId: string) {
  await verifySession();
  await deleteFoto(fotoId);
  revalidatePath(`/painel/imoveis/${imovelId}/editar`);
}
