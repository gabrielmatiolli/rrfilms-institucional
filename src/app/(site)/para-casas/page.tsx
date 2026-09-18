import type { Metadata } from "next";

import {
  CardDeServico,
  Depoimento,
  type ServicoDeCard,
} from "@/components/cards/Cartoes";
import { FaixaDeCta } from "@/components/sections/FaixaDeCta";
import { Galeria } from "@/components/sections/Galeria";
import { ChipDoHeroi, HeroDividido } from "@/components/sections/Heros";
import { BotaoExterno, BotaoLink } from "@/components/ui/Botao";
import { CardDeBeneficio, Passo } from "@/components/ui/Elementos";
import { ListaDeFaq } from "@/components/ui/Faq";
import {
  IconeCertificado,
  IconeRelogio,
  IconeWhatsapp,
} from "@/components/ui/Icone";
import { CabecalhoDeSecao, Secao } from "@/components/ui/Secao";
import { contatoDoSite, whatsappCom } from "@/lib/dados/configuracao";
import { galeriaPorChave } from "@/lib/dados/galerias";
import { fotos } from "@/content/fotos";

export const metadata: Metadata = {
  title: "Para casas",
  description:
    "Película residencial para quem tem uma janela grande e um problema grande. Sem escurecer o ambiente, sem obra, sem trocar o vidro.",
};

const problema = [
  {
    icone: "termometro" as const,
    titulo: "“Depois das 15h ninguém fica aqui”",
    descricao:
      "O vidro absorve e devolve calor pra dentro a tarde inteira. A película barra a radiação antes de ela virar calor.",
  },
  {
    icone: "gota" as const,
    titulo: "“Meu sofá desbotou em dois anos”",
    descricao:
      "O ultravioleta atravessa vidro comum sem resistência. Com 99% de bloqueio, tecido e madeira mantêm a cor.",
  },
  {
    icone: "privacidade" as const,
    titulo: "“Do prédio da frente dá pra ver tudo”",
    descricao:
      "Película de privacidade fecha a visão de fora mantendo a sua de dentro — diferente de aplicar fosco nos dois sentidos.",
  },
];

const ambientes: ServicoDeCard[] = [
  {
    linha: "conforto",
    tag: "Nanocerâmica Ultra HD",
    titulo: "Sala e living",
    descricao:
      "Janela grande virada para o poente. Aqui o calor é o que mais pesa — a gente prioriza barrar o sol mantendo o ambiente claro.",
    foto: fotos["casas-ambiente-1"],
    dados: [
      { valor: "79%", rotulo: "menos calor" },
      { valor: "70%", rotulo: "de luz preservada" },
    ],
    href: "/produtos/nanoceramica-ultra-hd",
  },
  {
    linha: "luz",
    tag: "Decorativa",
    titulo: "Quarto",
    descricao:
      "Sono e privacidade mandam. Combinamos controle solar com película de privacidade nas faces expostas a vizinho.",
    foto: fotos["casas-ambiente-2"],
    dados: [
      { valor: "0%", rotulo: "de visão externa" },
      { valor: "99%", rotulo: "bloqueio UV" },
    ],
    href: "/servicos#decorativa",
  },
  {
    linha: "frescor",
    tag: "Segurança",
    titulo: "Varanda e cobertura",
    descricao:
      "Vidro laminado, muita área e vento. Filme de baixa absorção para não gerar estresse térmico, com proteção UV total.",
    foto: fotos["casas-ambiente-3"],
    dados: [
      { valor: "baixa", rotulo: "absorção térmica" },
      { valor: "99,9%", rotulo: "de UV bloqueado" },
    ],
    href: "/servicos#seguranca",
  },
];

const falas = [
  {
    citacao:
      "“A sala não dava pra usar depois das 15h. Colocaram a película num sábado, sem sujeira, e na segunda já dava pra usar. Um ano depois, nenhuma bolha.”",
    nome: "Marina Alcântara",
    contexto: "Casa em condomínio · Itatiba, SP",
  },
  {
    citacao:
      "“Pedi orçamento de cinco empresas. Foi a única que foi medir antes de mandar preço — e a única que explicou por que a película mais escura não era a melhor pra minha varanda.”",
    nome: "Camila Prado",
    contexto: "Casa em condomínio · Jundiaí",
  },
];

