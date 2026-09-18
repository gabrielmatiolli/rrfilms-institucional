import type { Metadata } from "next";

import {
  CardDeServico,
  Depoimento,
  type ServicoDeCard,
} from "@/components/cards/Cartoes";
import { FaixaDeCta } from "@/components/sections/FaixaDeCta";
import { Galeria } from "@/components/sections/Galeria";
import { HeroDividido } from "@/components/sections/Heros";
import { Botao, BotaoLink } from "@/components/ui/Botao";
import { CardDeBeneficio, ChipDeVidroLink } from "@/components/ui/Elementos";
import { Foto } from "@/components/ui/Foto";
import { Campo, Checkbox, Selecao } from "@/components/ui/Formulario";
import { CabecalhoDeSecao, Secao } from "@/components/ui/Secao";
import { galeriaPorChave } from "@/lib/dados/galerias";
import { fotos } from "@/content/fotos";

export const metadata: Metadata = {
  title: "Para empresas",
  description:
    "Retrofit de fachada sem trocar um vidro: menos calor em torres envidraçadas, laudo assinado por engenheiro e contrato de manutenção.",
};

const economia = [
  { valor: "15–30%", rotulo: "de queda no consumo de climatização" },
  { valor: "18 meses", rotulo: "para o investimento se pagar na face oeste" },
  { valor: "0", rotulo: "vidro trocado, 0 dia de obra parada" },
  { valor: "Laudo", rotulo: "assinado por engenheiro responsável" },
];

const solucoes: ServicoDeCard[] = [
  {
    linha: "frescor",
    tag: "Segurança",
    titulo: "Eficiência energética de fachada",
    descricao:
      "Menos calor em torres envidraçadas. A gente calcula em quanto tempo o investimento se paga, face por face, antes de fechar.",
    foto: fotos["emp-solucao-1"],
    dados: [
      { valor: "15–30%", rotulo: "de economia" },
      { valor: "18 m", rotulo: "de payback" },
    ],
    href: "/contato",
  },
  {
    linha: "conforto",
    tag: "Nanocerâmica Ultra HD",
    titulo: "Conforto do posto de trabalho",
    descricao:
      "Ofuscamento em tela e calor localizado derrubam produtividade. Tratamos face a face, priorizando onde a equipe senta.",
    foto: fotos["emp-solucao-2"],
    dados: [
      { valor: "42%", rotulo: "menos ofuscamento" },
      { valor: "8 °C", rotulo: "a menos no pico" },
    ],
    href: "/produtos/nanoceramica-ultra-hd",
  },
  {
    linha: "luz",
    tag: "Decorativa",
    titulo: "Segurança e comunicação visual",
    descricao:
      "Filme anti-estilhaço conforme NBR 7199 e aplicação de jateado com recorte de marca em salas e divisórias.",
    foto: fotos["emp-solucao-3"],
    dados: [
      { valor: "NBR", rotulo: "7199 atendida" },
      { valor: "Laudo", rotulo: "emitida" },
    ],
    href: "/contato",
  },
];

const diferenciais = [
  {
    icone: "certificado" as const,
    titulo: "Laudo e nota fiscal",
    descricao:
      "Anotação de Responsabilidade Técnica emitida por engenheiro, com memorial de cálculo por face.",
  },
  {
    icone: "equipe" as const,
    titulo: "Equipe própria",
    descricao:
      "Sem terceirização. Time treinado, uniformizado, com integração de segurança e ASO em dia.",
  },
  {
    icone: "relogio" as const,
    titulo: "Obra fora do horário",
    descricao:
      "Aplicação noturna e em fim de semana sem custo adicional para áreas críticas.",
  },
  {
    icone: "regua" as const,
    titulo: "Contrato de manutenção",
    descricao:
      "Revisão anual, reposição de trecho danificado e SLA de atendimento definido em contrato.",
  },
];

const categorias = ["Todos", "Escritório", "Clínica", "Loja e fachada", "Divisória"];

const faixasDeMetragem = [
  "Até 100 m²",
  "De 100 a 300 m²",
  "De 300 a 1.000 m²",
  "Acima de 1.000 m²",
  "Não sei — preciso de medição",
];

