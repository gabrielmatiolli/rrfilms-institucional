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
 * Vinil Jateado e Decorativo.
 *
 * Nasce no lugar de /servicos/privacidade-e-jateado (redirecionamento em
 * next.config.mjs), que publicava a casca "Texto em produção" com `noindex` e
 * usava a foto "amostra-frescor" como imagem de compartilhamento — uma amostra
 * de outra linha.
 *
 * Como a Refletiva, abre pela coluna de empresa: divisória de escritório e de
 * consultório é o que mais chega.
 */

const LINHA = linhaPorSlug("vinil-jateado-decorativo")!;

export const metadata: Metadata = {
  title: { absolute: "Película Jateada e Vinil Decorativo | RR Film" },
  description:
    "Privacidade elegante para divisórias, box e portas de vidro. Efeito jateado, faixas e recortes sob medida. Peça seu projeto.",
  alternates: { canonical: LINHA.url },
  openGraph: {
    title: "Vinil Jateado e Decorativo | RR Film",
    description:
      "Efeito fosco, faixas e recortes sob medida para dividir ambientes e dar privacidade sem bloquear a luz.",
    images: [LINHA.foto ?? "/fotos/srv-galeria-6.jpg"],
  },
};

const oQueFaz = [
  {
    titulo: "Privacidade total na área aplicada",
    texto: "O vidro fica translúcido e impede a visão de um lado para o outro.",
  },
  {
    titulo: "Luz preservada",
    texto: `Mantém ${NUMEROS.jateado.luz} da luz, sem deixar o ambiente fechado.`,
  },
  {
    titulo: "Sob medida",
    texto: "Faixas, recortes geométricos, cores e aplicação de identidade visual.",
  },
  {
    titulo: "Removível",
    texto:
      "Pode ser trocado quando o layout ou a marca mudar, sem trocar o vidro.",
  },
];

/**
 * Os acabamentos. A revisão de copy pede confirmação com a RR Film de quais
 * opções ela oferece antes de publicar — e uma foto real de cada uma. Até lá a
 * seção descreve os efeitos sem prometer catálogo.
 */
const acabamentos = [
  {
    titulo: "Jateado total",
    texto: "O vidro inteiro fosco, para box e divisórias de consultório.",
  },
  {
    titulo: "Faixas",
    texto: "Privacidade na altura dos olhos e luz no resto do vidro.",
  },
  {
    titulo: "Recortes e desenhos",
    texto: "Padrões geométricos, logotipo ou grafismo da marca.",
  },
  {
    titulo: "Colorido",
    texto: "Vinil translúcido colorido para destacar ambientes.",
  },
];

const duvidas: Duvida[] = [
  {
    pergunta: "Dá para fazer desenho ou logotipo?",
    resposta:
      "Sim. Fazemos recortes sob medida a partir do seu arquivo ou do projeto do arquiteto.",
  },
  {
    pergunta: "É fácil de limpar?",
    resposta:
      "Sim. Pano macio e água com detergente neutro. Evite produto abrasivo e espátula.",
  },
  {
    pergunta: "Dá para remover depois?",
    resposta: "Sim, sem danificar o vidro.",
  },
  {
    pergunta: "Mantém a claridade?",
    resposta: `Sim. O vidro fica translúcido e preserva ${NUMEROS.jateado.luz} da luz.`,
  },
];

const trilha = [
  { rotulo: "Início", href: "/" },
  { rotulo: "Serviços", href: "/servicos" },
  { rotulo: LINHA.nomeCurto },
];

export default async function VinilJateado() {
  const galeria = await galeriaPorChave("linha-jateado");

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
        titulo="Vinil Jateado e Decorativo: privacidade com design"
        lead="Efeito fosco, faixas e recortes sob medida para dividir ambientes e dar privacidade sem bloquear a luz. Um acabamento limpo, que conversa com o projeto de arquitetura."
        foto="srv-galeria-6"
        acoes={
          <>
            <BotaoLink href="/contato?tipo=empresa">Solicitar visita técnica</BotaoLink>
            <BotaoDeWhatsapp codigo="WA-JAT-EMP" />
          </>
        }
      />

      <Secao fundo="pagina" className="!py-10">
        <div className="grid grid-cols-2 gap-8 lg:gap-10">
          <Dado valor={NUMEROS.jateado.luz} rotulo="da luz preservada" tom="acento" />
          <Dado valor="Sob medida" rotulo="faixas, recortes e cores" tom="acento" />
        </div>
      </Secao>

      {/* Bloco 2 — O que ele faz */}
      <Secao fundo="pagina">
        <CabecalhoDeSecao
          sobrancelha="O que ele faz"
          titulo="Privacidade que deixa a luz passar"
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

      {/* Bloco 3 — Opções de acabamento */}
      <Secao fundo="sutil">
        <CabecalhoDeSecao sobrancelha="Acabamentos" titulo="Escolha o efeito" />
        <dl className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {acabamentos.map((item) => (
            <div
              key={item.titulo}
              className="flex flex-col gap-2 rounded-xl border border-vidro-borda bg-vidro-preenchimento p-6 vidro-01"
            >
              <dt className="t-h5 text-texto-forte">{item.titulo}</dt>
              <dd className="t-corpo-p text-texto-suave">{item.texto}</dd>
            </div>
          ))}
        </dl>
      </Secao>

      {/* Bloco 4 — Onde aplicar. Aqui a coluna de empresa vem primeiro. */}
      <OndeAplicar
        titulo="Onde o jateado faz diferença"
        colunas={[
          {
            publico: "empresa",
            texto:
              "Divisórias com privacidade e acabamento de projeto para escritórios, clínicas e consultórios. Trabalhamos em parceria com arquitetos.",
            ambientes: [
              "Divisórias de escritório",
              "Consultórios e salas de atendimento",
              "Salas de reunião",
              "Portas de vidro com identidade visual",
            ],
            codigo: "WA-JAT-EMP",
          },
          {
            publico: "casa",
            texto: "Privacidade elegante para banheiros e portas de vidro, sem cortina.",
            ambientes: [
              "Box de banheiro",
              "Portas de vidro de cozinha",
              "Janelas de banheiro e lavabo",
            ],
            codigo: "WA-JAT-CASA",
          },
        ]}
      />

      {/* Bloco 5 — Transparência */}
      <Secao fundo="pagina">
        <CabecalhoDeSecao
          sobrancelha="Transparência"
          titulo="O que o jateado não faz"
          lead="O foco do vinil jateado é privacidade e estética. Ele não é uma solução de conforto térmico nem de segurança. Se o vidro também recebe sol forte, indicamos combinar com a Nanocerâmica; se há risco de quebra, com a película de segurança."
          largura="860px"
        />
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
        <CabecalhoDeSecao sobrancelha="Dúvidas" titulo="Dúvidas sobre o vinil jateado" />
        <div className="mt-10">
          <ListaDeFaq duvidas={duvidas} />
        </div>
      </Secao>

      {/* Bloco 9 — Chamada final */}
      <FaixaDeCta
        titulo="Privacidade que valoriza o ambiente"
        lead="Envie a planta ou fotos dos vidros pelo WhatsApp e agende a visita técnica."
        rotuloPrimario="Solicitar visita técnica"
        hrefPrimario="/contato?tipo=empresa"
        codigo="WA-JAT-EMP"
      />
    </>
  );
}
