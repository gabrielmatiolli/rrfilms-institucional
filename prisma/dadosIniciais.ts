/**
 * O conteúdo inicial do banco.
 *
 * Os caminhos de foto são os mesmos de src/content/fotos.ts: o painel passa a
 * apontar para /uploads quando alguém trocar a imagem, mas o acervo de obra que
 * veio do Figma continua em /fotos.
 *
 * Desde a revisão de copy de 28/10/2026, `servicos` e `produtos` espelham
 * src/content/linhas.ts — que é a fonte do site público. As quatro linhas
 * oficiais e os números de ficha técnica vivem no código, porque o documento
 * exige o mesmo valor em todos os pontos de contato e eles aparecem em doze
 * páginas. Estas linhas do banco existem para o painel não contradizer o site e
 * para cadastrar algo fora do portfólio oficial. Ver o README, "Conteúdo no
 * código x conteúdo no painel".
 */

import { LINHAS, MANUTENCAO } from "../src/content/linhas";

// --- Blog -------------------------------------------------------------------

export const categorias = [
  { slug: "guia", rotulo: "Guia", icone: "regua" },
  { slug: "nanoceramica-ultra-hd", rotulo: "Nanocerâmica Ultra HD", icone: "sol" },
  { slug: "seguranca", rotulo: "Segurança", icone: "escudo" },
  { slug: "corporativo", rotulo: "Corporativo", icone: "predio" },
  { slug: "residencial", rotulo: "Residencial", icone: "casa" },
];

export const posts = [
  {
    slug: "pelicula-escura-nao-refresca-mais",
    categoria: "guia",
    titulo: "Por que a película mais escura não é a que mais refresca",
    resumo:
      "“Rejeita 80% do calor” é a frase mais repetida do setor — e uma das mais mal usadas. Medimos três películas no mesmo vidro, com o mesmo sol, para mostrar o que o número quer dizer e o que ele esconde.",
    capa: "/fotos/blog-destaque.jpg",
    publicadoEm: "2026-08-12T12:00:00-03:00",
    minutos: 6,
    destaque: true,
  },
  {
    slug: "tres-perguntas-antes-de-fechar",
    categoria: "guia",
    titulo: "As três perguntas para fazer antes de fechar com qualquer empresa",
    resumo:
      "Orçamento de película varia muito de uma empresa para outra. Estas três perguntas mostram, em minutos, quem foi ver o seu vidro e quem só mandou preço de tabela.",
    capa: "/fotos/blog-2.jpg",
    publicadoEm: "2026-07-29T12:00:00-03:00",
    minutos: 8,
  },
  {
    slug: "cada-janela-pede-uma-pelicula",
    categoria: "residencial",
    titulo: "Por que cada janela da casa pede uma película diferente",
    resumo:
      "A janela do oeste, a do quarto do bebê e o box do banheiro resolvem problemas distintos. Aplicar a mesma película em todas é o erro mais comum de obra residencial.",
    capa: "/fotos/blog-3.jpg",
    publicadoEm: "2026-07-15T12:00:00-03:00",
    minutos: 5,
  },
  {
    slug: "pelicula-escura-nao-e-conforto",
    categoria: "guia",
    titulo: "Película escura não é sinônimo de mais conforto — e o teste prova",
    resumo:
      "Escurecer o ambiente e barrar calor são coisas diferentes. Este teste separa transmissão luminosa de rejeição de energia solar, com o termômetro do lado de dentro.",
    capa: "/fotos/blog-1.jpg",
    publicadoEm: "2026-06-30T12:00:00-03:00",
    minutos: 7,
  },
  {
    slug: "nbr-7199-na-pratica",
    categoria: "seguranca",
    titulo: "NBR 7199 na prática: quando o filme antiestilhaço é obrigatório",
    resumo:
      "A norma define onde o vidro precisa de retenção de fragmentos. Traduzimos o texto técnico para o que isso significa em fachada, porta de correr e área de circulação.",
    capa: "/fotos/blog-capa-padrao.jpg",
    publicadoEm: "2026-06-18T12:00:00-03:00",
    minutos: 9,
  },
  {
    slug: "cada-tipo-de-vidro-pede-uma-pelicula",
    categoria: "guia",
    titulo: "Cada tipo de vidro pede uma película: como saber qual é o seu",
    resumo:
      "Comum, temperado, laminado, insulado. Cada um reage de um jeito ao calor retido pela película — e a combinação errada pode trincar o vidro.",
    capa: "/fotos/blog-capa-padrao.jpg",
    publicadoEm: "2026-06-02T12:00:00-03:00",
    minutos: 6,
  },
  {
    slug: "payback-de-pelicula-corporativa",
    categoria: "corporativo",
    titulo: "Payback de película em edifício corporativo: como calcular de verdade",
    resumo:
      "Economia de ar-condicionado, vida útil do mobiliário e conforto de quem trabalha ao lado do vidro. A conta que faz sentido apresentar para um síndico ou um comitê.",
    capa: "/fotos/blog-capa-padrao.jpg",
    publicadoEm: "2026-05-21T12:00:00-03:00",
    minutos: 11,
  },
];

