import "server-only";
import { prisma } from "@/lib/prisma";

/**
 * Registra uma linha no feed de atividade do painel. Nunca deve derrubar a
 * ação que a chamou — o log é secundário ao que o usuário pediu.
 */
export async function registrarAtividade(mensagem: string, autor?: string) {
  try {
    await prisma.activityLog.create({ data: { mensagem, autor } });
  } catch (erro) {
    console.error("Falha ao registrar atividade:", erro);
  }
}
