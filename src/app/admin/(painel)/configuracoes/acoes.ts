"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { exigirAdmin, exigirDono, COOKIE_DE_SESSAO } from "@/lib/admin/sessao";
import {
  assinarSessao,
  conferirSenha,
  criticarSenha,
  gerarHashDeSenha,
} from "@/lib/admin/autenticacao";
import { registrarAtividade } from "@/lib/admin/atividade";

export interface EstadoDaConta {
  erro?: string;
  ok?: string;
}

// --- Senha da própria conta -------------------------------------------------

const esquemaDeSenha = z
  .object({
    senhaAtual: z.string().min(1, "Informe a senha atual."),
    senhaNova: z.string().min(1, "Informe a senha nova."),
    confirmacao: z.string().min(1, "Repita a senha nova."),
  })
  .refine((dados) => dados.senhaNova === dados.confirmacao, {
    message: "A confirmação não bate com a senha nova.",
  });

export async function trocarSenha(
  _anterior: EstadoDaConta,
  formulario: FormData,
): Promise<EstadoDaConta> {
  const admin = await exigirAdmin();

  const analise = esquemaDeSenha.safeParse({
    senhaAtual: formulario.get("senhaAtual"),
    senhaNova: formulario.get("senhaNova"),
    confirmacao: formulario.get("confirmacao"),
  });
  if (!analise.success) {
    return { erro: analise.error.issues[0]?.message ?? "Dados inválidos." };
  }
  const { senhaAtual, senhaNova } = analise.data;

  const critica = criticarSenha(senhaNova);
  if (critica) return { erro: critica };

  const usuario = await prisma.adminUser.findUnique({ where: { id: admin.id } });
  if (!usuario) return { erro: "Conta não encontrada." };

  if (!(await conferirSenha(senhaAtual, usuario.passwordHash))) {
    return { erro: "A senha atual está incorreta." };
  }
  if (await conferirSenha(senhaNova, usuario.passwordHash)) {
    return { erro: "A senha nova precisa ser diferente da atual." };
  }

  // Subir a versão derruba todas as sessões já emitidas para esta conta —
  // inclusive a que está fazendo a troca, que é reemitida logo abaixo.
  const atualizado = await prisma.adminUser.update({
    where: { id: usuario.id },
    data: {
      passwordHash: await gerarHashDeSenha(senhaNova),
      versaoSessao: { increment: 1 },
    },
  });

  const token = await assinarSessao(
    {
      sub: atualizado.id,
      nome: atualizado.nome,
      email: atualizado.email,
      papel: atualizado.papel,
      ver: atualizado.versaoSessao,
    },
    "12h",
  );
  (await cookies()).set(COOKIE_DE_SESSAO, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });

  await registrarAtividade("Trocou a própria senha", admin.nome);
  return { ok: "Senha trocada. Os outros dispositivos foram desconectados." };
}

// --- Contas de acesso (só DONO) --------------------------------------------

const esquemaDeUsuario = z.object({
  nome: z.string().trim().min(1, "Informe o nome.").max(80),
  email: z.string().trim().toLowerCase().email("Informe um e-mail válido."),
  senha: z.string().min(1, "Informe a senha inicial."),
  papel: z.enum(["DONO", "EDITOR"]),
});

export async function criarUsuario(
  _anterior: EstadoDaConta,
  formulario: FormData,
): Promise<EstadoDaConta> {
  const dono = await exigirDono();

  const analise = esquemaDeUsuario.safeParse({
    nome: formulario.get("nome"),
    email: formulario.get("email"),
    senha: formulario.get("senha"),
    papel: formulario.get("papel"),
  });
  if (!analise.success) {
    return { erro: analise.error.issues[0]?.message ?? "Dados inválidos." };
  }
  const dados = analise.data;

  const critica = criticarSenha(dados.senha);
  if (critica) return { erro: critica };

  const jaExiste = await prisma.adminUser.findUnique({
    where: { email: dados.email },
    select: { id: true },
  });
  if (jaExiste) return { erro: "Já existe uma conta com esse e-mail." };

  await prisma.adminUser.create({
    data: {
      nome: dados.nome,
      email: dados.email,
      papel: dados.papel,
      passwordHash: await gerarHashDeSenha(dados.senha),
    },
  });

  await registrarAtividade(`Criou a conta de acesso "${dados.email}"`, dono.nome);
  revalidatePath("/admin/configuracoes");
  return { ok: `Conta de ${dados.nome} criada.` };
}

export async function redefinirSenhaDeUsuario(
  _anterior: EstadoDaConta,
  formulario: FormData,
): Promise<EstadoDaConta> {
  const dono = await exigirDono();

  const id = String(formulario.get("id") ?? "");
  const senha = String(formulario.get("senha") ?? "");
  if (!id) return { erro: "Conta não encontrada." };

  const critica = criticarSenha(senha);
  if (critica) return { erro: critica };

  const usuario = await prisma.adminUser.findUnique({ where: { id } });
  if (!usuario) return { erro: "Conta não encontrada." };

  await prisma.adminUser.update({
    where: { id },
    data: {
      passwordHash: await gerarHashDeSenha(senha),
      // Redefinir senha desconecta a pessoa de todos os dispositivos e tira a
      // conta de um eventual bloqueio por tentativas.
      versaoSessao: { increment: 1 },
      tentativasFalhas: 0,
      bloqueadoAte: null,
    },
  });

  await registrarAtividade(`Redefiniu a senha de "${usuario.email}"`, dono.nome);
  revalidatePath("/admin/configuracoes");
  return { ok: `Senha de ${usuario.nome} redefinida.` };
}

export async function alternarAtivoDoUsuario(formulario: FormData) {
  const dono = await exigirDono();
  const id = String(formulario.get("id") ?? "");
  if (!id || id === dono.id) return;

  const usuario = await prisma.adminUser.findUnique({ where: { id } });
  if (!usuario) return;

  await prisma.adminUser.update({
    where: { id },
    data: {
      ativo: !usuario.ativo,
      // Desativar precisa cortar as sessões abertas na hora.
      versaoSessao: usuario.ativo ? { increment: 1 } : undefined,
    },
  });

  await registrarAtividade(
    `${usuario.ativo ? "Desativou" : "Reativou"} a conta "${usuario.email}"`,
    dono.nome,
  );
  revalidatePath("/admin/configuracoes");
}

export async function excluirUsuario(formulario: FormData) {
  const dono = await exigirDono();
  const id = String(formulario.get("id") ?? "");
  // Ninguém exclui a própria conta — é assim que o painel fica sem dono.
  if (!id || id === dono.id) return;

  const usuario = await prisma.adminUser.delete({ where: { id } });
  await registrarAtividade(`Excluiu a conta "${usuario.email}"`, dono.nome);
  revalidatePath("/admin/configuracoes");
}

/** Derruba as sessões da própria conta em todos os dispositivos. */
export async function sairDeTodosOsDispositivos() {
  const admin = await exigirAdmin();

  await prisma.adminUser.update({
    where: { id: admin.id },
    data: { versaoSessao: { increment: 1 } },
  });

  await registrarAtividade("Encerrou as sessões de todos os dispositivos", admin.nome);
  // Inclusive a deste navegador: entrar de novo é o que prova que a senha
  // continua nas mãos certas.
  (await cookies()).delete(COOKIE_DE_SESSAO);
  redirect("/admin/login");
}
