import type { Metadata } from "next";

import { HeroSimples } from "@/components/sections/Heros";
import { Botao } from "@/components/ui/Botao";
import { ListaDeFaq } from "@/components/ui/Faq";
import {
  AreaDeTexto,
  Campo,
  Checkbox,
  Selecao,
} from "@/components/ui/Formulario";
import {
  IconeEmail,
  IconePin,
  IconeTelefone,
  IconeWhatsapp,
} from "@/components/ui/Icone";
import { CabecalhoDeSecao, Secao } from "@/components/ui/Secao";
import { contatoDoSite } from "@/lib/dados/configuracao";

export const metadata: Metadata = {
  title: "Contato",
  description:
    "Conte do seu vidro e a gente responde em 1 dia útil. Medição e orçamento sem custo em Itatiba e região.",
};

const tiposDeImovel = [
  "Casa",
  "Apartamento",
  "Escritório",
  "Loja",
  "Clínica ou consultório",
  "Indústria ou galpão",
  "Outro",
];


const duvidas = [
  {
    pergunta: "A visita e o orçamento têm custo?",
    resposta:
      "Não. Medição, especificação e proposta são gratuitas em Itatiba e região, com ou sem fechamento. Para obra acima de 300 m² atendemos todo o estado, também sem custo.",
  },
  {
    pergunta: "Vocês trabalham com qual prazo?",
    resposta:
      "Orçamento em até 1 dia útil após a visita. Aplicação residencial normalmente em até 7 dias; obra corporativa conforme cronograma acordado.",
  },
  {
    pergunta: "Aceitam nota fiscal e faturamento para PJ?",
    resposta:
      "Sim. Emitimos NF-e, aceitamos empenho e trabalhamos com prazo de pagamento para pessoa jurídica.",
  },
];

export default async function Contato() {
  const contato = await contatoDoSite();

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
      nota: "Para propostas corporativas e licitação.",
      href: `mailto:${contato.email}`,
    },
    {
      Icone: IconePin,
      rotulo: "Área de atendimento",
      valor: contato.cidade,
      nota: "Campinas e Jundiaí sob consulta. Visita com hora marcada.",
    },
  ];

  return (
    <>
      <HeroSimples
        trilha={[{ rotulo: "Início", href: "/" }, { rotulo: "Contato" }]}
        titulo="Conte do seu vidro. A gente responde em 1 dia útil."
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
            <p className="t-sobrancelha text-texto-acento">Orçamento sem custo</p>
            <h2 className="mt-3 t-h4">Formulário de orçamento</h2>

            <form className="mt-8 flex flex-col gap-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <Campo
                  id="nome"
                  rotulo="Nome"
                  placeholder="Como podemos te chamar"
                  autoComplete="name"
                  required
                />
                <Campo
                  id="whatsapp"
                  rotulo="WhatsApp"
                  type="tel"
                  placeholder="(11) 90000-0000"
                  autoComplete="tel"
                  required
                />
              </div>

              <Campo
                id="email"
                rotulo="E-mail"
                type="email"
                placeholder="voce@email.com.br"
                ajuda="Usamos só para retornar o orçamento."
                autoComplete="email"
                required
              />

              <Selecao
                id="tipo-de-imovel"
                rotulo="Tipo de imóvel"
                opcoes={tiposDeImovel}
              />

              <AreaDeTexto
                id="sobre-o-vidro"
                rotulo="Conte do seu vidro"
                rows={5}
                placeholder="Quantas janelas, para onde estão viradas, qual o problema — calor, claridade, privacidade ou segurança."
                ajuda="Quanto mais detalhe, mais preciso o orçamento."
              />

              <Checkbox
                id="consentimento"
                rotulo="Aceito receber o orçamento por WhatsApp"
                defaultChecked
              />

              <Botao type="submit" className="w-full sm:w-fit">
                Enviar e receber orçamento
              </Botao>
            </form>
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
