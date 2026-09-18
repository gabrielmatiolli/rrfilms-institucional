"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { exigirAdmin } from "@/lib/admin/sessao";
import { registrarAtividade } from "@/lib/admin/atividade";
import { gerarSlug } from "@/lib/admin/slug";
import { caminhoDeImagemValido } from "@/lib/admin/upload";
import { lerBlocos, minutosDeLeitura, validarBlocos } from "@/lib/admin/blocos";
import type { Prisma } from "@/generated/prisma/client";

export interface EstadoDoPost {
  erro?: string;
}

const esquema = z.object({
  titulo: z.string().trim().min(1, "Informe o título do post.").max(180),
  resumo: z.string().trim().min(1, "Escreva um resumo curto.").max(600),
  autor: z.string().trim().min(1, "Informe o autor."),
  capa: z.string().trim().min(1, "Escolha uma imagem de capa."),
  categoriaId: z.string().trim().optional(),
  status: z.enum(["PUBLICADO", "RASCUNHO"]),
  destaque: z.boolean(),
});

function lerFormulario(formulario: FormData) {
  return esquema.safeParse({
    titulo: formulario.get("titulo"),
    resumo: formulario.get("resumo"),
    autor: formulario.get("autor"),
    capa: formulario.get("capa"),
    categoriaId: formulario.get("categoriaId") || undefined,
    status: formulario.get("status") === "PUBLICADO" ? "PUBLICADO" : "RASCUNHO",
    destaque: formulario.get("destaque") === "on",
  });
}

/** Gera um slug único; `ignorarId` deixa o post manter o próprio slug ao editar. */
async function slugUnico(titulo: string, ignorarId?: string) {
  const base = gerarSlug(titulo) || "post";
  let slug = base;
  let sufixo = 2;
  for (;;) {
    const existente = await prisma.blogPost.findUnique({ where: { slug }, select: { id: true } });
    if (!existente || existente.id === ignorarId) return slug;
    slug = `${base}-${sufixo++}`;
  }
}

/**
 * Limpa o cache das rotas que mostram post — a listagem, o artigo, a Home e o
 * sitemap. As páginas públicas são estáticas: sem isso, o que muda no painel só
 * apareceria no próximo deploy.
 */
function revalidarBlog(slug?: string) {
  revalidatePath("/blog");
  revalidatePath("/");
  revalidatePath("/sitemap.xml");
  revalidatePath("/admin/blog");
  revalidatePath("/admin");
  if (slug) revalidatePath(`/blog/${slug}`);
}

interface DadosPreparados {
  erro?: string;
  valores?: Prisma.BlogPostUncheckedCreateInput;
}

async function prepararDados(
  formulario: FormData,
  ignorarId?: string,
): Promise<DadosPreparados> {
  const analise = lerFormulario(formulario);
  if (!analise.success) {
    return { erro: analise.error.issues[0]?.message ?? "Dados inválidos." };
  }
  const dados = analise.data;

  if (!caminhoDeImagemValido(dados.capa)) {
    return { erro: "A capa precisa ser uma imagem do próprio site." };
  }

  let blocos;
  try {
    blocos = lerBlocos(JSON.parse(String(formulario.get("conteudo") ?? "[]")));
  } catch {
    return { erro: "Não foi possível ler o conteúdo do artigo." };
  }

  const erroNosBlocos = validarBlocos(blocos);
  if (erroNosBlocos) return { erro: erroNosBlocos };

  if (dados.status === "PUBLICADO" && blocos.length === 0) {
    return { erro: "Um post publicado precisa de pelo menos um bloco de conteúdo." };
  }

  // Categoria informada precisa existir — o <select> vem do banco, mas nada
  // impede um POST forjado.
  if (dados.categoriaId) {
    const existe = await prisma.blogCategoria.findUnique({
      where: { id: dados.categoriaId },
      select: { id: true },
    });
    if (!existe) return { erro: "Categoria não encontrada." };
  }

  return {
    valores: {
      slug: await slugUnico(dados.titulo, ignorarId),
      titulo: dados.titulo,
      resumo: dados.resumo,
      autor: dados.autor,
      capa: dados.capa,
      categoriaId: dados.categoriaId || null,
      conteudo: blocos as unknown as Prisma.InputJsonValue,
      minutosLeitura: minutosDeLeitura(blocos),
      status: dados.status,
      destaque: dados.destaque,
    },
  };
}

