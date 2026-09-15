import type { ReactNode } from "react";
import { SmoothScrollProvider } from "@/components/layout/smooth-scroll-provider";

/**
 * Scroll suave (Lenis) só para as páginas públicas/editoriais (Home,
 * `/imovel/[id]`) — é parte da identidade de marca ali. `/painel/**`
 * fica de fora de propósito: é ferramenta interna, usa scroll nativo do
 * navegador (ver CLAUDE.md > "Painel administrativo"). Escopar via route
 * group evita reimplementar isso como um early-return condicional dentro
 * do provider — o Lenis simplesmente nunca monta fora daqui.
 */
export default function PublicLayout({ children }: { children: ReactNode }) {
  return <SmoothScrollProvider>{children}</SmoothScrollProvider>;
}