// --- Serviços e linhas de película ----------------------------------------
//
// Derivados de src/content/linhas.ts: os nomes, os números, as URLs e a ordem
// são os mesmos que o site publica. Trocar um número ali atualiza o site e o
// painel na mesma edição.

type LinhaCromatica = "CONFORTO" | "LUZ" | "FRESCOR";

const CROMATICA: Record<string, LinhaCromatica> = {
  conforto: "CONFORTO",
  luz: "LUZ",
  frescor: "FRESCOR",
};

export const servicos: {
  slug: string;
  linha: LinhaCromatica;
  tag: string;
  titulo: string;
  descricao: string;
  foto: string;
  dados: { valor: string; rotulo: string }[];
  href: string;
}[] = [
  ...LINHAS.map((linha) => ({
    slug: linha.slug,
    linha: CROMATICA[linha.linha],
    tag: linha.familia,
    titulo: linha.nomeCurto,
    descricao: linha.frase,
    foto: linha.foto ?? "",
    dados: [...linha.indicadores],
    href: linha.url,
  })),
  {
    slug: MANUTENCAO.slug,
    linha: CROMATICA[MANUTENCAO.linha],
    tag: MANUTENCAO.familia,
    titulo: MANUTENCAO.nome,
    descricao: MANUTENCAO.frase,
    foto: "",
    dados: [...MANUTENCAO.indicadores],
    href: MANUTENCAO.url,
  },
];

/**
 * As linhas de película, como a Home as mostrava. A "Linha Smart" saiu: não faz
 * parte do portfólio da RR Film.
 */
export const produtos = LINHAS.map((linha) => ({
  slug: linha.slug,
  nome: linha.nomeCurto,
  destaque: "",
  promessa: linha.frase,
  descricao: linha.frase,
  foto: linha.foto ?? "",
  href: linha.url,
}));

// --- Galerias ---------------------------------------------------------------