/** Só um post fica em destaque na capa do blog. */
async function garantirDestaqueUnico(idDoDestaque: string) {
  await prisma.blogPost.updateMany({
    where: { destaque: true, id: { not: idDoDestaque } },
    data: { destaque: false },
  });
}

export async function criarPost(
  _anterior: EstadoDoPost,
  formulario: FormData,
): Promise<EstadoDoPost> {
  const admin = await exigirAdmin();

  const { erro, valores } = await prepararDados(formulario);
  if (erro || !valores) return { erro };

  const post = await prisma.blogPost.create({
    data: {
      ...valores,
      publicadoEm: valores.status === "PUBLICADO" ? new Date() : null,
    },
  });

  if (post.destaque) await garantirDestaqueUnico(post.id);

  await registrarAtividade(
    post.status === "PUBLICADO"
      ? `Publicou o post "${post.titulo}"`
      : `Criou o rascunho "${post.titulo}"`,
    admin.nome,
  );

  revalidarBlog(post.slug);
  redirect("/admin/blog");
}

export async function atualizarPost(
  id: string,
  _anterior: EstadoDoPost,
  formulario: FormData,
): Promise<EstadoDoPost> {
  const admin = await exigirAdmin();

  const anterior = await prisma.blogPost.findUnique({ where: { id } });
  if (!anterior) return { erro: "Post não encontrado." };

  const { erro, valores } = await prepararDados(formulario, id);
  if (erro || !valores) return { erro };

  const post = await prisma.blogPost.update({
    where: { id },
    data: {
      ...valores,
      // A data de publicação é a da primeira vez que foi ao ar: editar um post
      // publicado não o joga para o topo da listagem.
      publicadoEm:
        valores.status === "PUBLICADO" ? (anterior.publicadoEm ?? new Date()) : null,
    },
  });

  if (post.destaque) await garantirDestaqueUnico(post.id);

  await registrarAtividade(`Atualizou o post "${post.titulo}"`, admin.nome);

  revalidarBlog(post.slug);
  // O slug pode ter mudado junto com o título; a rota antiga também sai do cache.
  if (anterior.slug !== post.slug) revalidatePath(`/blog/${anterior.slug}`);
  redirect("/admin/blog");
}

export async function excluirPost(formulario: FormData) {
  const admin = await exigirAdmin();
  const id = String(formulario.get("id") ?? "");
  if (!id) return;

  const post = await prisma.blogPost.delete({ where: { id } });
  await registrarAtividade(`Excluiu o post "${post.titulo}"`, admin.nome);

  revalidarBlog(post.slug);
}

/** Publica ou despublica direto da listagem, sem abrir o formulário. */
export async function alternarPublicacao(formulario: FormData) {
  const admin = await exigirAdmin();
  const id = String(formulario.get("id") ?? "");
  if (!id) return;

  const post = await prisma.blogPost.findUnique({ where: { id } });
  if (!post) return;

  const publicando = post.status === "RASCUNHO";
  if (publicando && lerBlocos(post.conteudo).length === 0) return;

  const atualizado = await prisma.blogPost.update({
    where: { id },
    data: {
      status: publicando ? "PUBLICADO" : "RASCUNHO",
      publicadoEm: publicando ? (post.publicadoEm ?? new Date()) : null,
      // Um rascunho não pode continuar ocupando o destaque da capa do blog.
      destaque: publicando ? post.destaque : false,
    },
  });

  await registrarAtividade(
    `${publicando ? "Publicou" : "Despublicou"} o post "${atualizado.titulo}"`,
    admin.nome,
  );

  revalidarBlog(atualizado.slug);
}
