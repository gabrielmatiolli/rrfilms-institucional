import "server-only";
import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { conferirSessao, type DadosDaSessao } from "@/lib/admin/autenticacao";
import type { AdminRole } from "@/generated/prisma/client";

export const COOKIE_DE_SESSAO = "rrfilm_admin";

export interface AdminLogado {
  id: string;
  nome: string;
  email: string;
  papel: AdminRole;
}

/** Só confere a assinatura do cookie — não toca no banco. */
export const lerSessao = cache(async (): Promise<DadosDaSessao | null> => {
  const token = (await cookies()).get(COOKIE_DE_SESSAO)?.value;
  if (!token) return null;
  return conferirSessao(token);
});

/**
 * Sessão validada contra o banco: confere se a conta ainda existe, continua
 * ativa e se o token não foi invalidado em bloco (versaoSessao). Memoizado por
 * request — vários Server Components na mesma request fazem uma consulta só.
 */
export const usuarioLogado = cache(async (): Promise<AdminLogado | null> => {
  const dados = await lerSessao();
  if (!dados) return null;

  const usuario = await prisma.adminUser.findUnique({
    where: { id: dados.sub },
    select: { id: true, nome: true, email: true, papel: true, ativo: true, versaoSessao: true },
  });

  if (!usuario || !usuario.ativo) return null;
  // Token emitido antes de uma troca de senha ou de um "sair de todos os
  // dispositivos" — recusa mesmo estando dentro da validade.
  if (usuario.versaoSessao !== dados.ver) return null;

  return { id: usuario.id, nome: usuario.nome, email: usuario.email, papel: usuario.papel };
});

/**
 * Use no início de toda página e Server Action do painel. Redireciona para o
 * login quando não há sessão válida, guardando o destino em `?de=`.
 */
export async function exigirAdmin(de?: string): Promise<AdminLogado> {
  const usuario = await usuarioLogado();
  if (!usuario) {
    redirect(de ? `/admin/login?de=${encodeURIComponent(de)}` : "/admin/login");
  }
  return usuario;
}

/** Ações restritas ao papel DONO — gestão de contas de acesso. */
export async function exigirDono(): Promise<AdminLogado> {
  const usuario = await exigirAdmin();
  if (usuario.papel !== "DONO") redirect("/admin");
  return usuario;
}
