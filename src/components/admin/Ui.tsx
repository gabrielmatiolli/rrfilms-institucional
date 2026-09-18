import type { ComponentProps, ReactNode } from "react";
import Link from "next/link";

import { cn } from "@/lib/utils";

/**
 * Primitivas do painel administrativo.
 *
 * Reaproveitam os tokens do site (cores, raios, famílias) para o painel parecer
 * a mesma marca, mas em densidade de ferramenta: tipografia menor, mais
 * contraste de borda e alvos de toque de 44px, porque o cliente vai publicar
 * post do celular.
 */

// --- Estrutura --------------------------------------------------------------

export function CabecalhoDePagina({
  titulo,
  descricao,
  acoes,
}: {
  titulo: string;
  descricao?: string;
  acoes?: ReactNode;
}) {
  return (
    <header className="flex flex-col gap-4 border-b border-borda-sutil pb-6 sm:flex-row sm:items-end sm:justify-between">
      <div className="flex flex-col gap-1.5">
        <h1 className="font-[family-name:var(--tipo-familia-display)] text-[26px] font-bold leading-tight text-texto-forte sm:text-[30px]">
          {titulo}
        </h1>
        {descricao && <p className="text-[14px] text-texto-suave">{descricao}</p>}
      </div>
      {acoes && <div className="flex shrink-0 flex-wrap gap-2.5">{acoes}</div>}
    </header>
  );
}

export function Cartao({
  children,
  className,
  ...resto
}: { children: ReactNode } & ComponentProps<"section">) {
  return (
    <section
      {...resto}
      className={cn(
        "rounded-2xl border border-borda-sutil bg-fundo-superficie p-5 sm:p-7",
        className,
      )}
    >
      {children}
    </section>
  );
}

export function TituloDeBloco({ children, dica }: { children: ReactNode; dica?: string }) {
  return (
    <div className="mb-5 flex flex-col gap-1">
      <h2 className="font-[family-name:var(--tipo-familia-display)] text-[18px] font-bold text-texto-forte">
        {children}
      </h2>
      {dica && <p className="text-[13px] text-texto-suave">{dica}</p>}
    </div>
  );
}

export function Vazio({ titulo, descricao, acao }: { titulo: string; descricao: string; acao?: ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-borda-media/40 bg-fundo-sutil px-6 py-14 text-center">
      <p className="font-[family-name:var(--tipo-familia-display)] text-[17px] font-bold text-texto-forte">
        {titulo}
      </p>
      <p className="max-w-[420px] text-[13.5px] text-texto-suave">{descricao}</p>
      {acao}
    </div>
  );
}

// --- Botões -----------------------------------------------------------------

const estilosDeBotao = {
  primario: "bg-acao-primaria text-acao-sobre-primaria hover:bg-escuro-700",
  secundario: "bg-acao-secundaria text-acao-sobre-secundaria hover:bg-conforto-300",
  contorno:
    "border border-borda-media/40 bg-fundo-superficie text-texto-forte hover:border-texto-forte",
  perigo: "border border-estado-erro/40 bg-fundo-superficie text-estado-erro hover:bg-estado-erro/8",
} as const;

export type TipoDeBotao = keyof typeof estilosDeBotao;

const baseDoBotao =
  "inline-flex min-h-[44px] items-center justify-center gap-2 rounded-pill px-5 text-[14px] font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50";

export function BotaoPainel({
  tipo = "primario",
  className,
  ...resto
}: { tipo?: TipoDeBotao } & ComponentProps<"button">) {
  return <button {...resto} className={cn(baseDoBotao, estilosDeBotao[tipo], className)} />;
}

export function LinkPainel({
  tipo = "primario",
  className,
  ...resto
}: { tipo?: TipoDeBotao } & ComponentProps<typeof Link>) {
  return <Link {...resto} className={cn(baseDoBotao, estilosDeBotao[tipo], className)} />;
}

// --- Selos ------------------------------------------------------------------

export function Selo({
  children,
  tom = "neutro",
}: {
  children: ReactNode;
  tom?: "neutro" | "positivo" | "atencao" | "erro";
}) {
  const tons = {
    neutro: "border-borda-sutil bg-fundo-sutil text-texto-suave",
    positivo: "border-frescor-500 bg-frescor-100 text-escuro-900",
    atencao: "border-conforto-500 bg-conforto-100 text-escuro-900",
    erro: "border-estado-erro/30 bg-estado-erro/10 text-estado-erro",
  } as const;

  return (
    <span
      className={cn(
        "inline-flex w-fit items-center gap-1.5 rounded-pill border px-3 py-1 text-[12px] font-semibold",
        tons[tom],
      )}
    >
      {children}
    </span>
  );
}

// --- Mensagens --------------------------------------------------------------

export function Erro({ children }: { children: ReactNode }) {
  if (!children) return null;
  return (
    <p
      role="alert"
      className="rounded-xl border border-estado-erro/30 bg-estado-erro/8 px-4 py-3 text-[13px] font-semibold text-estado-erro"
    >
      {children}
    </p>
  );
}

export function Aviso({ children }: { children: ReactNode }) {
  return (
    <p className="rounded-xl border border-conforto-500 bg-conforto-100 px-4 py-3 text-[13px] text-escuro-900">
      {children}
    </p>
  );
}
