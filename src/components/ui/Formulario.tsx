import type { ReactNode } from "react";

import { IconeCheck, IconeChevronBaixo } from "@/components/ui/Icone";

/**
 * Formulário (Figma seção "02 · Formulário").
 *
 * Campo, Seleção e Área de texto usam o vidro Lâmina com contorno fino — o foco
 * engrossa o traço para grafite; o erro troca a cor do traço e da ajuda.
 */

const caixa =
  "w-full rounded-2xl border border-vidro-borda bg-vidro-preenchimento-forte px-5 text-[18px] leading-[1.65] text-texto-forte placeholder:text-texto-suave vidro-01 outline-none transition-[border-color,border-width] focus:border-[1.5px] focus:border-borda-foco";

function Envolucro({
  rotulo,
  htmlFor,
  ajuda,
  erro,
  children,
}: {
  rotulo: string;
  htmlFor: string;
  ajuda?: string;
  erro?: string;
  children: ReactNode;
}) {
  return (
    <div className="flex w-full flex-col items-start gap-2">
      <label htmlFor={htmlFor} className="t-campo text-texto-forte">
        {rotulo}
      </label>
      {children}
      {(erro ?? ajuda) && (
        <p className={`t-micro ${erro ? "text-estado-erro" : "text-texto-suave"}`}>
          {erro ?? ajuda}
        </p>
      )}
    </div>
  );
}

export function Campo({
  id,
  rotulo,
  ajuda,
  erro,
  ...props
}: {
  id: string;
  rotulo: string;
  ajuda?: string;
  erro?: string;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <Envolucro rotulo={rotulo} htmlFor={id} ajuda={ajuda} erro={erro}>
      <input
        id={id}
        name={props.name ?? id}
        aria-invalid={erro ? true : undefined}
        className={`${caixa} h-[60px] ${erro ? "border-[1.5px] border-estado-erro" : ""}`}
        {...props}
      />
    </Envolucro>
  );
}

export function AreaDeTexto({
  id,
  rotulo,
  ajuda,
  erro,
  ...props
}: {
  id: string;
  rotulo: string;
  ajuda?: string;
  erro?: string;
} & React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <Envolucro rotulo={rotulo} htmlFor={id} ajuda={ajuda} erro={erro}>
      <textarea
        id={id}
        name={props.name ?? id}
        rows={4}
        aria-invalid={erro ? true : undefined}
        className={`${caixa} resize-y py-4 ${erro ? "border-[1.5px] border-estado-erro" : ""}`}
        {...props}
      />
    </Envolucro>
  );
}

export function Selecao({
  id,
  rotulo,
  ajuda,
  erro,
  opcoes,
  ...props
}: {
  id: string;
  rotulo: string;
  ajuda?: string;
  erro?: string;
  opcoes: readonly string[];
} & React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <Envolucro rotulo={rotulo} htmlFor={id} ajuda={ajuda} erro={erro}>
      <div className="relative w-full">
        <select
          id={id}
          name={props.name ?? id}
          aria-invalid={erro ? true : undefined}
          defaultValue=""
          className={`${caixa} h-[60px] cursor-pointer appearance-none pr-12 ${
            erro ? "border-[1.5px] border-estado-erro" : ""
          }`}
          {...props}
        >
          <option value="" disabled>
            Selecione
          </option>
          {opcoes.map((opcao) => (
            <option key={opcao} value={opcao}>
              {opcao}
            </option>
          ))}
        </select>
        <span
          aria-hidden
          className="pointer-events-none absolute right-[18px] top-1/2 -translate-y-1/2 text-texto-forte"
        >
          <IconeChevronBaixo tamanho={20} />
        </span>
      </div>
    </Envolucro>
  );
}

/**
 * Checkbox (Figma nó 24:106).
 *
 * Consentimento e filtros múltiplos. Caixa 22px com raio 7 — quadrada
 * arredondada, para não confundir com radio. A área clicável cobre caixa +
 * rótulo com no mínimo 44px de altura.
 */
export function Checkbox({
  id,
  rotulo,
  ...props
}: { id: string; rotulo: ReactNode } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label
      htmlFor={id}
      className="group flex min-h-11 cursor-pointer items-center gap-3 t-corpo-p text-texto-corpo"
    >
      <input
        id={id}
        name={props.name ?? id}
        type="checkbox"
        className="peer sr-only"
        {...props}
      />
      <span className="flex size-[22px] shrink-0 items-center justify-center rounded-[7px] border-[1.5px] border-borda-media bg-vidro-preenchimento-forte text-transparent transition-colors peer-checked:border-acao-primaria peer-checked:bg-acao-primaria peer-checked:text-texto-inverso peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-texto-acento">
        <IconeCheck tamanho={14} />
      </span>
      <span>{rotulo}</span>
    </label>
  );
}
