import type { Metadata } from "next";

import { DadosEstruturados } from "@/components/conteudo/DadosEstruturados";
import { BotaoDeWhatsapp } from "@/components/sections/BotaoDeWhatsapp";
import { CompararLinhas } from "@/components/sections/CompararLinhas";
import { FaixaDeCta } from "@/components/sections/FaixaDeCta";
import { Galeria } from "@/components/sections/Galeria";
import { HeroSimples } from "@/components/sections/Heros";
import { OndeAplicar } from "@/components/sections/OndeAplicar";
import { BotaoLink } from "@/components/ui/Botao";
import { Dado } from "@/components/ui/Elementos";
import { ListaDeFaq, type Duvida } from "@/components/ui/Faq";
import { CabecalhoDeSecao, Secao } from "@/components/ui/Secao";
import { linhaPorSlug, NUMEROS } from "@/content/linhas";
import { galeriaPorChave } from "@/lib/dados/galerias";
import { esquemaDeFaq, esquemaDeServico, esquemaDeTrilha } from "@/lib/schema";

/**
 * Película Refletiva Black Silver II.
 *
 * Nasce no lugar de /servicos/espelhada-e-refletiva (redirecionamento em
 * next.config.mjs), que publicava a casca "Texto em produção" com `noindex`.
 *
 * É a única linha cuja página abre pela empresa: a demanda por privacidade de
 * sala de reunião e recepção vem antes da residencial. Por isso o CTA primário
 * é visita técnica, e não medição.
 */

const LINHA = linhaPorSlug("pelicula-refletiva-privacidade")!;

export const metadata: Metadata = {
  title: { absolute: "Película Espelhada e de Privacidade | RR Film" },
  description:
    "Espelhada por fora, fumê por dentro. Privacidade durante o dia e menos reflexo nas telas. Agende uma visita da RR Film.",
  alternates: { canonical: LINHA.url },
  openGraph: {
    title: "Película Refletiva Black Silver II | RR Film",
    description:
      "Você enxerga a rua; a rua não enxerga você. Privacidade durante o dia e menos ofuscamento em telas.",
    images: [LINHA.foto ?? "/fotos/srv-galeria-5.jpg"],
  },
};

const oQueFaz = [
  {
    titulo: "Privacidade durante o dia",
    texto: `O lado externo fica espelhado, com ${NUMEROS.refletiva.reflexao} de reflexão, e bloqueia a visão de vizinhos e de quem passa na rua.`,
  },
  {
    titulo: "Fim do reflexo nas telas",
    texto: "Reduz o ofuscamento do sol direto em monitores e TVs.",
  },
  {
    titulo: "Menos calor",
    texto: "Parte da radiação solar é refletida antes de entrar.",
  },
  {
    titulo: "Fachada uniforme",
    texto: "O acabamento espelhado padroniza o visual dos vidros.",
  },
];

/** Bloco de transparência: três ressalvas, cada uma com o seu título. */
const antesDeEscolher = [
  {
    titulo: "À noite, o efeito se inverte",
    texto:
      "Com a luz acesa dentro e escuro fora, quem está na rua passa a ver o interior. Para privacidade à noite, use cortina ou o Jateado.",
  },
  {
    titulo: "Escurece o ambiente",
    texto:
      "Ela deixa passar menos luz que a Nanocerâmica. Se a prioridade é claridade, a Nanocerâmica é melhor.",
  },
  {
    titulo: "Muda a fachada",
    texto:
      "Em prédios e condomínios, confirme antes se o regulamento permite vidro espelhado.",
  },
];

const duvidas: Duvida[] = [
  {
    pergunta: "Funciona à noite?",
    resposta:
      "Não da mesma forma. À noite, com luz acesa dentro, o efeito se inverte.",
  },
  {
    pergunta: "O condomínio permite?",
    resposta:
      "Depende do regulamento. Recomendamos consultar o síndico antes.",
  },
  {
    pergunta: "Escurece muito?",
    resposta:
      "Escurece mais que a Nanocerâmica. Na visita, mostramos a amostra no seu vidro.",
  },
  {
    pergunta: "Reduz calor também?",
    resposta:
      "Sim, reflete parte da radiação solar. Para o máximo de conforto térmico sem escurecer, a indicada é a Nanocerâmica.",
  },
];

const trilha = [
  { rotulo: "Início", href: "/" },
  { rotulo: "Serviços", href: "/servicos" },
  { rotulo: LINHA.nomeCurto },
];

