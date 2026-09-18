import Image from "@/components/ui/Imagem";
import Link from "next/link";

import { Isotipo } from "@/components/brand/Marca";
import { LinkComSeta, Tag, type TomDeTag } from "@/components/ui/Elementos";
import { IconeEstrela, IconeSetaDireita } from "@/components/ui/Icone";
import { TexturaDeLaminas } from "@/components/ui/Foto";
import type { CaminhoDeImagem } from "@/lib/imagens";

/* ==========================================================================
   Card de serviço (Figma nó 27:163)

   O card É uma amostra de película: o topo mostra a lâmina de vidro tingida com
   a cor da linha, com refração real. A variante Linha define a tinta —
   Conforto (solar), Luz (decorativa), Frescor (segurança).
   ========================================================================== */

export type LinhaDeCard = "conforto" | "luz" | "frescor";

const tintaDaLinha: Record<LinhaDeCard, string> = {
  conforto: "rgba(249,169,125,0.22)",
  luz: "rgba(254,224,132,0.22)",
  frescor: "rgba(196,221,166,0.22)",
};

const tomDaLinha: Record<LinhaDeCard, TomDeTag> = {
  conforto: "conforto",
  luz: "luz",
  frescor: "frescor",
};

export type ServicoDeCard = {
  linha: LinhaDeCard;
  tag: string;
  titulo: string;
  descricao: string;
  /** Caminho da imagem. Vazio desenha o card sem foto. */
  foto: CaminhoDeImagem | "";
  dados?: { valor: string; rotulo: string }[];
  href: string;
};

export function CardDeServico({ servico }: { servico: ServicoDeCard }) {
  return (
    <article className="group relative flex flex-col overflow-hidden rounded-[28px] border border-vidro-borda bg-vidro-preenchimento vidro-02">
      {/* Amostra: a foto da obra com a lâmina de vidro por cima */}
      <div className="relative h-[168px] shrink-0 overflow-hidden">
        {servico.foto && (
          <Image
            src={servico.foto}
            alt=""
            fill
            sizes="(max-width: 768px) 100vw, 410px"
            className="object-cover"
          />
        )}
        <span
          aria-hidden
          className="absolute left-1/2 top-1/2 flex h-[110px] w-[150px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-[14px] border border-white/70 vidro-05"
          style={{ background: tintaDaLinha[servico.linha] }}
        >
          <Isotipo className="h-[56px] w-auto text-texto-forte" />
        </span>
      </div>

      {/* Corpo */}
      <div className="flex flex-1 flex-col items-start gap-3 px-7 pb-7 pt-6">
        <Tag tom={tomDaLinha[servico.linha]}>{servico.tag}</Tag>
        <h3 className="t-h4">{servico.titulo}</h3>
        <p className="t-corpo-p text-texto-suave">{servico.descricao}</p>

        {servico.dados && (
          <div className="flex gap-6 pt-2">
            {servico.dados.map((dado) => (
              <div key={dado.rotulo} className="flex flex-col gap-[2px]">
                <p className="t-h4">{dado.valor}</p>
                <p className="t-micro text-texto-suave">{dado.rotulo}</p>
              </div>
            ))}
          </div>
        )}

        <LinkComSeta href={servico.href} className="mt-auto pt-2">
          Ver serviço
        </LinkComSeta>
      </div>
    </article>
  );
}

/* ==========================================================================
   Card de blog (Figma nó 29:172)
   Área de foto no topo, tag de categoria, título H4 e meta.
   ========================================================================== */

export type PostDeCard = {
  slug: string;
  categoria: string;
  titulo: string;
  meta: string;
  /** Caminho da imagem. Vazio desenha o card sem capa. */
  capa: CaminhoDeImagem | "";
};

export function CardDeBlog({ post }: { post: PostDeCard }) {
  return (
    <article className="relative flex flex-col overflow-hidden rounded-xl border border-vidro-borda bg-vidro-preenchimento vidro-02">
      <div className="relative h-[210px] shrink-0 overflow-hidden rounded-xl">
        {post.capa && (
          <Image
            src={post.capa}
            alt=""
            fill
            sizes="(max-width: 768px) 100vw, 410px"
            className="object-cover"
          />
        )}
        <TexturaDeLaminas />
      </div>

      <div className="flex flex-1 flex-col items-start gap-3 px-[26px] pb-[26px] pt-[22px]">
        <Tag>{post.categoria}</Tag>
        <h3 className="t-h4">
          <Link href={`/blog/${post.slug}`} className="after:absolute after:inset-0">
            {post.titulo}
          </Link>
        </h3>
        <p className="t-micro text-texto-suave">{post.meta}</p>
        <span className="mt-auto inline-flex items-center gap-2 rounded-pill bg-acao-secundaria px-[22px] py-[13px] t-botao-m text-acao-sobre-secundaria">
          Ler o artigo
          <IconeSetaDireita tamanho={18} />
        </span>
      </div>
    </article>
  );
}

/* ==========================================================================
   Depoimento (Figma nó 30:148)
   Prova social. Cinco estrelas, citação em Corpo/Grande e assinatura.
   Nomes reais só com autorização do cliente.
   ========================================================================== */

export type Fala = {
  citacao: string;
  nome: string;
  contexto: string;
  inicial?: string;
};

export function Estrelas({ tamanho = 18 }: { tamanho?: number }) {
  return (
    <div className="flex gap-1 text-conforto-500" aria-label="Cinco estrelas">
      {Array.from({ length: 5 }, (_, i) => (
        <IconeEstrela key={i} tamanho={tamanho} fill="currentColor" />
      ))}
    </div>
  );
}

export function Depoimento({ fala }: { fala: Fala }) {
  return (
    <figure className="relative flex flex-col items-start gap-[18px] rounded-xl border border-vidro-borda bg-vidro-preenchimento p-8 vidro-02">
      <Estrelas />
      <blockquote className="t-corpo-g text-texto-corpo">{fala.citacao}</blockquote>
      <figcaption className="flex flex-col gap-[2px]">
        <span className="t-corpo-destaque text-texto-forte">{fala.nome}</span>
        <span className="t-micro text-texto-suave">{fala.contexto}</span>
      </figcaption>
    </figure>
  );
}
