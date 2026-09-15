import { test } from "node:test";
import assert from "node:assert/strict";
import { buildWhatsAppMessage, buildWhatsAppUrl } from "./whatsapp.ts";

test("buildWhatsAppMessage inclui título, bairro e valor formatado", () => {
  const msg = buildWhatsAppMessage({
    titulo: "Apartamento 2 quartos",
    bairro: "Centro",
    valor: 1500,
  });
  assert.match(msg, /Apartamento 2 quartos/);
  assert.match(msg, /Centro/);
  assert.match(msg, /R\$\s?1\.500/);
  assert.doesNotMatch(msg, /taxas/);
});

test("buildWhatsAppMessage inclui taxas quando informadas", () => {
  const msg = buildWhatsAppMessage({
    titulo: "Casa",
    bairro: "Bairro X",
    valor: 2000,
    taxas: 350,
  });
  assert.match(msg, /R\$\s?350 de taxas/);
});

test("buildWhatsAppUrl remove caracteres não numéricos do telefone", () => {
  const url = buildWhatsAppUrl("+55 (11) 91234-5678", {
    titulo: "Casa",
    bairro: "Bairro X",
    valor: 2000,
  });
  assert.ok(url.startsWith("https://wa.me/5511912345678?text="));
});

test("buildWhatsAppUrl codifica a mensagem para uso em URL", () => {
  const url = buildWhatsAppUrl("5511999999999", {
    titulo: "Studio",
    bairro: "Vila Nova",
    valor: 1200,
  });
  const encoded = url.split("?text=")[1];
  assert.equal(decodeURIComponent(encoded), buildWhatsAppMessage({
    titulo: "Studio",
    bairro: "Vila Nova",
    valor: 1200,
  }));
});