export default async function PeliculaRefletiva() {
  const galeria = await galeriaPorChave("linha-refletiva");

  return (
    <>
      <DadosEstruturados
        dados={[
          esquemaDeTrilha(trilha),
          esquemaDeServico({ nome: LINHA.nome, descricao: LINHA.frase, url: LINHA.url }),
          esquemaDeFaq(duvidas),
        ]}
      />

      {/* Bloco 1 — Hero */}
      <HeroSimples
        trilha={trilha}
        titulo="Película Refletiva: privacidade de dia e menos ofuscamento"
        lead="A Black Silver II tem dupla tonalidade: espelhada para quem olha de fora, fumê para quem está dentro. Você enxerga a rua; a rua não enxerga você."
        foto="srv-galeria-5"
        acoes={
          <>
            <BotaoLink href="/contato?tipo=empresa">Solicitar visita técnica</BotaoLink>
            <BotaoDeWhatsapp codigo="WA-REF-EMP" />
          </>
        }
      />

      <Secao fundo="pagina" className="!py-10">
        <div className="grid grid-cols-2 gap-8 lg:gap-10">
          <Dado
            valor={NUMEROS.refletiva.reflexao}
            rotulo="de reflexão externa"
            tom="acento"
          />
          <Dado valor="Dupla" rotulo="tonalidade: espelhada e fumê" tom="acento" />
        </div>
      </Secao>

      {/* Bloco 2 — O que ela faz */}
      <Secao fundo="pagina">
        <CabecalhoDeSecao sobrancelha="O que ela faz" titulo="Ver sem ser visto" />
        <dl className="mt-10 grid gap-8 sm:grid-cols-2 lg:gap-10">
          {oQueFaz.map((item) => (
            <div key={item.titulo} className="flex flex-col gap-2">
              <dt className="t-h5 text-texto-forte">{item.titulo}</dt>
              <dd className="t-corpo-p text-texto-suave">{item.texto}</dd>
            </div>
          ))}
        </dl>
      </Secao>

      {/* Bloco 3 — Como funciona */}
      <Secao fundo="sutil">
        <CabecalhoDeSecao
          sobrancelha="Como funciona"
          titulo="Por que o espelhamento funciona"
          lead="O efeito espelhado acontece quando o lado de fora está mais claro que o lado de dentro. Durante o dia, quem está na rua vê o próprio reflexo. Quem está dentro vê a rua normalmente, com um tom fumê."
          largura="860px"
        />
      </Secao>

      {/* Bloco 4 — Onde aplicar. Aqui a coluna de empresa vem primeiro. */}
      <OndeAplicar
        titulo="Onde a Refletiva faz diferença"
        colunas={[
          {
            publico: "empresa",
            texto:
              "Privacidade para reuniões e atendimentos, sem persiana fechada o dia todo.",
            ambientes: [
              "Escritórios comerciais",
              "Salas de reunião",
              "Recepções de frente para a rua",
              "Fachadas de vidro",
            ],
            codigo: "WA-REF-EMP",
          },
          {
            publico: "casa",
            texto:
              "Para janelas voltadas para a rua ou para o vizinho, e para o home office que recebe sol forte.",
            ambientes: [
              "Home office",
              "Janelas voltadas para a rua",
              "Vidros com sol forte da tarde",
            ],
            codigo: "WA-REF-CASA",
          },
        ]}
      />

      {/* Bloco 5 — Transparência */}
      <Secao fundo="pagina">
        <CabecalhoDeSecao
          sobrancelha="Transparência"
          titulo="O que você precisa saber antes de escolher"
        />
        <dl className="mt-10 grid gap-8 lg:grid-cols-3">
          {antesDeEscolher.map((item) => (
            <div key={item.titulo} className="flex flex-col gap-2">
              <dt className="t-h5 text-texto-forte">{item.titulo}</dt>
              <dd className="t-corpo-p text-texto-suave">{item.texto}</dd>
            </div>
          ))}
        </dl>
      </Secao>

      {/* Bloco 6 — Compare as linhas */}
      <CompararLinhas atual={LINHA.slug} />

      {/* Bloco 7 — Obras */}
      {galeria && (
        <Galeria
          sobrancelha={galeria.sobrancelha}
          titulo={galeria.titulo}
          lead={galeria.lead}
          itens={galeria.itens}
        />
      )}

      {/* Bloco 8 — Dúvidas */}
      <Secao fundo="pagina">
        <CabecalhoDeSecao
          sobrancelha="Dúvidas"
          titulo="Dúvidas sobre a película refletiva"
        />
        <div className="mt-10">
          <ListaDeFaq duvidas={duvidas} />
        </div>
      </Secao>

      {/* Bloco 9 — Chamada final */}
      <FaixaDeCta
        titulo="Privacidade sem fechar a persiana"
        lead="Na visita, mostramos uma amostra da Black Silver II no seu vidro para você ver o efeito dos dois lados."
        rotuloPrimario="Solicitar visita técnica"
        hrefPrimario="/contato?tipo=empresa"
        codigo="WA-REF-EMP"
      />
    </>
  );
}
