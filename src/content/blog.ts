/**
 * Links internos de cada artigo do blog.
 *
 * A revisão de copy de 28/10/2026 encontrou os artigos sem nenhum link para
 * página de produto. São duas coisas diferentes:
 *
 * - **A caixa de chamada no fim do artigo** é código: mora aqui e aparece em
 *   `/blog/[slug]`, abaixo do corpo. Artigo fora desta tabela recebe a chamada
 *   padrão — nenhum artigo fica sem saída.
 * - **O link no meio do texto** (`linkNoTexto`) depende do corpo do artigo, que
 *   é escrito no painel, bloco a bloco. Os sete artigos foram semeados sem
 *   corpo, então não existe parágrafo onde inserir a âncora. O par
 *   `ancora` + `destino` fica registrado aqui para quem escrever o texto no
 *   painel colocar o link na primeira menção ao produto.
 */

export interface ChamadaDeArtigo {
  /** O texto da caixa no fim do artigo. */
  texto: string;
  /** Para onde a caixa leva. */
  href: string;
  rotulo: string;
  /** A âncora a inserir no corpo, na primeira menção ao produto. */
  linkNoTexto?: { ancora: string; destino: string };
}

export const CHAMADA_PADRAO: ChamadaDeArtigo = {
  texto: "Quer saber qual película o seu vidro pede? A medição é gratuita.",
  href: "/contato",
  rotulo: "Agendar medição gratuita",
};

export const CHAMADAS_POR_ARTIGO: Record<string, ChamadaDeArtigo> = {
  "pelicula-escura-nao-refresca-mais": {
    texto: "Veja como a Nanocerâmica refresca sem escurecer.",
    href: "/servicos/pelicula-nanoceramica",
    rotulo: "Conhecer a Nanocerâmica",
    linkNoTexto: {
      ancora: "Nanocerâmica Ultra HD",
      destino: "/servicos/pelicula-nanoceramica",
    },
  },
  "tres-perguntas-antes-de-fechar": {
    texto: "Agende a medição gratuita e faça essas perguntas para a gente.",
    href: "/contato",
    rotulo: "Agendar medição gratuita",
    linkNoTexto: { ancora: "medição no local", destino: "/contato" },
  },
  "cada-janela-pede-uma-pelicula": {
    texto: "Veja a indicação para cada cômodo da casa.",
    href: "/para-casas",
    rotulo: "Ver soluções para casa",
    linkNoTexto: { ancora: "películas residenciais", destino: "/para-casas" },
  },
  "pelicula-escura-nao-e-conforto": {
    texto: "Peça o teste no seu vidro: a medição é gratuita.",
    href: "/contato",
    rotulo: "Agendar medição gratuita",
    linkNoTexto: {
      ancora: "película nanocerâmica",
      destino: "/servicos/pelicula-nanoceramica",
    },
  },
  "nbr-7199-na-pratica": {
    texto: "Solicite uma visita técnica para avaliar os seus vidros.",
    href: "/contato?tipo=empresa",
    rotulo: "Solicitar visita técnica",
    linkNoTexto: {
      ancora: "película de segurança antiestilhaço",
      destino: "/servicos/pelicula-de-seguranca-antiestilhaco#para-sua-empresa",
    },
  },
  "cada-tipo-de-vidro-pede-uma-pelicula": {
    texto: "Não sabe qual é o seu vidro? A gente identifica na visita.",
    href: "/contato",
    rotulo: "Agendar medição gratuita",
    linkNoTexto: { ancora: "linhas de película", destino: "/servicos" },
  },
  "payback-de-pelicula-corporativa": {
    texto: "Solicite uma visita técnica para o seu prédio.",
    href: "/contato?tipo=empresa",
    rotulo: "Solicitar visita técnica",
    linkNoTexto: { ancora: "películas para empresas", destino: "/para-empresas" },
  },
  /**
   * O oitavo artigo do documento. Foi cadastrado pelo painel, e não pelo seed,
   * por isso o slug é o título inteiro — conferido no site, não deduzido.
   */
  "pelicula-para-reduzir-calor-em-casa-como-deixar-a-sala-fresca-sem-escurecer": {
    texto: "Quer sentir a diferença na sua sala? Agende a medição gratuita.",
    href: "/contato",
    rotulo: "Agendar medição gratuita",
    linkNoTexto: {
      ancora: "película nanocerâmica",
      destino: "/servicos/pelicula-nanoceramica#para-sua-casa",
    },
  },
};

export function chamadaDoArtigo(slug: string): ChamadaDeArtigo {
  return CHAMADAS_POR_ARTIGO[slug] ?? CHAMADA_PADRAO;
}

/** Os artigos citados nas páginas de produto, por assunto. */
export const ARTIGOS = {
  peliculaEscuraNaoRefresca: {
    slug: "pelicula-escura-nao-refresca-mais",
    titulo: "Por que a película mais escura não é a que mais refresca",
  },
  nbr7199: {
    slug: "nbr-7199-na-pratica",
    titulo: "NBR 7199 na prática: quando o filme antiestilhaço é obrigatório",
  },
  cadaJanela: {
    slug: "cada-janela-pede-uma-pelicula",
    titulo: "Por que cada janela da casa pede uma película diferente",
  },
  payback: {
    slug: "payback-de-pelicula-corporativa",
    titulo: "Payback de película em edifício corporativo: como calcular de verdade",
  },
} as const;
