import type { LinhaDeCard } from "@/components/cards/Cartoes";
import type { CaminhoDeImagem } from "@/lib/imagens";

/**
 * As quatro linhas de película da RR Film e o serviço de manutenção.
 *
 * Fonte única de propósito. A revisão de copy da MDPL Brands (28/10/2026) exige
 * que cada número apareça com o mesmo valor em todos os pontos de contato — e
 * com o número escrito em cada página, uma correção de ficha técnica passaria a
 * valer em algumas e não em outras. O site passa a falar em **quatro linhas**
 * (não "cinco" nem "seis"), mais a manutenção.
 *
 * Os valores de `NUMEROS` são os que a RR Film informou e dependem da ficha
 * técnica do fabricante: são os "[entre colchetes]" do documento. Trocar aqui
 * atualiza a Home, /servicos, as cinco internas, os dois hubs e o comparativo.
 */

export const NUMEROS = {
  /**
   * Conferidos no laudo técnico do fabricante (Sun Blue Nano Ceramic, relatório
   * de ensaio QUI/L-327.667/1/21), que a RR Film enviou em 04/11/2026.
   *
   * Dois valores que o documento de copy trazia entre colchetes não se
   * sustentaram e foram corrigidos para baixo: o bloqueio de UV era "99,6%" e o
   * laudo diz 99% (o ensaio mediu 98,87%); a rejeição de infravermelho era
   * "95%" e o laudo diz 90% (o ensaio mediu 90,2%–90,7%). Os outros dois
   * bateram: visibilidade de 70% e garantia de 15 anos.
   */
  nanoceramica: {
    /** "bloqueia 99% dos raios UV" — laudo, p. 2. Ensaio: 98,87%. */
    uv: "99%",
    /**
     * "rejeita até 90% do calor infravermelho" — laudo, p. 2. Ensaio:
     * 90,2%–90,7%. Nunca escrever "reduz 90% da temperatura": o laudo mede
     * rejeição de radiação infravermelha, não queda de temperatura.
     */
    calor: "90%",
    /** "mantém 70% da luz natural" — laudo, p. 2. Ensaio (VLT): 68%–69%. */
    luz: "70%",
    /**
     * Laudo, p. 2. A garantia de desbotamento da cor é separada e menor
     * (10 anos, p. 3) — não misture as duas no site.
     */
    garantia: "15 anos",
  },
  seguranca: {
    espessura: "400 micras",
    /** "aumenta em até [10 vezes] a resistência do vidro ao impacto" */
    resistencia: "10 vezes",
  },
  refletiva: {
    reflexao: "62%",
  },
  jateado: {
    luz: "82%",
  },
  manutencao: {
    prazo: "48 horas",
    garantia: "12 meses",
  },
} as const;

/** O ano de fundação por extenso — "desde 1997" em vez de uma idade que envelhece. */
export const DESDE = 1997;

export const CIDADES_ATENDIDAS = [
  "Itatiba",
  "Jundiaí",
  "Vinhedo",
  "Valinhos",
  "Campinas",
] as const;

/** "Itatiba, Jundiaí, Vinhedo, Valinhos, Campinas e região" */
export const COBERTURA = `${CIDADES_ATENDIDAS.join(", ")} e região`;

export interface LinhaDePortfolio {
  slug: string;
  /** Nome oficial completo, para H1 e metadados. */
  nome: string;
  /** Nome curto — menus, cards e rodapé. */
  nomeCurto: string;
  url: `/servicos/${string}`;
  /** Tinta do design system usada no card e na tag. */
  linha: LinhaDeCard;
  /**
   * O pilar da marca a que a linha responde (Conforto, Segurança, Privacidade,
   * Decor). É o que vai na etiqueta do card — repetir ali o nome da linha, que
   * já está no título logo abaixo, é o texto duplicado que a revisão de copy
   * pede para tirar.
   */
  familia: string;
  /** A frase do card, igual na Home e em /servicos. */
  frase: string;
  /** Os dois indicadores do card. */
  indicadores: readonly { valor: string; rotulo: string }[];
  /** Para quem a linha é indicada — a coluna "Indicada para" de /servicos. */
  publico: string;
  /** Rótulo do link do card na Home ("Conhecer a Nanocerâmica"). */
  rotuloDoLink: string;
  /** Rótulo do link na grade de /servicos ("Ver Nanocerâmica"). */
  rotuloNoHub: string;
  /**
   * Foto de obra do acervo. Vazio quando a linha ainda não tem material
   * fotográfico próprio — o card desenha sem foto em vez de usar a de outra
   * linha, que é o que a revisão de copy chama de "foto de catálogo".
   */
  foto?: CaminhoDeImagem;
  /** Legenda e alt da foto: ambiente + película + cidade. */
  legendaDaFoto?: string;
}

