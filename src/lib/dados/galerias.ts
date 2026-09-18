import { cache } from "react";

import { prisma } from "@/lib/prisma";
import type { ItemDeGaleria } from "@/components/sections/Galeria";
import { ehCaminhoDeImagem } from "@/lib/imagens";

/**
 * As chaves de galeria que o site conhece. O painel edita o conteúdo de cada
 * uma; criar chave nova exige mexer na página que a consome, então a lista
 * fica no código de propósito.
 */
export const CHAVES_DE_GALERIA = [
  { chave: "home", nome: "Home" },
  { chave: "servicos", nome: "Serviços" },
  { chave: "para-casas", nome: "Para casas" },
  { chave: "para-empresas", nome: "Para empresas" },
  { chave: "produto-nanoceramica", nome: "Produto · Nanocerâmica Ultra HD" },
] as const;

export type ChaveDeGaleria = (typeof CHAVES_DE_GALERIA)[number]["chave"];

export interface GaleriaDoSite {
  sobrancelha: string;
  titulo: string;
  lead: string;
  itens: ItemDeGaleria[];
}

/**
 * Devolve null quando a galeria ainda não foi cadastrada — a página decide se
 * esconde a seção. Melhor do que um bloco vazio no meio do layout.
 */
export const galeriaPorChave = cache(
  async (chave: ChaveDeGaleria): Promise<GaleriaDoSite | null> => {
    const galeria = await prisma.galeria.findUnique({
      where: { chave },
      include: { itens: { orderBy: { ordem: "asc" } } },
    });

    // Foto com caminho inválido sai da grade em vez de derrubar a página.
    const itens: ItemDeGaleria[] = [];
    for (const item of galeria?.itens ?? []) {
      if (ehCaminhoDeImagem(item.imagem)) itens.push({ src: item.imagem, alt: item.alt });
    }
    if (!galeria || itens.length === 0) return null;

    return {
      sobrancelha: galeria.sobrancelha,
      titulo: galeria.titulo,
      lead: galeria.lead,
      itens,
    };
  },
);