const processo = [
  {
    numero: "01",
    titulo: "Visita e medição",
    descricao:
      "Um técnico vai até sua casa, mede os vidros e vê de onde vem o sol em cada janela.",
  },
  {
    numero: "02",
    titulo: "Proposta",
    descricao:
      "Você recebe a indicação ambiente por ambiente, com preço fechado. Sem letra miúda.",
  },
  {
    numero: "03",
    titulo: "Aplicação",
    descricao:
      "Equipe própria, obra limpa, ambiente liberado no mesmo dia. Móvel volta pro lugar.",
  },
  {
    numero: "04",
    titulo: "Garantia",
    descricao:
      "Garantia de 15 anos por escrito e revisão sem custo no primeiro ano.",
  },
];

const duvidas = [
  {
    pergunta: "Preciso de autorização do condomínio?",
    resposta:
      "Depende da convenção. Películas aplicadas na face interna do vidro normalmente não alteram a fachada e dispensam aprovação — mas as espelhadas e as de tonalidade forte mudam o aspecto externo. Levamos a amostra e o laudo para você apresentar.",
  },
  {
    pergunta: "Posso limpar normalmente?",
    resposta:
      "Sim, depois de 30 dias de cura. Pano macio e água com detergente neutro. Evite produto abrasivo e espátula.",
  },
  {
    pergunta: "Funciona em janela de correr com vidro fino?",
    resposta:
      "Funciona, e é justamente onde o ganho é maior. Vidro de 4 mm sem película deixa passar quase toda a carga térmica.",
  },
];

export default async function ParaCasas() {
  const [galeria, contato] = await Promise.all([
    galeriaPorChave("para-casas"),
    contatoDoSite(),
  ]);

  return (
    <>
      <HeroDividido
        trilha={[{ rotulo: "Início", href: "/" }, { rotulo: "Para casas" }]}
        titulo="A sala das 15h volta a ser sala"
        lead="Película residencial para quem tem uma janela grande e um problema grande. Sem escurecer o ambiente, sem obra, sem trocar o vidro."
        foto="casas-hero"
        tom="conforto"
        acoes={
          <>
            <BotaoLink href="/contato">Agendar visita grátis</BotaoLink>
            <BotaoExterno
              href={whatsappCom(
                contato.whatsapp,
                "Olá! Quero uma visita para película residencial.",
              )}
              target="_blank"
              rel="noopener noreferrer"
              tipo="vidro"
              icone={<IconeWhatsapp tamanho={20} />}
            >
              Falar no WhatsApp
            </BotaoExterno>
          </>
        }
        chips={
          <>
            <ChipDoHeroi icone={<IconeRelogio tamanho={18} />}>
              Aplicação em 1 dia
            </ChipDoHeroi>
            <ChipDoHeroi icone={<IconeCertificado tamanho={18} />}>
              Garantia de 15 anos
            </ChipDoHeroi>
          </>
        }
      />

      <Secao fundo="pagina">
        <CabecalhoDeSecao
          sobrancelha="O problema"
          titulo="Três queixas que a gente ouve em toda visita"
          lead="Se alguma delas é a sua, a solução quase sempre é película — e não cortina blackout nem ar-condicionado maior."
        />
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {problema.map((item) => (
            <CardDeBeneficio key={item.titulo} {...item} />
          ))}
        </div>
      </Secao>

      <Secao fundo="pagina" id="ambientes">
        <CabecalhoDeSecao
          sobrancelha="Por ambiente"
          titulo="Cada cômodo pede uma transmissão de luz diferente"
          lead="Vidro de quarto e vidro de varanda não recebem a mesma película. É por isso que a visita vem antes do preço."
        />
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {ambientes.map((servico) => (
            <CardDeServico key={servico.titulo} servico={servico} />
          ))}
        </div>
      </Secao>

      {galeria && (
        <Galeria
          sobrancelha={galeria.sobrancelha}
          titulo={galeria.titulo}
          lead={galeria.lead}
          fundo="sutil"
          itens={galeria.itens}
        />
      )}

      <Secao fundo="pagina">
        <div className="grid gap-6 lg:grid-cols-2">
          {falas.map((fala) => (
            <Depoimento key={fala.nome} fala={fala} />
          ))}
        </div>
      </Secao>

      <Secao fundo="pagina">
        <CabecalhoDeSecao
          sobrancelha="Como funciona"
          titulo="Um sábado de manhã e está resolvido"
        />
        <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {processo.map((passo) => (
            <Passo key={passo.numero} {...passo} />
          ))}
        </div>
      </Secao>

      <Secao fundo="pagina">
        <CabecalhoDeSecao sobrancelha="Dúvidas" titulo="O que todo morador pergunta" />
        <div className="mt-10">
          <ListaDeFaq duvidas={duvidas} />
        </div>
      </Secao>

      <FaixaDeCta />
    </>
  );
}
