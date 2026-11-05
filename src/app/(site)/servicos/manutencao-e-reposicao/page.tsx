import type { Metadata } from "next";

import { LinhaDePelicula } from "@/components/autorais/LinhaDePelicula";
import { DadosEstruturados } from "@/components/conteudo/DadosEstruturados";
import { BotaoDeWhatsapp } from "@/components/sections/BotaoDeWhatsapp";
import { FaixaDeCta } from "@/components/sections/FaixaDeCta";
import { HeroSimples } from "@/components/sections/Heros";
import { BotaoLink } from "@/components/ui/Botao";
import { Dado, LinkComSeta } from "@/components/ui/Elementos";
import { ListaDeFaq, type Duvida } from "@/components/ui/Faq";
import { CabecalhoDeSecao, Secao } from "@/components/ui/Secao";
import { LINHAS, MANUTENCAO, NUMEROS } from "@/content/linhas";
import { esquemaDeFaq, esquemaDeServico, esquemaDeTrilha } from "@/lib/schema";

/**
 * Manutenção e reposição.
 *
 * A URL é a mesma de antes; o que muda é que a página existe. Antes ela era uma
 * interna gerada pelo painel sem corpo: publicava a casca "Texto em produção"
 * com `noindex`, herdava o rótulo "Decorativa" do card e não tinha metadados
 * próprios — o Open Graph saía com a amostra de outra linha.
 *
 * É rota estática, então vence o `/servicos/[slug]` do painel para este slug.
 */

