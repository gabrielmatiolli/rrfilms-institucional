import type { Metadata } from "next";

import { IsotipoDeVidro } from "@/components/brand/IsotipoDeVidro";
import { FaixaDeCta } from "@/components/sections/FaixaDeCta";
import { HeroSimples } from "@/components/sections/Heros";
import { CabecalhoDeSecao, Secao } from "@/components/ui/Secao";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "A marca",
  description:
    "RR vem de Rafael Rela. Desde 1997, tecnologia em películas para vidro com transparência, prova na hora e qualidade acima de fechar a qualquer custo.",
};

/** Golden circle: três camadas de vidro, uma sobre a outra, como o símbolo. */
const goldenCircle = [
  {
    sobrancelha: "Propósito · Motivação",
    titulo: "Por quê",
    texto:
      "Levar conforto e tranquilidade para ambientes com vidro, com uma postura de transparência e confiabilidade num mercado onde o cliente geralmente não consegue verificar a qualidade real do que foi instalado.",
  },
  {
    sobrancelha: "O processo · Ações",
    titulo: "Como",
    texto:
      "Atuação consultiva no local, com foco residencial: entendemos a dor do cliente, comprovamos o desempenho com medição na hora e executamos um processo rápido — visita, orçamento, instalação — sempre priorizando segurança e qualidade acima de fechar a qualquer custo.",
  },
  {
    sobrancelha: "O resultado",
    titulo: "O quê",
    texto:
      "Soluções em películas para vidro, residencial e B2B: conforto térmico e proteção UV, refletivas para privacidade e controle solar, segurança antiestilhaço e decorativas para estética e privacidade arquitetônica.",
  },
];

const marcos = [
  {
    marco: "1997",
    titulo: "Rafael Rela funda a RR Film",
    texto:
      "A operação nasce no universo das películas automotivas, a partir da formação e da iniciativa do fundador.",
  },
  {
    marco: "Anos 2000",
    titulo: "Vidraçarias e arquitetos",
    texto:
      "As parcerias ampliam o repertório técnico e o vidro residencial aparece como o território mais consistente.",
  },
  {
    marco: "Hoje",
    titulo: "Itatiba e região",
    texto:
      "Foco em soluções residenciais de alta performance, com atendimento por demanda em Campinas e Jundiaí.",
  },
  {
    marco: "A seguir",
    titulo: "Uma rede de aplicação",
    texto:
      "Crescer sem perder excelência: formar equipe e construir uma rede com treinamento e padrão próprios.",
  },
];

const pilares = [
  {
    titulo: "Missão",
    cor: "text-conforto-500",
    texto:
      "Proteger e melhorar o uso dos ambientes com vidro, entregando conforto térmico, proteção UV, segurança e privacidade, com atendimento transparente e instalação profissional no padrão mais seguro possível.",
  },
  {
    titulo: "Visão",
    cor: "text-luz-500",
    texto:
      "Ser a referência regional em películas residenciais e evoluir para uma rede de aplicação forte e bem treinada, elevando o padrão do mercado pela via da técnica e da confiabilidade.",
  },
  {
    titulo: "Valores",
    cor: "text-frescor-500",
    valores: [
      "Transparência",
      "Confiabilidade",
      "Segurança",
      "Excelência técnica",
      "Respeito ao lar do cliente",
    ],
  },
];

const crencas = [
  {
    numero: "01",
    titulo: "Acreditamos que uma casa com vidro bonito precisa ser habitável.",
    texto: "Ambientes com luz natural devem ser confortáveis — não inviáveis.",
  },
  {
    numero: "02",
    titulo: "Acreditamos em tecnologia aplicada ao dia a dia.",
    texto: "Película é performance: conforto térmico, proteção UV, segurança e bem-estar.",
  },
  {
    numero: "03",
    titulo: "Acreditamos em transparência como padrão.",
    texto:
      "O cliente tem o direito de entender, comparar e decidir com clareza — com prova, não com promessa.",
  },
  {
    numero: "04",
    titulo: "Acreditamos que qualidade não se improvisa.",
    texto:
      "O resultado mora no detalhe: diagnóstico, produto correto, instalação precisa e acabamento limpo.",
  },
  {
    numero: "05",
    titulo: "Acreditamos que segurança é inegociável.",
    texto: "Nenhuma entrega vale mais do que fazer certo — e fazer com responsabilidade.",
  },
];

