"use client";

import { useId, useState } from "react";

import { IconeMais } from "@/components/ui/Icone";

export type Duvida = { pergunta: string; resposta: string };

/**
 * Item de FAQ (Figma nó 30:139).
 *
 * Acordeão de dúvidas. Fechado é quase plano; aberto ganha vidro Painel e o "+"
 * gira 45°. Só um aberto por vez — o estado vive na lista, não no item.
 */
function ItemDeFaq({
  duvida,
  aberto,
  aoAlternar,
}: {
  duvida: Duvida;
  aberto: boolean;
  aoAlternar: () => void;
}) {
  const id = useId();

  return (
    <div
      className={`rounded-lg border transition-colors duration-300 ${
        aberto
          ? "border-vidro-borda bg-vidro-preenchimento-forte vidro-02"
          : "border-borda-sutil bg-vidro-preenchimento-sutil"
      }`}
    >
      <h3>
        <button
          type="button"
          onClick={aoAlternar}
          aria-expanded={aberto}
          aria-controls={id}
          className="flex w-full items-center gap-5 px-5 py-6 text-left sm:px-7"
        >
          <span className="t-h5 flex-1 text-texto-forte">{duvida.pergunta}</span>
          <span
            aria-hidden
            className={`shrink-0 text-texto-forte transition-transform duration-300 ${
              aberto ? "rotate-45" : ""
            }`}
          >
            <IconeMais tamanho={22} />
          </span>
        </button>
      </h3>
      <div
        id={id}
        hidden={!aberto}
        className="px-5 pb-6 t-corpo text-texto-suave sm:px-7"
      >
        {duvida.resposta}
      </div>
    </div>
  );
}

/** Lista de dúvidas. Abre a primeira por padrão, como no Figma. */
export function ListaDeFaq({ duvidas }: { duvidas: readonly Duvida[] }) {
  const [abertoEm, setAbertoEm] = useState(0);

  return (
    <div className="flex flex-col gap-3">
      {duvidas.map((duvida, i) => (
        <ItemDeFaq
          key={duvida.pergunta}
          duvida={duvida}
          aberto={abertoEm === i}
          aoAlternar={() => setAbertoEm(abertoEm === i ? -1 : i)}
        />
      ))}
    </div>
  );
}
