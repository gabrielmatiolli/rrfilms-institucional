import { FabWhatsapp } from "@/components/layout/FabWhatsapp";
import { Navbar } from "@/components/layout/Navbar";
import { Rodape } from "@/components/layout/Rodape";
import { contatoDoSite } from "@/lib/dados/configuracao";

/**
 * A moldura do site público. O painel em /admin não passa por aqui.
 *
 * Os dados de contato são lidos uma vez e descem por prop: a Navbar é Client
 * Component (menu e scroll) e não pode consultar o banco por conta própria.
 */
export default async function SiteLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const contato = await contatoDoSite();

  return (
    <>
      <a
        href="#conteudo"
        className="sr-only t-botao-m focus:not-sr-only focus:fixed focus:left-6 focus:top-6 focus:z-[60] focus:rounded-pill focus:bg-acao-primaria focus:px-6 focus:py-3 focus:text-acao-sobre-primaria"
      >
        Pular para o conteúdo
      </a>
      <Navbar telefone={contato.telefone} telefoneLink={contato.telefoneLink} />
      <main id="conteudo">{children}</main>
      <Rodape contato={contato} />
      <FabWhatsapp whatsapp={contato.whatsapp} />
    </>
  );
}
