/**
 * Modelo de dado para a seção "Imóveis em destaque" (etapa futura).
 * Nenhum imóvel real foi cadastrado ainda — ver CLAUDE.md > "Copy" sobre
 * o uso de conteúdo demonstrativo no protótipo.
 */
export interface Property {
  id: string;
  title: string;
  location: string;
  category: string;
  image: string;
  highlight?: string;
}
