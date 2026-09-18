import type { ComponentProps, ReactNode } from "react";

import { cn } from "@/lib/utils";

/** Campos de formulário do painel. Sem estado próprio — servem em Server e
 * Client Components; quem precisa de `value` controlado passa `value`/`onChange`. */

export const estiloDeEntrada =
  "w-full rounded-xl border border-borda-media/35 bg-fundo-sutil px-4 py-3 text-[15px] text-texto-forte transition-colors placeholder:text-texto-suave/60 focus:border-texto-forte focus:outline-none disabled:opacity-60";

function Envolucro({
  id,
  rotulo,
  dica,
  obrigatorio,
  children,
}: {
  id: string;
  rotulo: string;
  dica?: string;
  obrigatorio?: boolean;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-[13px] font-semibold text-texto-forte">
        {rotulo}
        {obrigatorio && <span className="ml-1 text-texto-acento">*</span>}
      </label>
      {children}
      {dica && (
        <p id={`${id}-dica`} className="text-[12px] text-texto-suave">
          {dica}
        </p>
      )}
    </div>
  );
}

export function Campo({
  id,
  rotulo,
  dica,
  className,
  required,
  ...resto
}: { id: string; rotulo: string; dica?: string } & ComponentProps<"input">) {
  return (
    <Envolucro id={id} rotulo={rotulo} dica={dica} obrigatorio={required}>
      <input
        id={id}
        name={id}
        required={required}
        aria-describedby={dica ? `${id}-dica` : undefined}
        {...resto}
        className={cn(estiloDeEntrada, className)}
      />
    </Envolucro>
  );
}

export function Area({
  id,
  rotulo,
  dica,
  className,
  required,
  rows = 4,
  ...resto
}: { id: string; rotulo: string; dica?: string } & ComponentProps<"textarea">) {
  return (
    <Envolucro id={id} rotulo={rotulo} dica={dica} obrigatorio={required}>
      <textarea
        id={id}
        name={id}
        rows={rows}
        required={required}
        aria-describedby={dica ? `${id}-dica` : undefined}
        {...resto}
        className={cn(estiloDeEntrada, "resize-y", className)}
      />
    </Envolucro>
  );
}

export function Selecao({
  id,
  rotulo,
  dica,
  opcoes,
  className,
  required,
  ...resto
}: {
  id: string;
  rotulo: string;
  dica?: string;
  opcoes: { valor: string; rotulo: string }[];
} & ComponentProps<"select">) {
  return (
    <Envolucro id={id} rotulo={rotulo} dica={dica} obrigatorio={required}>
      <select
        id={id}
        name={id}
        required={required}
        aria-describedby={dica ? `${id}-dica` : undefined}
        {...resto}
        className={cn(estiloDeEntrada, className)}
      >
        {opcoes.map((opcao) => (
          <option key={opcao.valor} value={opcao.valor}>
            {opcao.rotulo}
          </option>
        ))}
      </select>
    </Envolucro>
  );
}

/** Caixa de marcação com área de toque de 44px e explicação ao lado. */
export function Interruptor({
  id,
  rotulo,
  dica,
  ...resto
}: { id: string; rotulo: string; dica?: string } & ComponentProps<"input">) {
  return (
    <label
      htmlFor={id}
      className="-my-2 flex cursor-pointer items-start gap-3 py-2 text-[14px] text-texto-forte"
    >
      <input
        id={id}
        name={id}
        type="checkbox"
        {...resto}
        className="mt-0.5 size-5 shrink-0 accent-[var(--acao-secundaria)]"
      />
      <span className="flex flex-col gap-0.5">
        <span className="font-semibold">{rotulo}</span>
        {dica && <span className="text-[12.5px] font-normal text-texto-suave">{dica}</span>}
      </span>
    </label>
  );
}
