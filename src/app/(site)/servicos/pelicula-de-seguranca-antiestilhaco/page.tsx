import type { Metadata } from "next";

import { DadosEstruturados } from "@/components/conteudo/DadosEstruturados";
import { BotaoDeWhatsapp } from "@/components/sections/BotaoDeWhatsapp";
import { CompararLinhas } from "@/components/sections/CompararLinhas";
import { FaixaDeCta } from "@/components/sections/FaixaDeCta";
import { Galeria } from "@/components/sections/Galeria";
import { HeroSimples } from "@/components/sections/Heros";
import { LinkDeArtigo } from "@/components/sections/LinkDeArtigo";
import { OndeAplicar } from "@/components/sections/OndeAplicar";
import { BotaoLink } from "@/components/ui/Botao";
import { Dado, Passo } from "@/components/ui/Elementos";
import { ListaDeFaq, type Duvida } from "@/components/ui/Faq";
import { CabecalhoDeSecao, Secao } from "@/components/ui/Secao";
import { ARTIGOS } from "@/content/blog";
import { linhaPorSlug, NUMEROS } from "@/content/linhas";
import { galeriaPorChave } from "@/lib/dados/galerias";
import { esquemaDeFaq, esquemaDeServico, esquemaDeTrilha } from "@/lib/schema";

/**
 * Película de Segurança Antiestilhaço PS4.
 *
 * Nasce no lugar de /servicos/seguranca-e-anti-vandalismo, que só publicava a
 * casca "Texto em produção" com `noindex`. O redirecionamento permanente da URL
 * antiga está em next.config.mjs.
 *
 * Sem menção à NBR 7199 nesta página: a revisão de copy pede confirmação com o
 * fabricante sobre em quais aplicações a PS4 atende à norma antes de publicar a
 * afirmação. O artigo do blog que explica a norma continua linkado nas dúvidas.
 */

const LINHA = linhaPorSlug("pelicula-de-seguranca-antiestilhaco")!;

export const metadata: Metadata = {
  title: { absolute: "Película de Segurança Antiestilhaço | RR Film Itatiba" },
  description:
    "Se o vidro quebrar, os cacos ficam presos na película. Proteção para portas de correr, box e sacadas. Agende uma visita.",
  alternates: { canonical: LINHA.url },
  openGraph: {
    title: "Película de Segurança Antiestilhaço | RR Film",
    description:
      "Uma película espessa que absorve o impacto e mantém todos os fragmentos colados caso o vidro se rompa.",
    images: ["/fotos/srv-galeria-3.jpg"],
  },
};

const oQueFaz = [
  {
    titulo: "Retém os estilhaços",
    texto:
      "Se o vidro quebrar, os pedaços ficam presos na película, em vez de se espalharem pelo chão.",
  },
  {
    titulo: "Vidro mais resistente",
    texto: `Aumenta em até ${NUMEROS.seguranca.resistencia} a resistência do vidro ao impacto.`,
  },
  {
    titulo: "Película espessa",
    texto: `${NUMEROS.seguranca.espessura}, projetada para absorver impacto direto.`,
  },
  {
    titulo: "Transparente",
    texto: "Não muda a aparência do vidro.",
  },
];

const comoAplicamos = [
  {
    numero: "01",
    titulo: "Medição gratuita no local",
    descricao: "Avaliamos cada vidro e o risco de cada ambiente.",
  },
  {
    numero: "02",
    titulo: "Indicação explicada",
    descricao: "Você entende por que essa película é a certa.",
  },
  {
    numero: "03",
    titulo: "Instalação com equipe própria",
    descricao: "Sem desocupar o ambiente.",
  },
  {
    numero: "04",
    titulo: "Garantia do serviço",
    // O prazo da PS4 depende da ficha do fabricante — informado na visita, não aqui.
    descricao: "Informamos o prazo de garantia da PS4 na visita, por escrito.",
  },
];

const duvidas: Duvida[] = [
  {
    pergunta: "É a mesma coisa que vidro laminado?",
    resposta:
      "Não. O laminado já vem de fábrica com a camada de segurança. A película é aplicada no vidro que você já tem, sem troca.",
  },
  {
    pergunta: "É blindagem?",
    resposta:
      "Não. Ela retém os estilhaços e aumenta a resistência, mas não é à prova de balas nem de arrombamento.",
  },
  {
    pergunta: "Fica visível no vidro?",
    resposta: "Não. A película é transparente.",
  },
  {
    pergunta: "Serve para box de banheiro?",
    resposta: "Sim. É uma das aplicações mais indicadas.",
  },
];

const trilha = [
  { rotulo: "Início", href: "/" },
  { rotulo: "Serviços", href: "/servicos" },
  { rotulo: LINHA.nomeCurto },
];

