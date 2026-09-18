import { cache } from "react";

import { prisma } from "@/lib/prisma";
import { lerBlocos, type Bloco } from "@/lib/admin/blocos";
import { metaDoPost } from "@/lib/datas";
import { caminhoOuVazio, type CaminhoDeImagem } from "@/lib/imagens";
import type { NomeDeIcone } from "@/components/ui/Icone";
import { icones } from "@/components/ui/Icone";
import type { BlogPost } from "@/generated/prisma/client";

export interface ResumoDePost {
  slug: string;
  titulo: string;
  resumo: string;
  categoria: string;
  capa: CaminhoDeImagem | "";
  autor: string;
  publicadoEm: Date;
  minutosLeitura: number;
  /** "12 de agosto de 2026 · 6 min de leitura" */
  meta: string;
}

export interface PostCompleto extends ResumoDePost {
  conteudo: Bloco[];
}

type PostComCategoria = BlogPost & { categoria: { rotulo: string } | null };

function paraResumo(post: PostComCategoria, metaCurta = false): ResumoDePost {
  const publicadoEm = post.publicadoEm ?? post.criadoEm;
  return {
    slug: post.slug,
    titulo: post.titulo,
    resumo: post.resumo,
    categoria: post.categoria?.rotulo ?? "Artigo",
    capa: caminhoOuVazio(post.capa),
    autor: post.autor,
    publicadoEm,
    minutosLeitura: post.minutosLeitura,
    meta: metaDoPost(publicadoEm, post.minutosLeitura, metaCurta),
  };
}

const PUBLICADOS = { status: "PUBLICADO" } as const;
const MAIS_NOVOS_PRIMEIRO = [{ publicadoEm: "desc" }, { criadoEm: "desc" }] as const;

/** Todos os posts publicados, mais recentes primeiro. */
export const listarPosts = cache(async (): Promise<ResumoDePost[]> => {
  const posts = await prisma.blogPost.findMany({
    where: PUBLICADOS,
    orderBy: [...MAIS_NOVOS_PRIMEIRO],
    include: { categoria: { select: { rotulo: true } } },
  });
  return posts.map((post) => paraResumo(post));
});

/**
 * O post grande do topo de /blog. Sem nenhum marcado como destaque, cai no
 * mais recente — a página nunca fica sem capa.
 */
export const postEmDestaque = cache(async (): Promise<ResumoDePost | null> => {
  const marcado = await prisma.blogPost.findFirst({
    where: { ...PUBLICADOS, destaque: true },
    include: { categoria: { select: { rotulo: true } } },
  });
  if (marcado) return paraResumo(marcado);

  const maisRecente = await prisma.blogPost.findFirst({
    where: PUBLICADOS,
    orderBy: [...MAIS_NOVOS_PRIMEIRO],
    include: { categoria: { select: { rotulo: true } } },
  });
  return maisRecente ? paraResumo(maisRecente) : null;
});

/** Os três da Home, com a meta curta ("6 min" em vez de "6 min de leitura"). */
export const postsDaHome = cache(async (quantos = 3): Promise<ResumoDePost[]> => {
  const posts = await prisma.blogPost.findMany({
    where: PUBLICADOS,
    orderBy: [...MAIS_NOVOS_PRIMEIRO],
    take: quantos,
    include: { categoria: { select: { rotulo: true } } },
  });
  return posts.map((post) => paraResumo(post, true));
});

export const postPorSlug = cache(async (slug: string): Promise<PostCompleto | null> => {
  const post = await prisma.blogPost.findFirst({
    where: { slug, ...PUBLICADOS },
    include: { categoria: { select: { rotulo: true } } },
  });
  if (!post) return null;
  return { ...paraResumo(post), conteudo: lerBlocos(post.conteudo) };
});

export const postsRelacionados = cache(
  async (slugAtual: string, quantos = 3): Promise<ResumoDePost[]> => {
    const posts = await prisma.blogPost.findMany({
      where: { ...PUBLICADOS, slug: { not: slugAtual } },
      orderBy: [...MAIS_NOVOS_PRIMEIRO],
      take: quantos,
      include: { categoria: { select: { rotulo: true } } },
    });
    return posts.map((post) => paraResumo(post, true));
  },
);

export interface FiltroDoBlog {
  rotulo: string;
  icone: NomeDeIcone;
}

/** Os chips de filtro. "Todos" é fixo e vem sempre primeiro. */
export const listarFiltros = cache(async (): Promise<FiltroDoBlog[]> => {
  const categorias = await prisma.blogCategoria.findMany({
    where: { ativo: true },
    orderBy: { ordem: "asc" },
  });

  return [
    { rotulo: "Todos", icone: "janela" as NomeDeIcone },
    ...categorias.map((categoria) => ({
      rotulo: categoria.rotulo,
      // Um ícone renomeado no design system não pode quebrar a página.
      icone: (categoria.icone in icones ? categoria.icone : "janela") as NomeDeIcone,
    })),
  ];
});

/** Slugs publicados — usado no sitemap. */
export const slugsPublicados = cache(async () => {
  const posts = await prisma.blogPost.findMany({
    where: PUBLICADOS,
    orderBy: [...MAIS_NOVOS_PRIMEIRO],
    select: { slug: true, atualizadoEm: true },
  });
  return posts;
});
