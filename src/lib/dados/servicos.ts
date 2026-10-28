import { cache } from "react";

import { prisma } from "@/lib/prisma";
import type { ServicoDeCard, LinhaDeCard } from "@/components/cards/Cartoes";
import { lerBlocos, type Bloco, type DadoDeBloco } from "@/lib/admin/blocos";
import { caminhoOuVazio } from "@/lib/imagens";

/** O enum do banco é maiúsculo; o design system usa minúsculo. */
const LINHA: Record<"CONFORTO" | "LUZ" | "FRESCOR", LinhaDeCard> = {
  CONFORTO: "conforto",
  LUZ: "luz",
  FRESCOR: "frescor",
};

export interface ServicoCompleto extends ServicoDeCard {
  slug: string;
  conteudo: Bloco[];
  metaTitulo: string;
  metaDescricao: string;
}

/** Lê a coluna Json `dados` descartando o que não for par valor/legenda. */
export function dadosDeServico(bruto: unknown): DadoDeBloco[] {
  if (!Array.isArray(bruto)) return [];
  return bruto.filter(
    (item): item is DadoDeBloco =>
      typeof item === "object" &&
      item !== null &&
      typeof (item as DadoDeBloco).valor === "string" &&
      typeof (item as DadoDeBloco).rotulo === "string",
  );
}

/** O CTA do card: a interna gerada pelo painel ou um destino avulso. */
function destino(servico: { temPaginaPropria: boolean; slug: string; href: string }) {
  return servico.temPaginaPropria ? `/servicos/${servico.slug}` : servico.href;
}

/** Serviços ativos, na ordem definida no painel. */
export const listarServicos = cache(async (): Promise<ServicoDeCard[]> => {
  const servicos = await prisma.servico.findMany({
    where: { ativo: true },
    orderBy: { ordem: "asc" },
  });

  return servicos.map((servico) => ({
    linha: LINHA[servico.linha],
    tag: servico.tag,
    titulo: servico.titulo,
    descricao: servico.descricao,
    foto: caminhoOuVazio(servico.foto),
    dados: dadosDeServico(servico.dados),
    href: destino(servico),
  }));
});

/** Só os que têm interna — alimenta o sitemap. */
export const servicosComPagina = cache(async () => {
  return prisma.servico.findMany({
    where: { ativo: true, temPaginaPropria: true },
    orderBy: { ordem: "asc" },
    select: { slug: true, atualizadoEm: true },
  });
});

export const servicoPorSlug = cache(async (slug: string): Promise<ServicoCompleto | null> => {
  const servico = await prisma.servico.findFirst({
    where: { slug, ativo: true, temPaginaPropria: true },
  });
  if (!servico) return null;

  return {
    slug: servico.slug,
    linha: LINHA[servico.linha],
    tag: servico.tag,
    titulo: servico.titulo,
    descricao: servico.descricao,
    foto: caminhoOuVazio(servico.foto),
    dados: dadosDeServico(servico.dados),
    href: `/servicos/${servico.slug}`,
    conteudo: lerBlocos(servico.conteudo),
    metaTitulo: servico.metaTitulo || servico.titulo,
    metaDescricao: servico.metaDescricao || servico.descricao,
  };
});

/** Os outros serviços ativos — a grade do pé da interna. */
export const outrosServicos = cache(
  async (slugAtual: string, quantos = 3): Promise<ServicoDeCard[]> => {
    const servicos = await prisma.servico.findMany({
      where: { ativo: true, slug: { not: slugAtual } },
      orderBy: { ordem: "asc" },
      take: quantos,
    });

    return servicos.map((servico) => ({
      linha: LINHA[servico.linha],
      tag: servico.tag,
      titulo: servico.titulo,
      descricao: servico.descricao,
      foto: caminhoOuVazio(servico.foto),
      dados: dadosDeServico(servico.dados),
      href: destino(servico),
    }));
  },
);
