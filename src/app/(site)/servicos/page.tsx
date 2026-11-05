import type { Metadata } from "next";

import { CardDeServico, type ServicoDeCard } from "@/components/cards/Cartoes";
import { DadosEstruturados } from "@/components/conteudo/DadosEstruturados";
import { FaixaDeCta } from "@/components/sections/FaixaDeCta";
import { Galeria } from "@/components/sections/Galeria";
import { HeroSimples } from "@/components/sections/Heros";
import { BotaoDeWhatsapp } from "@/components/sections/BotaoDeWhatsapp";
import { BotaoLink } from "@/components/ui/Botao";
import { CardDeBeneficio } from "@/components/ui/Elementos";
import { ListaDeFaq, type Duvida } from "@/components/ui/Faq";
import { CabecalhoDeSecao, Secao } from "@/components/ui/Secao";
import { COBERTURA, LINHAS, MANUTENCAO, NUMEROS } from "@/content/linhas";
import { galeriaPorChave } from "@/lib/dados/galerias";
import { esquemaDeFaq, esquemaDeTrilha } from "@/lib/schema";

export const metadata: Metadata = {
  title: { absolute: "Películas para vidro residencial e comercial | RR Film" },
  description:
    "Nanocerâmica, segurança antiestilhaço, refletiva e jateado. Conheça as linhas da RR Film e agende a medição gratuita.",
  openGraph: {
    title: "Películas para vidro residencial e comercial | RR Film",
    description:
      "Quatro linhas de película e uma indicação para cada vidro. Medição gratuita em Itatiba e região.",
  },
};

/**
 * A grade de /servicos: as quatro linhas mais a manutenção, nessa ordem.
 *
 * Sai de src/content/linhas.ts — a mesma fonte da Home, do menu, do rodapé e das
 * internas. O card "Proteção UV" que existia aqui virou seção da Nanocerâmica
 * (#protecao-uv), e a "Linha Smart" saiu: não faz parte do portfólio.
 */
const cards: ServicoDeCard[] = [
  ...LINHAS.map((linha) => ({
    linha: linha.linha,
    tag: linha.familia,
    titulo: linha.nomeCurto,
    descricao: linha.frase,
    foto: linha.foto ?? ("" as const),
    legendaDaFoto: linha.legendaDaFoto,
    dados: [...linha.indicadores],
    publico: linha.publico,
    href: linha.url,
    rotuloDoLink: linha.rotuloNoHub,
  })),
  {
    linha: MANUTENCAO.linha,
    tag: MANUTENCAO.familia,
    titulo: MANUTENCAO.nome,
    descricao: MANUTENCAO.frase,
    foto: "",
    dados: [...MANUTENCAO.indicadores],
    publico: MANUTENCAO.publico,
    href: MANUTENCAO.url,
    rotuloDoLink: MANUTENCAO.rotuloNoHub,
  },
];

const comoEscolher = [
  {
    icone: "sol" as const,
    titulo: "Para onde o vidro está virado?",
    descricao:
      "Vidros voltados para oeste recebem o sol mais forte da tarde e pedem mais controle de calor.",
  },
  {
    icone: "janela" as const,
    titulo: "Que vidro é esse?",
    descricao:
      "Comum, temperado ou laminado reagem de forma diferente ao calor. Por isso medimos antes de indicar.",
  },
  {
    icone: "equipe" as const,
    titulo: "O que acontece nesse ambiente?",
    descricao:
      "Uma sala de reunião, um quarto de bebê e uma loja de rua pedem quantidades diferentes de luz e privacidade.",
  },
];

const duvidas: Duvida[] = [
  {
    pergunta: "A película escurece o ambiente?",
    resposta:
      "Não necessariamente. A Nanocerâmica Ultra HD reduz o calor e mantém a claridade e a vista. Películas refletivas escurecem mais, e a gente explica isso antes de indicar.",
  },
  {
    pergunta: "Quanto tempo dura?",
    resposta: `Depende da linha e da exposição ao sol. A Nanocerâmica Ultra HD tem garantia de ${NUMEROS.nanoceramica.garantia}. Na visita, informamos a garantia de cada película indicada.`,
  },
  {
    pergunta: "Preciso desocupar o ambiente?",
    resposta:
      "Não. Pedimos apenas acesso livre aos vidros. A instalação é limpa e, na maioria das casas, termina no mesmo dia.",
  },
  {
    pergunta: "Vocês atendem fora de Itatiba?",
    resposta:
      "Sim. Atendemos Jundiaí, Vinhedo, Valinhos, Campinas e região. Fale com a gente pelo WhatsApp para confirmar a sua cidade.",
  },
];

const trilha = [{ rotulo: "Início", href: "/" }, { rotulo: "Serviços" }];

export default async function Servicos() {
  const galeria = await galeriaPorChave("servicos");

  return (
    <>
      <DadosEstruturados dados={[esquemaDeTrilha(trilha), esquemaDeFaq(duvidas)]} />

      <HeroSimples
        trilha={trilha}
        titulo="Quatro linhas de película. Uma indicação para cada vidro."
        lead="A RR Film não vende rolo de película, vende especificação. A escolha certa depende de para onde o vidro está virado, do tipo de vidro e do que acontece no ambiente."
        foto="srv-galeria-1"
        acoes={
          <>
            <BotaoLink href="/contato">Agendar medição gratuita</BotaoLink>
            <BotaoDeWhatsapp codigo="WA-GERAL" />
          </>
        }
      />

      <Secao fundo="pagina">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {cards.map((servico) => (
            <CardDeServico key={servico.href} servico={servico} />
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

      <Secao fundo="sutil" id="como-escolher">
        <CabecalhoDeSecao
          sobrancelha="Como escolher"
          titulo="Três perguntas antes de escolher a película"
          lead="Se a proposta que você recebeu não responde a estas três, ela não foi feita para o seu vidro."
        />
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {comoEscolher.map((item) => (
            <CardDeBeneficio key={item.titulo} {...item} />
          ))}
        </div>
      </Secao>

      <Secao fundo="pagina" id="duvidas">
        <CabecalhoDeSecao
          sobrancelha="Dúvidas frequentes"
          titulo="O que a gente mais responde na visita"
        />
        <div className="mt-10">
          <ListaDeFaq duvidas={duvidas} />
        </div>
      </Secao>

      <FaixaDeCta lead={`Medição e indicação sem custo em ${COBERTURA}.`} />
    </>
  );
}
