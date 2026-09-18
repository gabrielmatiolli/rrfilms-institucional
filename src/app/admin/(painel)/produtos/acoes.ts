"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { exigirAdmin } from "@/lib/admin/sessao";
import { registrarAtividade } from "@/lib/admin/atividade";
import { gerarSlug } from "@/lib/admin/slug";
import { caminhoDeImagemValido } from "@/lib/admin/upload";
import { lerBlocos, validarBlocos } from "@/lib/admin/blocos";
import type { Prisma } from "@/generated/prisma/client";

export interface EstadoDoProduto {
  erro?: string;
}

const esquema = z.object({
  nome: z.string().trim().min(1, "Informe o nome da linha.").max(80),
  destaque: z.string().trim().min(1, "Informe a segunda linha do título.").max(80),
  promessa: z.string().trim().min(1, "Escreva a promessa.").max(240),
  descricao: z.string().trim().min(1, "Escreva a descrição.").max(800),
  foto: z.string().trim(),
  ativo: z.boolean(),
  temPaginaPropria: z.boolean(),
  hrefExterno: z.string().trim(),
  metaTitulo: z.string().trim().max(120),
  metaDescricao: z.string().trim().max(320),
});

/** A grade de linhas fica na Home; ligar ou desligar a página própria mexe no sitemap. */
function revalidarProdutos(slug?: string) {
  revalidatePath("/");
  revalidatePath("/sitemap.xml");
  revalidatePath("/admin/produtos");
  revalidatePath("/admin");
  if (slug) revalidatePath(`/produtos/${slug}`);
}

async function slugUnico(nome: string, destaque: string, ignorarId?: string) {
  const base = gerarSlug(`${nome} ${destaque}`) || "produto";
  let slug = base;
  let sufixo = 2;
  for (;;) {
    const existente = await prisma.produto.findUnique({ where: { slug }, select: { id: true } });
    if (!existente || existente.id === ignorarId) return slug;
    slug = `${base}-${sufixo++}`;
  }
}

async function prepararDados(formulario: FormData, ignorarId?: string) {
  const analise = esquema.safeParse({
    nome: formulario.get("nome"),
    destaque: formulario.get("destaque"),
    promessa: formulario.get("promessa"),
    descricao: formulario.get("descricao"),
    foto: formulario.get("foto") ?? "",
    ativo: formulario.get("ativo") === "on",
    temPaginaPropria: formulario.get("temPaginaPropria") === "on",
    hrefExterno: formulario.get("hrefExterno") ?? "/contato",
    metaTitulo: formulario.get("metaTitulo") ?? "",
    metaDescricao: formulario.get("metaDescricao") ?? "",
  });

  if (!analise.success) {
    return { erro: analise.error.issues[0]?.message ?? "Dados inválidos." };
  }
  const dados = analise.data;

  if (!caminhoDeImagemValido(dados.foto)) {
    return { erro: "A foto precisa ser uma imagem do próprio site." };
  }

  let blocos;
  try {
    blocos = lerBlocos(JSON.parse(String(formulario.get("conteudo") ?? "[]")));
  } catch {
    return { erro: "Não foi possível ler o conteúdo da página." };
  }

  const erroNosBlocos = validarBlocos(blocos);
  if (erroNosBlocos) return { erro: erroNosBlocos };

  if (dados.temPaginaPropria) {
    if (blocos.length === 0) {
      return { erro: "Uma linha com página própria precisa de conteúdo na página." };
    }
  } else if (!dados.hrefExterno.startsWith("/") || dados.hrefExterno.startsWith("//")) {
    // Sem página própria, o card precisa de um destino interno válido.
    return { erro: "O destino precisa ser um caminho do site, como /servicos#seguranca." };
  }

  return {
    valores: {
      slug: await slugUnico(dados.nome, dados.destaque, ignorarId),
      nome: dados.nome,
      destaque: dados.destaque,
      promessa: dados.promessa,
      descricao: dados.descricao,
      foto: dados.foto,
      ativo: dados.ativo,
      temPaginaPropria: dados.temPaginaPropria,
      hrefExterno: dados.hrefExterno || "/contato",
      metaTitulo: dados.metaTitulo,
      metaDescricao: dados.metaDescricao,
      conteudo: blocos as unknown as Prisma.InputJsonValue,
    },
  };
}

export async function criarProduto(
  _anterior: EstadoDoProduto,
  formulario: FormData,
): Promise<EstadoDoProduto> {
  const admin = await exigirAdmin();

  const { erro, valores } = await prepararDados(formulario);
  if (erro || !valores) return { erro };

  const ultimo = await prisma.produto.findFirst({
    orderBy: { ordem: "desc" },
    select: { ordem: true },
  });

  const produto = await prisma.produto.create({
    data: { ...valores, ordem: (ultimo?.ordem ?? -1) + 1 },
  });

  await registrarAtividade(`Criou a linha "${produto.nome} ${produto.destaque}"`, admin.nome);
  revalidarProdutos(produto.slug);
  redirect("/admin/produtos");
}

export async function atualizarProduto(
  id: string,
  _anterior: EstadoDoProduto,
  formulario: FormData,
): Promise<EstadoDoProduto> {
  const admin = await exigirAdmin();

  const anterior = await prisma.produto.findUnique({ where: { id }, select: { slug: true } });
  if (!anterior) return { erro: "Linha não encontrada." };

  const { erro, valores } = await prepararDados(formulario, id);
  if (erro || !valores) return { erro };

  const produto = await prisma.produto.update({ where: { id }, data: valores });

  await registrarAtividade(`Atualizou a linha "${produto.nome} ${produto.destaque}"`, admin.nome);
  revalidarProdutos(produto.slug);
  if (anterior.slug !== produto.slug) revalidatePath(`/produtos/${anterior.slug}`);
  redirect("/admin/produtos");
}

export async function excluirProduto(formulario: FormData) {
  const admin = await exigirAdmin();
  const id = String(formulario.get("id") ?? "");
  if (!id) return;

  const produto = await prisma.produto.delete({ where: { id } });
  await registrarAtividade(`Excluiu a linha "${produto.nome} ${produto.destaque}"`, admin.nome);
  revalidarProdutos(produto.slug);
}

export async function moverProduto(formulario: FormData) {
  await exigirAdmin();
  const id = String(formulario.get("id") ?? "");
  const direcao = formulario.get("direcao") === "cima" ? -1 : 1;
  if (!id) return;

  const produtos = await prisma.produto.findMany({
    orderBy: { ordem: "asc" },
    select: { id: true },
  });

  const indice = produtos.findIndex((p) => p.id === id);
  const destino = indice + direcao;
  if (indice === -1 || destino < 0 || destino >= produtos.length) return;

  [produtos[indice], produtos[destino]] = [produtos[destino], produtos[indice]];

  await prisma.$transaction(
    produtos.map((produto, ordem) =>
      prisma.produto.update({ where: { id: produto.id }, data: { ordem } }),
    ),
  );

  revalidarProdutos();
}
