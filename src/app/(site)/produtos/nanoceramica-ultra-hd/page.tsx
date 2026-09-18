import type { Metadata } from "next";
import Image from "next/image";

import { FaixaDeCta } from "@/components/sections/FaixaDeCta";
import { Galeria } from "@/components/sections/Galeria";
import { BotaoLink } from "@/components/ui/Botao";
import {
  Breadcrumb,
  CardDeBeneficio,
  Dado,
  LinhaDeEspecificacao,
  Passo,
  Tag,
} from "@/components/ui/Elementos";
import { ListaDeFaq } from "@/components/ui/Faq";
import { IconeSol } from "@/components/ui/Icone";
import { CabecalhoDeSecao, Secao } from "@/components/ui/Secao";
import { fotos } from "@/content/fotos";
import { galeriaPorChave } from "@/lib/dados/galerias";

export const metadata: Metadata = {
  title: "Nanocerâmica Ultra HD · Película de controle solar",
  description:
    "A película que segura o calor do sol e deixa a luz passar: até 95% do calor barrado, 99,9% de UV bloqueado e 70% de luz natural preservada.",
};

const dados = [
  { valor: "95%", rotulo: "do calor do sol barrado" },
  { valor: "99%", rotulo: "dos raios UV bloqueados" },
  { valor: "70%", rotulo: "de luz visível preservada" },
  { valor: "8 °C", rotulo: "a menos no pico da tarde" },
];

const oQueMuda = [
  {
    icone: "termometro" as const,
    titulo: "O vidro para de queimar",
    descricao:
      "Encostar na janela às 15h deixa de ser desconfortável. A superfície interna fica até 12 °C mais fria.",
  },
  {
    icone: "moeda" as const,
    titulo: "O ar-condicionado descansa",
    descricao:
      "Com menos calor entrando, o ar-condicionado liga menos. A conta costuma cair entre 15% e 30%.",
  },
  {
    icone: "gota" as const,
    titulo: "Móvel e piso param de desbotar",
    descricao:
      "99% do UV fica do lado de fora. Sofá, madeira e quadro mantêm a cor por muito mais tempo.",
  },
  {
    icone: "sol" as const,
    titulo: "A luz continua entrando",
    descricao:
      "Sem aquele escurão de insulfilm de carro. A vista continua e o ofuscamento some.",
  },
];

const ficha = [
  { rotulo: "Luz natural que continua entrando", valor: "70%" },
  { rotulo: "Calor do sol barrado", valor: "até 95%" },
  { rotulo: "Raios UV bloqueados", valor: "99,9%" },
  { rotulo: "Escurece o ambiente?", valor: "Não" },
  { rotulo: "Espessura", valor: "mais fina que um fio de cabelo" },
  { rotulo: "Instalação", valor: "por dentro, em um dia, sem obra" },
  { rotulo: "Garantia por escrito", valor: "15 anos" },
];

const processo = [
  {
    numero: "01",
    titulo: "Visita e medição",
    descricao:
      "Um técnico vai até o local, mede os vidros e registra a orientação solar de cada face.",
  },
  {
    numero: "02",
    titulo: "Especificação",
    descricao:
      "Você recebe por escrito qual película foi indicada, o porquê da escolha e a garantia.",
  },
  {
    numero: "03",
    titulo: "Aplicação",
    descricao:
      "Instalação em obra limpa, com equipe própria. Ambiente liberado no mesmo dia.",
  },
  {
    numero: "04",
    titulo: "Garantia e pós",
    descricao:
      "Certificado de fábrica, orientação de limpeza e revisão sem custo no primeiro ano.",
  },
];

const duvidas = [
  {
    pergunta: "Dá para aplicar em vidro temperado ou laminado?",
    resposta:
      "Sim, mas a película muda. Cada tipo de vidro pede um filme diferente para não trincar. É por isso que a gente pergunta o tipo do seu vidro antes de fazer o orçamento.",
  },
  {
    pergunta: "A película atrapalha o sinal de celular ou Wi-Fi?",
    resposta:
      "As linhas metalizadas podem atenuar sinal. A série Select 70 usa metalização seletiva de baixa densidade, sem interferência perceptível.",
  },
  {
    pergunta: "E se eu quiser tirar depois?",
    resposta:
      "A remoção é reversível e não danifica o vidro. Fazemos remoção e reaplicação como serviço avulso.",
  },
];

/** Amostra de película do herói: as três lâminas de vidro sobre a tinta Conforto. */
function PainelDeAmostra() {
  return (
    <div
      className="relative aspect-[410/350] w-full overflow-hidden rounded-2xl border border-vidro-borda vidro-05"
      style={{
        backgroundImage: "linear-gradient(140deg, #f7955f 0%, #fbc47f 55%, #fde084 100%)",
      }}
    >
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          aria-hidden
          className="absolute rounded-[18px] border border-white/40 bg-white/16"
          style={{
            inset: `${12 + i * 7}% ${10 + i * 8}% ${12 + i * 7}% ${10 + i * 8}%`,
            transform: "rotate(-4deg)",
          }}
        />
      ))}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "repeating-linear-gradient(110deg, rgba(255,255,255,0.22) 0 26px, transparent 26px 120px)",
        }}
      />
      <p className="absolute inset-x-3 bottom-3 flex items-center gap-2 rounded-2xl bg-fundo-sutil/90 px-4 py-3 t-micro text-texto-corpo vidro-01 sm:inset-x-4 sm:bottom-4 sm:rounded-pill">
        <span className="shrink-0 text-texto-acento">
          <IconeSol tamanho={18} />
        </span>
        Três camadas: a cola, a que segura o calor e a capa que protege de riscos.
      </p>
    </div>
  );
}

