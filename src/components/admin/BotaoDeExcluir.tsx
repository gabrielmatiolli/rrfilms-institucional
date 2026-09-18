"use client";

import { cn } from "@/lib/utils";

interface Props {
  /** Server Action que recebe o FormData com o campo `id`. */
  acao: (formulario: FormData) => Promise<void>;
  id: string;
  confirmacao: string;
  rotulo?: string;
  className?: string;
}

/**
 * Exclusão com confirmação. O `confirm()` do navegador é bloqueante e
 * suficiente aqui: é uma ação rara, de um painel interno, e evita montar um
 * diálogo próprio só para isso.
 */
export default function BotaoDeExcluir({
  acao,
  id,
  confirmacao,
  rotulo = "Excluir",
  className,
}: Props) {
  return (
    <form
      action={acao}
      onSubmit={(evento) => {
        if (!confirm(confirmacao)) evento.preventDefault();
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        className={cn(
          "inline-flex min-h-[44px] w-full items-center justify-center rounded-pill px-4 text-[13px] font-semibold text-estado-erro hover:underline",
          className,
        )}
      >
        {rotulo}
      </button>
    </form>
  );
}
