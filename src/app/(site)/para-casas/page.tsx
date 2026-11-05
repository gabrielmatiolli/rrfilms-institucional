import type { Metadata } from "next";
import Link from "next/link";

import { DadosEstruturados } from "@/components/conteudo/DadosEstruturados";
import { BotaoDeWhatsapp } from "@/components/sections/BotaoDeWhatsapp";
import { FaixaDeCta } from "@/components/sections/FaixaDeCta";
import { Galeria } from "@/components/sections/Galeria";
import { HeroDividido } from "@/components/sections/Heros";
import { LinkDeArtigo } from "@/components/sections/LinkDeArtigo";
import { BotaoLink } from "@/components/ui/Botao";
import { LinkComSeta, Selo } from "@/components/ui/Elementos";
import { ListaDeFaq, type Duvida } from "@/components/ui/Faq";
import { CabecalhoDeSecao, Secao } from "@/components/ui/Secao";
import { Tabela } from "@/components/ui/Tabela";
import { ARTIGOS } from "@/content/blog";
import { NUMEROS } from "@/content/linhas";
import { galeriaPorChave } from "@/lib/dados/galerias";
import { esquemaDeFaq, esquemaDeTrilha } from "@/lib/schema";

/**
 * Para casas — o hub residencial.
 *
 * A revisão de copy de 28/10/2026 tirou daqui a "Linha Smart", os números que
 * não estão na lista oficial (79%, 0% de visão externa, "baixa absorção") e os
 * dados técnicos que apareciam soltos no corpo da página. Cada card de problema
 * leva para a âncora `#para-sua-casa` da linha indicada, não para um genérico
 * `/servicos#seguranca`.
 */

export const metadata: Metadata = {
  title: { absolute: "Película residencial em Itatiba e região | RR Film" },
  description:
    "Menos calor na sala, sacada segura e privacidade sem cortina. Películas para cada vidro da sua casa, com medição gratuita.",
  openGraph: {
    title: "Película residencial em Itatiba e região | RR Film",
    description:
      "Conforto sem escurecer a casa, segurança para a família e privacidade sem viver de cortina fechada.",
    images: ["/fotos/casas-hero.jpg"],
  },
};

/** Bloco 2 — por problema. Cada solução aponta para a âncora da linha. */
const problemas = [
  {
    icone: "termometro" as const,
    titulo: "Calor e claridade demais",
    texto: "A sala esquenta à tarde, o sol bate na TV e os móveis estão desbotando.",
    solucao: "Nanocerâmica Ultra HD",
    href: "/servicos/pelicula-nanoceramica#para-sua-casa",
  },
  {
    icone: "escudo" as const,
    titulo: "Medo de o vidro quebrar",
    texto: "Porta de correr, sacada e box de vidro perto de crianças e pets.",
    solucao: "Segurança Antiestilhaço",
    href: "/servicos/pelicula-de-seguranca-antiestilhaco#para-sua-casa",
  },
  {
    icone: "privacidade" as const,
    titulo: "Vizinho vendo dentro",
    texto: "Janela de frente para a rua ou para o prédio ao lado.",
    solucao: "Refletiva Black Silver II (de dia) ou Jateado",
    href: "/servicos/pelicula-refletiva-privacidade#para-sua-casa",
  },
  {
    icone: "janela" as const,
    titulo: "Box e portas de vidro",
    texto: "Privacidade no banheiro e acabamento bonito nas portas internas.",
    solucao: "Jateado e Decorativo",
    href: "/servicos/vinil-jateado-decorativo#para-sua-casa",
  },
];

/** Bloco 3 — por cômodo. */
const comodos = [
  {
    comodo: "Sala e sacada",
    incomoda: "Calor da tarde, sol na TV, móveis desbotando",
    indicacao: "Nanocerâmica + Segurança nas portas de correr",
  },
  {
    comodo: "Quartos",
    incomoda: "Calor e claridade ao acordar",
    indicacao: "Nanocerâmica",
  },
  {
    comodo: "Quarto de bebê e crianças",
    incomoda: "Calor, UV e vidro ao alcance",
    indicacao: "Nanocerâmica + Segurança",
  },
  {
    comodo: "Home office",
    incomoda: "Reflexo na tela e visão da rua",
    indicacao: "Refletiva ou Nanocerâmica",
  },
  {
    comodo: "Banheiro",
    incomoda: "Privacidade e box de vidro",
    indicacao: "Jateado + Segurança no box",
  },
];

