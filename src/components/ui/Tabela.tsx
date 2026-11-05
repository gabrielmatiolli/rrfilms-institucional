import type { ReactNode } from "react";

/**
 * Tabela de conteúdo (a de cômodos em /para-casas, por exemplo).
 *
 * Partindo do celular: até o sm cada linha é um cartão, com o rótulo da coluna
 * ao lado do valor; do sm em diante, a tabela de verdade. É uma `<table>` só —
 * duplicar a grade em duas marcações daria conteúdo repetido para o buscador.
 *
 * Os rótulos do celular ficam `aria-hidden`: o cabeçalho de coluna já descreve
 * a célula para quem usa leitor de tela.
 */
export function Tabela({
  colunas,
  linhas,
}: {
  /** O primeiro rótulo é o da coluna-cabeçalho de cada linha. */
  colunas: readonly string[];
  linhas: readonly { chave: string; celulas: readonly ReactNode[] }[];
}) {
  const [primeira, ...resto] = colunas;

  return (
    <table className="w-full border-collapse text-left max-sm:block">
      <thead className="max-sm:hidden">
        <tr className="border-b border-borda-media">
          {colunas.map((coluna) => (
            <th key={coluna} scope="col" className="pb-4 pr-6 t-campo text-texto-forte">
              {coluna}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="max-sm:flex max-sm:flex-col max-sm:gap-3">
        {linhas.map((linha) => {
          const [cabecalho, ...celulas] = linha.celulas;

          return (
            <tr
              key={linha.chave}
              className="border-b border-borda-sutil last:border-0 max-sm:block max-sm:rounded-xl max-sm:border max-sm:border-vidro-borda max-sm:bg-vidro-preenchimento max-sm:p-5 max-sm:vidro-01"
            >
              <th
                scope="row"
                className="py-4 pr-6 align-top t-corpo-destaque font-normal text-texto-forte max-sm:block max-sm:p-0 max-sm:pb-3"
              >
                <span aria-hidden className="block t-micro text-texto-suave sm:hidden">
                  {primeira}
                </span>
                {cabecalho}
              </th>
              {celulas.map((celula, i) => (
                <td
                  key={resto[i]}
                  className="py-4 pr-6 align-top t-corpo-p text-texto-suave max-sm:flex max-sm:flex-col max-sm:gap-[2px] max-sm:py-[6px] max-sm:pr-0"
                >
                  <span aria-hidden className="t-micro text-texto-suave sm:hidden">
                    {resto[i]}
                  </span>
                  <span className="max-sm:text-texto-corpo">{celula}</span>
                </td>
              ))}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
