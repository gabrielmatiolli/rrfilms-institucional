"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { exigirAdmin } from "@/lib/admin/sessao";
import { registrarAtividade } from "@/lib/admin/atividade";

export interface EstadoDoConteudo {
  erro?: string;
  ok?: boolean;
}

// --- Depoimentos ------------------------------------------------------------

const esquemaDeDepoimentos = z.array(
  z.object({
    id: z.string(),
    citacao: z.string().trim().min(1, "Todo depoimento precisa da fala do cliente."),
    nome: z.string().trim().min(1, "Todo depoimento precisa do nome de quem falou."),
    contexto: z.string().trim().min(1, "Informe o contexto (cidade, tipo de obra)."),
    ativo: z.boolean(),
    autorizado: z.boolean(),
  }),
);

export async function salvarDepoimentos(
  _anterior: EstadoDoConteudo,
  formulario: FormData,
): Promise<EstadoDoConteudo> {
  const admin = await exigirAdmin();

  let bruto: unknown;
  try {
    bruto = JSON.parse(String(formulario.get("depoimentos") ?? "[]"));
  } catch {
    return { erro: "Não foi possível ler a lista." };
  }

  const analise = esquemaDeDepoimentos.safeParse(bruto);
  if (!analise.success) {
    return { erro: analise.error.issues[0]?.message ?? "Dados inválidos." };
  }
  const depoimentos = analise.data;

  const idsMantidos = depoimentos.map((d) => d.id).filter(Boolean);
  await prisma.depoimento.deleteMany({
    where: idsMantidos.length > 0 ? { id: { notIn: idsMantidos } } : {},
  });

  for (const [ordem, depoimento] of depoimentos.entries()) {
    const campos = {
      citacao: depoimento.citacao,
      nome: depoimento.nome,
      contexto: depoimento.contexto,
      ativo: depoimento.ativo,
      autorizado: depoimento.autorizado,
      ordem,
    };
    if (depoimento.id) {
      await prisma.depoimento.update({ where: { id: depoimento.id }, data: campos });
    } else {
      await prisma.depoimento.create({ data: campos });
    }
  }

  await registrarAtividade("Atualizou os depoimentos", admin.nome);
  // Os depoimentos vêm do banco só na Home.
  revalidatePath("/");
  return { ok: true };
}

// --- Dados institucionais ---------------------------------------------------

const esquemaDeContato = z.object({
  telefone: z.string().trim().min(1, "Informe o telefone."),
  telefoneLink: z.string().trim().min(1, "Informe o link do telefone."),
  whatsapp: z.string().trim().url("O WhatsApp precisa ser um endereço completo."),
  email: z.string().trim().email("Informe um e-mail válido."),
  instagram: z.string().trim().min(1, "Informe o @ do Instagram."),
  instagramUrl: z.string().trim().url("O Instagram precisa ser um endereço completo."),
  horario: z.string().trim().min(1, "Informe o horário de atendimento."),
  atendimento: z.string().trim().min(1, "Informe a área de atendimento."),
  cidade: z.string().trim().min(1, "Informe a cidade."),
  cnpj: z.string().trim().min(1, "Informe o CNPJ."),
});

export async function salvarContato(
  _anterior: EstadoDoConteudo,
  formulario: FormData,
): Promise<EstadoDoConteudo> {
  const admin = await exigirAdmin();

  const analise = esquemaDeContato.safeParse({
    telefone: formulario.get("telefone"),
    telefoneLink: formulario.get("telefoneLink"),
    whatsapp: formulario.get("whatsapp"),
    email: formulario.get("email"),
    instagram: formulario.get("instagram"),
    instagramUrl: formulario.get("instagramUrl"),
    horario: formulario.get("horario"),
    atendimento: formulario.get("atendimento"),
    cidade: formulario.get("cidade"),
    cnpj: formulario.get("cnpj"),
  });

  if (!analise.success) {
    return { erro: analise.error.issues[0]?.message ?? "Dados inválidos." };
  }

  await prisma.configuracaoSite.upsert({
    where: { id: "singleton" },
    update: analise.data,
    create: { id: "singleton", ...analise.data },
  });

  await registrarAtividade("Atualizou os dados institucionais", admin.nome);
  // Rodapé, navbar e botão de WhatsApp estão no layout: invalida toda página
  // que passa por ele, em vez de uma lista de rotas que fica velha quando
  // alguém cria uma página nova.
  revalidatePath("/", "layout");
  return { ok: true };
}