export default async function ParaEmpresas() {
  const galeria = await galeriaPorChave("para-empresas");

  return (
    <>
      <HeroDividido
        trilha={[{ rotulo: "Início", href: "/" }, { rotulo: "Para empresas" }]}
        titulo="Retrofit de fachada sem trocar um vidro"
        lead="Película para prédios, lojas e indústria. Menos calor, fachada uniforme em todo o edifício e laudo com contrato de manutenção."
        foto="empresas-hero"
        tom="frescor"
        acoes={
          <>
            <BotaoLink href="#orcamento">Falar com o comercial</BotaoLink>
            <BotaoLink href="/contato" tipo="vidro">
              Baixar portfólio
            </BotaoLink>
          </>
        }
      />

      {/* Economia — faixa grafite */}
      <section className="bg-fundo-inverso py-12">
        <div className="conteudo grid grid-cols-2 gap-8 lg:grid-cols-4 lg:gap-10">
          {economia.map((d) => (
            <div key={d.rotulo} className="flex flex-col gap-[10px]">
              <p className="t-h1 leading-[1.08] text-texto-inverso">{d.valor}</p>
              <p className="t-corpo-p text-texto-inverso opacity-70">{d.rotulo}</p>
            </div>
          ))}
        </div>
      </section>

      <Secao fundo="pagina" id="solucoes">
        <CabecalhoDeSecao
          sobrancelha="Soluções"
          titulo="Três frentes que resolvem 90% das demandas corporativas"
          lead="Da torre envidraçada ao ponto de rua. Cada frente tem especificação, prazo e forma de contratação própria."
        />
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {solucoes.map((servico) => (
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
          filtros={categorias.map((categoria, i) => (
            <ChipDeVidroLink key={categoria} href="#projetos" ativo={i === 0}>
              {categoria}
            </ChipDeVidroLink>
          ))}
          itens={galeria.itens}
        />
      )}

      <Secao fundo="pagina" id="diferenciais">
        <CabecalhoDeSecao
          sobrancelha="Por que a RR Film"
          titulo="O que o setor de facilities cobra e quase ninguém entrega"
          lead="Documentação, previsibilidade e uma equipe que já sabe entrar em prédio com controle de acesso."
        />
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {diferenciais.map((item) => (
            <CardDeBeneficio key={item.titulo} {...item} />
          ))}
        </div>
      </Secao>

      {/* Caso */}
      <Secao fundo="pagina">
        <div className="grid items-center gap-8 lg:grid-cols-2">
          <Foto
            slot="emp-caso"
            alt="Escritório em Campinas com película aplicada"
            className="aspect-[624/380]"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
          <Depoimento
            fala={{
              citacao:
                "“Precisávamos atender à norma de fachada sem trocar o vidro do prédio inteiro. Eles apresentaram o laudo, aplicaram em dois fins de semana e não paramos o escritório um dia.”",
              nome: "Rodrigo Sette",
              contexto: "Escritório em Campinas · 3.200 m² aplicados",
            }}
          />
        </div>
      </Secao>

      {/* Formulário corporativo */}
      <Secao fundo="pagina" id="orcamento">
        <div className="grid gap-10 rounded-2xl border border-vidro-borda bg-vidro-preenchimento p-6 vidro-03 sm:gap-12 sm:p-14 lg:grid-cols-2 lg:gap-16">
          <div className="flex flex-col items-start gap-4">
            <p className="t-sobrancelha text-texto-acento">Orçamento corporativo</p>
            <h2 className="t-h2">Mande a metragem, devolvemos a simulação</h2>
            <p className="t-corpo text-texto-suave">
              Para áreas acima de 300 m² a gente estuda cada face do prédio e
              calcula o retorno antes da visita. O comercial responde em até 1 dia
              útil.
            </p>
          </div>

          <form className="flex flex-col gap-5" action="/contato" method="get">
            <Campo
              id="empresa"
              rotulo="Empresa"
              placeholder="Razão social"
              autoComplete="organization"
              required
            />
            <Campo
              id="email-corporativo"
              rotulo="E-mail corporativo"
              type="email"
              placeholder="voce@empresa.com.br"
              ajuda="Usamos só para retornar o orçamento."
              autoComplete="email"
              required
            />
            <Selecao
              id="metragem"
              rotulo="Metragem aproximada de vidro"
              ajuda="Se não souber, a gente mede na visita."
              opcoes={faixasDeMetragem}
            />
            <Checkbox
              id="consentimento-corporativo"
              rotulo="Aceito receber o orçamento por WhatsApp"
              defaultChecked
            />
            <Botao type="submit" className="w-full sm:w-fit">
              Solicitar simulação
            </Botao>
          </form>
        </div>
      </Secao>

      <FaixaDeCta
        titulo="Quanto custa manter esse prédio quente?"
        lead="Mande a metragem e a orientação das faces. Devolvemos a simulação de economia antes da visita."
        rotuloPrimario="Falar com o comercial"
        mensagem="Olá! Quero falar com o comercial sobre película para empresa."
      />
    </>
  );
}
