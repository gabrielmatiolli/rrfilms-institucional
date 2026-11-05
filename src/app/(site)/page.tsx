import type { Metadata } from "next";

import { BussolaSolar } from "@/components/autorais/BussolaSolar";
import { CorteDaLamina } from "@/components/autorais/CorteDaLamina";
import { LinhaDePelicula } from "@/components/autorais/LinhaDePelicula";
import { HeroComparador } from "@/components/autorais/HeroComparador";
import { SegmentoDividido } from "@/components/autorais/SegmentoDividido";
import { IsotipoDeVidro } from "@/components/brand/IsotipoDeVidro";
import { CardDeBlog } from "@/components/cards/Cartoes";
import { JanelaDeDepoimento } from "@/components/cards/JanelaDeDepoimento";
import { BotaoDeWhatsapp } from "@/components/sections/BotaoDeWhatsapp";
import { FaixaDeCta } from "@/components/sections/FaixaDeCta";
import { Galeria } from "@/components/sections/Galeria";
import { BotaoLink } from "@/components/ui/Botao";
import { Foto } from "@/components/ui/Foto";
import { LinkComSeta, Passo } from "@/components/ui/Elementos";
import { CabecalhoDeSecao, Secao } from "@/components/ui/Secao";
import { COBERTURA, DESDE, LINHAS, MANUTENCAO } from "@/content/linhas";
import { postsDaHome } from "@/lib/dados/blog";
import { listarDepoimentos } from "@/lib/dados/depoimentos";
import { galeriaPorChave } from "@/lib/dados/galerias";

export const metadata: Metadata = {
  title: {
    absolute: "Películas para vidro em Itatiba e região | RR Film",
  },
  description: `Películas para casas e empresas desde ${DESDE}. Menos calor, proteção UV, segurança e privacidade, com medição gratuita no local.`,
  openGraph: {
    title: "Películas para vidro em Itatiba e região | RR Film",
    description:
      "A gente mede o seu vidro, explica o porquê da indicação e instala com equipe própria.",
  },
};

/** Bloco 2 — a faixa de credenciais. Nenhuma delas é número sem fonte. */
const credenciais = [
  `Desde ${DESDE}`,
  "Medição gratuita no local",
  "Instalação com equipe própria",
  "Serviço com garantia",
];

/** Bloco 3 — os três passos da visita. */
const passos = [
  {
    numero: "01",
    titulo: "Medição no local",
    descricao: "Medimos calor, luz e tipo de vidro.",
  },
  {
    numero: "02",
    titulo: "Prova na hora",
    descricao: "Você vê a diferença antes de decidir.",
  },
  {
    numero: "03",
    titulo: "Instalação própria",
    descricao: "Equipe RR Film, com garantia.",
  },
];

/** Bloco 9 — os mantras da marca, que também abrem /a-marca. */
const porQue = [
  {
    titulo: "Transparência sempre",
    texto:
      "Explicamos o porquê de cada indicação, inclusive o que a película não faz.",
  },
  {
    titulo: "Conforto que dá pra sentir",
    texto: "O resultado é percebido no primeiro dia de sol.",
  },
  {
    titulo: "Prova na hora, decisão segura",
    texto: "Medimos e demonstramos antes de você fechar.",
  },
  {
    titulo: "Qualidade acima de tudo",
    texto: "Processo correto e padrão técnico antes de qualquer pressa.",
  },
];

