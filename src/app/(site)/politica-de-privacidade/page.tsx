import type { Metadata } from "next";
import Link from "next/link";

import { BlocoLegal, ListaLegal, TextoLegal } from "@/components/conteudo/TextoLegal";
import { LinkDePreferenciasDeCookies } from "@/components/layout/AvisoDeCookies";
import { HeroSimples } from "@/components/sections/Heros";
import { Secao } from "@/components/ui/Secao";
import { contatoDoSite } from "@/lib/dados/configuracao";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Política de privacidade",
  description:
    "Como a RR Film coleta, usa, guarda e protege os seus dados pessoais, e como exercer os seus direitos pela LGPD.",
};

/**
 * Política de privacidade (LGPD — Lei 13.709/2018).
 *
 * O texto descreve o que o site faz de fato — ver src/lib/pedidos e
 * src/components/layout/TagsDeMedicao.tsx. Se um formulário, uma tag ou um
 * fornecedor mudar, esta página muda junto (e a data de atualização também).
 */
const ATUALIZADO_EM = "23 de outubro de 2026";

export default async function PoliticaDePrivacidade() {
  const contato = await contatoDoSite();
  const email = <a href={`mailto:${contato.email}`}>{contato.email}</a>;

  return (
    <>
      <HeroSimples
        trilha={[{ rotulo: "Início", href: "/" }, { rotulo: "Política de privacidade" }]}
        titulo="Política de privacidade"
        lead="O que fazemos com os seus dados, e o que você pode pedir sobre eles."
        foto="casas-galeria-2"
        alturaClasse="min-h-[300px] md:min-h-[360px]"
      />

      <Secao fundo="pagina">
        <TextoLegal atualizadoEm={ATUALIZADO_EM}>
          <BlocoLegal titulo="1. Quem cuida dos seus dados">
            <p>
              A {site.nome}, inscrita no CNPJ {contato.cnpj}, com atendimento em {contato.cidade},
              é a controladora dos dados pessoais tratados neste site ({site.urlCurta}), nos termos
              da Lei Geral de Proteção de Dados (Lei nº 13.709/2018, a LGPD).
            </p>
            <p>
              Para qualquer assunto de privacidade, o canal é o e-mail {email}. Ele também é o
              canal de comunicação com o encarregado pelo tratamento de dados.
            </p>
          </BlocoLegal>

          <BlocoLegal titulo="2. Quais dados coletamos">
            <p>
              <strong>Quando você pede um orçamento</strong> pelos formulários de{" "}
              <Link href="/contato">Contato</Link> ou de <Link href="/para-empresas">Para empresas</Link>:
            </p>
            <ListaLegal
              itens={[
                "nome ou razão social, e-mail e WhatsApp;",
                "tipo de imóvel ou metragem aproximada de vidro, e o que você escrever sobre o seu vidro;",
                "se você aceita receber o orçamento por WhatsApp;",
                "o endereço IP e a data e a hora do envio, guardados para proteger o formulário contra envio automático e abuso.",
              ]}
            />
            <p>
              <strong>Quando você fala com a gente</strong> pelo WhatsApp, telefone ou e-mail,
              recebemos o que você nos enviar por esses canais.
            </p>
            <p>
              <strong>Quando você navega no site, e só se aceitar os cookies</strong>, ferramentas
              do Google e da Meta registram como o site é usado: páginas visitadas, de onde você
              veio, tipo de aparelho e navegador, região aproximada e ações como enviar um pedido
              ou clicar no WhatsApp. Esses registros não levam seu nome, e-mail nem telefone. Os
              detalhes estão na <Link href="/politica-de-cookies">política de cookies</Link>.
            </p>
            <p>
              Não pedimos dados sensíveis (saúde, religião, origem racial, biometria e afins) e não
              coletamos dados de pagamento pelo site.
            </p>
          </BlocoLegal>

          <BlocoLegal titulo="3. Para que usamos e com qual base legal">
            <ListaLegal
              itens={[
                <>
                  <strong>Responder ao seu pedido</strong>, preparar o orçamento e agendar a
                  medição — para atender a um pedido seu antes de um contrato (LGPD, art. 7º, V).
                </>,
                <>
                  <strong>Enviar o orçamento pelo WhatsApp</strong>, quando você marca essa opção
                  no formulário — com o seu consentimento (art. 7º, I).
                </>,
                <>
                  <strong>Proteger o site</strong> contra envios automáticos e abuso, com o IP e o
                  horário do envio — por legítimo interesse (art. 7º, IX).
                </>,
                <>
                  <strong>Medir as visitas e mostrar nossos anúncios</strong> no Google, no
                  Facebook e no Instagram a quem já visitou o site — com o seu consentimento, dado
                  no aviso de cookies (art. 7º, I).
                </>,
                <>
                  <strong>Cumprir obrigações legais</strong>, como as fiscais, se o orçamento virar
                  serviço (art. 7º, II).
                </>,
              ]}
            />
            <p>Não vendemos nem alugamos dados pessoais, e não enviamos propaganda por e-mail sem pedido seu.</p>
          </BlocoLegal>

          <BlocoLegal titulo="4. Com quem compartilhamos">
            <ListaLegal
              itens={[
                <>
                  <strong>Hostinger</strong> — hospeda o site, o banco de dados onde os pedidos
                  ficam guardados e a caixa de e-mail que recebe o aviso de cada pedido.
                </>,
                <>
                  <strong>Google</strong> (Google Analytics, Google Tag Manager e Google Ads) e{" "}
                  <strong>Meta</strong> (Facebook e Instagram) — só se você aceitar os cookies, e
                  sem dados de contato.
                </>,
                <>
                  <strong>Agência de marketing</strong> que presta serviço à {site.nome}, com acesso
                  aos relatórios de visita e de anúncios dessas ferramentas.
                </>,
                <>
                  <strong>Autoridades</strong>, quando a lei ou uma ordem judicial exigir.
                </>,
              ]}
            />
            <p>
              Google e Meta podem tratar dados em servidores fora do Brasil, principalmente nos
              Estados Unidos. Essa transferência segue as garantias previstas no art. 33 da LGPD,
              como as cláusulas contratuais dessas empresas.
            </p>
          </BlocoLegal>

          <BlocoLegal titulo="5. Por quanto tempo guardamos">
            <ListaLegal
              itens={[
                "Pedidos de orçamento: pelo tempo necessário para atender o pedido. Se ele virar serviço, pelo prazo das obrigações legais e fiscais; se não virar, excluímos quando deixa de ser útil para o atendimento — ou antes, se você pedir.",
                "Mensagens de WhatsApp e e-mail: enquanto forem necessárias para o atendimento.",
                "Dados de navegação: pelos prazos configurados no Google e na Meta e pela duração de cada cookie, descrita na política de cookies.",
              ]}
            />
          </BlocoLegal>

          <BlocoLegal titulo="6. Seus direitos">
            <p>Pela LGPD (art. 18), você pode pedir a qualquer momento:</p>
            <ListaLegal
              itens={[
                "confirmação de que tratamos dados seus e acesso a eles;",
                "correção de dados incompletos, errados ou desatualizados;",
                "anonimização, bloqueio ou exclusão de dados desnecessários ou tratados em desacordo com a lei;",
                "exclusão dos dados tratados com o seu consentimento;",
                "portabilidade dos dados a outro fornecedor;",
                "informação sobre com quem compartilhamos os seus dados;",
                "informação sobre a possibilidade de não dar consentimento e o que acontece se não der;",
                "revogação do consentimento.",
              ]}
            />
            <p>
              Para isso, escreva para {email}. Podemos pedir alguma confirmação de que o pedido é
              seu, para não entregar seus dados a outra pessoa. Respondemos em até 15 dias.
            </p>
            <p>
              Os cookies você aceita ou recusa a qualquer momento em{" "}
              <LinkDePreferenciasDeCookies className="font-semibold text-texto-forte underline underline-offset-4" />
              . Se achar que não atendemos bem o seu pedido, você também pode recorrer à Autoridade
              Nacional de Proteção de Dados (ANPD), em{" "}
              <a href="https://www.gov.br/anpd" target="_blank" rel="noopener noreferrer">
                gov.br/anpd
              </a>
              .
            </p>
          </BlocoLegal>

          <BlocoLegal titulo="7. Como protegemos">
            <p>
              O site só funciona em conexão segura (HTTPS). Os pedidos ficam num banco de dados
              acessível apenas pelo painel administrativo, que exige senha forte, bloqueia acessos
              após tentativas erradas seguidas e registra quem entrou. Só a equipe que atende
              orçamentos tem acesso.
            </p>
          </BlocoLegal>

          <BlocoLegal titulo="8. Crianças e adolescentes">
            <p>
              O site é voltado a adultos que contratam serviços para casas e empresas. Não
              coletamos de propósito dados de menores de 18 anos.
            </p>
          </BlocoLegal>

          <BlocoLegal titulo="9. Mudanças nesta política">
            <p>
              Quando mudarmos a forma de tratar dados, atualizamos esta página e a data no topo.
              Se a mudança afetar o que você aceitou sobre cookies, o aviso aparece de novo para
              você escolher.
            </p>
          </BlocoLegal>
        </TextoLegal>
      </Secao>
    </>
  );
}
