import type { Metadata } from "next";

import { DadosEstruturados } from "@/components/conteudo/DadosEstruturados";
import { FormularioDeOrcamento } from "@/components/formularios/FormularioDeOrcamento";
import { HeroSimples } from "@/components/sections/Heros";
import { ListaDeFaq, type Duvida } from "@/components/ui/Faq";
import {
  IconeEmail,
  IconePin,
  IconeTelefone,
  IconeWhatsapp,
} from "@/components/ui/Icone";
import { CabecalhoDeSecao, Secao } from "@/components/ui/Secao";
import { COBERTURA } from "@/content/linhas";
import { destinoDaUrl, interesseDaUrl } from "@/content/formulario";
import { contatoDoSite } from "@/lib/dados/configuracao";
import { esquemaDeFaq, esquemaDeTrilha } from "@/lib/schema";

/**
 * Contato.
 *
 * O formulário ganhou cidade, "para onde é a película?" e "o que você procura?"
 * (revisão de copy de 28/10/2026). A pré-seleção é lida aqui, no servidor:
 * `?tipo=empresa` abre em "Empresa ou escritório" e `?interesse=…`, posto pelos
 * CTAs das páginas de produto, já marca o que a pessoa foi ver.
 *
 * "Trabalhe conosco" saiu daqui e do rodapé: levava para este mesmo formulário,
 * que não tem campo de currículo.
 */

export const metadata: Metadata = {
  title: { absolute: "Agende sua medição gratuita | RR Film" },
  description:
    "Fale com a RR Film pelo WhatsApp (11) 97374-2600 ou pelo formulário. Medição gratuita em Itatiba e região.",
  openGraph: {
    title: "Agende sua medição gratuita | RR Film",
    description: `Medição e orçamento sem custo em ${COBERTURA}.`,
  },
};

const duvidas: Duvida[] = [
  {
    pergunta: "Quanto tempo leva para agendar a medição?",
    resposta:
      "Em geral, conseguimos agendar na mesma semana do contato. Confirmamos o dia e o horário com você pelo WhatsApp.",
  },
  {
    pergunta: "A medição tem custo?",
    resposta: `Não. A medição e o orçamento são gratuitos em ${COBERTURA}.`,
  },
  {
    pergunta: "Vocês emitem nota fiscal?",
    resposta: "Sim, emitimos nota fiscal para pessoas físicas e empresas.",
  },
  {
    pergunta: "Quais cidades vocês atendem?",
    resposta: "Itatiba, Jundiaí, Vinhedo, Valinhos, Campinas e região.",
  },
];

const trilha = [{ rotulo: "Início", href: "/" }, { rotulo: "Contato" }];

export default async function Contato({
  searchParams,
}: {
  searchParams: Promise<{ tipo?: string; interesse?: string }>;
}) {
  const [{ tipo, interesse }, contato] = await Promise.all([
    searchParams,
    contatoDoSite(),
  ]);

  const canais = [
    {
      Icone: IconeWhatsapp,
      rotulo: "WhatsApp",
      valor: contato.telefone,
      nota: "Resposta em minutos no horário comercial.",
      href: contato.whatsapp,
    },
    {
      Icone: IconeTelefone,
      rotulo: "Telefone",
      valor: contato.telefone,
      nota: contato.horario,
      href: contato.telefoneLink,
    },
    {
      Icone: IconeEmail,
      rotulo: "E-mail",
      valor: contato.email,
      nota: "Para propostas corporativas e arquitetura.",
      href: `mailto:${contato.email}`,
    },
    {
      Icone: IconePin,
      rotulo: "Área de atendimento",
      valor: contato.cidade,
      nota: COBERTURA,
    },
  ];

  return (
    <>
      <DadosEstruturados dados={[esquemaDeTrilha(trilha), esquemaDeFaq(duvidas)]} />

      <HeroSimples
        trilha={trilha}
        titulo="Agende sua medição gratuita"
        lead="Conte um pouco sobre o seu vidro. A gente responde pelo WhatsApp em horário comercial, de segunda a sexta, das 8h às 18h."
        foto="casas-galeria-3"
        alturaClasse="min-h-[320px] md:min-h-[400px]"
      />

      <Secao fundo="pagina">
        <div className="grid gap-4 lg:grid-cols-[1fr_440px] lg:grid-rows-[auto_1fr] lg:gap-x-6">
          {/* Canais de contato: primeiro no celular — é onde WhatsApp e telefone
              estão a um toque. No lg, coluna da direita, como no Figma. */}
          <div className="flex flex-col gap-4 lg:col-start-2 lg:row-start-1">
            {canais.map(({ Icone, rotulo, valor, nota, href }) => {
              const conteudo = (
                <>
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-pill border border-vidro-borda bg-[rgba(249,169,125,0.18)] text-texto-forte">
                    <Icone tamanho={20} />
                  </span>
                  <span className="flex flex-col gap-1">
                    <span className="t-micro text-texto-suave">{rotulo}</span>
                    <span className="t-h5 text-texto-forte">{valor}</span>
                    <span className="t-micro text-texto-suave">{nota}</span>
                  </span>
                </>
              );

              return href ? (
                <a
                  key={rotulo}
                  href={href}
                  className="flex items-start gap-4 rounded-xl border border-vidro-borda bg-vidro-preenchimento p-6 vidro-01 transition-colors hover:bg-white/60"
                >
                  {conteudo}
                </a>
              ) : (
                <div
                  key={rotulo}
                  className="flex items-start gap-4 rounded-xl border border-vidro-borda bg-vidro-preenchimento p-6 vidro-01"
                >
                  {conteudo}
                </div>
              );
            })}
          </div>

          {/* Formulário */}
          <div className="rounded-2xl border border-vidro-borda bg-vidro-preenchimento p-6 vidro-02 sm:p-12 lg:col-start-1 lg:row-span-2 lg:row-start-1">
            <p className="t-sobrancelha text-texto-acento">Medição sem custo</p>
            <h2 className="mt-3 t-h4">Formulário de orçamento</h2>

            <div className="mt-8">
              <FormularioDeOrcamento
                origem="contato"
                destinoInicial={destinoDaUrl(tipo)}
                interesseInicial={interesseDaUrl(interesse)}
              />
            </div>
          </div>

          {/* Mapa: por último no celular; embaixo dos canais no lg */}
          <div className="overflow-hidden rounded-xl border border-vidro-borda-baixa lg:col-start-2 lg:row-start-2 lg:self-start">
            <iframe
              title="Área de atendimento da RR Film em Itatiba, SP"
              src="https://www.openstreetmap.org/export/embed.html?bbox=-46.90%2C-23.05%2C-46.78%2C-22.95&layer=mapnik"
              loading="lazy"
              className="h-[260px] w-full border-0"
            />
          </div>
        </div>
      </Secao>

      <Secao fundo="pagina">
        <CabecalhoDeSecao sobrancelha="Dúvidas" titulo="Antes de você escrever" />
        <div className="mt-10">
          <ListaDeFaq duvidas={duvidas} />
        </div>
      </Secao>
    </>
  );
}
