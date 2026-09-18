import Image from "@/components/ui/Imagem";
import Link from "next/link";

import { IconeSetaDireita } from "@/components/ui/Icone";
import type { CaminhoDeImagem } from "@/lib/imagens";

/**
 * Linha de película (Figma nó 79:488).
 *
 * As cinco linhas reais do portfólio RR Film (Descritivo do cliente + pasta
 * SERVIÇOS). Título em duas cores — padrão tipográfico da marca. Copy em
 * linguagem de cliente final, não técnica.
 */

export type Linha = {
  nome: string;
  /** Segunda linha do título, em Acento. */
  destaque: string;
  promessa: string;
  descricao: string;
  /** Caminho da imagem. Vazio quando a linha ainda não tem material fotográfico. */
  foto?: CaminhoDeImagem;
  href: string;
};

export function LinhaDePelicula({ linha }: { linha: Linha }) {
  return (
    <article className="flex h-full flex-col items-start gap-5 rounded-2xl border border-borda-sutil bg-fundo-superficie p-8">
      <h3 className="t-h4">
        <span className="block">{linha.nome}</span>
        <span className="block text-texto-acento">{linha.destaque}</span>
      </h3>

      {linha.foto ? (
        <div className="relative h-[176px] w-full overflow-hidden rounded-lg border border-vidro-borda-baixa">
          <Image
            src={linha.foto}
            alt={`Aplicação da linha ${linha.nome} ${linha.destaque}`}
            fill
            sizes="(max-width: 768px) 100vw, 400px"
            className="object-cover"
          />
        </div>
      ) : (
        <div className="h-[176px] w-full rounded-lg border border-vidro-borda-baixa bg-vidro-preenchimento-sutil" />
      )}

      <p className="t-h5">{linha.promessa}</p>
      <p className="t-corpo text-texto-corpo">{linha.descricao}</p>

      <Link
        href={linha.href}
        className="mt-auto inline-flex items-center gap-2 rounded-pill bg-acao-secundaria px-[22px] py-[13px] t-botao-m text-acao-sobre-secundaria transition-colors hover:bg-conforto-300"
      >
        Conheça a linha
        <IconeSetaDireita tamanho={18} />
      </Link>
    </article>
  );
}

/** Painel de garantia que fecha a grade das cinco linhas, na Home. */
export function GarantiaPorEscrito() {
  return (
    <div className="flex h-full flex-col items-start justify-center gap-4 rounded-2xl border border-vidro-borda bg-vidro-preenchimento p-8 vidro-02">
      <p className="t-display-l text-[clamp(3rem,5vw,5.25rem)] leading-none">15 anos</p>
      <p className="t-h5">de garantia por escrito</p>
      <p className="t-corpo-p text-texto-suave">
        Trabalhamos com Sun Blue, que emite termo formal de garantia contra perda
        de eficiência e descolamento. Também aplicamos 3M para quem faz questão
        da marca.
      </p>
    </div>
  );
}
