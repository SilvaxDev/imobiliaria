import type { Property } from "@/data/types";

/**
 * Conteúdo demonstrativo — nenhum imóvel real cadastrado ainda (ver
 * CLAUDE.md > "O que NÃO fazer": não inventar dados comerciais reais).
 * `image` fica vazio até a fotografia definitiva chegar; a seção usa
 * `MediaFrame` como placeholder enquanto isso.
 */
export const FEATURED_PROPERTIES: Property[] = [
  {
    id: "01",
    title: "Cobertura Jardim",
    location: "Zona Sul, São Paulo",
    category: "Cobertura",
    image: "",
    highlight: "220 m² · 3 suítes",
  },
  {
    id: "02",
    title: "Apartamento Alto Padrão",
    location: "Zona Oeste, São Paulo",
    category: "Apartamento",
    image: "",
    highlight: "140 m² · 2 suítes",
  },
  {
    id: "03",
    title: "Casa de Vila",
    location: "Zona Sul, São Paulo",
    category: "Casa",
    image: "",
    highlight: "180 m² · quintal privativo",
  },
];
