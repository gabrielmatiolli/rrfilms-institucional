/**
 * Eventos para o Google Tag Manager — só `dataLayer.push`.
 *
 * Toda a mensuração mora no GTM: as tags de GA4, Meta e Google Ads lá dentro
 * escutam estes eventos. O site não chama `gtag()` nem `fbq()` diretamente —
 * fazer isso duplicava as contagens.
 *
 * Nenhum dado pessoal (nome, e-mail, telefone) sai daqui: Google e Meta proíbem
 * receber isso em evento comum. E nada sai sem o aceite no aviso de cookies —
 * nem para o dataLayer, senão o GTM processaria o evento se o visitante
 * aceitasse depois.
 */

import { lerEscolha } from "@/lib/consentimento";

export type FormularioDeOrcamento = "contato" | "empresas";

/**
 * Pedido de orçamento enviado e salvo. Chame só depois da confirmação do
 * servidor, nunca no clique do botão.
 */
export function registrarPedidoDeOrcamento(formulario: FormularioDeOrcamento) {
  if (typeof window === "undefined" || lerEscolha() !== "aceito") return;

  // Acionador no GTM: Evento personalizado = generate_lead.
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event: "generate_lead", formulario });
}

export type CanalDeContato = "whatsapp" | "telefone" | "email";

/** Clique num link de WhatsApp, telefone ou e-mail. */
export function registrarCliqueDeContato(canal: CanalDeContato, local: string) {
  if (typeof window === "undefined" || lerEscolha() !== "aceito") return;

  // Acionador no GTM: Evento personalizado = clique_contato.
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event: "clique_contato", canal, local });
}
