import * as z from "zod";

export const ImovelFormSchema = z.object({
  titulo: z.string().trim().min(3, { error: "Informe um título." }),
  bairro: z.string().trim().min(2, { error: "Informe o bairro." }),
  valor: z.coerce.number({ error: "Informe um valor válido." }).positive({ error: "O valor deve ser maior que zero." }),
  taxas: z
    .union([z.coerce.number().nonnegative(), z.nan()])
    .optional()
    .transform((value) => (value === undefined || Number.isNaN(value) ? null : value)),
  quartos: z.coerce.number({ error: "Informe a quantidade de quartos." }).int().min(0).max(20),
  temGaragem: z.coerce.boolean(),
  descricao: z.string().trim().min(10, { error: "Descreva o imóvel (mínimo 10 caracteres)." }),
  status: z.enum(["ATIVO", "INATIVO"]),
});

export type ImovelFormValues = z.infer<typeof ImovelFormSchema>;

export function parseImovelFormData(formData: FormData) {
  return ImovelFormSchema.safeParse({
    titulo: formData.get("titulo"),
    bairro: formData.get("bairro"),
    valor: formData.get("valor"),
    taxas: formData.get("taxas") || undefined,
    quartos: formData.get("quartos"),
    temGaragem: formData.get("temGaragem") === "on",
    descricao: formData.get("descricao"),
    status: formData.get("status") === "INATIVO" ? "INATIVO" : "ATIVO",
  });
}
