import type { Metadata } from "next";

import { DadosEstruturados } from "@/components/conteudo/DadosEstruturados";
import { BotaoDeWhatsapp } from "@/components/sections/BotaoDeWhatsapp";
import { CompararLinhas } from "@/components/sections/CompararLinhas";
import { FaixaDeCta } from "@/components/sections/FaixaDeCta";
import { Galeria } from "@/components/sections/Galeria";
import { HeroSimples } from "@/components/sections/Heros";
import { LinkDeArtigo } from "@/components/sections/LinkDeArtigo";
import { OndeAplicar } from "@/components/sections/OndeAplicar";
import { BotaoExterno, BotaoLink } from "@/components/ui/Botao";
import { Dado, Passo } from "@/components/ui/Elementos";
import { ListaDeFaq, type Duvida } from "@/components/ui/Faq";
import { IconeSetaDireita } from "@/components/ui/Icone";
import { CabecalhoDeSecao, Secao } from "@/components/ui/Secao";
import { ARTIGOS } from "@/content/blog";
import { linhaPorSlug, NUMEROS } from "@/content/linhas";
import { galeriaPorChave } from "@/lib/dados/galerias";
import { esquemaDeFaq, esquemaDeServico, esquemaDeTrilha } from "@/lib/schema";

/**
 * Película Nanocerâmica Ultra HD.
 *
 * Substitui /produtos/nanoceramica-ultra-hd, que continua respondendo por
 * redirecionamento permanente (ver next.config.mjs). Os números vêm todos de
 * src/content/linhas.ts: esta página é a que mais os repete, e era onde a
 * revisão de copy encontrou "95%" convivendo com "79%" e "99%" com "99,9%".
 */

const LINHA = linhaPorSlug("pelicula-nanoceramica")!;

/**
 * O laudo técnico do fabricante (Sun Blue Nano Ceramic), enviado pela RR Film
 * em 04/11/2026. É a fonte dos números desta página — ver `NUMEROS` em
 * src/content/linhas.ts. Fica em `public/`, então entra no ZIP do deploy.
 */
const FICHA_TECNICA_PDF = "/documentos/laudo-tecnico-nanoceramica-ultra-hd.pdf";

export const metadata: Metadata = {
  title: { absolute: "Película Nanocerâmica em Itatiba e região | RR Film" },
  description: `Menos calor sem escurecer o vidro. Bloqueio de ${NUMEROS.nanoceramica.uv} dos raios UV e vista preservada. Agende a medição gratuita.`,
  alternates: { canonical: LINHA.url },
  openGraph: {
    title: "Película Nanocerâmica Ultra HD | RR Film",
    description:
      "O máximo em conforto térmico e bloqueio de radiação sem escurecer o ambiente, sem mudar a fachada e sem perder a vista.",
    images: [LINHA.foto ?? "/fotos/prod-galeria-1.jpg"],
  },
};

const oQueMuda = [
  {
    titulo: "Ambiente mais fresco",
    texto: `A película rejeita até ${NUMEROS.nanoceramica.calor} do calor infravermelho que entra pelo vidro.`,
  },
  {
    titulo: "Claridade e vista preservadas",
    texto: `Mantém ${NUMEROS.nanoceramica.luz} da luz natural. O vidro continua transparente.`,
  },
  {
    titulo: "Móveis e pele protegidos",
    texto: `Bloqueia ${NUMEROS.nanoceramica.uv} dos raios UV, principal causa do desbotamento de pisos de madeira, estofados e móveis.`,
  },
  {
    titulo: "Fachada sem alteração",
    texto: "Não espelha nem muda a cor do vidro visto de fora.",
  },
];

const comoAplicamos = [
  {
    numero: "01",
    titulo: "Medição gratuita no local",
    descricao: "Com termômetro infravermelho e medidor de UV.",
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
    titulo: `Garantia de ${NUMEROS.nanoceramica.garantia}`,
    descricao: "Entregue por escrito, junto com a orientação de limpeza.",
  },
];

