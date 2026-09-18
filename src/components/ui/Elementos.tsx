import Link from "next/link";
import type { ReactNode } from "react";

import {
  IconeChevronBaixo,
  IconeSetaDireita,
  IconeSetaEsquerda,
  type NomeDeIcone,
  icones,
} from "@/components/ui/Icone";

/* ==========================================================================
   Tag (Figma nó 22:53)
   Rótulo curto de categoria ou estado. Um acento por composição — não empilhe
   Conforto, Luz e Frescor na mesma seção.
   ========================================================================== */

export type TomDeTag = "neutro" | "conforto" | "luz" | "frescor" | "escuro";

const tonsDeTag: Record<TomDeTag, string> = {
  neutro: "bg-fundo-superficie border border-borda-sutil text-texto-corpo",
  conforto: "bg-conforto-500 text-texto-forte",
  luz: "bg-luz-500 text-texto-forte",
  frescor: "bg-frescor-500 text-texto-forte",
  escuro: "bg-escuro-900 text-texto-inverso",
};

export function Tag({
  tom = "neutro",
  children,
  className = "",
}: {
  tom?: TomDeTag;
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-pill px-3 py-[6px] t-tag ${tonsDeTag[tom]} ${className}`}
    >
      {children}
    </span>
  );
}

/* ==========================================================================
   Chip de vidro (Figma nó 22:66)
   Filtro pill de vidro, com estado Padrão e Ativo.
   ========================================================================== */

export function ChipDeVidro({
  ativo = false,
  children,
  ...props
}: { ativo?: boolean; children: ReactNode } & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      aria-pressed={ativo}
      className={`inline-flex items-center rounded-pill px-[18px] py-3 t-campo transition-colors ${
        ativo
          ? "bg-escuro-900 text-texto-inverso"
          : "border border-vidro-borda bg-vidro-preenchimento text-texto-corpo vidro-01 hover:bg-white/60"
      }`}
      {...props}
    >
      {children}
    </button>
  );
}

/** Versão do chip que navega em vez de filtrar. */
export function ChipDeVidroLink({
  ativo = false,
  href,
  children,
}: {
  ativo?: boolean;
  href: string;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      aria-current={ativo ? "page" : undefined}
      className={`inline-flex items-center rounded-pill px-[18px] py-3 t-campo transition-colors ${
        ativo
          ? "bg-escuro-900 text-texto-inverso"
          : "border border-vidro-borda bg-vidro-preenchimento text-texto-corpo vidro-01 hover:bg-white/60"
      }`}
    >
      {children}
    </Link>
  );
}

/* ==========================================================================
   Breadcrumb (Figma nó 26:83)
   ========================================================================== */

export function Breadcrumb({ trilha }: { trilha: { rotulo: string; href?: string }[] }) {
  return (
    <nav aria-label="Trilha de navegação">
      <ol className="flex flex-wrap items-center gap-2 t-corpo-p text-texto-suave">
        {trilha.map((item, i) => (
          <li key={item.rotulo} className="flex items-center gap-2">
            {i > 0 && (
              <span aria-hidden className="opacity-40">
                /
              </span>
            )}
            {item.href ? (
              <Link
                href={item.href}
                className="-my-[9px] inline-block py-[9px] transition-colors hover:text-texto-forte"
              >
                {item.rotulo}
              </Link>
            ) : (
              <span aria-current="page" className="text-texto-forte">
                {item.rotulo}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

/* ==========================================================================
   Dado (Figma nó 29:96)
   Número grande + rótulo. Usado em faixas de prova.
   ========================================================================== */

export function Dado({
  valor,
  rotulo,
  tom = "forte",
  className = "",
}: {
  valor: ReactNode;
  rotulo: ReactNode;
  /** As faixas de dados das paginas internas usam o acento; a Home usa o forte. */
  tom?: "forte" | "acento";
  className?: string;
}) {
  return (
    <div className={`flex flex-col gap-[10px] ${className}`}>
      <p className={`t-h1 leading-[1.08] ${tom === "acento" ? "text-texto-acento" : ""}`}>
        {valor}
      </p>
      <p className="t-corpo-p text-texto-suave">{rotulo}</p>
    </div>
  );
}

/* ==========================================================================
   Passo (Figma nó 30:140)
   Etapa numerada do processo.
   ========================================================================== */

export function Passo({
  numero,
  titulo,
  descricao,
}: {
  numero: string;
  titulo: string;
  descricao: string;
}) {
  return (
    <div className="flex flex-col items-start gap-4">
      <span className="flex size-11 items-center justify-center rounded-pill border border-vidro-borda bg-[rgba(249,169,125,0.18)] t-tag text-texto-forte">
        {numero}
      </span>
      <h3 className="t-corpo-destaque text-texto-forte">{titulo}</h3>
      <p className="t-corpo-p text-texto-suave">{descricao}</p>
    </div>
  );
}

/* ==========================================================================
   Linha de especificação (Figma nó 30:145)
   Linha de ficha técnica. No celular o valor desce para baixo do rótulo —
   lado a lado, valores longos ("por dentro, em um dia, sem obra") espremem;
   do sm em diante, rótulo à esquerda e valor à direita, como no Figma.
   ========================================================================== */

export function LinhaDeEspecificacao({
  rotulo,
  valor,
}: {
  rotulo: string;
  valor: string;
}) {
  return (
    <div className="flex flex-col gap-1 border-b border-borda-sutil py-4 last:border-0 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6 sm:py-5">
      <dt className="t-corpo-p text-texto-suave">{rotulo}</dt>
      <dd className="t-corpo-destaque text-texto-forte sm:text-right">{valor}</dd>
    </div>
  );
}

/* ==========================================================================
   Selo — o círculo de vidro com ícone que abre o Card de benefício
   ========================================================================== */

export function Selo({ icone, tamanho = 52 }: { icone: NomeDeIcone; tamanho?: number }) {
  const Icone = icones[icone];
  return (
    <span
      className="flex shrink-0 items-center justify-center rounded-pill border border-vidro-borda bg-[rgba(249,169,125,0.18)] text-texto-forte"
      style={{ width: tamanho, height: tamanho }}
      aria-hidden
    >
      <Icone tamanho={Math.round(tamanho * 0.46)} />
    </span>
  );
}

/* ==========================================================================
   Card de benefício (Figma nó 27:164)
   Bloco curto de argumento. Ícone em círculo de vidro, título H5 e duas linhas
   de texto. Usado em grades de 3 ou 4.
   ========================================================================== */

export function CardDeBeneficio({
  icone,
  titulo,
  descricao,
}: {
  icone: NomeDeIcone;
  titulo: string;
  descricao: string;
}) {
  return (
    <div className="flex flex-col items-start gap-4 rounded-xl border border-vidro-borda bg-vidro-preenchimento p-7 vidro-02">
      <Selo icone={icone} />
      <h3 className="t-h5">{titulo}</h3>
      <p className="t-corpo-p text-texto-suave">{descricao}</p>
    </div>
  );
}

/* ==========================================================================
   Link "Ver serviço" — o par rótulo + seta que fecha os cards
   ========================================================================== */

export function LinkComSeta({
  href,
  children,
  className = "",
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={`group -my-[9px] inline-flex items-center gap-2 py-[9px] t-botao-m text-texto-forte ${className}`}
    >
      {children}
      <span className="transition-transform group-hover:translate-x-1">
        <IconeSetaDireita tamanho={18} />
      </span>
    </Link>
  );
}

/* ==========================================================================
   Paginação (Figma nó 26:89)
   ========================================================================== */

/**
 * Como no Figma: seta, as três primeiras páginas, reticências, a última e seta.
 * Tudo em círculos de 44px — o alvo mínimo de toque — e cabe numa linha de 320px.
 */
export function Paginacao({
  pagina = 1,
  total = 7,
}: {
  pagina?: number;
  total?: number;
}) {
  const circulo =
    "flex size-11 shrink-0 items-center justify-center rounded-pill t-campo";
  const vidro =
    "border border-vidro-borda bg-vidro-preenchimento-forte text-texto-corpo vidro-01";

  const numeros = total <= 4 ? Array.from({ length: total }, (_, i) => i + 1) : [1, 2, 3];

  return (
    <nav aria-label="Paginação" className="flex items-center justify-center gap-1.5 sm:gap-2">
      <span
        aria-disabled={pagina === 1}
        className={`${circulo} ${vidro} ${pagina === 1 ? "opacity-50" : ""}`}
      >
        <span className="sr-only">Página anterior</span>
        <IconeSetaEsquerda tamanho={18} />
      </span>

      {numeros.map((n) => (
        <span
          key={n}
          aria-current={n === pagina ? "page" : undefined}
          className={`${circulo} ${n === pagina ? "bg-escuro-900 text-texto-inverso" : vidro}`}
        >
          {n}
        </span>
      ))}

      {total > 4 && (
        <>
          <span aria-hidden className="w-4 shrink-0 text-center t-campo text-texto-suave">
            …
          </span>
          <span className={`${circulo} ${vidro}`}>{total}</span>
        </>
      )}

      <span className={`${circulo} ${vidro}`}>
        <span className="sr-only">Próxima página</span>
        <IconeSetaDireita tamanho={18} />
      </span>
    </nav>
  );
}

/** Marcador de acordeão fechado/aberto, para reuso fora do FAQ. */
export function Chevron({ aberto }: { aberto: boolean }) {
  return (
    <span
      className={`shrink-0 text-texto-forte transition-transform duration-300 ${
        aberto ? "rotate-180" : ""
      }`}
    >
      <IconeChevronBaixo tamanho={22} />
    </span>
  );
}
