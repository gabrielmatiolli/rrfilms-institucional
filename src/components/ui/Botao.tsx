import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

import { IconeSetaDireita } from "@/components/ui/Icone";

/**
 * Botão — CTA do sistema (Figma nó 21:92).
 *
 * Primária  = grafite, a ação principal.
 * Secundária = laranja Conforto térmico, conversão sobre fundo claro.
 * Vidro      = sobre imagem ou fundo tingido.
 * Fantasma   = ação terciária.
 * Pill em todos.
 */
export type BotaoTipo = "primaria" | "secundaria" | "vidro" | "fantasma" | "frescor";
export type BotaoTamanho = "G" | "M";

const tipos: Record<BotaoTipo, string> = {
  primaria: "bg-acao-primaria text-acao-sobre-primaria hover:bg-[#33383b]",
  secundaria: "bg-acao-secundaria text-acao-sobre-secundaria hover:bg-conforto-300",
  vidro:
    "bg-vidro-preenchimento-forte text-texto-forte border border-vidro-borda vidro-01 hover:bg-white/80",
  fantasma:
    "border border-borda-media text-texto-forte hover:border-texto-forte hover:bg-white/40",
  frescor:
    "bg-frescor-500 text-escuro-900 border border-frescor-100 hover:bg-[#b6d494] elevacao-02",
};

const tamanhos: Record<BotaoTamanho, string> = {
  G: "gap-[10px] px-7 py-[18px] t-botao-g",
  M: "gap-2 px-[22px] py-[13px] t-botao-m",
};

const iconeTamanho: Record<BotaoTamanho, number> = { G: 20, M: 18 };

type Comum = {
  tipo?: BotaoTipo;
  tamanho?: BotaoTamanho;
  /** Ícone à direita do rótulo. Por padrão, a seta do sistema. */
  icone?: ReactNode;
  /** Passe `false` para um botão só de texto. */
  mostrarIcone?: boolean;
  className?: string;
  children: ReactNode;
};

function classes({
  tipo = "primaria",
  tamanho = "G",
  className = "",
}: Pick<Comum, "tipo" | "tamanho" | "className">) {
  // Sem whitespace-nowrap: numa tela estreita, um rótulo longo quebra em duas
  // linhas dentro da pílula em vez de passar por baixo da seta. Onde cabe, fica
  // numa linha só, como no Figma.
  return [
    "relative inline-flex items-center justify-center rounded-pill text-center",
    "transition-colors duration-200",
    "motion-safe:hover:-translate-y-px motion-safe:transition-[background-color,border-color,transform]",
    tipos[tipo],
    tamanhos[tamanho],
    className,
  ].join(" ");
}

type BotaoLinkProps = Comum &
  Omit<ComponentProps<typeof Link>, "children" | "className">;

/** Botão que navega. É o caso mais comum no site. */
export function BotaoLink({
  tipo = "primaria",
  tamanho = "G",
  icone,
  mostrarIcone = true,
  className,
  children,
  ...props
}: BotaoLinkProps) {
  return (
    <Link className={classes({ tipo, tamanho, className })} {...props}>
      <span className="relative text-balance">{children}</span>
      {mostrarIcone && (
        <span className="relative shrink-0">
          {icone ?? <IconeSetaDireita tamanho={iconeTamanho[tamanho]} />}
        </span>
      )}
    </Link>
  );
}

type BotaoProps = Comum &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "children" | "className">;

/** Botão que executa uma ação (envio de formulário, filtro, acordeão). */
export function Botao({
  tipo = "primaria",
  tamanho = "G",
  icone,
  mostrarIcone = true,
  className,
  children,
  ...props
}: BotaoProps) {
  return (
    <button className={classes({ tipo, tamanho, className })} {...props}>
      <span className="relative text-balance">{children}</span>
      {mostrarIcone && (
        <span className="relative shrink-0">
          {icone ?? <IconeSetaDireita tamanho={iconeTamanho[tamanho]} />}
        </span>
      )}
    </button>
  );
}

type BotaoExternoProps = Comum &
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "children" | "className">;

/** Botão para destinos externos — WhatsApp, Instagram, telefone. */
export function BotaoExterno({
  tipo = "primaria",
  tamanho = "G",
  icone,
  mostrarIcone = true,
  className,
  children,
  ...props
}: BotaoExternoProps) {
  return (
    <a className={classes({ tipo, tamanho, className })} {...props}>
      <span className="relative text-balance">{children}</span>
      {mostrarIcone && (
        <span className="relative shrink-0">
          {icone ?? <IconeSetaDireita tamanho={iconeTamanho[tamanho]} />}
        </span>
      )}
    </a>
  );
}
