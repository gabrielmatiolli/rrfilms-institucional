/**
 * O conteúdo que hoje vive fixo em src/content/* e src/lib/site.ts, no formato
 * do banco. Textos copiados palavra por palavra do arquivo Figma "RR Films" —
 * a migração não é lugar de reescrever copy.
 *
 * Os caminhos de foto são os mesmos de src/content/fotos.ts: o painel passa a
 * apontar para /uploads quando alguém trocar a imagem, mas o acervo de obra que
 * veio do Figma continua em /fotos.
 */

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
    titulo: "NBR 7199 na prática: quando o filme anti-estilhaço é obrigatório",
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

// --- Serviços ---------------------------------------------------------------

type LinhaCromatica = "CONFORTO" | "LUZ" | "FRESCOR";

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
  {
    slug: "nanoceramica-ultra-hd",
    linha: "CONFORTO",
    tag: "Nanocerâmica Ultra HD",
    titulo: "Nanocerâmica Ultra HD",
    descricao:
      "Rejeita até 79% da energia solar sem escurecer o ambiente. O ar-condicionado trabalha menos e o vidro para de esquentar ao toque.",
    foto: "/fotos/amostra-conforto.jpg",
    dados: [
      { valor: "79%", rotulo: "menos calor" },
      { valor: "99%", rotulo: "bloqueio UV" },
    ],
    href: "/produtos/nanoceramica-ultra-hd",
  },
  {
    slug: "seguranca-e-anti-vandalismo",
    linha: "FRESCOR",
    tag: "Segurança",
    titulo: "Segurança e anti-vandalismo",
    descricao:
      "Filme de retenção que mantém os cacos presos ao vidro em caso de impacto. Atende à NBR 7199 em fachadas e áreas de circulação.",
    foto: "/fotos/amostra-luz.jpg",
    dados: [
      { valor: "400µ", rotulo: "espessura do filme" },
      { valor: "NBR", rotulo: "7199 atendida" },
    ],
    href: "/contato",
  },
  {
    slug: "privacidade-e-jateado",
    linha: "LUZ",
    tag: "Decorativa",
    titulo: "Privacidade e jateado",
    descricao:
      "Efeito fosco, faixas ou recorte sob medida. Fecha a visão de fora sem tirar a luz que entra.",
    foto: "/fotos/amostra-frescor.jpg",
    dados: [
      { valor: "0%", rotulo: "de visão externa" },
      { valor: "82%", rotulo: "de luz preservada" },
    ],
    href: "/contato",
  },
  {
    slug: "protecao-uv",
    linha: "CONFORTO",
    tag: "Nanocerâmica Ultra HD",
    titulo: "Proteção UV",
    descricao:
      "Bloqueio de 99% do ultravioleta. Tecido, madeira e obra de arte param de desbotar — e a pele de quem trabalha ao lado do vidro agradece.",
    foto: "/fotos/amostra-conforto.jpg",
    dados: [
      { valor: "99,9%", rotulo: "de UV bloqueado" },
      { valor: "5×", rotulo: "mais vida ao tecido" },
    ],
    href: "/produtos/nanoceramica-ultra-hd",
  },
  {
    slug: "espelhada-e-refletiva",
    linha: "FRESCOR",
    tag: "Segurança",
    titulo: "Espelhada e refletiva",
    descricao:
      "Uniformiza a fachada e devolve parte da radiação antes de ela entrar. Indicada para vidro comum em orientação oeste.",
    foto: "/fotos/amostra-luz.jpg",
    dados: [
      { valor: "62%", rotulo: "de reflexão externa" },
      { valor: "20%", rotulo: "de luz visível" },
    ],
    href: "/contato",
  },
  {
    slug: "manutencao-e-reposicao",
    linha: "LUZ",
    tag: "Decorativa",
    titulo: "Manutenção e reposição",
    descricao:
      "Remoção de película velha, correção de bolha e troca pontual. Atendemos também aplicação feita por terceiros.",
    foto: "/fotos/amostra-frescor.jpg",
    dados: [
      { valor: "48h", rotulo: "prazo médio" },
      { valor: "12 m", rotulo: "de garantia do reparo" },
    ],
    href: "/contato",
  },
];

// --- Linhas de película -----------------------------------------------------

