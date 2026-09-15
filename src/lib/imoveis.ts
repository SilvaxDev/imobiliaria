import "server-only";
import { prisma } from "@/lib/prisma";
import type { Prisma, StatusImovel } from "@/generated/prisma/client";
import type { ImovelGetPayload } from "@/generated/prisma/models";

export interface ImovelListItem {
  id: string;
  titulo: string;
  bairro: string;
  valor: number;
  taxas: number | null;
  quartos: number;
  temGaragem: boolean;
  status: StatusImovel;
  fotoCapa: string | null;
}

export interface ImovelFoto {
  id: string;
  url: string;
  ordem: number;
}

export interface ImovelDetail extends ImovelListItem {
  descricao: string;
  fotos: ImovelFoto[];
}

export interface ImovelInput {
  titulo: string;
  bairro: string;
  valor: number;
  taxas: number | null;
  quartos: number;
  temGaragem: boolean;
  descricao: string;
  status: StatusImovel;
}

export interface ListaFiltros {
  quartos?: number[];
  temGaragem?: boolean;
}

function toNumber(value: Prisma.Decimal | null): number | null {
  return value === null ? null : value.toNumber();
}

type ImovelComFotos = ImovelGetPayload<{ include: { fotos: true } }>;

function mapListItem(imovel: ImovelComFotos): ImovelListItem {
  const [capa] = [...imovel.fotos].sort((a, b) => a.ordem - b.ordem);
  return {
    id: imovel.id,
    titulo: imovel.titulo,
    bairro: imovel.bairro,
    valor: imovel.valor.toNumber(),
    taxas: toNumber(imovel.taxas),
    quartos: imovel.quartos,
    temGaragem: imovel.temGaragem,
    status: imovel.status,
    fotoCapa: capa?.url ?? null,
  };
}

function mapDetail(imovel: ImovelComFotos): ImovelDetail {
  return {
    ...mapListItem(imovel),
    descricao: imovel.descricao,
    fotos: [...imovel.fotos]
      .sort((a, b) => a.ordem - b.ordem)
      .map((foto) => ({ id: foto.id, url: foto.url, ordem: foto.ordem })),
  };
}

export async function listImoveisAtivos(filtros: ListaFiltros = {}): Promise<ImovelListItem[]> {
  const imoveis = await prisma.imovel.findMany({
    where: {
      status: "ATIVO",
      ...(filtros.quartos?.length ? { quartos: { in: filtros.quartos } } : {}),
      ...(filtros.temGaragem !== undefined ? { temGaragem: filtros.temGaragem } : {}),
    },
    orderBy: { createdAt: "desc" },
    include: { fotos: true },
  });

  return imoveis.map(mapListItem);
}

export async function getImovelAtivoById(id: string): Promise<ImovelDetail | null> {
  const imovel = await prisma.imovel.findFirst({
    where: { id, status: "ATIVO" },
    include: { fotos: true },
  });
  return imovel ? mapDetail(imovel) : null;
}

export async function listImoveisAdmin(): Promise<ImovelListItem[]> {
  const imoveis = await prisma.imovel.findMany({
    orderBy: { createdAt: "desc" },
    include: { fotos: true },
  });
  return imoveis.map(mapListItem);
}

export async function getImovelById(id: string): Promise<ImovelDetail | null> {
  const imovel = await prisma.imovel.findUnique({
    where: { id },
    include: { fotos: true },
  });
  return imovel ? mapDetail(imovel) : null;
}

export async function createImovel(data: ImovelInput): Promise<string> {
  const imovel = await prisma.imovel.create({ data });
  return imovel.id;
}

export async function updateImovel(id: string, data: ImovelInput): Promise<void> {
  await prisma.imovel.update({ where: { id }, data });
}

export async function deleteImovel(id: string): Promise<void> {
  await prisma.imovel.delete({ where: { id } });
}

export async function addFoto(imovelId: string, url: string, ordem: number): Promise<void> {
  await prisma.foto.create({ data: { imovelId, url, ordem } });
}

export async function deleteFoto(fotoId: string): Promise<void> {
  await prisma.foto.delete({ where: { id: fotoId } });
}
