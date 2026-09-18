"use client";

import { useActionState, useState } from "react";

import { estiloDeEntrada } from "@/components/admin/Campos";
import { Aviso, BotaoPainel, Cartao, Erro, TituloDeBloco } from "@/components/admin/Ui";
import {
  salvarDepoimentos,
  type EstadoDoConteudo,
} from "@/app/admin/(painel)/conteudo/acoes";
import { cn } from "@/lib/utils";

export interface Depoimento {
  id: string;
  citacao: string;
  nome: string;
  contexto: string;
  ativo: boolean;
  autorizado: boolean;
}

const estadoInicial: EstadoDoConteudo = {};

export default function FormularioDeDepoimentos({ iniciais }: { iniciais: Depoimento[] }) {
  const [estado, enviar, enviando] = useActionState(salvarDepoimentos, estadoInicial);
  const [depoimentos, setDepoimentos] = useState<Depoimento[]>(iniciais);

  const semAutorizacao = depoimentos.filter((d) => d.ativo && !d.autorizado).length;

  function alterar(indice: number, mudanca: Partial<Depoimento>) {
    setDepoimentos((anterior) =>
      anterior.map((d, i) => (i === indice ? { ...d, ...mudanca } : d)),
    );
  }

  return (
    <form action={enviar} className="flex flex-col gap-5">
      <input type="hidden" name="depoimentos" value={JSON.stringify(depoimentos)} />

      <Cartao>
        <TituloDeBloco dica="Aparecem na Home e nas páginas de segmento.">
          Depoimentos
        </TituloDeBloco>

        {semAutorizacao > 0 && (
          <div className="mb-4">
            <Aviso>
              {semAutorizacao === 1
                ? "Um depoimento está marcado como ativo, mas sem autorização por escrito — e por isso não vai ao ar."
                : `${semAutorizacao} depoimentos estão ativos sem autorização por escrito — e por isso não vão ao ar.`}
            </Aviso>
          </div>
        )}

        <ul className="flex flex-col gap-3">
          {depoimentos.map((depoimento, i) => (
            <li
              key={depoimento.id || `novo-${i}`}
              className="flex flex-col gap-3 rounded-xl border border-borda-sutil bg-fundo-sutil p-3.5"
            >
              <div className="flex items-start gap-2">
                <textarea
                  value={depoimento.citacao}
                  onChange={(e) => alterar(i, { citacao: e.target.value })}
                  rows={3}
                  placeholder="“A sala não dava pra usar depois das 15h…”"
                  aria-label={`Fala do depoimento ${i + 1}`}
                  className={cn(estiloDeEntrada, "resize-y py-2.5 text-[14px]")}
                />
                <button
                  type="button"
                  onClick={() =>
                    setDepoimentos((anterior) => anterior.filter((_, idx) => idx !== i))
                  }
                  className="flex size-11 shrink-0 items-center justify-center text-[18px] text-estado-erro"
                >
                  <span className="sr-only">Remover depoimento {i + 1}</span>
                  <span aria-hidden>×</span>
                </button>
              </div>

              <div className="grid gap-2 sm:grid-cols-2">
                <input
                  value={depoimento.nome}
                  onChange={(e) => alterar(i, { nome: e.target.value })}
                  placeholder="Nome de quem falou"
                  aria-label={`Nome do depoimento ${i + 1}`}
                  className={cn(estiloDeEntrada, "py-2.5 text-[14px]")}
                />
                <input
                  value={depoimento.contexto}
                  onChange={(e) => alterar(i, { contexto: e.target.value })}
                  placeholder="Casa em condomínio · Itatiba"
                  aria-label={`Contexto do depoimento ${i + 1}`}
                  className={cn(estiloDeEntrada, "py-2.5 text-[14px]")}
                />
              </div>

              <div className="flex flex-wrap gap-x-5 gap-y-1">
                <label className="flex min-h-[44px] cursor-pointer items-center gap-2 text-[13px] text-texto-suave">
                  <input
                    type="checkbox"
                    checked={depoimento.ativo}
                    onChange={(e) => alterar(i, { ativo: e.target.checked })}
                    className="size-4 accent-[var(--acao-secundaria)]"
                  />
                  Ativo
                </label>
                <label className="flex min-h-[44px] cursor-pointer items-center gap-2 text-[13px] text-texto-suave">
                  <input
                    type="checkbox"
                    checked={depoimento.autorizado}
                    onChange={(e) => alterar(i, { autorizado: e.target.checked })}
                    className="size-4 accent-[var(--acao-secundaria)]"
                  />
                  Tenho autorização por escrito
                </label>
              </div>
            </li>
          ))}
        </ul>

        <button
          type="button"
          onClick={() =>
            setDepoimentos((anterior) => [
              ...anterior,
              { id: "", citacao: "", nome: "", contexto: "", ativo: true, autorizado: false },
            ])
          }
          className="mt-3 min-h-[44px] rounded-pill border border-dashed border-borda-media/40 px-5 text-[13.5px] font-semibold text-texto-forte hover:border-texto-forte"
        >
          + Adicionar depoimento
        </button>
      </Cartao>

      {estado.erro && <Erro>{estado.erro}</Erro>}
      {estado.ok && !estado.erro && (
        <p className="rounded-xl border border-frescor-500 bg-frescor-100 px-4 py-3 text-[13px] font-semibold text-escuro-900">
          Depoimentos salvos.
        </p>
      )}

      <BotaoPainel type="submit" disabled={enviando} className="self-start">
        {enviando ? "Salvando…" : "Salvar depoimentos"}
      </BotaoPainel>
    </form>
  );
}
