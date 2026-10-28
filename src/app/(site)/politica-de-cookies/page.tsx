import type { Metadata } from "next";
import Link from "next/link";

import {
  BlocoLegal,
  ListaLegal,
  TabelaDeCookies,
  TextoLegal,
  type LinhaDeCookie,
} from "@/components/conteudo/TextoLegal";
import { LinkDePreferenciasDeCookies } from "@/components/layout/AvisoDeCookies";
import { HeroSimples } from "@/components/sections/Heros";
import { Secao } from "@/components/ui/Secao";
import { contatoDoSite } from "@/lib/dados/configuracao";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Política de cookies",
  description:
    "Quais cookies o site da RR Film usa, para quê, por quanto tempo, e como aceitar ou recusar.",
};

/**
 * Política de cookies. As tabelas listam o que as tags configuradas no site
 * gravam — ver src/components/layout/TagsDeMedicao.tsx. Se a agência adicionar
 * outra ferramenta pelo Google Tag Manager, ela precisa entrar aqui.
 */
const ATUALIZADO_EM = "23 de outubro de 2026";

const ESSENCIAIS: LinhaDeCookie[] = [
  {
    nome: "rr_consentimento",
    quem: site.nome,
    para: "Guardar a sua escolha sobre cookies, para o aviso não voltar a cada página. Fica no armazenamento local do navegador.",
    duracao: "Até você limpar os dados do navegador",
  },
];

const MEDICAO: LinhaDeCookie[] = [
  {
    nome: "_ga",
    quem: "Google Analytics",
    para: "Distinguir visitantes, para contar quantas pessoas diferentes visitam o site.",
    duracao: "2 anos",
  },
  {
    nome: "_ga_<ID>",
    quem: "Google Analytics",
    para: "Manter o estado da visita (sessão) e as páginas vistas nela.",
    duracao: "2 anos",
  },
];

const PUBLICIDADE: LinhaDeCookie[] = [
  {
    nome: "_gcl_au",
    quem: "Google Ads",
    para: "Ligar uma visita ou um pedido de orçamento ao anúncio do Google que trouxe você.",
    duracao: "3 meses",
  },
  {
    nome: "_fbp",
    quem: "Meta (Facebook e Instagram)",
    para: "Reconhecer o navegador para medir os anúncios e mostrá-los a quem já visitou o site.",
    duracao: "3 meses",
  },
  {
    nome: "_fbc",
    quem: "Meta (Facebook e Instagram)",
    para: "Registrar que você chegou clicando num anúncio da Meta.",
    duracao: "3 meses",
  },
];

export default async function PoliticaDeCookies() {
  const contato = await contatoDoSite();

  return (
    <>
      <HeroSimples
        trilha={[{ rotulo: "Início", href: "/" }, { rotulo: "Política de cookies" }]}
        titulo="Política de cookies"
        lead="O que o site grava no seu navegador, para quê, e como escolher."
        foto="casas-galeria-4"
        alturaClasse="min-h-[300px] md:min-h-[360px]"
      />

      <Secao fundo="pagina">
        <TextoLegal atualizadoEm={ATUALIZADO_EM}>
          <BlocoLegal titulo="1. O que são cookies">
            <p>
              Cookies são pequenos arquivos que um site grava no seu navegador para lembrar de
              alguma coisa entre uma página e outra, ou entre uma visita e outra. Esta página
              complementa a nossa <Link href="/politica-de-privacidade">política de privacidade</Link>.
            </p>
          </BlocoLegal>

          <BlocoLegal titulo="2. A sua escolha">
            <p>
              Na primeira visita, um aviso pergunta se você aceita os cookies de medição e de
              publicidade. <strong>Enquanto você não aceitar, nenhum deles é gravado</strong> e as
              ferramentas do Google e da Meta nem são carregadas. Recusar não muda nada no
              funcionamento do site: você navega e pede orçamento do mesmo jeito.
            </p>
            <p>
              Para mudar de ideia a qualquer momento, use{" "}
              <LinkDePreferenciasDeCookies className="font-semibold text-texto-forte underline underline-offset-4" />{" "}
              (também no rodapé de todas as páginas). Ao recusar depois de ter aceitado, apagamos
              os cookies dessas ferramentas do seu navegador.
            </p>
          </BlocoLegal>

          <BlocoLegal titulo="3. Essenciais — sempre ativos">
            <p>Necessários para o site funcionar e para lembrar a sua escolha. Não exigem consentimento.</p>
            <TabelaDeCookies linhas={ESSENCIAIS} />
            <p>
              A área administrativa do site, usada só pela equipe da {site.nome}, grava ainda um
              cookie de sessão de login. Ele não é gravado para quem visita o site.
            </p>
          </BlocoLegal>

          <BlocoLegal titulo="4. Medição — só com o seu aceite">
            <p>
              Mostram quantas pessoas visitam o site, por quais páginas passam e de onde vieram,
              em relatórios agregados. Carregados pelo Google Tag Manager, que não grava cookies
              próprios.
            </p>
            <TabelaDeCookies linhas={MEDICAO} />
          </BlocoLegal>

          <BlocoLegal titulo="5. Publicidade — só com o seu aceite">
            <p>
              Medem se os anúncios da {site.nome} trazem pedidos de orçamento e permitem mostrar
              anúncios a quem já visitou o site.
            </p>
            <TabelaDeCookies linhas={PUBLICIDADE} />
          </BlocoLegal>

          <BlocoLegal titulo="6. Outras formas de controlar">
            <ListaLegal
              itens={[
                "Pelas configurações do navegador, apagando ou bloqueando cookies — o que vale para todos os sites.",
                <>
                  No Google, em{" "}
                  <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer">
                    Minha Central de Anúncios
                  </a>{" "}
                  e pelo{" "}
                  <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer">
                    complemento de desativação do Google Analytics
                  </a>
                  .
                </>,
                <>
                  Na Meta, em{" "}
                  <a
                    href="https://www.facebook.com/adpreferences/ad_settings"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Preferências de anúncios
                  </a>
                  .
                </>,
              ]}
            />
          </BlocoLegal>

          <BlocoLegal titulo="7. Dúvidas">
            <p>
              Escreva para <a href={`mailto:${contato.email}`}>{contato.email}</a>.
            </p>
          </BlocoLegal>
        </TextoLegal>
      </Secao>
    </>
  );
}