export const produtos = [
  {
    slug: "nanoceramica-ultra-hd",
    nome: "Nanocerâmica",
    destaque: "Ultra HD",
    promessa: "O calor para no vidro. A vista continua lá.",
    descricao:
      "Para sala, quarto e varanda que pegam sol direto. Bloqueia mais de 99% dos raios que desbotam móvel, piso e cortina — sem escurecer o ambiente.",
    foto: "/fotos/linha-1.jpg",
    // A página desta linha é a desenhada no Figma, com os componentes autorais;
    // por isso ela não é gerada pelo editor de blocos.
    href: "/produtos/nanoceramica-ultra-hd",
  },
  {
    slug: "seguranca-antiestilhaco",
    nome: "Segurança",
    destaque: "Antiestilhaço",
    promessa: "Se o vidro quebrar, ele não vira caco.",
    descricao:
      "Deixa o vidro até 10 vezes mais resistente e segura os pedaços colados na película. Para porta de correr, janela grande e box, com criança e pet em casa.",
    // A pasta SERVIÇOS ainda não tem material fotográfico desta linha.
    foto: "",
    href: "/servicos#seguranca",
  },
  {
    slug: "refletiva-black-silver",
    nome: "Refletiva",
    destaque: "Black Silver",
    promessa: "De fora ninguém vê. De dentro você vê tudo.",
    descricao:
      "Espelhada por fora, fumê discreto por dentro. Resolve a privacidade durante o dia e acaba com o reflexo na TV e no computador.",
    foto: "/fotos/linha-2.jpg",
    href: "/servicos#refletiva",
  },
  {
    slug: "decorativa-jateada",
    nome: "Decorativa",
    destaque: "Jateada",
    promessa: "Divide o ambiente sem levantar parede.",
    descricao:
      "Efeito jateado, faixas e desenhos sob medida. Para divisória de escritório e clínica, porta de cozinha e box de banheiro.",
    foto: "/fotos/linha-3.jpg",
    href: "/servicos#decorativa",
  },
  {
    slug: "linha-smart",
    nome: "Linha",
    destaque: "Smart",
    promessa: "Transparente agora, fechado no segundo seguinte.",
    descricao:
      "O mesmo vidro serve de janela e de parede. Para sala de reunião, consultório e ambientes que precisam de privacidade só de vez em quando.",
    foto: "/fotos/linha-4.jpg",
    href: "/servicos#smart",
  },
];

// --- Galerias ---------------------------------------------------------------

export const galerias = [
  {
    chave: "home",
    nomeNoPainel: "Home",
    sobrancelha: "Obras da RR Film",
    titulo: "Vidro de cliente, não render de catálogo",
    lead: "Toda foto do site é de obra aplicada pela equipe em Itatiba e região.",
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
    titulo: "Trabalho aplicado, não render",
    lead: "Todas as fotos desta página são de obras da RR Film em Itatiba e região.",
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
    sobrancelha: "Casas que já fizemos",
    titulo: "Como fica depois de aplicada",
    lead: "Nenhuma foto de banco de imagem. É obra nossa, em casa de cliente.",
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
    nomeNoPainel: "Produto · Nanocerâmica Ultra HD",
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
];

// --- Depoimentos ------------------------------------------------------------

/**
 * `autorizado: true` reproduz o que o site já publica hoje. O componente
 * Depoimento do Figma registra que nome real de cliente exige autorização por
 * escrito — a marcação existe no painel para que essa regra possa ser cobrada
 * antes da virada para produção.
 */
export const depoimentos = [
  {
    citacao:
      "“A sala não dava pra usar depois das 15h. Aplicaram num sábado, sem sujeira, e na segunda já dava pra usar.”",
    nome: "Marina Alcântara",
    contexto: "Casa em condomínio · Itatiba",
    ativo: true,
    autorizado: true,
  },
  {
    citacao:
      "“Precisávamos resolver o calor sem trocar o vidro do prédio inteiro. Fizeram em dois fins de semana e não paramos um dia.”",
    nome: "Rodrigo Sette",
    contexto: "Escritório em Campinas · 3.200 m²",
    ativo: true,
    autorizado: true,
  },
  {
    citacao:
      "“Foi a única das cinco empresas que foi medir antes de mandar preço. E a única que explicou por que a mais escura não era a melhor.”",
    nome: "Camila Prado",
    contexto: "Casa em condomínio · Jundiaí",
    ativo: true,
    autorizado: true,
  },
];