export const metadata: Metadata = {
  title: { absolute: "Remoção e troca de película de vidro | RR Film" },
  description:
    "Película com bolhas, descascando ou desbotada? Removemos sem danificar o vidro e reaplicamos, inclusive películas de outras empresas.",
  alternates: { canonical: MANUTENCAO.url },
  openGraph: {
    title: "Remoção e troca de película de vidro | RR Film",
    description:
      "Removemos a película antiga e toda a cola, sem riscar o vidro, e reaplicamos do jeito certo.",
    images: ["/fotos/srv-galeria-4.jpg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Remoção e troca de película de vidro | RR Film",
    description:
      "Bolhas, descascamento ou cor roxa? A gente avalia se é caso de reparo ou de troca.",
  },
};

const oQueFazemos = [
  {
    titulo: "Remoção de película antiga",
    texto: "Retiramos a película e toda a cola, sem riscar o vidro.",
  },
  {
    titulo: "Correção de bolhas e descolamento",
    texto: "Avaliamos se dá para corrigir ou se é melhor trocar.",
  },
  {
    titulo: "Trocas pontuais",
    texto: "Substituímos só o vidro danificado, mantendo o padrão dos demais.",
  },
  {
    titulo: "Películas de terceiros",
    texto: "Atendemos também películas aplicadas por outras empresas.",
  },
];

const sinais = [
  "Bolhas ou partes descolando",
  "Cor roxa ou desbotada",
  "Riscos e manchas que não saem",
  "O ambiente voltou a esquentar",
];

const duvidas: Duvida[] = [
  {
    pergunta: "A remoção danifica o vidro?",
    resposta: "Não, quando feita com técnica e ferramentas adequadas.",
  },
  {
    pergunta: "Vocês mexem em película de outra empresa?",
    resposta: "Sim.",
  },
  {
    pergunta: "Dá para tirar só as bolhas?",
    resposta:
      "Depende do caso. Na visita, avaliamos se o reparo resolve ou se a troca é mais segura.",
  },
];

const trilha = [
  { rotulo: "Início", href: "/" },
  { rotulo: "Serviços", href: "/servicos" },
  { rotulo: MANUTENCAO.nomeCurto },
];

export default function ManutencaoEReposicao() {
  return (
    <>
      <DadosEstruturados
        dados={[
          esquemaDeTrilha(trilha),
          esquemaDeServico({
            nome: MANUTENCAO.nome,
            descricao: MANUTENCAO.frase,
            url: MANUTENCAO.url,
          }),
          esquemaDeFaq(duvidas),
        ]}
      />

      {/* Bloco 1 — Hero */}
      <HeroSimples
        trilha={trilha}
        titulo="Remoção, troca e reparo de películas"
        lead="Película com bolhas, descascando, arranhada ou roxeada? A gente remove sem danificar o vidro e reaplica do jeito certo, inclusive películas instaladas por outras empresas."
        foto="srv-galeria-4"
        acoes={
          <>
            <BotaoDeWhatsapp codigo="WA-MANUT" tipo="primaria" />
            <BotaoLink href="/contato" tipo="vidro">
              Agendar medição gratuita
            </BotaoLink>
          </>
        }
      />

      <Secao fundo="pagina" className="!py-10">
        <div className="grid grid-cols-2 gap-8 lg:gap-10">
          <Dado
            valor={NUMEROS.manutencao.prazo}
            rotulo="de prazo médio para o reparo"
            tom="acento"
          />
          <Dado
            valor={NUMEROS.manutencao.garantia}
            rotulo="de garantia do reparo"
            tom="acento"
          />
        </div>
      </Secao>

      {/* Bloco 2 — O que fazemos */}
      <Secao fundo="pagina">
        <CabecalhoDeSecao
          sobrancelha="O que fazemos"
          titulo="O que a manutenção resolve"
        />
        <dl className="mt-10 grid gap-8 sm:grid-cols-2 lg:gap-10">
          {oQueFazemos.map((item) => (
            <div key={item.titulo} className="flex flex-col gap-2">
              <dt className="t-h5 text-texto-forte">{item.titulo}</dt>
              <dd className="t-corpo-p text-texto-suave">{item.texto}</dd>
            </div>
          ))}
        </dl>
      </Secao>

      {/* Bloco 3 — Hora de trocar */}
      <Secao fundo="sutil">
        <CabecalhoDeSecao
          sobrancelha="Hora de trocar"
          titulo="Sinais de que a película precisa de atenção"
        />
        <ul className="mt-10 grid gap-3 sm:grid-cols-2">
          {sinais.map((sinal) => (
            <li
              key={sinal}
              className="flex items-start gap-[10px] t-corpo text-texto-corpo"
            >
              <span
                aria-hidden
                className="mt-[10px] block size-[9px] shrink-0 rounded-pill bg-conforto-500"
              />
              {sinal}
            </li>
          ))}
        </ul>
        <p className="mt-8 max-w-[760px] t-corpo text-texto-suave">
          Se for trocar, vale reavaliar a película. Muitos vidros que receberam película
          escura comum ficam mais confortáveis e claros com a Nanocerâmica Ultra HD.
        </p>
        <div className="mt-4">
          <LinkComSeta href="/servicos/pelicula-nanoceramica">
            Conheça a Nanocerâmica Ultra HD
          </LinkComSeta>
        </div>
      </Secao>

      {/* Bloco 4 — Casas e empresas */}
      <Secao fundo="pagina">
        <p className="max-w-[860px] t-corpo-g text-texto-corpo">
          Atendemos casas, condomínios, escritórios, clínicas e lojas. Para empresas com
          muitos vidros, fazemos avaliação completa e combinamos o cronograma de troca na
          visita, de acordo com a sua operação.
        </p>
      </Secao>

      {/* Bloco 5 — Dúvidas */}
      <Secao fundo="pagina">
        <CabecalhoDeSecao sobrancelha="Dúvidas" titulo="Dúvidas sobre manutenção" />
        <div className="mt-10">
          <ListaDeFaq duvidas={duvidas} />
        </div>
      </Secao>

      {/* Bloco 6 — Outras linhas */}
      <Secao fundo="sutil">
        <CabecalhoDeSecao
          sobrancelha="Outras linhas"
          titulo="Vai reaplicar? Conheça as linhas"
        />
        <div className="rolagem-lateral mt-10 md:grid-cols-2 md:gap-6 lg:grid-cols-4">
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
      </Secao>

      {/* Bloco 7 — Chamada final */}
      <FaixaDeCta
        titulo="Mande uma foto da sua película"
        lead="Pelo WhatsApp, a gente já consegue dizer se é caso de reparo ou de troca."
        rotuloPrimario="Agendar medição gratuita"
        codigo="WA-MANUT"
      />
    </>
  );
}
