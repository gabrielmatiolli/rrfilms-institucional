import { BussolaSolar } from "@/components/autorais/BussolaSolar";
import { CorteDaLamina } from "@/components/autorais/CorteDaLamina";
import {
  GarantiaPorEscrito,
  LinhaDePelicula,
} from "@/components/autorais/LinhaDePelicula";
import { HeroComparador } from "@/components/autorais/HeroComparador";
import { SegmentoDividido } from "@/components/autorais/SegmentoDividido";
import { IsotipoDeVidro } from "@/components/brand/IsotipoDeVidro";
import { CardDeBlog } from "@/components/cards/Cartoes";
import { JanelaDeDepoimento } from "@/components/cards/JanelaDeDepoimento";
import { FaixaDeCta } from "@/components/sections/FaixaDeCta";
import { Galeria } from "@/components/sections/Galeria";
import { BotaoLink } from "@/components/ui/Botao";
import { Dado } from "@/components/ui/Elementos";
import { CabecalhoDeSecao, Secao } from "@/components/ui/Secao";
import { postsDaHome } from "@/lib/dados/blog";
import { contatoDoSite } from "@/lib/dados/configuracao";
import { listarDepoimentos } from "@/lib/dados/depoimentos";
import { galeriaPorChave } from "@/lib/dados/galerias";
import { listarProdutos } from "@/lib/dados/produtos";
import { site } from "@/lib/site";

const numeros = [
  { valor: "99,9%", rotulo: "dos raios que desbotam sofá e piso" },
  { valor: "15 anos", rotulo: "de garantia por escrito" },
  { valor: "10x", rotulo: "mais resistente contra quebra" },
  { valor: "29 anos", rotulo: "de casa em casa, desde 1997" },
];

const diferenciais = [
  "Atendimento consultivo no local",
  "Indicação certa para cada ambiente",
  "Instalação com acabamento premium",
  "Segurança e qualidade em primeiro lugar",
  "Garantia e suporte",
];

export default async function Home() {
  const [linhas, depoimentos, galeria, posts, contato] = await Promise.all([
    listarProdutos(),
    listarDepoimentos(),
    galeriaPorChave("home"),
    postsDaHome(),
    contatoDoSite(),
  ]);

  return (
    <>
      <HeroComparador />

      {/* Prova */}
      <Secao fundo="pagina" className="relative overflow-hidden">
        <IsotipoDeVidro
          largura={416}
          className="absolute right-[-72px] top-[-40px] w-[190px] opacity-60 lg:right-[-40px] lg:top-[-60px] lg:w-auto lg:opacity-90"
        />
        <div className="relative flex flex-col gap-7">
          <div className="flex flex-col gap-7">
            <p className="t-sobrancelha text-texto-acento">Medido, não prometido</p>
            <h2 className="t-h2 max-w-[980px]">
              Quase 30 anos aplicando película em Itatiba e região
            </h2>
          </div>
          <div className="grid grid-cols-2 gap-8 lg:grid-cols-4 lg:gap-10">
            {numeros.map((n) => (
              <Dado key={n.valor} valor={n.valor} rotulo={n.rotulo} />
            ))}
          </div>
        </div>
      </Secao>

      {/* Camadas */}
      <Secao fundo="pagina">
        <CabecalhoDeSecao
          sobrancelha="O que você está comprando"
          titulo="Mais fina que um fio de cabelo. E resolve o problema."
          lead="Não é aquele plástico escuro que vendem em loja de shopping. São quatro camadas coladas, cada uma cuidando de uma coisa."
          largura="1245px"
        />
      </Secao>
      <CorteDaLamina />

      {/* Bússola */}
      <Secao fundo="pagina" id="bussola">
        <CabecalhoDeSecao
          sobrancelha="Comece pelo seu vidro"
          titulo="Você não precisa saber o nome da película"
          lead="Precisa saber para onde a janela está virada. É a primeira pergunta que o técnico faz na visita — e a única que muda tudo."
        />
        <div className="mt-10">
          <BussolaSolar />
        </div>
      </Secao>

      {/* Linhas */}
      <Secao fundo="sutil" id="linhas">
        <CabecalhoDeSecao
          sobrancelha="O que aplicamos"
          titulo="Cinco películas. Uma pergunta simples em cada uma."
          lead="Você não precisa escolher pelo nome. Escolha pelo que te incomoda hoje — a gente indica o resto na visita."
          largura="860px"
        />
        <div className="rolagem-lateral mt-10 md:mt-12 md:grid-cols-2 md:gap-6 lg:grid-cols-3">
          {linhas.map((linha) => (
            <LinhaDePelicula key={linha.nome + linha.destaque} linha={linha} />
          ))}
          <GarantiaPorEscrito />
        </div>
      </Secao>

      {/* Segmentos */}
      <Secao fundo="pagina">
        <SegmentoDividido />
      </Secao>

      {/* Galeria */}
      {galeria && (
        <Galeria
          sobrancelha={galeria.sobrancelha}
          titulo={galeria.titulo}
          lead={galeria.lead}
          itens={galeria.itens}
        />
      )}

      {/* Depoimentos */}
      {depoimentos.length > 0 && (
        <Secao fundo="pagina">
          <div className="flex flex-col gap-7">
            <p className="t-sobrancelha text-texto-acento">Quem já aplicou</p>
            <h2 className="t-h2">
              <span className="pointer-coarse:hidden">Passe o mouse</span>
              <span className="hidden pointer-coarse:inline">Toque</span> para limpar o vidro
            </h2>
          </div>
          <div className="rolagem-lateral mt-10 md:grid-cols-2 md:gap-6 lg:grid-cols-3">
            {depoimentos.map((fala) => (
              <JanelaDeDepoimento key={fala.nome} fala={fala} />
            ))}
          </div>
        </Secao>
      )}

      {/* Por que RR Film */}
      <Secao fundo="pagina">
        <div className="grid gap-8 rounded-2xl border border-vidro-borda bg-vidro-preenchimento p-6 vidro-03 sm:gap-10 sm:p-14 lg:grid-cols-2 lg:gap-20">
          <div className="flex flex-col gap-5">
            <h2 className="t-h1">Por que RR Film?</h2>
            <p className="t-corpo-g text-texto-corpo">
              Mais do que películas, entregamos resultado:
            </p>
          </div>
          <div className="flex flex-col gap-[18px]">
            <ul className="flex flex-col gap-[18px]">
              {diferenciais.map((item) => (
                <li key={item} className="flex items-start gap-[14px] t-corpo">
                  <span
                    aria-hidden
                    className="mt-[10px] block size-[9px] shrink-0 rounded-pill bg-conforto-500"
                  />
                  {item}
                </li>
              ))}
            </ul>
            <p className="t-corpo-p text-texto-suave">
              Itatiba e região · consulte cidades próximas
            </p>
            <p className="t-corpo-p text-texto-suave">
              {site.urlCurta} · {contato.instagram} ·{" "}
              <span className="whitespace-nowrap">{contato.telefone}</span>
            </p>
          </div>
        </div>
      </Secao>

      {/* Blog */}
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

      <FaixaDeCta />

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
