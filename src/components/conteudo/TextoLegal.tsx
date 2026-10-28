import type { ReactNode } from "react";

/**
 * Tipografia das páginas legais (privacidade e cookies): coluna de leitura de
 * 760px, títulos numerados e listas com marcador.
 */

export function TextoLegal({ atualizadoEm, children }: { atualizadoEm: string; children: ReactNode }) {
  return (
    <article className="mx-auto flex max-w-[760px] flex-col gap-10">
      <p className="t-micro text-texto-suave">Última atualização: {atualizadoEm}</p>
      {children}
    </article>
  );
}

export function BlocoLegal({ id, titulo, children }: { id?: string; titulo: string; children: ReactNode }) {
  return (
    <section id={id} className="flex scroll-mt-28 flex-col gap-4">
      <h2 className="t-h4 text-texto-forte">{titulo}</h2>
      <div className="flex flex-col gap-4 t-corpo text-texto-corpo [&_a]:font-semibold [&_a]:text-texto-forte [&_a]:underline [&_a]:underline-offset-4 [&_strong]:font-semibold [&_strong]:text-texto-forte">
        {children}
      </div>
    </section>
  );
}

export function ListaLegal({ itens }: { itens: ReactNode[] }) {
  return (
    <ul className="flex list-disc flex-col gap-2 pl-6 marker:text-texto-acento">
      {itens.map((item, indice) => (
        <li key={indice}>{item}</li>
      ))}
    </ul>
  );
}

export interface LinhaDeCookie {
  nome: string;
  quem: string;
  para: string;
  duracao: string;
}

/** Tabela de cookies — vira cartões empilhados no celular. */
export function TabelaDeCookies({ linhas }: { linhas: LinhaDeCookie[] }) {
  return (
    <div className="overflow-hidden rounded-xl border border-vidro-borda">
      <table className="w-full border-collapse text-left t-corpo-p">
        <thead className="hidden bg-fundo-sutil sm:table-header-group">
          <tr>
            <th scope="col" className="px-4 py-3 font-semibold text-texto-forte">Nome</th>
            <th scope="col" className="px-4 py-3 font-semibold text-texto-forte">De quem</th>
            <th scope="col" className="px-4 py-3 font-semibold text-texto-forte">Para quê</th>
            <th scope="col" className="px-4 py-3 font-semibold text-texto-forte">Duração</th>
          </tr>
        </thead>
        <tbody>
          {linhas.map((linha) => (
            <tr
              key={linha.nome}
              className="flex flex-col gap-1 border-t border-vidro-borda px-4 py-3 first:border-t-0 sm:table-row sm:first:border-t"
            >
              <td className="font-mono text-[14px] font-semibold text-texto-forte sm:px-4 sm:py-3">{linha.nome}</td>
              <td className="sm:px-4 sm:py-3">
                <span className="text-texto-suave sm:hidden">De quem: </span>
                {linha.quem}
              </td>
              <td className="sm:px-4 sm:py-3">{linha.para}</td>
              <td className="sm:px-4 sm:py-3">
                <span className="text-texto-suave sm:hidden">Duração: </span>
                {linha.duracao}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
