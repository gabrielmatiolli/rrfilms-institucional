import type { ReactNode } from "react";

type Fundo = "pagina" | "sutil" | "superficie" | "inverso";

const fundos: Record<Fundo, string> = {
  pagina: "bg-fundo-pagina",
  sutil: "bg-fundo-sutil",
  superficie: "bg-fundo-superficie",
  inverso: "bg-fundo-inverso text-texto-inverso",
};

/** Bloco de seção: fundo, respiro vertical e o contêiner de 1280 do Figma. */
export function Secao({
  fundo = "pagina",
  id,
  className = "",
  children,
}: {
  fundo?: Fundo;
  id?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className={`${fundos[fundo]} secao ${className}`}>
      <div className="conteudo">{children}</div>
    </section>
  );
}

/**
 * Cabeçalho de seção (Figma nó 27:78).
 *
 * Sobrancelha em caixa alta, título H2 e lead. Largura de leitura travada em
 * 720 — não estique além disso.
 */
export function CabecalhoDeSecao({
  sobrancelha,
  titulo,
  lead,
  alinhamento = "esquerda",
  largura = "720px",
  className = "",
}: {
  sobrancelha: string;
  titulo: ReactNode;
  lead?: ReactNode;
  alinhamento?: "esquerda" | "centro";
  /** Algumas seções do Figma abrem a caixa para 760, 860 ou 980. */
  largura?: string;
  className?: string;
}) {
  const centro = alinhamento === "centro";
  return (
    <div
      className={`flex flex-col gap-[14px] ${
        centro ? "mx-auto items-center text-center" : "items-start"
      } ${className}`}
      style={{ maxWidth: largura }}
    >
      <p className="t-sobrancelha text-texto-acento">{sobrancelha}</p>
      <h2 className="t-h2">{titulo}</h2>
      {lead && <p className="t-corpo-g text-texto-suave">{lead}</p>}
    </div>
  );
}
