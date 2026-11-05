/**
 * Eventos para o Google Tag Manager — só `dataLayer.push`.
 *
 * Toda a mensuração mora no GTM: as tags de GA4, Meta e Google Ads lá dentro
 * escutam estes eventos. O site não chama `gtag()` nem `fbq()` diretamente —
 * fazer isso duplicava as contagens.
 *
 * Os nomes são os da revisão de copy de 28/10/2026: `click_whatsapp`,
 * `click_telefone` e `envio_formulario`. Eles SUBSTITUEM `clique_contato` e
 * `generate_lead` — o contêiner do GTM precisa reapontar os acionadores no
 * mesmo deploy, senão a conversão para de ser contada. Emitir os dois nomes
 * juntos resolveria o prazo e criaria o problema pior: conversão contada em
 * dobro no Google Ads.
 *
 * Nenhum dado pessoal (nome, e-mail, telefone) sai daqui: Google e Meta proíbem
 * receber isso em evento comum. E nada sai sem o aceite no aviso de cookies —
 * nem para o dataLayer, senão o GTM processaria o evento se o visitante
 * aceitasse depois.
 */

import { lerEscolha } from "@/lib/consentimento";

/** Empurra no dataLayer só com consentimento e só no navegador. */
function empurrar(evento: Record<string, unknown>) {
  if (typeof window === "undefined" || lerEscolha() !== "aceito") return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(evento);
}

export type FormularioDeOrcamento = "contato" | "empresas";

/**
 * Pedido de orçamento enviado e salvo. Chame só depois da confirmação do
 * servidor, nunca no clique do botão.
 *
 * `publico` e `interesse` são os campos "Para onde é a película?" e "O que você
 * procura?" — é o que o documento pede para o GTM poder separar lead de casa
 * de lead de empresa sem olhar o painel.
 */
export function registrarPedidoDeOrcamento(
  formulario: FormularioDeOrcamento,
  campos?: { publico?: string; interesse?: string },
) {
  // Acionador no GTM: Evento personalizado = envio_formulario.
  empurrar({
    event: "envio_formulario",
    formulario,
    publico: campos?.publico || undefined,
    interesse: campos?.interesse || undefined,
  });
}

export type CanalDeContato = "whatsapp" | "telefone" | "email";

const EVENTO_POR_CANAL: Record<CanalDeContato, string> = {
  whatsapp: "click_whatsapp",
  telefone: "click_telefone",
  email: "click_email",
};

/**
 * Clique num link de WhatsApp, telefone ou e-mail.
 *
 * `produto` e `publico` vêm dos atributos `data-produto` / `data-publico` do
 * próprio botão (ver BotaoDeWhatsapp): é como o GTM sabe que o clique saiu do
 * bloco "Para sua empresa" da página da Refletiva, e não do botão flutuante.
 */
export function registrarCliqueDeContato(
  canal: CanalDeContato,
  local: string,
  rastreio?: { produto?: string; publico?: string },
) {
  empurrar({
    event: EVENTO_POR_CANAL[canal],
    canal,
    local,
    produto: rastreio?.produto || undefined,
    publico: rastreio?.publico || undefined,
  });
}
