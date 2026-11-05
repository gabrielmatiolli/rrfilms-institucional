import type { Metadata } from "next";

import { DadosEstruturados } from "@/components/conteudo/DadosEstruturados";
import { FormularioDeOrcamento } from "@/components/formularios/FormularioDeOrcamento";
import { BotaoDeWhatsapp } from "@/components/sections/BotaoDeWhatsapp";
import { FaixaDeCta } from "@/components/sections/FaixaDeCta";
import { Galeria } from "@/components/sections/Galeria";
import { HeroDividido } from "@/components/sections/Heros";
import { LinkDeArtigo } from "@/components/sections/LinkDeArtigo";
import { BotaoExterno, BotaoLink } from "@/components/ui/Botao";
import { LinkComSeta, Selo } from "@/components/ui/Elementos";
import { CabecalhoDeSecao, Secao } from "@/components/ui/Secao";
import { ARTIGOS } from "@/content/blog";
import { DESDE } from "@/content/linhas";
import { galeriaPorChave } from "@/lib/dados/galerias";
import { esquemaDeTrilha } from "@/lib/schema";

/**
 * Para empresas — o hub corporativo.
 *
 * Reescrita pela revisão de copy de 28/10/2026. Saíram os números sem fonte
 * (15–30% de economia, payback de 18 meses, 42% menos ofuscamento, 8 °C, o
 * corte de 300 m², o "1 dia útil" de resposta), a foto repetida da galeria e a
 * afirmação de atendimento à NBR 7199 — que depende de confirmação com o
 * fabricante, aplicação por aplicação. O "Laudo emitida" foi embora com a
 * faixa de números.
 */

/**
 * O portfólio de obras da RR Film, enviado em 04/11/2026.
 *
 * Não é um PDF, como o documento de copy supunha: é a página "Instalações da
 * semana" no Google Sites da marca. Por isso o botão diz "Ver portfólio de
 * obras" e abre em outra aba, em vez de "Baixar portfólio (PDF)" — prometer
 * download e abrir um site é o tipo de desencontro que a revisão veio corrigir.
 *
 * Os parâmetros `?pli=1&authuser=0` do link original foram removidos: são da
 * sessão Google de quem copiou a URL e, em quem tem mais de uma conta logada,
 * `authuser=0` manda o visitante para a conta errada.
 */
const PORTFOLIO =
  "https://sites.google.com/view/rr-film-decor/instala%C3%A7%C3%B5es-da-semana";