export default async function NanoceramicaUltraHd() {
  const galeria = await galeriaPorChave("produto-nanoceramica");

  return (
    <>
      {/* Herói */}
      <section className="relative isolate overflow-hidden bg-fundo-pagina pb-16 pt-[140px] lg:min-h-[720px]">
        <Image
          src={fotos["prod-hero"]}
          alt=""
          fill
          priority
          sizes="100vw"
          className="-z-20 object-cover"
        />
        <span
          aria-hidden
          className="absolute inset-0 -z-10"
          style={{
            background:
              "linear-gradient(100deg, rgba(252,252,242,0.96) 0%, rgba(250,250,238,0.9) 45%, rgba(244,244,230,0.7) 100%)",
          }}
        />
        <div className="conteudo relative grid items-center gap-12 lg:grid-cols-2">
          <div className="flex flex-col items-start gap-4">
            <Breadcrumb
              trilha={[
                { rotulo: "Início", href: "/" },
                { rotulo: "Serviços", href: "/servicos" },
                { rotulo: "Nanocerâmica Ultra HD" },
              ]}
            />
            <Tag tom="conforto">Linha Conforto térmico</Tag>
            <h1 className="t-h1">Película de controle solar</h1>
            <p className="t-corpo-g max-w-[520px] text-texto-corpo">
              Ela segura o calor do sol e deixa a luz passar. O ambiente continua
              claro do mesmo jeito e para de assar.
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-3">
              <BotaoLink href="/contato">Pedir orçamento</BotaoLink>
              <BotaoLink href="#ficha-tecnica" tipo="vidro">
                Ver ficha técnica
              </BotaoLink>
            </div>
          </div>
          <PainelDeAmostra />
        </div>
      </section>

      {/* Dados */}
      <Secao fundo="pagina" className="!py-10">
        <div className="grid grid-cols-2 gap-8 lg:grid-cols-4 lg:gap-10">
          {dados.map((d) => (
            <Dado key={d.rotulo} valor={d.valor} rotulo={d.rotulo} tom="acento" />
          ))}
        </div>
      </Secao>

      {/* O que muda */}
      <Secao fundo="pagina">
        <CabecalhoDeSecao
          sobrancelha="O que muda na prática"
          titulo="Quatro coisas que você percebe na primeira semana"
          lead="Não é sensação térmica de folder. São efeitos que aparecem em conta de luz, em móvel e em quantas horas do dia o ambiente é usável."
        />
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {oQueMuda.map((item) => (
            <CardDeBeneficio key={item.titulo} {...item} />
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

      {/* Ficha técnica */}
      <Secao fundo="pagina" id="ficha-tecnica">
        <div className="grid gap-10 lg:grid-cols-[420px_1fr] lg:gap-16">
          <div className="flex flex-col items-start gap-4">
            <p className="t-sobrancelha text-texto-acento">O que você leva</p>
            <h2 className="t-h2">Nanocerâmica Ultra HD 70</h2>
            <p className="t-corpo-p text-texto-suave">
              Os números valem para vidro comum de 6 mm. Outro vidro muda o
              resultado — na proposta vai o cálculo do seu.
            </p>
            <BotaoLink href="/contato" tipo="fantasma" tamanho="M" className="mt-2">
              Baixar ficha em PDF
            </BotaoLink>
          </div>

          <dl className="rounded-2xl border border-vidro-borda bg-vidro-preenchimento px-5 py-2 vidro-02 sm:px-8 sm:py-3">
            {ficha.map((linha) => (
              <LinhaDeEspecificacao key={linha.rotulo} {...linha} />
            ))}
          </dl>
        </div>
      </Secao>

      {/* Processo */}
      <Secao fundo="pagina">
        <CabecalhoDeSecao
          sobrancelha="Como aplicamos"
          titulo="Da visita à garantia, em quatro etapas"
          lead="Sem surpresa no meio do caminho: você sabe o que vai ser aplicado, quanto custa e quanto tempo leva antes de fechar."
        />
        <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {processo.map((passo) => (
            <Passo key={passo.numero} {...passo} />
          ))}
        </div>
      </Secao>

      {/* Dúvidas */}
      <Secao fundo="pagina">
        <CabecalhoDeSecao
          sobrancelha="Dúvidas"
          titulo="Sobre controle solar, especificamente"
        />
        <div className="mt-10">
          <ListaDeFaq duvidas={duvidas} />
        </div>
      </Secao>

      <FaixaDeCta />
    </>
  );
}
