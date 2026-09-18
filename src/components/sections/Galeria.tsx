import type { ReactNode } from "react";

import { CabecalhoDeSecao, Secao } from "@/components/ui/Secao";
import { FotoDeUrl } from "@/components/ui/Foto";
import type { CaminhoDeImagem } from "@/lib/imagens";

export type ItemDeGaleria = { src: CaminhoDeImagem; alt: string };

/**
 * Galeria de obras.
 *
 * A grade do Figma: a primeira linha traz uma foto larga (844) ao lado de uma
 * vertical (412); a segunda, quatro fotos de 302. Tudo dentro dos 1280 do
 * contêiner, com 24 de gap.
 */
export function Galeria({
  sobrancelha,
  titulo,
  lead,
  itens,
  filtros,
  fundo = "pagina",
  id,
}: {
  sobrancelha: string;
  titulo: ReactNode;
  lead?: ReactNode;
  itens: readonly ItemDeGaleria[];
  /** Chips de categoria, quando a página usa (Para empresas). */
  filtros?: ReactNode;
  fundo?: "pagina" | "sutil" | "superficie";
  id?: string;
}) {
  const [larga, vertical, ...restantes] = itens;

  return (
    <Secao fundo={fundo} id={id}>
      <CabecalhoDeSecao
        sobrancelha={sobrancelha}
        titulo={titulo}
        lead={lead}
        largura="860px"
      />

      {filtros && <div className="linha-de-chips mt-8">{filtros}</div>}

      {/* No celular: a foto larga ocupa a linha e as outras formam uma grade de
          duas colunas — em vez de seis fotos empilhadas. Do sm em diante, a grade
          do Figma. */}
      <div className="mt-8 grid grid-cols-2 gap-3 sm:mt-10 sm:grid-cols-12 sm:gap-6">
        {larga && (
          <FotoDeUrl
            src={larga.src}
            alt={larga.alt}
            arredondamento="rounded-lg sm:rounded-xl"
            className="col-span-2 aspect-[4/3] sm:col-span-8 sm:aspect-[844/420]"
            sizes="(max-width: 640px) 100vw, 66vw"
          />
        )}
        {vertical && (
          <FotoDeUrl
            src={vertical.src}
            alt={vertical.alt}
            arredondamento="rounded-lg sm:rounded-xl"
            className="aspect-[4/5] sm:col-span-4 sm:aspect-[412/420]"
            sizes="(max-width: 640px) 50vw, 33vw"
          />
        )}
        {restantes.map((item, i) => {
          // Com número ímpar de fotos na grade de duas colunas, a última ocupa a linha.
          const sobra = (restantes.length + (vertical ? 1 : 0)) % 2 === 1;
          const ultima = i === restantes.length - 1;
          return (
            <FotoDeUrl
              key={item.src + item.alt}
              src={item.src}
              alt={item.alt}
              arredondamento="rounded-lg sm:rounded-xl"
              className={`sm:col-span-6 sm:aspect-[302/220] lg:col-span-3 ${
                sobra && ultima ? "col-span-2 aspect-[4/3]" : "aspect-[4/5]"
              }`}
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 25vw"
            />
          );
        })}
      </div>
    </Secao>
  );
}
