import "server-only";
import { put } from "@vercel/blob";

const MAX_SIZE_BYTES = 8 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

export async function uploadFotoImovel(imovelId: string, file: File): Promise<string> {
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error("Formato de imagem não suportado. Use JPG, PNG ou WebP.");
  }
  if (file.size > MAX_SIZE_BYTES) {
    throw new Error("A imagem excede o tamanho máximo de 8MB.");
  }

  const extension = file.type.split("/")[1];
  const filename = `imoveis/${imovelId}/${crypto.randomUUID()}.${extension}`;

  const blob = await put(filename, file, { access: "public" });
  return blob.url;
}
