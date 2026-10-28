"use server";

import { after } from "next/server";
import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { ipDoCliente } from "@/lib/admin/seguranca";
import { contatoDoSite } from "@/lib/dados/configuracao";
import { avisarPedidoPorEmail } from "@/lib/pedidos/email";
import { esquemaDoPedido } from "@/lib/pedidos/esquema";

/**
 * Envio dos formulários de orçamento do site (/contato e /para-empresas).
 *
 * Ordem: valida → filtra robô → salva → responde. O e-mail para a equipe sai
 * depois da resposta (`after`), para o visitante não esperar o SMTP; se ele
 * falhar, o pedido continua salvo e aparece no painel.
 *
 * Sem captcha de propósito: é o formulário de conversão, e cada atrito ali custa
 * pedido. No lugar, três filtros que o visitante não vê — campo-isca, tempo
 * mínimo de preenchimento e limite de envios por IP.
 */

export type EstadoDoPedido =
  | { situacao: "inicial" }
  | { situacao: "erro"; mensagem: string }
  /** `id` muda a cada envio — é o que o formulário usa para disparar a conversão uma vez só. */
  | { situacao: "enviado"; id: string };

/** Menos que isso entre abrir a página e enviar é robô. */
const TEMPO_MINIMO_MS = 3_000;
const MAX_PEDIDOS_POR_IP = 5;
const JANELA_DO_IP_MS = 60 * 60 * 1000;

export async function enviarPedido(
  _anterior: EstadoDoPedido,
  formulario: FormData,
): Promise<EstadoDoPedido> {
  // Campo-isca: escondido de quem vê a página, preenchido por robô que preenche
  // tudo. Responde como sucesso para o robô não ter o que ajustar.
  if (String(formulario.get("site") ?? "") !== "") {
    return { situacao: "enviado", id: "ignorado" };
  }

  const abertoEm = Number(formulario.get("aberto_em"));
  if (!Number.isFinite(abertoEm) || Date.now() - abertoEm < TEMPO_MINIMO_MS) {
    return { situacao: "erro", mensagem: "Não foi possível enviar. Confira os campos e tente de novo." };
  }

  const analise = esquemaDoPedido.safeParse({
    origem: formulario.get("origem"),
    nome: formulario.get("nome") ?? "",
    whatsapp: formulario.get("whatsapp") ?? "",
    email: formulario.get("email") ?? "",
    detalhe: formulario.get("detalhe") ?? "",
    mensagem: formulario.get("origem") === "CONTATO" ? (formulario.get("mensagem") ?? "") : null,
    aceitaWhatsapp: formulario.get("aceita_whatsapp") === "on",
  });

  if (!analise.success) {
    return {
      situacao: "erro",
      mensagem: analise.error.issues[0]?.message ?? "Confira os campos e tente de novo.",
    };
  }

  const ip = await ipDoCliente();

  try {
    if (ip !== "desconhecido") {
      const recentes = await prisma.pedidoDeOrcamento.count({
        where: { ip, criadoEm: { gte: new Date(Date.now() - JANELA_DO_IP_MS) } },
      });
      if (recentes >= MAX_PEDIDOS_POR_IP) {
        return {
          situacao: "erro",
          mensagem: "Recebemos vários pedidos seguidos daqui. Fale com a gente pelo WhatsApp.",
        };
      }
    }

    const pedido = await prisma.pedidoDeOrcamento.create({ data: { ...analise.data, ip } });

    after(async () => {
      const contato = await contatoDoSite();
      const enviado = await avisarPedidoPorEmail(pedido, contato.email);
      if (enviado) {
        await prisma.pedidoDeOrcamento
          .update({ where: { id: pedido.id }, data: { emailEnviado: true } })
          .catch((erro) => console.error("Falha ao marcar o aviso como enviado:", erro));
      }
    });

    revalidatePath("/admin/pedidos");
    revalidatePath("/admin");
    return { situacao: "enviado", id: pedido.id };
  } catch (erro) {
    console.error("Falha ao salvar pedido de orçamento:", erro);
    return {
      situacao: "erro",
      mensagem: "Não conseguimos registrar seu pedido agora. Tente de novo ou fale pelo WhatsApp.",
    };
  }
}
