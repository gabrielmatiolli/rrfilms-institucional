/**
 * Dados institucionais da RR Film.
 * Os textos vêm do arquivo Figma "RR Films" e do brandbook da MDPL Brands.
 */

export const site = {
  nome: "RR Film",
  complemento: "Tecnologia em Películas.",
  slogan: "Conforto que você sente.",
  fundacao: 1997,
  cidade: "Itatiba, SP",
  url: "https://www.rrfilm.com.br",
  urlCurta: "www.rrfilm.com.br",
  instagram: "@rrfilmdecor",
  instagramUrl: "https://www.instagram.com/rrfilmdecor",
  email: "contato@rrfilm.com.br",
  telefone: "(11) 97374-2600",
  telefoneLink: "tel:+5511973742600",
  whatsapp: "https://wa.me/5511973742600",
  horario: "Seg a sex, 8h às 18h",
  atendimento: "Itatiba, SP — atendimento em toda a região",
  cnpj: "00.000.000/0001-00",
  identidade: "Identidade por MDPL Brands",
  pilares: ["Conforto", "Segurança", "Privacidade", "Decor"],
} as const;

// O link do WhatsApp com mensagem pronta mora em src/lib/dados/configuracao.ts:
// o número é editável pelo painel, e montar o link a partir daqui ignoraria isso.

export const navegacao = [
  { rotulo: "Serviços", href: "/servicos" },
  { rotulo: "Para casas", href: "/para-casas" },
  { rotulo: "Para empresas", href: "/para-empresas" },
  { rotulo: "Blog", href: "/blog" },
  { rotulo: "Contato", href: "/contato" },
  { rotulo: "A marca", href: "/a-marca" },
] as const;

export const rodape = {
  descricao:
    "Tecnologia em películas para vidro, com foco residencial e soluções sob medida para empresas. Diagnóstico no local, instalação própria e garantia.",
  colunas: [
    {
      titulo: "Serviços",
      itens: [
        { rotulo: "Nanocerâmica Ultra HD", href: "/produtos/nanoceramica-ultra-hd" },
        { rotulo: "Segurança antiestilhaço", href: "/servicos#seguranca" },
        { rotulo: "Refletiva Black Silver", href: "/servicos#refletiva" },
        { rotulo: "Decorativa e jateada", href: "/servicos#decorativa" },
        { rotulo: "Linha Smart", href: "/servicos#smart" },
        { rotulo: "Manutenção e reposição", href: "/servicos#manutencao" },
      ],
    },
    {
      titulo: "Soluções",
      itens: [
        { rotulo: "Para casas", href: "/para-casas" },
        { rotulo: "Para empresas", href: "/para-empresas" },
        { rotulo: "Fachadas e retrofit", href: "/para-empresas#solucoes" },
        { rotulo: "Arquitetos e vidraçarias", href: "/para-empresas#diferenciais" },
      ],
    },
    {
      titulo: "Institucional",
      itens: [
        { rotulo: "A marca", href: "/a-marca" },
        { rotulo: "Blog", href: "/blog" },
        { rotulo: "Trabalhe conosco", href: "/contato" },
        { rotulo: "Política de privacidade", href: "/contato" },
      ],
    },
  ],
} as const;
