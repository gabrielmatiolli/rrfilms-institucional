import { cache } from "react";

import { prisma } from "@/lib/prisma";
import { lerBlocos, type Bloco } from "@/lib/admin/blocos";
import type { Linha } from "@/components/autorais/LinhaDePelicula";
import { caminhoOuVazio } from "@/lib/imagens";

export interface ProdutoCompleto extends Linha {
  slug: string;
  conteudo: Bloco[];
  metaTitulo: string;
  metaDescricao: string;
}

/** O CTA do card: página própria gerada pelo painel ou destino avulso. */
function destino(produto: { temPaginaPropria: boolean; slug: string; hrefExterno: string }) {
  return produto.temPaginaPropria ? `/produtos/${produto.slug}` : produto.hrefExterno;
}

/** As linhas de película ativas, na ordem do painel. */
export const listarProdutos = cache(async (): Promise<Linha[]> => {
  const produtos = await prisma.produto.findMany({
    where: { ativo: true },
    orderBy: { ordem: "asc" },
  });

  return produtos.map((produto) => ({
    nome: produto.nome,
    destaque: produto.destaque,
    promessa: produto.promessa,
    descricao: produto.descricao,
    foto: caminhoOuVazio(produto.foto) || undefined,
    href: destino(produto),
  }));
});

/** Só os que têm página própria — alimenta /produtos/[slug] e o sitemap. */
export const produtosComPagina = cache(async () => {
  return prisma.produto.findMany({
    where: { ativo: true, temPaginaPropria: true },
    orderBy: { ordem: "asc" },
    select: { slug: true, atualizadoEm: true },
  });
});

export const produtoPorSlug = cache(async (slug: string): Promise<ProdutoCompleto | null> => {
  const produto = await prisma.produto.findFirst({
    where: { slug, ativo: true, temPaginaPropria: true },
  });
  if (!produto) return null;

  return {
    slug: produto.slug,
    nome: produto.nome,
    destaque: produto.destaque,
    promessa: produto.promessa,
    descricao: produto.descricao,
    foto: caminhoOuVazio(produto.foto) || undefined,
    href: `/produtos/${produto.slug}`,
    conteudo: lerBlocos(produto.conteudo),
    metaTitulo: produto.metaTitulo || `${produto.nome} ${produto.destaque}`,
    metaDescricao: produto.metaDescricao || produto.promessa,
  };
});
