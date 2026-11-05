import Link from "next/link";

import { CabecalhoDeSecao, Secao } from "@/components/ui/Secao";
import { COMPARATIVO } from "@/content/linhas";

/**
 * Comparativo "Qual película é a sua?".
 *
 * Repete-se nas quatro internas de produto, com o nome de cada linha linkado — e
 * a linha da página atual marcada, para o leitor se localizar. Os dados vêm de
 * src/content/linhas.ts: a tabela não pode discordar da página que ela compara.
 *
 * Partindo do celular: até o sm, cada linha é um cartão com rótulo e valor lado
 * a lado; do sm em diante, a tabela de quatro colunas. É uma `<table>` só — os
 * rótulos do celular ficam fora da árvore de acessibilidade, porque o cabeçalho
 * de coluna já descreve a célula.
 */

const COLUNAS = ["Resolve", "Escurece?", "Dá privacidade?"] as const;

export function CompararLinhas({ atual }: { atual?: string }) {
  return (
    <Secao fundo="sutil">
      <CabecalhoDeSecao sobrancelha="Compare as linhas" titulo="Qual película é a sua?" />

      <div className="mt-10">
        <table className="w-full border-collapse text-left max-sm:block">
          <thead className="max-sm:hidden">
            <tr className="border-b border-borda-media">
              <th scope="col" className="pb-4 pr-6 t-campo text-texto-forte">
                Linha
              </th>
              {COLUNAS.map((coluna) => (
                <th key={coluna} scope="col" className="pb-4 pr-6 t-campo text-texto-forte">
                  {coluna}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="max-sm:flex max-sm:flex-col max-sm:gap-3">
            {COMPARATIVO.map((linha) => {
              const ehAtual = linha.slug === atual;
              const celulas = [linha.resolve, linha.escurece, linha.privacidade];

              return (
                <tr
                  key={linha.slug}
                  className={`border-b border-borda-sutil last:border-0 max-sm:block max-sm:rounded-xl max-sm:border max-sm:border-vidro-borda max-sm:bg-vidro-preenchimento max-sm:p-5 max-sm:vidro-01 ${
                    ehAtual ? "max-sm:border-texto-acento sm:bg-vidro-preenchimento-sutil" : ""
                  }`}
                >
                  <th
                    scope="row"
                    className="py-4 pr-6 align-top t-corpo-destaque font-normal text-texto-forte max-sm:block max-sm:p-0 max-sm:pb-3"
                  >
                    {ehAtual ? (
                      <span aria-current="page">{linha.nome}</span>
                    ) : (
                      <Link
                        href={linha.url}
                        className="underline decoration-borda-media underline-offset-4 transition-colors hover:decoration-texto-forte"
                      >
                        {linha.nome}
                      </Link>
                    )}
                  </th>
                  {celulas.map((valor, i) => (
                    <td
                      key={COLUNAS[i]}
                      className="py-4 pr-6 align-top t-corpo-p text-texto-suave max-sm:flex max-sm:items-baseline max-sm:justify-between max-sm:gap-4 max-sm:py-[6px] max-sm:pr-0"
                    >
                      <span aria-hidden className="shrink-0 t-micro text-texto-suave sm:hidden">
                        {COLUNAS[i]}
                      </span>
                      <span className="max-sm:text-right max-sm:text-texto-corpo">{valor}</span>
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Secao>
  );
}
