"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { exigirAdmin } from "@/lib/admin/sessao";
import { registrarAtividade } from "@/lib/admin/atividade";
import { gerarSlug } from "@/lib/admin/slug";
import { caminhoDeImagemValido } from "@/lib/admin/upload";
import type { Prisma } from "@/generated/prisma/client";

export interface EstadoDoServico {
  erro?: string;
}

const esquema = z.object({
  titulo: z.string().trim().min(1, "Informe o título do serviço.").max(120),
  tag: z.string().trim().min(1, "Informe a etiqueta do card.").max(60),
  descricao: z.string().trim().min(1, "Escreva a descrição.").max(600),
  linha: z.enum(["CONFORTO", "LUZ", "FRESCOR"]),
  foto: z.string().trim().min(1, "Escolha uma foto."),
  href: z.string().trim().min(1, "Informe o destino do card."),
  ativo: z.boolean(),
  dados: z
    .array(
      z.object({
        valor: z.string().trim().min(1, "Todo número precisa de um valor."),
        rotulo: z.string().trim().min(1, "Todo número precisa de uma legenda."),
      }),
    )
    .max(4),
});

function revalidarServicos() {
  revalidatePath("/servicos");
  revalidatePath("/");
  revalidatePath("/admin/servicos");
  revalidatePath("/admin");
}

async function slugUnico(titulo: string, ignorarId?: string) {
  const base = gerarSlug(titulo) || "servico";
  let slug = base;
  let sufixo = 2;
  for (;;) {
    const existente = await prisma.servico.findUnique({ where: { slug }, select: { id: true } });
    if (!existente || existente.id === ignorarId) return slug;
    slug = `${base}-${sufixo++}`;
  }
}

async function prepararDados(formulario: FormData, ignorarId?: string) {
  let dadosBrutos: unknown = [];
  try {
    dadosBrutos = JSON.parse(String(formulario.get("dados") ?? "[]"));
  } catch {
    return { erro: "Não foi possível ler os números do card." };
  }

  const analise = esquema.safeParse({
    titulo: formulario.get("titulo"),
    tag: formulario.get("tag"),
    descricao: formulario.get("descricao"),
    linha: formulario.get("linha"),
    foto: formulario.get("foto"),
    href: formulario.get("href"),
    ativo: formulario.get("ativo") === "on",
    dados: dadosBrutos,
  });

  if (!analise.success) {
    return { erro: analise.error.issues[0]?.message ?? "Dados inválidos." };
  }
  const dados = analise.data;

  if (!caminhoDeImagemValido(dados.foto)) {
    return { erro: "A foto precisa ser uma imagem do próprio site." };
  }
  // O href vira `href` de um <Link>: aceita caminho interno e âncora, não URL externa.
  if (!dados.href.startsWith("/") || dados.href.startsWith("//")) {
    return { erro: "O destino precisa ser um caminho do site, como /contato." };
  }

  return {
    valores: {
      slug: await slugUnico(dados.titulo, ignorarId),
      titulo: dados.titulo,
      tag: dados.tag,
      descricao: dados.descricao,
      linha: dados.linha,
      foto: dados.foto,
      href: dados.href,
      ativo: dados.ativo,
      dados: dados.dados as unknown as Prisma.InputJsonValue,
    },
  };
}

export async function criarServico(
  _anterior: EstadoDoServico,
  formulario: FormData,
): Promise<EstadoDoServico> {
  const admin = await exigirAdmin();

  const { erro, valores } = await prepararDados(formulario);
  if (erro || !valores) return { erro };

  // Entra no fim da lista.
  const ultimo = await prisma.servico.findFirst({
    orderBy: { ordem: "desc" },
    select: { ordem: true },
  });

  const servico = await prisma.servico.create({
    data: { ...valores, ordem: (ultimo?.ordem ?? -1) + 1 },
  });

  await registrarAtividade(`Criou o serviço "${servico.titulo}"`, admin.nome);
  revalidarServicos();
  redirect("/admin/servicos");
}

export async function atualizarServico(
  id: string,
  _anterior: EstadoDoServico,
  formulario: FormData,
): Promise<EstadoDoServico> {
  const admin = await exigirAdmin();

  const existente = await prisma.servico.findUnique({ where: { id }, select: { id: true } });
  if (!existente) return { erro: "Serviço não encontrado." };

  const { erro, valores } = await prepararDados(formulario, id);
  if (erro || !valores) return { erro };

  const servico = await prisma.servico.update({ where: { id }, data: valores });

  await registrarAtividade(`Atualizou o serviço "${servico.titulo}"`, admin.nome);
  revalidarServicos();
  redirect("/admin/servicos");
}

export async function excluirServico(formulario: FormData) {
  const admin = await exigirAdmin();
  const id = String(formulario.get("id") ?? "");
  if (!id) return;

  const servico = await prisma.servico.delete({ where: { id } });
  await registrarAtividade(`Excluiu o serviço "${servico.titulo}"`, admin.nome);
  revalidarServicos();
}

/** Sobe ou desce um serviço na grade, trocando a ordem com o vizinho. */
export async function moverServico(formulario: FormData) {
  await exigirAdmin();
  const id = String(formulario.get("id") ?? "");
  const direcao = formulario.get("direcao") === "cima" ? -1 : 1;
  if (!id) return;

  const servicos = await prisma.servico.findMany({
    orderBy: { ordem: "asc" },
    select: { id: true },
  });

  const indice = servicos.findIndex((s) => s.id === id);
  const destino = indice + direcao;
  if (indice === -1 || destino < 0 || destino >= servicos.length) return;

  [servicos[indice], servicos[destino]] = [servicos[destino], servicos[indice]];

  // Regrava a coluna `ordem` da lista inteira: é barato (poucos registros) e
  // deixa os índices sempre contíguos, sem buracos de exclusões antigas.
  await prisma.$transaction(
    servicos.map((servico, ordem) =>
      prisma.servico.update({ where: { id: servico.id }, data: { ordem } }),
    ),
  );

  revalidarServicos();
}
