"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { exigirAdmin } from "@/lib/admin/sessao";
import { registrarAtividade } from "@/lib/admin/atividade";
import { caminhoDeImagemValido } from "@/lib/admin/upload";
import { CHAVES_DE_GALERIA } from "@/lib/dados/galerias";

export interface EstadoDaGaleria {
  erro?: string;
  ok?: boolean;
}

/** Cada chave de galeria é consumida por uma página específica do site. */
const ROTA_DA_CHAVE: Record<string, string> = {
  home: "/",
  servicos: "/servicos",
  "para-casas": "/para-casas",
  "para-empresas": "/para-empresas",
  "produto-nanoceramica": "/produtos/nanoceramica-ultra-hd",
};

const esquema = z.object({
  sobrancelha: z.string().trim().min(1, "Informe a sobrancelha da seção.").max(80),
  titulo: z.string().trim().min(1, "Informe o título da seção.").max(160),
  lead: z.string().trim().max(400),
  itens: z
    .array(
      z.object({
        imagem: z.string().trim().min(1, "Toda foto precisa de um arquivo."),
        alt: z.string().trim().min(1, "Toda foto precisa de um texto alternativo."),
      }),
    )
    .max(12),
});

export async function salvarGaleria(
  chave: string,
  _anterior: EstadoDaGaleria,
  formulario: FormData,
): Promise<EstadoDaGaleria> {
  const admin = await exigirAdmin();

  const conhecida = CHAVES_DE_GALERIA.find((g) => g.chave === chave);
  if (!conhecida) return { erro: "Galeria não encontrada." };

  let itensBrutos: unknown = [];
  try {
    itensBrutos = JSON.parse(String(formulario.get("itens") ?? "[]"));
  } catch {
    return { erro: "Não foi possível ler a lista de fotos." };
  }

  const analise = esquema.safeParse({
    sobrancelha: formulario.get("sobrancelha"),
    titulo: formulario.get("titulo"),
    lead: formulario.get("lead") ?? "",
    itens: itensBrutos,
  });

  if (!analise.success) {
    return { erro: analise.error.issues[0]?.message ?? "Dados inválidos." };
  }
  const dados = analise.data;

  if (dados.itens.some((item) => !caminhoDeImagemValido(item.imagem))) {
    return { erro: "As fotos precisam ser imagens do próprio site." };
  }

  const cabecalho = {
    sobrancelha: dados.sobrancelha,
    titulo: dados.titulo,
    lead: dados.lead,
  };

  // Troca a lista inteira numa transação: assim a galeria nunca fica vista pelo
  // site com metade das fotos antigas e metade das novas.
  await prisma.$transaction(async (tx) => {
    const galeria = await tx.galeria.upsert({
      where: { chave },
      update: cabecalho,
      create: { chave, nomeNoPainel: conhecida.nome, ...cabecalho },
    });

    await tx.galeriaItem.deleteMany({ where: { galeriaId: galeria.id } });

    if (dados.itens.length > 0) {
      await tx.galeriaItem.createMany({
        data: dados.itens.map((item, ordem) => ({
          galeriaId: galeria.id,
          imagem: item.imagem,
          alt: item.alt,
          ordem,
        })),
      });
    }
  });

  await registrarAtividade(`Atualizou a galeria "${conhecida.nome}"`, admin.nome);

  const rota = ROTA_DA_CHAVE[chave];
  if (rota) revalidatePath(rota);
  revalidatePath("/admin/galerias");

  return { ok: true };
}