export const galerias = [
  {
    chave: "home",
    nomeNoPainel: "Home",
    sobrancelha: "Obras da RR Film",
    titulo: "Vidro de cliente, não foto de catálogo",
    lead: "Todas as fotos são de obras da RR Film em Itatiba e região.",
    itens: [
      { imagem: "/fotos/casas-galeria-1.jpg", alt: "Sala com pano de vidro depois da aplicação" },
      { imagem: "/fotos/galeria-2.jpg", alt: "Sacada com película de controle solar" },
      { imagem: "/fotos/galeria-3.jpg", alt: "Janela de quarto com película aplicada" },
      { imagem: "/fotos/galeria-4.jpg", alt: "Porta de vidro com película decorativa" },
      { imagem: "/fotos/galeria-5.jpg", alt: "Fachada residencial com película refletiva" },
      { imagem: "/fotos/galeria-6.jpg", alt: "Divisória de vidro jateado" },
    ],
  },
  {
    chave: "servicos",
    nomeNoPainel: "Serviços",
    sobrancelha: "Obras recentes",
    titulo: "Trabalho aplicado, não imagem ilustrativa",
    lead: "Todas as fotos são de obras da RR Film em Itatiba e região.",
    itens: [
      { imagem: "/fotos/srv-galeria-1.jpg", alt: "Pano de vidro residencial com controle solar" },
      { imagem: "/fotos/srv-galeria-2.jpg", alt: "Sacada com película aplicada" },
      { imagem: "/fotos/srv-galeria-3.jpg", alt: "Janela de sala com película" },
      { imagem: "/fotos/srv-galeria-4.jpg", alt: "Porta de vidro com película decorativa" },
      { imagem: "/fotos/srv-galeria-5.jpg", alt: "Fachada com película refletiva" },
      { imagem: "/fotos/srv-galeria-6.jpg", alt: "Divisória de vidro jateado" },
    ],
  },
  {
    chave: "para-casas",
    nomeNoPainel: "Para casas",
    sobrancelha: "Antes e depois",
    titulo: "Como fica depois de aplicada",
    lead: "Todas as fotos são de obras da RR Film em Itatiba e região.",
    itens: [
      { imagem: "/fotos/casas-galeria-1.jpg", alt: "Sala com pano de vidro e película aplicada" },
      { imagem: "/fotos/casas-galeria-2.jpg", alt: "Varanda com película de controle solar" },
      { imagem: "/fotos/casas-galeria-3.jpg", alt: "Quarto com janela tratada" },
      { imagem: "/fotos/casas-galeria-4.jpg", alt: "Porta de vidro residencial com película" },
      { imagem: "/fotos/casas-galeria-5.jpg", alt: "Fachada de casa com película refletiva" },
      { imagem: "/fotos/casas-galeria-6.jpg", alt: "Box de banheiro com película jateada" },
    ],
  },
  {
    chave: "para-empresas",
    nomeNoPainel: "Para empresas",
    sobrancelha: "Projetos corporativos",
    titulo: "Escritórios, clínicas e lojas",
    lead: "Divisória, sala de reunião e fachada — com a operação do cliente funcionando.",
    itens: [
      { imagem: "/fotos/emp-galeria-1.jpg", alt: "Sala de reunião com divisória de vidro" },
      { imagem: "/fotos/emp-galeria-2.jpg", alt: "Fachada corporativa com película" },
      { imagem: "/fotos/emp-galeria-3.jpg", alt: "Escritório com vidro tratado" },
      { imagem: "/fotos/emp-galeria-4.jpg", alt: "Clínica com película de privacidade" },
      { imagem: "/fotos/emp-galeria-5.jpg", alt: "Loja com vitrine tratada" },
      { imagem: "/fotos/emp-galeria-6.jpg", alt: "Divisória jateada com recorte de marca" },
    ],
  },
  {
    chave: "produto-nanoceramica",
    nomeNoPainel: "Linha · Nanocerâmica Ultra HD",
    sobrancelha: "Onde já aplicamos",
    titulo: "A mesma película, em casas diferentes",
    lead: "Sacada, sala com pano de vidro, quarto. Todas com a Nanocerâmica Ultra HD.",
    itens: [
      { imagem: "/fotos/prod-galeria-1.jpg", alt: "Sala com pano de vidro e película" },
      { imagem: "/fotos/prod-galeria-2.jpg", alt: "Sacada com película de controle solar" },
      { imagem: "/fotos/galeria-6.jpg", alt: "Quarto com janela tratada" },
      { imagem: "/fotos/galeria-5.jpg", alt: "Janela de sala com película" },
      { imagem: "/fotos/galeria-2.jpg", alt: "Área de convivência com vidro tratado" },
      { imagem: "/fotos/prod-galeria-6.jpg", alt: "Fachada residencial com película" },
    ],
  },
  {
    chave: "linha-seguranca",
    nomeNoPainel: "Linha · Segurança Antiestilhaço",
    sobrancelha: "Onde já aplicamos",
    titulo: "Vidro protegido, casa e empresa",
    lead: "Todas as fotos são de obras da RR Film em Itatiba e região.",
    // Legenda e alt na forma pedida pelo documento: ambiente + película + cidade.
    itens: [
      {
        imagem: "/fotos/srv-galeria-3.jpg",
        alt: "Janela de sala · Segurança Antiestilhaço · Itatiba",
      },
      {
        imagem: "/fotos/casas-galeria-4.jpg",
        alt: "Porta de vidro · Segurança Antiestilhaço · Itatiba",
      },
    ],
  },
  {
    chave: "linha-refletiva",
    nomeNoPainel: "Linha · Refletiva Black Silver II",
    sobrancelha: "Onde já aplicamos",
    titulo: "Fachadas e escritórios com privacidade de dia",
    lead: "Todas as fotos são de obras da RR Film em Itatiba e região.",
    itens: [
      {
        imagem: "/fotos/srv-galeria-5.jpg",
        alt: "Fachada · Refletiva Black Silver II · Itatiba",
      },
      {
        imagem: "/fotos/casas-galeria-5.jpg",
        alt: "Fachada residencial · Refletiva Black Silver II · Itatiba",
      },
    ],
  },
  {
    chave: "linha-jateado",
    nomeNoPainel: "Linha · Jateado e Decorativo",
    sobrancelha: "Onde já aplicamos",
    titulo: "Divisórias e portas com privacidade e luz",
    lead: "Todas as fotos são de obras da RR Film em Itatiba e região.",
    itens: [
      {
        imagem: "/fotos/srv-galeria-6.jpg",
        alt: "Divisória de escritório · Vinil Jateado e Decorativo · Itatiba",
      },
      {
        imagem: "/fotos/galeria-4.jpg",
        alt: "Porta de vidro · Vinil Jateado e Decorativo · Itatiba",
      },
      {
        imagem: "/fotos/casas-galeria-6.jpg",
        alt: "Box de banheiro · Vinil Jateado e Decorativo · Itatiba",
      },
    ],
  },
];