const duvidas: Duvida[] = [
  {
    pergunta: "A casa vai ficar escura?",
    resposta:
      "Não, se a película for a certa. A Nanocerâmica mantém a claridade e a vista.",
  },
  {
    pergunta: "Posso aplicar em apartamento?",
    resposta:
      "Sim. Para películas que mudam a fachada, como a refletiva, consulte o regulamento do condomínio.",
  },
  {
    pergunta: "Quanto custa?",
    resposta:
      "Depende da metragem e da película indicada. A medição é gratuita e o orçamento sai na visita.",
  },
  {
    pergunta: "Quanto tempo dura?",
    resposta: `A Nanocerâmica Ultra HD tem garantia de ${NUMEROS.nanoceramica.garantia}. Informamos a garantia de cada linha na visita.`,
  },
];

const trilha = [{ rotulo: "Início", href: "/" }, { rotulo: "Para casas" }];

export default async function ParaCasas() {
  const galeria = await galeriaPorChave("para-casas");

  return (
    <>
      <DadosEstruturados dados={[esquemaDeTrilha(trilha), esquemaDeFaq(duvidas)]} />

      {/* Bloco 1 — Hero */}
      <HeroDividido
        trilha={trilha}
        titulo="A sala das 15h volta a ser sala"
        lead="Películas residenciais para quem quer conforto sem escurecer a casa, segurança para a família e privacidade sem viver de cortina fechada."
        foto="casas-hero"
        tom="conforto"
        acoes={
          <>
            <BotaoLink href="/contato">Agendar medição gratuita</BotaoLink>
            <BotaoDeWhatsapp codigo="WA-CASAS" />
          </>
        }
      />

      {/* Bloco 2 — Por problema */}
      <Secao fundo="pagina" id="problemas">
        <CabecalhoDeSecao
          sobrancelha="Por problema"
          titulo="O que incomoda aí na sua casa?"
          lead="Você não precisa saber o nome da película. Diga o que incomoda — a indicação é nossa."
        />
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {problemas.map((item) => (
            <article
              key={item.titulo}
              className="flex flex-col items-start gap-4 rounded-xl border border-vidro-borda bg-vidro-preenchimento p-7 vidro-02"
            >
              <Selo icone={item.icone} />
              <h3 className="t-h5">{item.titulo}</h3>
              <p className="t-corpo-p text-texto-suave">{item.texto}</p>
              <div className="mt-auto pt-2">
                <LinkComSeta href={item.href}>{item.solucao}</LinkComSeta>
              </div>
            </article>
          ))}
        </div>
      </Secao>

      {/* Bloco 3 — Por cômodo */}
      <Secao fundo="sutil" id="comodos">
        <CabecalhoDeSecao
          sobrancelha="Por cômodo"
          titulo="Cada cômodo pede uma película diferente"
        />
        <div className="mt-10">
          <Tabela
            colunas={["Cômodo", "O que costuma incomodar", "Indicação mais comum"]}
            linhas={comodos.map((linha) => ({
              chave: linha.comodo,
              celulas: [linha.comodo, linha.incomoda, linha.indicacao],
            }))}
          />
        </div>
        <p className="mt-8 max-w-[760px] t-corpo text-texto-suave">
          A indicação final depende da medição: orientação do vidro, tipo de vidro e uso
          do ambiente.
        </p>
        <div className="mt-4">
          <LinkDeArtigo slug={ARTIGOS.cadaJanela.slug} titulo={ARTIGOS.cadaJanela.titulo} />
        </div>
      </Secao>

      {/* Bloco 4 — Antes e depois */}
      {galeria && (
        <Galeria
          sobrancelha={galeria.sobrancelha}
          titulo={galeria.titulo}
          lead={galeria.lead}
          itens={galeria.itens}
        />
      )}

      {/* Bloco 5 — Como é a instalação */}
      <Secao fundo="pagina">
        <CabecalhoDeSecao
          sobrancelha="Como é a instalação"
          titulo="Sem obra e sem bagunça"
          lead="Você não precisa desocupar a casa. A equipe RR Film protege o piso e os móveis, aplica a película e deixa tudo limpo. Na maioria das casas, o serviço termina em um dia."
          largura="860px"
        />
      </Secao>

      {/* Bloco 6 — Dúvidas */}
      <Secao fundo="pagina">
        <CabecalhoDeSecao sobrancelha="Dúvidas" titulo="O que todo morador pergunta" />
        <div className="mt-10">
          <ListaDeFaq duvidas={duvidas} />
        </div>
        <p className="mt-8 t-corpo-p text-texto-suave">
          Quer ver linha por linha?{" "}
          <Link href="/servicos" className="underline underline-offset-4">
            Conheça as quatro linhas de película
          </Link>
          .
        </p>
      </Secao>

      {/* Bloco 7 — Chamada final */}
      <FaixaDeCta
        titulo="Sinta a diferença antes de decidir"
        lead="Na medição gratuita, você vê no termômetro quanto calor o seu vidro deixa entrar."
        codigo="WA-CASAS"
      />
    </>
  );
}
