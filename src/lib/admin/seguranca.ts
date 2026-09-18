import "server-only";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { registrarAtividade } from "@/lib/admin/atividade";
import { LoginAttemptReason } from "@/generated/prisma/client";

const MAX_TENTATIVAS_CONTA = 5;
const BLOQUEIO_DA_CONTA_MS = 15 * 60 * 1000;
const MAX_TENTATIVAS_IP = 20;
const JANELA_DO_IP_MS = 15 * 60 * 1000;

export async function ipDoCliente(): Promise<string> {
  const cabecalhos = await headers();
  const encaminhado = cabecalhos.get("x-forwarded-for")?.split(",")[0]?.trim();
  if (encaminhado) return encaminhado;
  return cabecalhos.get("x-real-ip")?.trim() || "desconhecido";
}

/**
 * "desconhecido" fica isento — se o proxy não repassar o IP real, não dá pra
 * deixar o site inteiro compartilhar o mesmo balde de tentativas.
 */
export async function ipBloqueado(ip: string): Promise<boolean> {
  if (ip === "desconhecido") return false;

  const desde = new Date(Date.now() - JANELA_DO_IP_MS);
  const falhas = await prisma.loginAttempt.count({
    where: { ip, sucesso: false, criadoEm: { gte: desde } },
  });
  return falhas >= MAX_TENTATIVAS_IP;
}

interface TentativaDeLogin {
  email: string;
  ip: string;
  sucesso: boolean;
  motivo: LoginAttemptReason;
}

export async function registrarTentativa(tentativa: TentativaDeLogin) {
  try {
    const userAgent = (await headers()).get("user-agent");
    await prisma.loginAttempt.create({ data: { ...tentativa, userAgent } });
  } catch (erro) {
    console.error("Falha ao registrar tentativa de login:", erro);
  }
}

/**
 * Incrementa o contador de tentativas erradas da conta e bloqueia ao atingir o
 * limite — zerando o contador junto, pra a conta sair do bloqueio com um limite
 * novo em vez de travar de novo na primeira tentativa seguinte.
 */
export async function contarFalhaDaConta(usuarioId: string, email: string): Promise<void> {
  try {
    const atualizado = await prisma.adminUser.update({
      where: { id: usuarioId },
      data: { tentativasFalhas: { increment: 1 } },
      select: { tentativasFalhas: true },
    });

    if (atualizado.tentativasFalhas >= MAX_TENTATIVAS_CONTA) {
      await prisma.adminUser.update({
        where: { id: usuarioId },
        data: {
          tentativasFalhas: 0,
          bloqueadoAte: new Date(Date.now() + BLOQUEIO_DA_CONTA_MS),
        },
      });
      await registrarAtividade(`Conta "${email}" bloqueada por 15 minutos após 5 tentativas`);
    }
  } catch (erro) {
    console.error("Falha ao contabilizar tentativa inválida:", erro);
  }
}

/** Limpa tentativas antigas — chamado no login bem-sucedido, sem bloquear. */
export async function limparTentativasAntigas(): Promise<void> {
  const limite = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
  await prisma.loginAttempt.deleteMany({ where: { criadoEm: { lt: limite } } });
}