export default async function Home() {
  const [depoimentos, galeria, posts] = await Promise.all([
    listarDepoimentos(),
    galeriaPorChave("home"),
    postsDaHome(),
  ]);

  return (
    <>
      {/* Bloco 1 — Herói */}
      <HeroComparador />

      {/*
        Bloco 1/2 — os dois CTAs do herói e a faixa de credenciais.

        Os botões saem logo abaixo do comparador, e não dentro dele: o herói
        captura `pointerdown` em qualquer ponto para passar o rodo, e um botão
        ali dentro brigaria com o gesto. Além disso a cena é desenhada duas
        vezes (vidro nu e lâmina aplicada, recortada) — um botão dentro dela
        apareceria duplicado e metade dele ficaria fora do recorte.
      */}
      <Secao fundo="pagina" className="!py-10">
        <div className="flex flex-col gap-8">
          <div className="flex w-full flex-col gap-3 *:w-full sm:w-auto sm:flex-row sm:flex-wrap sm:items-center sm:*:w-auto">
            <BotaoLink href="/contato" tipo="secundaria">
              Agendar medição gratuita
            </BotaoLink>
            <BotaoDeWhatsapp codigo="WA-GERAL" />
          </div>

          <ul className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-6 sm:gap-y-3">
            {credenciais.map((credencial) => (
              <li
                key={credencial}
                className="flex items-center gap-[10px] t-corpo-destaque text-texto-corpo"
              >
                <span
                  aria-hidden
                  className="block size-[9px] shrink-0 rounded-pill bg-conforto-500"
                />
                {credencial}
              </li>
            ))}
          </ul>
        </div>
      </Secao>

      {/* O que você está comprando — as camadas da película */}
      <Secao fundo="pagina">
        <CabecalhoDeSecao
          sobrancelha="O que você está comprando"
          titulo="Mais fina que um fio de cabelo. E resolve o problema."
          lead="Não é aquele plástico escuro que vendem em loja de shopping. São quatro camadas coladas, cada uma cuidando de uma coisa."
          largura="1245px"
        />
      </Secao>
      <CorteDaLamina />

      {/* Bloco 3 — Como funciona */}
      <Secao fundo="pagina" id="como-funciona">
        <CabecalhoDeSecao
          sobrancelha="Como funciona"
          titulo="Você não precisa saber o nome da película"
          lead="Basta contar o que incomoda: calor, claridade, falta de privacidade ou medo de o vidro quebrar. Na visita, a gente mede o vidro, mostra o resultado na hora e indica a película certa para cada ambiente. Sem pegadinha e sem empurrar o produto mais caro."
          largura="860px"
        />
        <div className="mt-10 grid gap-8 sm:grid-cols-3">
          {passos.map((passo) => (
            <Passo key={passo.numero} {...passo} />
          ))}
        </div>
        <div className="mt-12">
          <BussolaSolar />
        </div>
      </Secao>

      {/* Bloco 4 — Linhas de película */}
      <Secao fundo="sutil" id="linhas">
        <CabecalhoDeSecao
          sobrancelha="O que aplicamos"
          titulo="Quatro linhas de película. Uma indicação para cada vidro."
          lead="Você não precisa escolher pelo nome. Escolha pelo que te incomoda hoje — a gente indica o resto na visita."
          largura="860px"
        />
        <div className="rolagem-lateral mt-10 md:mt-12 md:grid-cols-2 md:gap-6 lg:grid-cols-4">
          {LINHAS.map((linha) => (
            <LinhaDePelicula
              key={linha.slug}
              linha={{
                nome: linha.nomeCurto,
                promessa: linha.frase,
                foto: linha.foto,
                legendaDaFoto: linha.legendaDaFoto,
                href: linha.url,
                rotuloDoLink: linha.rotuloDoLink,
              }}
            />
          ))}
        </div>
        <p className="mt-8 t-corpo text-texto-suave">
          Precisa remover ou trocar uma película antiga?{" "}
          <LinkComSeta href={MANUTENCAO.url}>Conheça o serviço de manutenção</LinkComSeta>
        </p>
      </Secao>

      {/* Bloco 5 — Casas e empresas */}
      <Secao fundo="pagina">
        <CabecalhoDeSecao
          sobrancelha="Para quem é"
          titulo="Para sua casa ou para sua empresa"
          className="mb-10"
        />
        <SegmentoDividido />
      </Secao>

      {/* Bloco 6 — Prova na hora */}
      <Secao fundo="pagina" id="prova">
        <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
          <div className="flex flex-col gap-[14px]">
            <p className="t-sobrancelha text-texto-acento">Prova na hora</p>
            <h2 className="t-h2">A gente mostra o resultado antes de você decidir</h2>
            <p className="t-corpo-g text-texto-suave">
              Na visita, usamos termômetro infravermelho e medidor de UV para mostrar,
              no seu próprio vidro, quanto calor e radiação a película bloqueia. Para a
              linha de segurança, demonstramos como o vidro fica retido após o impacto.
            </p>
          </div>
          {/*
            Enquanto não houver vídeo nem foto da demonstração (termômetro no
            vidro, teste de impacto), entra uma foto de obra do acervo. Trocar
            por material da demonstração quando a RR Film enviar.
          */}
          <Foto
            slot="prod-galeria-1"
            alt="Medição no vidro de uma sala com película Nanocerâmica Ultra HD, Itatiba"
            className="aspect-[624/420]"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </div>
      </Secao>

      {/* Bloco 7 — Obras */}
      {galeria && (
        <Galeria
          sobrancelha={galeria.sobrancelha}
          titulo={galeria.titulo}
          lead={galeria.lead}
          fundo="sutil"
          itens={galeria.itens}
        />
      )}

      {/* Bloco 8 — Depoimentos. Sem depoimento autorizado, o bloco não existe. */}
      {depoimentos.length > 0 && (
        <Secao fundo="pagina">
          <CabecalhoDeSecao
            sobrancelha="Quem já aplicou"
            titulo="O que os clientes sentem depois"
          />
          <div className="rolagem-lateral mt-10 md:grid-cols-2 md:gap-6 lg:grid-cols-3">
            {depoimentos.map((fala) => (
              <JanelaDeDepoimento key={fala.nome} fala={fala} />
            ))}
          </div>
        </Secao>
      )}

      {/* Bloco 9 — Por que a RR Film */}
      <Secao fundo="pagina">
        <div className="grid gap-8 rounded-2xl border border-vidro-borda bg-vidro-preenchimento p-6 vidro-03 sm:gap-10 sm:p-14 lg:grid-cols-[360px_1fr] lg:gap-20">
          <div className="relative flex flex-col gap-5">
            <IsotipoDeVidro
              largura={320}
              className="absolute right-[-40px] top-[-30px] hidden w-[180px] opacity-50 lg:block"
            />
            <h2 className="t-h1">Por que a RR Film</h2>
            <p className="t-corpo-g text-texto-corpo">
              Mais do que películas, entregamos resultado:
            </p>
          </div>
          <dl className="grid gap-7 sm:grid-cols-2">
            {porQue.map((item) => (
              <div key={item.titulo} className="flex flex-col gap-2">
                <dt className="t-corpo-destaque text-texto-forte">{item.titulo}</dt>
                <dd className="t-corpo-p text-texto-suave">{item.texto}</dd>
              </div>
            ))}
          </dl>
        </div>
      </Secao>

      {/* Bloco 10 — Blog */}
      {posts.length > 0 && (
        <Secao fundo="sutil">
          <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
            <div className="flex flex-col gap-7">
              <p className="t-sobrancelha text-texto-acento">Conteúdo</p>
              <h2 className="t-h2">A gente publica o que explica na visita</h2>
            </div>
            <BotaoLink href="/blog" tipo="fantasma" tamanho="M" className="shrink-0">
              Ver o blog
            </BotaoLink>
          </div>
          <div className="rolagem-lateral mt-10 md:grid-cols-2 md:gap-6 lg:grid-cols-3">
            {posts.map((post) => (
              <CardDeBlog key={post.slug} post={post} />
            ))}
          </div>
        </Secao>
      )}

      {/* Bloco 11 — Chamada final */}
      <FaixaDeCta lead={`Medição e indicação sem custo em ${COBERTURA}.`} />

      {/* Descolamento: a aba de película levantando antes do rodapé */}
      <div aria-hidden className="relative h-24 overflow-hidden bg-fundo-pagina">
        <span
          className="absolute inset-x-0 bottom-0 block h-[86px]"
          style={{
            background:
              "linear-gradient(to bottom, rgba(249,169,126,0) 0%, rgba(249,169,126,0.55) 100%)",
            clipPath: "ellipse(72% 100% at 50% 100%)",
          }}
        />
        <span
          className="absolute inset-x-0 bottom-6 block h-[38px] rounded-[999px] bg-white/35 blur-[6px]"
          style={{ clipPath: "ellipse(60% 100% at 50% 100%)" }}
        />
      </div>
    </>
  );
}