export default async function PeliculaDeSeguranca() {
  const galeria = await galeriaPorChave("linha-seguranca");

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
        titulo="Película de Segurança Antiestilhaço: o vidro quebra, os cacos ficam"
        lead="Uma película espessa que absorve o impacto e mantém todos os fragmentos colados caso o vidro se rompa. Proteção ativa contra acidentes graves em casa e no trabalho."
        foto="srv-galeria-3"
        acoes={
          <>
            <BotaoLink href="/contato">Agendar medição gratuita</BotaoLink>
            <BotaoDeWhatsapp codigo="WA-SEG-CASA" />
          </>
        }
      />

      <Secao fundo="pagina" className="!py-10">
        <div className="grid grid-cols-2 gap-8 lg:gap-10">
          <Dado
            valor={NUMEROS.seguranca.espessura}
            rotulo="de espessura da película"
            tom="acento"
          />
          <Dado
            valor={`até ${NUMEROS.seguranca.resistencia}`}
            rotulo="mais resistência ao impacto"
            tom="acento"
          />
        </div>
      </Secao>

      {/* Bloco 2 — O que ela faz */}
      <Secao fundo="pagina">
        <CabecalhoDeSecao
          sobrancelha="O que ela faz"
          titulo="Proteção que você só percebe quando precisa"
        />
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
          titulo="Por que o vidro comum é o maior risco da casa"
          lead="Vidro comum quebra em pedaços grandes e cortantes. Portas de correr e janelas grandes ficam exatamente na altura de crianças e pets. A película de segurança funciona como uma membrana: o vidro pode trincar, mas permanece unido."
          largura="860px"
        />
      </Secao>

      {/* Bloco 4 — Onde aplicar */}
      <OndeAplicar
        titulo="Onde a película de segurança faz diferença"
        colunas={[
          {
            publico: "casa",
            texto:
              "Para quem tem crianças pequenas ou pets e convive com portas de correr, sacadas e box de vidro.",
            ambientes: [
              "Portas de correr da sala",
              "Janelas grandes de vidro comum ou temperado",
              "Box de banheiro",
              "Sacadas e guarda-corpos",
            ],
            codigo: "WA-SEG-CASA",
          },
          {
            publico: "empresa",
            texto:
              "Segurança para áreas de circulação de clientes, alunos e pacientes, e mais resistência em fachadas e vitrines.",
            ambientes: [
              "Fachadas e vitrines",
              "Escolas e clínicas",
              "Corredores e áreas comuns",
              "Lojas de rua",
            ],
            codigo: "WA-SEG-EMP",
          },
        ]}
      />

      {/* Bloco 5 — Transparência */}
      <Secao fundo="pagina">
        <CabecalhoDeSecao
          sobrancelha="Transparência"
          titulo="O que a película de segurança não faz"
          lead="Antiestilhaço não é blindagem. Ela não torna o vidro inquebrável nem impede uma invasão determinada. O que ela faz é reter os fragmentos e dificultar a quebra, reduzindo o risco de acidentes. Também não é foco dela reduzir calor: para isso, indicamos a Nanocerâmica."
          largura="860px"
        />
      </Secao>

      {/* Bloco 6 — Compare as linhas */}
      <CompararLinhas atual={LINHA.slug} />

      {/* Bloco 7 — Obras. Sem galeria cadastrada no painel, a seção não aparece. */}
      {galeria && (
        <Galeria
          sobrancelha={galeria.sobrancelha}
          titulo={galeria.titulo}
          lead={galeria.lead}
          itens={galeria.itens}
        />
      )}

      {/* Bloco 8 — Como aplicamos */}
      <Secao fundo="pagina">
        <CabecalhoDeSecao sobrancelha="Como aplicamos" titulo="Da medição à instalação" />
        <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {comoAplicamos.map((passo) => (
            <Passo key={passo.numero} {...passo} />
          ))}
        </div>
      </Secao>

      {/* Bloco 9 — Dúvidas */}
      <Secao fundo="pagina">
        <CabecalhoDeSecao
          sobrancelha="Dúvidas"
          titulo="Dúvidas sobre a película de segurança"
        />
        <div className="mt-10">
          <ListaDeFaq duvidas={duvidas} />
        </div>
        <div className="mt-8">
          <LinkDeArtigo slug={ARTIGOS.nbr7199.slug} titulo={ARTIGOS.nbr7199.titulo} />
        </div>
      </Secao>

      {/* Bloco 10 — Chamada final */}
      <FaixaDeCta
        titulo="Proteja quem circula perto do vidro"
        lead="Na visita gratuita, avaliamos cada vidro da casa ou da empresa e indicamos onde a película de segurança faz diferença."
        codigo="WA-SEG-CASA"
      />
    </>
  );
}
