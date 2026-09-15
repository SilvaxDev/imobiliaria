export function getWhatsAppPhone(): string {
  const phone = process.env.WHATSAPP_PHONE;
  if (!phone) {
    throw new Error(
      "WHATSAPP_PHONE não está configurada. Defina o número (com DDI+DDD, ex: 5511999999999) no .env.",
    );
  }
  return phone;
}
