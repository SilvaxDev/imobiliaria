export interface ImovelWhatsAppInfo {
  titulo: string;
  bairro: string;
  valor: number;
  taxas?: number | null;
}

function formatCurrency(value: number): string {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}

export function buildWhatsAppMessage(imovel: ImovelWhatsAppInfo): string {
  const linhas = [
    `Olá! Tenho interesse no imóvel "${imovel.titulo}" (${imovel.bairro}).`,
    `Valor: ${formatCurrency(imovel.valor)}${imovel.taxas ? ` + ${formatCurrency(imovel.taxas)} de taxas` : ""}.`,
    "Pode me passar mais informações?",
  ];
  return linhas.join("\n");
}

export function buildWhatsAppUrl(phone: string, imovel: ImovelWhatsAppInfo): string {
  const digits = phone.replace(/\D/g, "");
  const message = buildWhatsAppMessage(imovel);
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}