// --- Depoimentos ------------------------------------------------------------

/**
 * `autorizado: false` desde a revisão de copy de 28/10/2026: "usar só
 * depoimentos reais, com nome, bairro ou cidade e foto autorizada. Sem
 * depoimentos aprovados, ocultar o bloco."
 *
 * O site só publica os marcados como autorizados, então em banco novo o bloco
 * de depoimentos nasce oculto. Quem libera é o painel, depois de a RR Film ter
 * a autorização escrita do cliente — não o seed.
 */
export const depoimentos = [
  {
    citacao:
      "“A sala não dava pra usar depois das 15h. Aplicaram num sábado, sem sujeira, e na segunda já dava pra usar.”",
    nome: "Marina Alcântara",
    contexto: "Casa em condomínio · Itatiba",
    ativo: true,
    autorizado: false,
  },
  {
    citacao:
      "“Precisávamos resolver o calor sem trocar o vidro do prédio inteiro. Fizeram em dois fins de semana e não paramos um dia.”",
    nome: "Rodrigo Sette",
    contexto: "Escritório · Campinas",
    ativo: true,
    autorizado: false,
  },
  {
    citacao:
      "“Foi a única das cinco empresas que foi medir antes de mandar preço. E a única que explicou por que a mais escura não era a melhor.”",
    nome: "Camila Prado",
    contexto: "Casa em condomínio · Jundiaí",
    ativo: true,
    autorizado: false,
  },
];