export const metadata: Metadata = {
  title: { absolute: "Películas para empresas, clínicas e fachadas | RR Film" },
  description:
    "Conforto térmico, privacidade e segurança para escritórios, clínicas e lojas, sem trocar o vidro. Solicite uma visita técnica.",
  openGraph: {
    title: "Películas para empresas, clínicas e fachadas | RR Film",
    description:
      "Diagnóstico no local, especificação técnica explicada e instalação com equipe própria.",
    images: ["/fotos/emp-galeria-2.jpg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Películas para empresas, clínicas e fachadas | RR Film",
    description:
      "Conforto, privacidade e segurança sem trocar um vidro. Solicite uma visita técnica.",
  },
};

/** Bloco 2 — as três frentes. */
const frentes = [
  {
    icone: "termometro" as const,
    titulo: "Conforto térmico e fachada",
    texto:
      "Menos calor para equipe e clientes, menos carga no ar-condicionado e fachada sem alteração.",
    rotulo: "Nanocerâmica Ultra HD",
    href: "/servicos/pelicula-nanoceramica#para-sua-empresa",
  },
  {
    icone: "privacidade" as const,
    titulo: "Privacidade",
    texto:
      "Salas de reunião, consultórios e recepções sem persiana fechada o dia todo.",
    rotulo: "Refletiva e Jateado",
    href: "/servicos/pelicula-refletiva-privacidade#para-sua-empresa",
  },
  {
    icone: "escudo" as const,
    titulo: "Segurança",
    texto: "Retenção de estilhaços em fachadas, vitrines e áreas de circulação.",
    rotulo: "Segurança Antiestilhaço",
    href: "/servicos/pelicula-de-seguranca-antiestilhaco#para-sua-empresa",
  },
];

/** Bloco 3 — por segmento. As âncoras são linkadas pelo rodapé. */
const segmentos = [
  {
    ancora: undefined,
    titulo: "Escritórios",
    texto:
      "Privacidade em salas de reunião, menos reflexo nos monitores e conforto térmico para a equipe.",
    indicacao: "Refletiva, Jateado e Nanocerâmica",
  },
  {
    ancora: "clinicas",
    titulo: "Clínicas e consultórios",
    texto:
      "Privacidade elegante no atendimento e conforto para pacientes na sala de espera.",
    indicacao: "Jateado e Nanocerâmica",
  },
  {
    ancora: undefined,
    titulo: "Comércio e vitrines",
    texto:
      "Produtos protegidos do desbotamento por UV, vitrine sem calor excessivo e mais segurança no vidro.",
    indicacao: "Nanocerâmica e Segurança",
  },
  {
    ancora: "arquitetos",
    titulo: "Arquitetos e vidraçarias",
    texto:
      "Especificação técnica para o projeto, amostras e instalação alinhada ao cronograma da obra.",
    indicacao: "Todas as linhas",
  },
];

/** Bloco 4 — por que a RR Film. */
const porQue = [
  {
    titulo: `Desde ${DESDE}`,
    texto: "Quase 30 anos de experiência técnica em películas.",
  },
  {
    titulo: "Especificação explicada",
    texto: "Você recebe o porquê de cada película indicada, por vidro.",
  },
  {
    titulo: "Equipe própria",
    texto: "Instalação feita pela RR Film, sem terceirizar.",
  },
  {
    titulo: "Prova antes de fechar",
    texto: "Medição de calor e UV no local.",
  },
  {
    titulo: "Nota fiscal e garantia",
    texto: "Emitimos nota fiscal e a garantia vai por escrito na proposta.",
  },
];

/** Bloco 5 — como funciona o atendimento. */
const atendimento = [
  { numero: "01", titulo: "Visita técnica", descricao: "E medição dos vidros." },
  {
    numero: "02",
    titulo: "Proposta",
    descricao: "Com especificação por ambiente.",
  },
  {
    numero: "03",
    titulo: "Instalação programada",
    descricao: "Combinada para não parar a operação.",
  },
  { numero: "04", titulo: "Entrega", descricao: "Com garantia por escrito." },
];

const trilha = [{ rotulo: "Início", href: "/" }, { rotulo: "Para empresas" }];

export default async function ParaEmpresas() {
  const galeria = await galeriaPorChave("para-empresas");

  return (
    <>
      <DadosEstruturados dados={esquemaDeTrilha(trilha)} />

      {/* Bloco 1 — Hero */}
      <HeroDividido
        trilha={trilha}
        titulo="Conforto, privacidade e segurança sem trocar um vidro"
        lead="Películas para escritórios, clínicas, lojas e projetos de arquitetura. Diagnóstico no local, especificação técnica explicada e instalação com equipe própria."
        foto="empresas-hero"
        tom="frescor"
        acoes={
          <>
            <BotaoLink href="#orcamento">Solicitar visita técnica</BotaoLink>
            <BotaoDeWhatsapp codigo="WA-EMP" rotulo="Falar com o comercial" />
          </>
        }
      />

      {/* Bloco 2 — Três frentes */}
      <Secao fundo="pagina" id="solucoes">
        <CabecalhoDeSecao
          sobrancelha="Soluções"
          titulo="Três frentes que resolvem a maior parte das demandas corporativas"
          lead="Da torre envidraçada ao ponto de rua. Cada frente tem especificação própria, definida vidro por vidro na visita."
        />
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {frentes.map((frente) => (
            <article
              key={frente.titulo}
              className="flex flex-col items-start gap-4 rounded-xl border border-vidro-borda bg-vidro-preenchimento p-7 vidro-02"
            >
              <Selo icone={frente.icone} />
              <h3 className="t-h5">{frente.titulo}</h3>
              <p className="t-corpo-p text-texto-suave">{frente.texto}</p>
              <div className="mt-auto pt-2">
                <LinkComSeta href={frente.href}>{frente.rotulo}</LinkComSeta>
              </div>
            </article>
          ))}
        </div>
      </Secao>

      {/* Bloco 3 — Por segmento */}
      <Secao fundo="sutil" id="segmentos">
        <CabecalhoDeSecao sobrancelha="Por segmento" titulo="Escritórios, clínicas e lojas" />
        <div className="mt-10 grid gap-8 md:grid-cols-2 lg:gap-10">
          {segmentos.map((segmento) => (
            <div
              key={segmento.titulo}
              id={segmento.ancora}
              className="flex scroll-mt-32 flex-col gap-2 border-t border-borda-media pt-5"
            >
              <h3 className="t-h5 text-texto-forte">{segmento.titulo}</h3>
              <p className="t-corpo-p text-texto-suave">{segmento.texto}</p>
              <p className="t-micro text-texto-suave">
                Indicação: <span className="text-texto-corpo">{segmento.indicacao}</span>
              </p>
            </div>
          ))}
        </div>
      </Secao>

      {galeria && (
        <Galeria
          sobrancelha={galeria.sobrancelha}
          titulo={galeria.titulo}
          lead={galeria.lead}
          itens={galeria.itens}
        />
      )}

      {/* Bloco 4 — Por que a RR Film */}
      <Secao fundo="pagina" id="diferenciais">
        <CabecalhoDeSecao
          sobrancelha="Por que a RR Film"
          titulo="Por que empresas escolhem a RR Film"
        />
        <dl className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {porQue.map((item) => (
            <div key={item.titulo} className="flex flex-col gap-2">
              <dt className="t-h5 text-texto-forte">{item.titulo}</dt>
              <dd className="t-corpo-p text-texto-suave">{item.texto}</dd>
            </div>
          ))}
        </dl>
      </Secao>

      {/* Bloco 5 — Como funciona o atendimento */}
      <Secao fundo="pagina">
        <CabecalhoDeSecao
          sobrancelha="Como funciona"
          titulo="Do diagnóstico à entrega"
        />
        <ol className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {atendimento.map((passo) => (
            <li key={passo.numero} className="flex flex-col items-start gap-4">
              <span className="flex size-11 items-center justify-center rounded-pill border border-vidro-borda bg-[rgba(249,169,125,0.18)] t-tag text-texto-forte">
                {passo.numero}
              </span>
              <h3 className="t-corpo-destaque text-texto-forte">{passo.titulo}</h3>
              <p className="t-corpo-p text-texto-suave">{passo.descricao}</p>
            </li>
          ))}
        </ol>

        {/* Bloco 6 — Portfólio */}
        <div className="mt-10 flex flex-col items-start gap-3">
          <BotaoExterno
            href={PORTFOLIO}
            target="_blank"
            rel="noopener noreferrer"
            tipo="fantasma"
            tamanho="M"
          >
            Ver portfólio de obras
          </BotaoExterno>
          <p className="t-micro text-texto-suave">
            Abre as instalações da semana, atualizadas pela equipe RR Film.
          </p>
        </div>
      </Secao>

      {/* Bloco 7 — Conteúdo */}
      <Secao fundo="sutil" className="!py-12">
        <LinkDeArtigo slug={ARTIGOS.payback.slug} titulo={ARTIGOS.payback.titulo} />
      </Secao>

      {/* Bloco 8 — Orçamento corporativo */}
      <Secao fundo="pagina" id="orcamento">
        <div className="grid gap-10 rounded-2xl border border-vidro-borda bg-vidro-preenchimento p-6 vidro-03 sm:gap-12 sm:p-14 lg:grid-cols-2 lg:gap-16">
          <div className="flex flex-col items-start gap-4">
            <p className="t-sobrancelha text-texto-acento">Orçamento corporativo</p>
            <h2 className="t-h2">Solicite uma visita técnica</h2>
            <p className="t-corpo text-texto-suave">
              Conte o tipo de empresa, a cidade e a metragem aproximada de vidro.
              Retornamos para agendar a visita.
            </p>
          </div>

          <FormularioDeOrcamento origem="empresas" />
        </div>
      </Secao>

      {/* Bloco 9 — Chamada final */}
      <FaixaDeCta
        titulo="Quanto calor a sua fachada deixa entrar?"
        lead="Na visita técnica, medimos o calor e o UV nos seus vidros e mostramos o que muda com cada película."
        rotuloPrimario="Solicitar visita técnica"
        hrefPrimario="/contato?tipo=empresa"
        codigo="WA-EMP"
      />
    </>
  );
}
