"use client";

import { estiloDeEntrada } from "@/components/admin/Campos";
import type { DadoDeBloco } from "@/lib/admin/blocos";
import { cn } from "@/lib/utils";

interface Props {
  dados: DadoDeBloco[];
  onChange: (dados: DadoDeBloco[]) => void;
  rotulo?: string;
  dica?: string;
  maximo?: number;
}

/**
 * Lista de pares número + legenda ("79%" · "menos calor"). Serve tanto para a
 * faixa de dados do card de serviço quanto para o bloco de dados do editor.
 */
export default function EditorDeDados({
  dados,
  onChange,
  rotulo = "Números",
  dica,
  maximo = 4,
}: Props) {
  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex flex-col gap-0.5">
        <p className="text-[13px] font-semibold text-texto-forte">{rotulo}</p>
        {dica && <p className="text-[12px] text-texto-suave">{dica}</p>}
      </div>

      {dados.map((dado, i) => (
        <div key={i} className="flex items-center gap-2">
          <input
            value={dado.valor}
            onChange={(e) =>
              onChange(dados.map((d, idx) => (idx === i ? { ...d, valor: e.target.value } : d)))
            }
            placeholder="79%"
            aria-label={`Valor ${i + 1}`}
            className={cn(estiloDeEntrada, "w-[100px] shrink-0 py-2.5 text-[14px]")}
          />
          <input
            value={dado.rotulo}
            onChange={(e) =>
              onChange(dados.map((d, idx) => (idx === i ? { ...d, rotulo: e.target.value } : d)))
            }
            placeholder="menos calor"
            aria-label={`Legenda ${i + 1}`}
            className={cn(estiloDeEntrada, "py-2.5 text-[14px]")}
          />
          <button
            type="button"
            onClick={() => onChange(dados.filter((_, idx) => idx !== i))}
            className="flex size-11 shrink-0 items-center justify-center text-[18px] text-estado-erro"
          >
            <span className="sr-only">Remover número {i + 1}</span>
            <span aria-hidden>×</span>
          </button>
        </div>
      ))}

      {dados.length < maximo && (
        <button
          type="button"
          onClick={() => onChange([...dados, { valor: "", rotulo: "" }])}
          className="min-h-[44px] self-start rounded-pill border border-borda-media/40 px-4 text-[13px] font-semibold text-texto-forte hover:border-texto-forte"
        >
          + Adicionar número
        </button>
      )}
    </div>
  );
}