const duvidas: Duvida[] = [
  {
    pergunta: "Ela escurece o ambiente?",
    resposta: `Não. Mantém ${NUMEROS.nanoceramica.luz} da luz natural e a vista para fora.`,
  },
  {
    pergunta: "Muda a cor da fachada?",
    resposta: "Não. Ela não tem efeito espelhado.",
  },
  {
    pergunta: "Atrapalha o sinal de celular ou Wi-Fi?",
    resposta:
      "Películas nanocerâmicas normalmente não são metálicas e não interferem no sinal. Na visita confirmamos o comportamento da película indicada para o seu vidro.",
  },
  {
    pergunta: "Dá para remover depois?",
    resposta: "Sim. A remoção é feita pela nossa equipe sem danificar o vidro.",
  },
  {
    pergunta: "Quanto tempo dura?",
    resposta: `Garantia de ${NUMEROS.nanoceramica.garantia}.`,
  },
];

const trilha = [
  { rotulo: "Início", href: "/" },
  { rotulo: "Serviços", href: "/servicos" },
  { rotulo: LINHA.nomeCurto },
];

export default async function PeliculaNanoceramica() {
  const galeria = await galeriaPorChave("produto-nanoceramica");

  return (
    <>
      <DadosEstruturados
        dados={[
          esquemaDeTrilha(trilha),
          esquemaDeServico({
            nome: LINHA.nome,
            descricao: LINHA.frase,
            url: LINHA.url,
          }),
          esquemaDeFaq(duvidas),
        ]}
      />

      {/* Bloco 1 — Hero */}
      <HeroSimples
        trilha={trilha}
        titulo="Película Nanocerâmica Ultra HD: menos calor, a mesma luz"
        lead="O máximo em conforto térmico e bloqueio de radiação sem escurecer o ambiente, sem mudar a fachada e sem perder a vista."
        foto="prod-hero"
        acoes={
          <>
            <BotaoLink href="/contato">Agendar medição gratuita</BotaoLink>
            <BotaoDeWhatsapp codigo="WA-NANO-CASA" />
          </>
        }
      />

      {/* Os três números oficiais da linha */}
      <Secao fundo="pagina" className="!py-10">
        <div className="grid grid-cols-2 gap-8 lg:grid-cols-4 lg:gap-10">
          <Dado
            valor={`até ${NUMEROS.nanoceramica.calor}`}
            rotulo="de rejeição do calor infravermelho"
            tom="acento"
          />
          <Dado
            valor={NUMEROS.nanoceramica.uv}
            rotulo="dos raios UV bloqueados"
            tom="acento"
          />
          <Dado
            valor={NUMEROS.nanoceramica.luz}
            rotulo="da luz natural mantida"
            tom="acento"
          />
          <Dado
            valor={NUMEROS.nanoceramica.garantia}
            rotulo="de garantia"
            tom="acento"
          />
        </div>
      </Secao>

      {/* Bloco 2 — O que você sente */}
      <Secao fundo="pagina">
        <CabecalhoDeSecao
          sobrancelha="O que você sente"
          titulo="O que muda no primeiro dia de sol"
        />
        <dl className="mt-10 grid gap-8 sm:grid-cols-2 lg:gap-10">
          {oQueMuda.map((item) => (
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
          titulo="Por que ela refresca sem escurecer"
          lead="O calor do sol chega principalmente pela radiação infravermelha, que não enxergamos. As partículas de cerâmica da película barram essa radiação e deixam passar a luz visível. Por isso o ambiente esfria sem ficar escuro. Película mais escura não significa mais conforto."
          largura="860px"
        />
        <div className="mt-6">
          <LinkDeArtigo
            slug={ARTIGOS.peliculaEscuraNaoRefresca.slug}
            titulo={ARTIGOS.peliculaEscuraNaoRefresca.titulo}
          />
        </div>
      </Secao>

      {/* Bloco 4 — Proteção UV. O card "Proteção UV" de /servicos virou esta seção. */}
      <Secao fundo="pagina" id="protecao-uv" className="scroll-mt-32">
        <CabecalhoDeSecao
          sobrancelha="Proteção UV"
          titulo="Proteção UV para móveis, pisos e pele"
          lead={`Os raios ultravioleta atravessam o vidro comum e desbotam pisos de madeira, tecidos, quadros e móveis de alto padrão. A Nanocerâmica Ultra HD bloqueia ${NUMEROS.nanoceramica.uv} desses raios e protege também a pele de quem passa o dia perto da janela.`}
          largura="860px"
        />
      </Secao>

      {/* Bloco 5 — Onde aplicar */}
      <OndeAplicar
        titulo="Onde a Nanocerâmica faz diferença"
        colunas={[
          {
            publico: "casa",
            texto:
              "Para quem quer acabar com o calor da tarde na sala sem fechar a cortina e perder a vista.",
            ambientes: [
              "Sacadas integradas",
              "Salas com grandes panos de vidro",
              "Quartos de casal e infantis",
              "Home office",
            ],
            codigo: "WA-NANO-CASA",
          },
          {
            publico: "empresa",
            texto:
              "Conforto térmico para equipe, clientes e pacientes, sem alterar a fachada nem o projeto de arquitetura.",
            ambientes: [
              "Recepções e salas de espera",
              "Escritórios com fachada de vidro",
              "Clínicas e consultórios",
              "Lojas com vitrine",
            ],
            codigo: "WA-NANO-EMP",
          },
        ]}
      />

      {/* Bloco 6 — Transparência */}
      <Secao fundo="pagina">
        <CabecalhoDeSecao
          sobrancelha="Transparência"
          titulo="O que a Nanocerâmica não faz"
          lead="Ela não dá privacidade: quem está fora continua vendo dentro. Para privacidade, indicamos a Refletiva ou o Jateado. O resultado também varia com a orientação do vidro e o tipo de vidro, por isso medimos antes de indicar."
          largura="860px"
        />
      </Secao>

      {/* Bloco 7 — Compare as linhas */}
      <CompararLinhas atual={LINHA.slug} />

      {/* Bloco 8 — Obras */}
      {galeria && (
        <Galeria
          sobrancelha={galeria.sobrancelha}
          titulo={galeria.titulo}
          lead={galeria.lead}
          itens={galeria.itens}
        />
      )}

      {/* Bloco 9 — Como aplicamos */}
      <Secao fundo="pagina">
        <CabecalhoDeSecao sobrancelha="Como aplicamos" titulo="Da medição à instalação" />
        <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {comoAplicamos.map((passo) => (
            <Passo key={passo.numero} {...passo} />
          ))}
        </div>
        <div className="mt-10 flex flex-col items-start gap-3">
          {/* PDF estático: abre em outra aba, fora do roteador do Next. */}
          <BotaoExterno
            href={FICHA_TECNICA_PDF}
            target="_blank"
            rel="noopener noreferrer"
            tipo="fantasma"
            tamanho="M"
            icone={<IconeSetaDireita tamanho={18} />}
          >
            Baixar ficha técnica (PDF)
          </BotaoExterno>
          <p className="t-micro text-texto-suave">
            Laudo técnico do fabricante, com os ensaios de luz visível, rejeição de
            infravermelho e bloqueio de UV.
          </p>
        </div>
      </Secao>

      {/* Bloco 10 — Dúvidas */}
      <Secao fundo="pagina">
        <CabecalhoDeSecao sobrancelha="Dúvidas" titulo="Dúvidas sobre a Nanocerâmica" />
        <div className="mt-10">
          <ListaDeFaq duvidas={duvidas} />
        </div>
      </Secao>

      {/* Bloco 11 — Chamada final */}
      <FaixaDeCta
        titulo="Descubra quanto calor o seu vidro deixa entrar"
        lead="Na medição gratuita, você vê no termômetro a diferença que a película faz no seu próprio vidro."
        codigo="WA-NANO-CASA"
      />
    </>
  );
}
