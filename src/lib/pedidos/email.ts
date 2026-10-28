import "server-only";
import nodemailer from "nodemailer";

import type { PedidoDeOrcamento } from "@/generated/prisma/client";
import { formatarTelefone, linkDoWhatsapp } from "@/lib/pedidos/esquema";
import { dataEHora } from "@/lib/datas";
import { site } from "@/lib/site";

/**
 * Aviso por e-mail de pedido novo, pelo SMTP da caixa de e-mail da RR Film
 * (na Hostinger: smtp.hostinger.com, porta 465).
 *
 * Sem SMTP configurado não envia e não quebra nada: o pedido já está salvo e
 * aparece em /admin/pedidos de qualquer jeito.
 */

function configuracao() {
  const host = process.env.SMTP_HOST?.trim();
  const usuario = process.env.SMTP_USUARIO?.trim();
  const senha = process.env.SMTP_SENHA;
  if (!host || !usuario || !senha) return null;

  const porta = Number(process.env.SMTP_PORTA || 465);
  return { host, porta, usuario, senha };
}

const ROTULO_DO_DETALHE = { CONTATO: "Tipo de imóvel", EMPRESAS: "Metragem de vidro" } as const;
const ROTULO_DA_ORIGEM = { CONTATO: "Contato", EMPRESAS: "Para empresas" } as const;

function escapar(texto: string) {
  return texto.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);
}

/**
 * Envia o aviso para PEDIDOS_EMAIL_PARA (ou o e-mail de contato do painel).
 * Devolve true quando o servidor de e-mail aceitou a mensagem.
 */
export async function avisarPedidoPorEmail(
  pedido: PedidoDeOrcamento,
  destinoPadrao: string,
): Promise<boolean> {
  const smtp = configuracao();
  if (!smtp) {
    console.warn("SMTP não configurado: pedido salvo sem aviso por e-mail. Veja o .env.example.");
    return false;
  }

  const para = process.env.PEDIDOS_EMAIL_PARA?.trim() || destinoPadrao;
  const telefone = formatarTelefone(pedido.whatsapp);

  const linhas: [string, string][] = [
    [pedido.origem === "EMPRESAS" ? "Empresa" : "Nome", pedido.nome],
    ["WhatsApp", telefone],
    ["E-mail", pedido.email],
    [ROTULO_DO_DETALHE[pedido.origem], pedido.detalhe ?? "Não informado"],
    ["Aceita orçamento por WhatsApp", pedido.aceitaWhatsapp ? "Sim" : "Não"],
    ["Recebido em", dataEHora(pedido.criadoEm)],
  ];
  if (pedido.mensagem) linhas.push(["Sobre o vidro", pedido.mensagem]);

  const texto = [
    `Pedido de orçamento pelo site (${ROTULO_DA_ORIGEM[pedido.origem]})`,
    "",
    ...linhas.map(([rotulo, valor]) => `${rotulo}: ${valor}`),
    "",
    `Responder no WhatsApp: ${linkDoWhatsapp(pedido.whatsapp)}`,
    `Ver no painel: ${site.url}/admin/pedidos`,
  ].join("\n");

  const html = `
    <p style="font-family:Arial,sans-serif;font-size:15px">Pedido de orçamento pelo site (${ROTULO_DA_ORIGEM[pedido.origem]})</p>
    <table style="font-family:Arial,sans-serif;font-size:14px;border-collapse:collapse">
      ${linhas
        .map(
          ([rotulo, valor]) =>
            `<tr><td style="padding:6px 16px 6px 0;color:#666;vertical-align:top">${escapar(rotulo)}</td><td style="padding:6px 0;white-space:pre-wrap">${escapar(valor)}</td></tr>`,
        )
        .join("")}
    </table>
    <p style="font-family:Arial,sans-serif;font-size:14px">
      <a href="${linkDoWhatsapp(pedido.whatsapp)}">Responder no WhatsApp</a> ·
      <a href="${site.url}/admin/pedidos">Ver no painel</a>
    </p>`;

  try {
    const transporte = nodemailer.createTransport({
      host: smtp.host,
      port: smtp.porta,
      secure: smtp.porta === 465,
      auth: { user: smtp.usuario, pass: smtp.senha },
      connectionTimeout: 10_000,
      greetingTimeout: 10_000,
      socketTimeout: 15_000,
    });

    await transporte.sendMail({
      from: `"Site ${site.nome}" <${smtp.usuario}>`,
      to: para,
      // "Responder" no e-mail vai direto para o cliente.
      replyTo: pedido.email,
      subject: `Novo pedido de orçamento: ${pedido.nome}`,
      text: texto,
      html,
    });
    return true;
  } catch (erro) {
    console.error("Falha ao enviar o aviso de pedido por e-mail:", erro);
    return false;
  }
}
