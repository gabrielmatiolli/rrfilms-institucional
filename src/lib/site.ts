import { COBERTURA, DESDE, LINHAS, MANUTENCAO } from "@/content/linhas";

/**
 * Dados institucionais da RR Film.
 *
 * Os textos vêm do arquivo Figma "RR Films", do brandbook da MDPL Brands e da
 * revisão de copy de 28/10/2026. A idade da empresa nunca aparece em anos
 * ("29 anos"), sempre como "desde 1997": o número envelhece sozinho e o texto
 * do site não.
 */

export const site = {
  nome: "RR Film",
  complemento: "Tecnologia em Películas.",
  slogan: "Conforto que você sente.",
  fundacao: DESDE,
  cidade: "Itatiba, SP",
  url: "https://www.rrfilm.com.br",
  urlCurta: "www.rrfilm.com.br",
  instagram: "@rrfilmdecor",
  instagramUrl: "https://www.instagram.com/rrfilmdecor",
  email: "contato@rrfilm.com.br",
  telefone: "(11) 97374-2600",
  telefoneLink: "tel:+5511973742600",
  whatsapp: "https://wa.me/5511973742600",
  horario: "Segunda a sexta, das 8h às 18h",
  atendimento: `Atendimento em ${COBERTURA}`,
  cnpj: "60.356.183/0001-04",
  identidade: "Realizado por: MDPL Brands",
  pilares: ["Conforto", "Segurança", "Privacidade", "Decor"],
} as const;

// O link do WhatsApp com mensagem pronta mora em src/lib/dados/configuracao.ts:
// o número é editável pelo painel, e montar o link a partir daqui ignoraria isso.

/**
 * O submenu de "Serviços": as quatro linhas mais a manutenção, na ordem do
 * portfólio. Sai de src/content/linhas.ts para o menu, os cards e o rodapé
 * nunca divergirem de nome ou de URL.
 */
export const menuDeServicos = [
  ...LINHAS.map((linha) => ({ rotulo: linha.nomeCurto, href: linha.url })),
  { rotulo: MANUTENCAO.nomeCurto, href: MANUTENCAO.url },
] as const;

export const navegacao = [
  { rotulo: "Serviços", href: "/servicos", submenu: menuDeServicos },
  { rotulo: "Para casas", href: "/para-casas" },
  { rotulo: "Para empresas", href: "/para-empresas" },
  { rotulo: "A marca", href: "/a-marca" },
  { rotulo: "Blog", href: "/blog" },
  { rotulo: "Contato", href: "/contato" },
] as const;

export const rodape = {
  descricao: `${site.nome} – ${site.complemento} Desde ${DESDE} protegendo casas e empresas do interior de São Paulo com conforto térmico, proteção UV, segurança e privacidade. Medição no local, instalação própria e garantia.`,
  colunas: [
    {
      titulo: "Películas",
      itens: menuDeServicos,
    },
    {
      titulo: "Soluções",
      itens: [
        { rotulo: "Para casas", href: "/para-casas" },
        { rotulo: "Para empresas", href: "/para-empresas" },
        { rotulo: "Clínicas e consultórios", href: "/para-empresas#clinicas" },
        { rotulo: "Arquitetos e vidraçarias", href: "/para-empresas#arquitetos" },
      ],
    },
    {
      titulo: "Institucional",
      itens: [
        { rotulo: "A marca", href: "/a-marca" },
        { rotulo: "Blog", href: "/blog" },
        { rotulo: "Contato", href: "/contato" },
        { rotulo: "Política de privacidade", href: "/politica-de-privacidade" },
        { rotulo: "Política de cookies", href: "/politica-de-cookies" },
      ],
    },
  ],
} as const;