const mantras = [
  {
    numero: "01",
    titulo: "Transparência sempre",
    texto:
      "A RR Film explica o que vai ser feito, qual película é indicada e por quê, com termos claros de garantia — sem surpresas no meio do caminho.",
  },
  {
    numero: "02",
    titulo: "Conforto que dá pra sentir",
    texto:
      "O foco é entregar resultado no dia a dia: reduzir calor, melhorar o uso do ambiente e proteger contra UV, mantendo estética e transparência.",
  },
  {
    numero: "03",
    titulo: "Prova na hora, decisão segura",
    texto:
      "Antes de decidir, o cliente entende e enxerga a diferença com demonstração e medição no local, trazendo segurança para a escolha.",
  },
  {
    numero: "04",
    titulo: "Qualidade acima de tudo",
    texto:
      "A RR Film prioriza instalação correta e segura, mesmo que isso signifique ajustar o escopo ou recusar algo que não possa ser feito com padrão.",
  },
];

export default function AMarca() {
  return (
    <>
      <HeroSimples
        trilha={[{ rotulo: "Início", href: "/" }, { rotulo: "A marca" }]}
        sobrancelha={`A marca · Desde ${site.fundacao}`}
        titulo={
          <>
            <span className="block">RR vem de Rafael Rela.</span>
            <span className="block">É por isso que o nome importa.</span>
          </>
        }
        lead="Em um mercado onde o cliente raramente consegue verificar o que foi instalado, assinar com o próprio nome é um compromisso — não um enfeite. É o que sustenta cada decisão desta página."
        foto="casas-galeria-5"
      />

      {/* Golden circle */}
      <Secao fundo="pagina">
        <CabecalhoDeSecao
          sobrancelha="Golden circle"
          titulo="Três camadas, como o símbolo"
          lead="O modelo que organiza a essência da marca em três níveis. Aqui ele aparece do jeito que a RR Film desenha: uma lâmina sobre a outra, cada uma deixando ver a anterior."
          largura="760px"
        />
        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {goldenCircle.map((camada, i) => (
            <div
              key={camada.titulo}
              className="cascata flex flex-col gap-4 rounded-2xl border border-vidro-borda bg-vidro-preenchimento p-6 vidro-02 sm:p-9"
              style={{ "--i": i } as React.CSSProperties}
            >
              <p className="t-sobrancelha text-texto-acento">{camada.sobrancelha}</p>
              <h3 className="t-h4">{camada.titulo}</h3>
              <p className="t-corpo-p text-texto-suave">{camada.texto}</p>
            </div>
          ))}
        </div>
      </Secao>

      {/* Assinatura de marca */}
      <Secao fundo="pagina" className="relative overflow-hidden">
        <IsotipoDeVidro
          largura={560}
          className="absolute right-[-110px] top-[-30px] w-[240px] opacity-40 lg:right-[-120px] lg:top-[-80px] lg:w-auto lg:opacity-80"
        />
        <div className="relative flex max-w-[700px] flex-col items-start gap-5">
          <p className="t-sobrancelha text-texto-acento">Assinatura de marca</p>
          <p className="t-display-l text-[clamp(2.5rem,5vw,4.25rem)]">
            {site.complemento}
          </p>
          <span aria-hidden className="block h-[2px] w-24 bg-texto-acento" />
          <p className="t-h2">{site.slogan}</p>
          <p className="t-corpo-p max-w-[620px] text-texto-suave">
            O complemento fala do meio: tecnologia. O slogan fala do fim: conforto.
            Um é o método, o outro é o resultado — e por isso não competem.
          </p>
          <p className="t-corpo-destaque text-texto-forte">
            {site.pilares.join(" · ")}
          </p>
        </div>
      </Secao>

      {/* História */}
      <Secao fundo="sutil">
        <CabecalhoDeSecao
          sobrancelha={`Desde ${site.fundacao}`}
          titulo="Vinte e nove anos aprendendo com vidro"
          lead="A RR Film não mudou de nome. Mudou de território — e o nome acompanhou."
          largura="760px"
        />
        {/* No celular, linha do tempo vertical: o fio corre à esquerda e liga os
            marcos. No lg, horizontal em quatro colunas, como no Figma. */}
        <ol className="ml-[5px] mt-10 flex flex-col gap-9 border-l border-borda-media pl-6 lg:ml-0 lg:mt-12 lg:grid lg:grid-cols-4 lg:gap-8 lg:border-l-0 lg:pl-0">
          {marcos.map((item) => (
            <li key={item.marco} className="relative flex flex-col items-start gap-2 lg:gap-3">
              <span
                aria-hidden
                className="absolute left-[-30px] top-[9px] block size-[11px] rounded-pill bg-texto-acento lg:static"
              />
              <p className="t-h4 text-texto-acento">{item.marco}</p>
              <h3 className="w-full t-corpo-destaque text-texto-forte lg:border-b lg:border-borda-media lg:pb-3">
                {item.titulo}
              </h3>
              <p className="t-corpo-p text-texto-suave">{item.texto}</p>
            </li>
          ))}
        </ol>
      </Secao>

      {/* Pilares */}
      <Secao fundo="pagina">
        <CabecalhoDeSecao
          sobrancelha="Os pilares"
          titulo="O que guia a decisão quando ninguém está olhando"
          lead="Missão, visão e valores como estão no brandbook — sem reescrita."
          largura="860px"
        />
        <div className="mt-10 grid gap-8 lg:grid-cols-3">
          {pilares.map((pilar) => (
            <div
              key={pilar.titulo}
              className="flex flex-col gap-5 rounded-2xl bg-fundo-inverso p-6 sm:p-9"
            >
              <h3 className={`t-h4 ${pilar.cor}`}>{pilar.titulo}</h3>
              {pilar.texto ? (
                <p className="t-corpo-p text-texto-inverso opacity-80">{pilar.texto}</p>
              ) : (
                <ul className="flex flex-col gap-3">
                  {pilar.valores?.map((valor) => (
                    <li key={valor} className="t-corpo-p text-texto-inverso opacity-80">
                      {valor}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </Secao>

      {/* Mini-manifesto */}
      <Secao fundo="pagina">
        <CabecalhoDeSecao
          sobrancelha="Mini-manifesto"
          titulo="Cinco coisas em que a RR Film acredita"
          lead="Cada crença é uma camada. Lidas de cima para baixo, elas se acumulam — como a película sobre o vidro."
          largura="760px"
        />
        <ol className="mt-10 flex flex-col gap-4">
          {crencas.map((crenca, i) => (
            <li
              key={crenca.numero}
              className="flex max-w-[880px] flex-col gap-3 rounded-2xl border border-vidro-borda bg-vidro-preenchimento p-6 vidro-02 sm:p-8"
              style={{ marginInlineStart: `calc(${i} * clamp(0px, 3.2vw, 46px))` }}
            >
              <p className="t-sobrancelha text-texto-acento">{crenca.numero}</p>
              <h3 className="t-corpo-destaque text-texto-forte">{crenca.titulo}</h3>
              <p className="t-corpo-p text-texto-suave">{crenca.texto}</p>
            </li>
          ))}
        </ol>
      </Secao>

      {/* Mantras */}
      <Secao fundo="sutil">
        <div className="flex flex-col gap-7">
          <p className="t-sobrancelha text-texto-acento">Mantras</p>
          <h2 className="t-h2">As regras do dia a dia</h2>
        </div>
        <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {mantras.map((mantra) => (
            <div
              key={mantra.numero}
              className="flex flex-col gap-3 border-t border-borda-media pt-4"
            >
              <p className="t-sobrancelha text-texto-acento">{mantra.numero}</p>
              <h3 className="t-corpo-destaque text-texto-forte">{mantra.titulo}</h3>
              <p className="t-corpo-p text-texto-suave">{mantra.texto}</p>
            </div>
          ))}
        </div>
      </Secao>

      <FaixaDeCta />
    </>
  );
}
