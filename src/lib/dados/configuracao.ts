import { cache } from "react";

import { prisma } from "@/lib/prisma";
import { site } from "@/lib/site";

export interface ContatoDoSite {
  telefone: string;
  telefoneLink: string;
  whatsapp: string;
  email: string;
  instagram: string;
  instagramUrl: string;
  horario: string;
  atendimento: string;
  cidade: string;
  cnpj: string;
}

/** Os valores de src/lib/site.ts, usados enquanto o banco não tem a linha. */
const PADRAO: ContatoDoSite = {
  telefone: site.telefone,
  telefoneLink: site.telefoneLink,
  whatsapp: site.whatsapp,
  email: site.email,
  instagram: site.instagram,
  instagramUrl: site.instagramUrl,
  horario: site.horario,
  atendimento: site.atendimento,
  cidade: site.cidade,
  cnpj: site.cnpj,
};

/**
 * Dados de contato editáveis pelo painel.
 *
 * Cai no padrão quando o banco não responde: uma falha de conexão não pode
 * derrubar o rodapé e o botão de WhatsApp do site inteiro.
 */
export const contatoDoSite = cache(async (): Promise<ContatoDoSite> => {
  try {
    const configuracao = await prisma.configuracaoSite.findUnique({
      where: { id: "singleton" },
    });
    if (!configuracao) return PADRAO;

    return {
      telefone: configuracao.telefone,
      telefoneLink: configuracao.telefoneLink,
      whatsapp: configuracao.whatsapp,
      email: configuracao.email,
      instagram: configuracao.instagram,
      instagramUrl: configuracao.instagramUrl,
      horario: configuracao.horario,
      atendimento: configuracao.atendimento,
      cidade: configuracao.cidade,
      cnpj: configuracao.cnpj,
    };
  } catch (erro) {
    console.error("Falha ao ler a configuração do site:", erro);
    return PADRAO;
  }
});

/** Link do WhatsApp com mensagem já preenchida, usando o número do painel. */
export function whatsappCom(numero: string, mensagem: string) {
  return `${numero}?text=${encodeURIComponent(mensagem)}`;
}
