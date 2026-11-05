import Image from "@/components/ui/Imagem";
import Link from "next/link";

import { IconeSetaDireita } from "@/components/ui/Icone";
import type { CaminhoDeImagem } from "@/lib/imagens";

/**
 * Linha de película (Figma nó 79:488).
 *
 * As quatro linhas reais do portfólio RR Film (ver src/content/linhas.ts).
 * Título em duas cores quando a linha tem destaque — padrão tipográfico da
 * marca. Copy em linguagem de cliente final, não técnica.
 *
 * A foto é opcional: linha sem material fotográfico próprio desenha o card sem
 * foto, em vez de emprestar a imagem de outra linha.
 */

export type Linha = {
  nome: string;
  /** Segunda linha do título, em Acento. */
  destaque?: string;
  promessa: string;
  descricao?: string;
  foto?: CaminhoDeImagem;
  /** Alt da foto: ambiente + película + cidade. */
  legendaDaFoto?: string;
  href: string;
  /** O padrão é "Conheça a linha". As linhas oficiais trazem o rótulo próprio. */
  rotuloDoLink?: string;
};

export function LinhaDePelicula({ linha }: { linha: Linha }) {
  return (
    <article className="flex h-full flex-col items-start gap-5 rounded-2xl border border-borda-sutil bg-fundo-superficie p-8">
      <h3 className="t-h4">
        <span className="block">{linha.nome}</span>
        {linha.destaque && <span className="block text-texto-acento">{linha.destaque}</span>}
      </h3>

      {linha.foto ? (
        <div className="relative h-[176px] w-full overflow-hidden rounded-lg border border-vidro-borda-baixa">
          <Image
            src={linha.foto}
            alt={linha.legendaDaFoto ?? `Aplicação da linha ${linha.nome}`}
            fill
            sizes="(max-width: 768px) 100vw, 400px"
            className="object-cover"
          />
        </div>
      ) : (
        <div className="h-[176px] w-full rounded-lg border border-vidro-borda-baixa bg-vidro-preenchimento-sutil" />
      )}

      <p className="t-h5">{linha.promessa}</p>
      {linha.descricao && <p className="t-corpo text-texto-corpo">{linha.descricao}</p>}

      <Link
        href={linha.href}
        className="mt-auto inline-flex items-center gap-2 rounded-pill bg-acao-secundaria px-[22px] py-[13px] t-botao-m text-acao-sobre-secundaria transition-colors hover:bg-conforto-300"
      >
        {linha.rotuloDoLink ?? "Conheça a linha"}
        <IconeSetaDireita tamanho={18} />
      </Link>
    </article>
  );
}
