import { COBERTURA, CIDADES_ATENDIDAS, DESDE } from "@/content/linhas";
import type { Duvida } from "@/components/ui/Faq";
import type { ContatoDoSite } from "@/lib/dados/configuracao";
import { site } from "@/lib/site";

/**
 * Dados estruturados (schema.org) do site.
 *
 * O checklist de SEO da revisão de copy pede LocalBusiness no site todo,
 * Service nas páginas de produto, FAQPage nos blocos de dúvidas e
 * BreadcrumbList. Montar o JSON aqui — e não em cada página — mantém endereço,
 * telefone e área de atendimento iguais em todos os marcadores.
 *
 * Os objetos saem como `Record<string, unknown>` de propósito: quem desenha é o
 * componente DadosEstruturados, que serializa escapando "<".
 */

export type Esquema = Record<string, unknown>;

/** A empresa. Vai no layout do site público, uma vez por página. */
export function esquemaDeNegocio(contato: ContatoDoSite): Esquema {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${site.url}/#negocio`,
    name: site.nome,
    description: `Películas para vidro de casas e empresas desde ${DESDE}. Conforto térmico, proteção UV, segurança antiestilhaço e privacidade.`,
    url: site.url,
    telephone: contato.telefoneLink.replace("tel:", ""),
    email: contato.email,
    foundingDate: String(DESDE),
    address: {
      "@type": "PostalAddress",
      addressLocality: "Itatiba",
      addressRegion: "SP",
      addressCountry: "BR",
    },
    areaServed: CIDADES_ATENDIDAS.map((cidade) => ({
      "@type": "City",
      name: cidade,
    })),
    sameAs: [contato.instagramUrl],
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "08:00",
      closes: "18:00",
    },
  };
}

/** Uma linha de película ou o serviço de manutenção. */
export function esquemaDeServico({
  nome,
  descricao,
  url,
}: {
  nome: string;
  descricao: string;
  url: string;
}): Esquema {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: nome,
    description: descricao,
    url: `${site.url}${url}`,
    serviceType: "Aplicação de película para vidro",
    areaServed: COBERTURA,
    provider: { "@id": `${site.url}/#negocio` },
  };
}

/** Bloco de dúvidas. Só marque o que está visível na página. */
export function esquemaDeFaq(duvidas: readonly Duvida[]): Esquema {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: duvidas.map((duvida) => ({
      "@type": "Question",
      name: duvida.pergunta,
      acceptedAnswer: { "@type": "Answer", text: duvida.resposta },
    })),
  };
}

/** A trilha de navegação, na mesma ordem do breadcrumb desenhado na página. */
export function esquemaDeTrilha(
  trilha: readonly { rotulo: string; href?: string }[],
): Esquema {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trilha.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.rotulo,
      ...(item.href ? { item: `${site.url}${item.href}` } : {}),
    })),
  };
}
