"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { exigirAdmin } from "@/lib/admin/sessao";
import { registrarAtividade } from "@/lib/admin/atividade";

const STATUS = ["NOVO", "EM_ATENDIMENTO", "FECHADO", "DESCARTADO"] as const;

const ROTULO_DO_STATUS = {
  NOVO: "novo",
  EM_ATENDIMENTO: "em atendimento",
  FECHADO: "fechado",
  DESCARTADO: "descartado",
} as const;

function revalidarPedidos() {
  revalidatePath("/admin/pedidos");
  revalidatePath("/admin");
}

export async function alterarStatusDoPedido(formulario: FormData) {
  const admin = await exigirAdmin("/admin/pedidos");

  const analise = z
    .object({ id: z.string().min(1), status: z.enum(STATUS) })
    .safeParse({ id: formulario.get("id"), status: formulario.get("status") });
  if (!analise.success) return;

  const pedido = await prisma.pedidoDeOrcamento
    .update({
      where: { id: analise.data.id },
      data: { status: analise.data.status },
      select: { nome: true },
    })
    .catch(() => null);
  if (!pedido) return;

  await registrarAtividade(
    `Marcou o pedido de "${pedido.nome}" como ${ROTULO_DO_STATUS[analise.data.status]}`,
    admin.nome,
  );
  revalidarPedidos();
}

/** Exclusão definitiva — para quando o cliente pede para apagar os dados (LGPD). */
export async function excluirPedido(formulario: FormData) {
  const admin = await exigirAdmin("/admin/pedidos");

  const id = String(formulario.get("id") ?? "");
  if (!id) return;

  const pedido = await prisma.pedidoDeOrcamento
    .delete({ where: { id }, select: { nome: true } })
    .catch(() => null);
  if (!pedido) return;

  await registrarAtividade(`Excluiu o pedido de "${pedido.nome}"`, admin.nome);
  revalidarPedidos();
}
