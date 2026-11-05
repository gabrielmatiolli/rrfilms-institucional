import { BotaoDeWhatsapp } from "@/components/sections/BotaoDeWhatsapp";
import { Selo } from "@/components/ui/Elementos";
import { CabecalhoDeSecao, Secao } from "@/components/ui/Secao";
import type { CodigoDeWhatsapp } from "@/content/whatsapp";

/**
 * "Onde aplicar" — as duas colunas de público das internas de produto.
 *
 * Cada coluna tem âncora própria (`#para-sua-casa`, `#para-sua-empresa`): é para
 * onde apontam os cards de /para-casas e /para-empresas e os links dos artigos
 * do blog. Por isso os ids são derivados do público, e não passados à mão — um
 * id digitado errado quebraria links de outras páginas em silêncio.
 *
 * A ordem é a do array: nas páginas da Refletiva e do Jateado a coluna de
 * empresa vem primeiro, porque a demanda delas nasce corporativa.
 */

export interface ColunaDeAplicacao {
  publico: "casa" | "empresa";
  texto: string;
  ambientes: readonly string[];
  codigo: CodigoDeWhatsapp;
  /** O padrão é "Falar no WhatsApp" em casa e "Solicitar visita técnica" em empresa. */
  rotuloDoBotao?: string;
}

const TITULOS = {
  casa: { titulo: "Para sua casa", ancora: "para-sua-casa", icone: "casa" as const },
  empresa: {
    titulo: "Para sua empresa",
    ancora: "para-sua-empresa",
    icone: "predio" as const,
  },
};

export function OndeAplicar({
  sobrancelha = "Onde aplicar",
  titulo,
  colunas,
}: {
  sobrancelha?: string;
  titulo: string;
  colunas: readonly [ColunaDeAplicacao, ColunaDeAplicacao];
}) {
  return (
    <Secao fundo="pagina">
      <CabecalhoDeSecao sobrancelha={sobrancelha} titulo={titulo} />

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        {colunas.map((coluna) => {
          const { titulo: tituloDaColuna, ancora, icone } = TITULOS[coluna.publico];
          const rotulo =
            coluna.rotuloDoBotao ??
            (coluna.publico === "casa" ? "Falar no WhatsApp" : "Solicitar visita técnica");

          return (
            <div
              key={ancora}
              id={ancora}
              // scroll-mt: a navbar é flutuante e cobriria o título ao chegar pela âncora.
              className="flex scroll-mt-32 flex-col items-start gap-4 rounded-2xl border border-vidro-borda bg-vidro-preenchimento p-6 vidro-02 sm:p-9"
            >
              <Selo icone={icone} />
              <h3 className="t-h4">{tituloDaColuna}</h3>
              <p className="t-corpo text-texto-corpo">{coluna.texto}</p>

              <ul className="flex flex-col gap-2">
                {coluna.ambientes.map((ambiente) => (
                  <li
                    key={ambiente}
                    className="flex items-start gap-[10px] t-corpo-p text-texto-suave"
                  >
                    <span
                      aria-hidden
                      className="mt-[9px] block size-[7px] shrink-0 rounded-pill bg-conforto-500"
                    />
                    {ambiente}
                  </li>
                ))}
              </ul>

              <div className="mt-auto w-full pt-2 *:w-full sm:w-auto sm:*:w-auto">
                <BotaoDeWhatsapp
                  codigo={coluna.codigo}
                  rotulo={rotulo}
                  tipo={coluna.publico === "casa" ? "vidro" : "primaria"}
                  tamanho="M"
                />
              </div>
            </div>
          );
        })}
      </div>
    </Secao>
  );
}
