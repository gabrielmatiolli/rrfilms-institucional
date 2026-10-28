import { AvisoDeCookies } from "@/components/layout/AvisoDeCookies";
import { FabWhatsapp } from "@/components/layout/FabWhatsapp";
import { Navbar } from "@/components/layout/Navbar";
import { RastreioDeContato } from "@/components/layout/RastreioDeContato";
import { Rodape } from "@/components/layout/Rodape";
import { TagsDeMedicao } from "@/components/layout/TagsDeMedicao";
import { contatoDoSite } from "@/lib/dados/configuracao";

/**
 * Todo o conteúdo do site público sai do banco, e quem edita é o painel.
 *
 * Sem isto o Next pré-renderiza cada página no `build` e serve esse HTML para
 * sempre (`x-nextjs-cache: HIT`): o `revalidatePath()` das actions do painel é
 * a única coisa que limpa esse cache, e na Hostinger ele não surte efeito —
 * post publicado, destaque trocado e categoria nova continuavam invisíveis até
 * o próximo deploy. Montar a página a cada pedido é o que /blog/[slug] já fazia
 * (por ser rota dinâmica) e é por isso que só ela aparecia atualizada.
 *
 * Fica no layout de propósito: vale para todas as rotas do grupo `(site)`.
 */
export const dynamic = "force-dynamic";

/**
 * A moldura do site público. O painel em /admin não passa por aqui.
 *
 * As tags de medição (GTM, Google, Meta) e o aviso de cookies ficam aqui, e não
 * no layout raiz, para o /admin não virar visita nos relatórios. As tags só
 * carregam depois do aceite — ver TagsDeMedicao.
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
      <AvisoDeCookies />
      <TagsDeMedicao />
      <RastreioDeContato />
    </>
  );
}
