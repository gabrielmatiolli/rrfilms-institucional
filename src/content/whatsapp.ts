/**
 * As mensagens pré-preenchidas dos botões de WhatsApp, por página e por bloco.
 *
 * Cada botão do site carrega a mensagem do seu contexto: quem clica na coluna
 * "Para sua empresa" da página da Refletiva já abre a conversa falando de
 * escritório. Os códigos são os da revisão de copy da MDPL Brands — mantê-los
 * no código permite conferir a tabela do documento contra o site.
 *
 * O link é montado por `whatsappCom()` (src/lib/dados/configuracao.ts), que usa
 * o número editável no painel e codifica a mensagem na URL.
 */

export const MENSAGENS_DE_WHATSAPP = {
  "WA-GERAL":
    "Olá! Vim pelo site da RR Film e quero agendar uma medição gratuita.",
  "WA-NANO-CASA":
    "Olá! Quero saber sobre a Película Nanocerâmica para a minha casa.",
  "WA-NANO-EMP":
    "Olá! Quero saber sobre a Película Nanocerâmica para a minha empresa.",
  "WA-SEG-CASA":
    "Olá! Quero saber sobre a película antiestilhaço para a minha casa.",
  "WA-SEG-EMP":
    "Olá! Quero saber sobre a película de segurança para a minha empresa.",
  "WA-REF-CASA":
    "Olá! Quero saber sobre a película refletiva para dar privacidade à minha casa.",
  "WA-REF-EMP":
    "Olá! Quero saber sobre a película refletiva para o meu escritório.",
  "WA-JAT-CASA": "Olá! Quero saber sobre o vinil jateado para a minha casa.",
  "WA-JAT-EMP":
    "Olá! Quero saber sobre o vinil jateado para divisórias da minha empresa.",
  "WA-MANUT": "Olá! Preciso remover ou trocar uma película.",
  "WA-CASAS":
    "Olá! Quero conforto nas janelas da minha casa e gostaria de agendar uma medição.",
  "WA-EMP": "Olá! Represento uma empresa e quero agendar uma visita técnica.",
} as const;

export type CodigoDeWhatsapp = keyof typeof MENSAGENS_DE_WHATSAPP;

/**
 * O par `data-produto` / `data-publico` que o Google Tag Manager lê em cada CTA.
 * Derivado do código: um botão novo não pode entrar sem classificação.
 */
const RASTREIO: Record<CodigoDeWhatsapp, { produto: string; publico: string }> = {
  "WA-GERAL": { produto: "geral", publico: "geral" },
  "WA-NANO-CASA": { produto: "nanoceramica", publico: "casa" },
  "WA-NANO-EMP": { produto: "nanoceramica", publico: "empresa" },
  "WA-SEG-CASA": { produto: "seguranca", publico: "casa" },
  "WA-SEG-EMP": { produto: "seguranca", publico: "empresa" },
  "WA-REF-CASA": { produto: "refletiva", publico: "casa" },
  "WA-REF-EMP": { produto: "refletiva", publico: "empresa" },
  "WA-JAT-CASA": { produto: "jateado", publico: "casa" },
  "WA-JAT-EMP": { produto: "jateado", publico: "empresa" },
  "WA-MANUT": { produto: "manutencao", publico: "geral" },
  "WA-CASAS": { produto: "geral", publico: "casa" },
  "WA-EMP": { produto: "geral", publico: "empresa" },
};

export function mensagemDeWhatsapp(codigo: CodigoDeWhatsapp) {
  return MENSAGENS_DE_WHATSAPP[codigo];
}

export function rastreioDeWhatsapp(codigo: CodigoDeWhatsapp) {
  return RASTREIO[codigo];
}