export const LINHAS: readonly LinhaDePortfolio[] = [
  {
    slug: "pelicula-nanoceramica",
    nome: "Película Nanocerâmica Ultra HD",
    nomeCurto: "Nanocerâmica Ultra HD",
    url: "/servicos/pelicula-nanoceramica",
    linha: "conforto",
    familia: "Conforto térmico",
    frase: "Menos calor sem escurecer o ambiente nem mudar a fachada.",
    indicadores: [
      { valor: NUMEROS.nanoceramica.calor, rotulo: "de rejeição do calor infravermelho" },
      { valor: NUMEROS.nanoceramica.uv, rotulo: "de bloqueio UV" },
    ],
    publico: "Casas e empresas",
    rotuloDoLink: "Conhecer a Nanocerâmica",
    rotuloNoHub: "Ver Nanocerâmica",
    foto: "/fotos/linha-1.jpg",
    legendaDaFoto: "Sala · Nanocerâmica Ultra HD · Itatiba",
  },
  {
    slug: "pelicula-de-seguranca-antiestilhaco",
    nome: "Película de Segurança Antiestilhaço PS4",
    nomeCurto: "Segurança Antiestilhaço",
    url: "/servicos/pelicula-de-seguranca-antiestilhaco",
    linha: "frescor",
    familia: "Segurança",
    frase: "O vidro pode quebrar; os cacos ficam presos na película.",
    indicadores: [
      { valor: NUMEROS.seguranca.espessura, rotulo: "de espessura" },
      { valor: `até ${NUMEROS.seguranca.resistencia}`, rotulo: "mais resistência" },
    ],
    publico: "Casas e empresas",
    rotuloDoLink: "Conhecer a película de segurança",
    rotuloNoHub: "Ver película de segurança",
    // Sem foto: a pasta SERVIÇOS ainda não tem material desta linha.
  },
  {
    slug: "pelicula-refletiva-privacidade",
    nome: "Película Refletiva Black Silver II",
    nomeCurto: "Refletiva e Privacidade",
    url: "/servicos/pelicula-refletiva-privacidade",
    linha: "luz",
    familia: "Privacidade",
    frase: "Espelhada por fora, visão normal por dentro durante o dia.",
    indicadores: [
      { valor: NUMEROS.refletiva.reflexao, rotulo: "de reflexão externa" },
      { valor: "Menos", rotulo: "ofuscamento em telas" },
    ],
    publico: "Escritórios e home office",
    rotuloDoLink: "Conhecer a Black Silver II",
    rotuloNoHub: "Ver Black Silver II",
    foto: "/fotos/linha-2.jpg",
    legendaDaFoto: "Fachada · Refletiva Black Silver II · Itatiba",
  },
  {
    slug: "vinil-jateado-decorativo",
    nome: "Vinil Jateado e Decorativo",
    nomeCurto: "Jateado e Decorativo",
    url: "/servicos/vinil-jateado-decorativo",
    linha: "luz",
    familia: "Decor",
    frase: "Privacidade com design, sem perder a luz.",
    indicadores: [
      { valor: NUMEROS.jateado.luz, rotulo: "da luz preservada" },
      { valor: "Sob medida", rotulo: "faixas e recortes" },
    ],
    publico: "Divisórias, clínicas e box",
    rotuloDoLink: "Conhecer o jateado",
    rotuloNoHub: "Ver jateado",
    foto: "/fotos/linha-3.jpg",
    legendaDaFoto: "Divisória · Vinil Jateado e Decorativo · Itatiba",
  },
] as const;

/** A manutenção não é uma linha de película: é serviço, e aparece à parte. */
export const MANUTENCAO = {
  slug: "manutencao-e-reposicao",
  nome: "Manutenção e reposição",
  nomeCurto: "Manutenção",
  url: "/servicos/manutencao-e-reposicao",
  linha: "conforto" as LinhaDeCard,
  familia: "Serviço",
  frase:
    "Remoção de película antiga, bolhas e trocas, inclusive de outras empresas.",
  indicadores: [
    { valor: `prazo médio de ${NUMEROS.manutencao.prazo}`, rotulo: "para o reparo" },
    { valor: NUMEROS.manutencao.garantia, rotulo: "de garantia do reparo" },
  ],
  publico: "Casas e empresas",
  rotuloDoLink: "Conhecer o serviço de manutenção",
  rotuloNoHub: "Ver manutenção",
} as const;

/** Busca por slug — usada pelas internas para não repetir nome nem número. */
export function linhaPorSlug(slug: string): LinhaDePortfolio | undefined {
  return LINHAS.find((linha) => linha.slug === slug);
}

/* ==========================================================================
   Comparativo "Qual película é a sua?"

   Repete-se nas quatro internas de produto, com o nome de cada linha linkado.
   ========================================================================== */

export interface LinhaDoComparativo {
  slug: string;
  nome: string;
  url: string;
  resolve: string;
  escurece: string;
  privacidade: string;
}

export const COMPARATIVO: readonly LinhaDoComparativo[] = [
  {
    slug: "pelicula-nanoceramica",
    nome: "Nanocerâmica Ultra HD",
    url: "/servicos/pelicula-nanoceramica",
    resolve: "Calor e UV",
    escurece: "Não",
    privacidade: "Não",
  },
  {
    slug: "pelicula-de-seguranca-antiestilhaco",
    nome: "Segurança Antiestilhaço",
    url: "/servicos/pelicula-de-seguranca-antiestilhaco",
    resolve: "Acidentes com vidro",
    escurece: "Não",
    privacidade: "Não",
  },
  {
    slug: "pelicula-refletiva-privacidade",
    nome: "Refletiva Black Silver II",
    url: "/servicos/pelicula-refletiva-privacidade",
    resolve: "Privacidade de dia e ofuscamento",
    escurece: "Sim",
    privacidade: "Sim, de dia",
  },
  {
    slug: "vinil-jateado-decorativo",
    nome: "Jateado e Decorativo",
    url: "/servicos/vinil-jateado-decorativo",
    resolve: "Privacidade e estética",
    escurece: "Não, mas fica translúcido",
    privacidade: "Sim",
  },
] as const;
