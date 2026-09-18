"use client";

import { useActionState, useState } from "react";
import Link from "next/link";

import { estiloDeEntrada } from "@/components/admin/Campos";
import { BotaoPainel, Cartao, Erro, TituloDeBloco } from "@/components/admin/Ui";
import {
  salvarCategorias,
  type EstadoDasCategorias,
} from "@/app/admin/(painel)/blog/categorias/acoes";
import { icones } from "@/components/ui/Icone";
import { cn } from "@/lib/utils";

export interface Categoria {
  id: string;
  rotulo: string;
  icone: string;
  ativo: boolean;
  /** Quantos posts apontam para ela — usado no aviso de exclusão. */
  posts: number;
}

const NOMES_DE_ICONE = Object.keys(icones);
const estadoInicial: EstadoDasCategorias = {};

export default function FormularioDeCategorias({ iniciais }: { iniciais: Categoria[] }) {
  const [estado, enviar, enviando] = useActionState(salvarCategorias, estadoInicial);
  const [categorias, setCategorias] = useState<Categoria[]>(iniciais);

  function alterar(indice: number, mudanca: Partial<Categoria>) {
    setCategorias((anterior) =>
      anterior.map((c, i) => (i === indice ? { ...c, ...mudanca } : c)),
    );
  }

  function remover(indice: number) {
    const categoria = categorias[indice];
    if (
      categoria.posts > 0 &&
      !confirm(
        `"${categoria.rotulo}" está em ${categoria.posts} post(s). Eles ficarão sem categoria. Continuar?`,
      )
    ) {
      return;
    }
    setCategorias((anterior) => anterior.filter((_, i) => i !== indice));
  }

  return (
    <form action={enviar} className="flex flex-col gap-5">
      <input
        type="hidden"
        name="categorias"
        value={JSON.stringify(
          categorias.map((c) => ({
            id: c.id,
            rotulo: c.rotulo,
            icone: c.icone,
            ativo: c.ativo,
          })),
        )}
      />

      <Cartao>
        <TituloDeBloco dica="A ordem daqui é a ordem dos filtros na página do blog.">
          Categorias
        </TituloDeBloco>

        <ul className="flex flex-col gap-3">
          {categorias.map((categoria, i) => {
            const Icone = icones[categoria.icone as keyof typeof icones] ?? icones.janela;
            return (
              <li
                key={categoria.id || `nova-${i}`}
                className="flex flex-col gap-3 rounded-xl border border-borda-sutil bg-fundo-sutil p-3 sm:flex-row sm:items-center"
              >
                <span className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-fundo-superficie text-texto-forte">
                  <Icone tamanho={20} />
                </span>

                <input
                  value={categoria.rotulo}
                  onChange={(e) => alterar(i, { rotulo: e.target.value })}
                  placeholder="Nome da categoria"
                  aria-label={`Nome da categoria ${i + 1}`}
                  className={cn(estiloDeEntrada, "flex-1 py-2.5 text-[14px]")}
                />

                <select
                  value={categoria.icone}
                  onChange={(e) => alterar(i, { icone: e.target.value })}
                  aria-label={`Ícone da categoria ${i + 1}`}
                  className={cn(estiloDeEntrada, "py-2.5 text-[14px] sm:w-[160px]")}
                >
                  {NOMES_DE_ICONE.map((nome) => (
                    <option key={nome} value={nome}>
                      {nome}
                    </option>
                  ))}
                </select>

                <div className="flex items-center justify-between gap-1 sm:justify-start">
                  <label className="flex min-h-[44px] cursor-pointer items-center gap-2 text-[13px] text-texto-suave">
                    <input
                      type="checkbox"
                      checked={categoria.ativo}
                      onChange={(e) => alterar(i, { ativo: e.target.checked })}
                      className="size-4 accent-[var(--acao-secundaria)]"
                    />
                    Ativa
                  </label>
                  <button
                    type="button"
                    onClick={() => remover(i)}
                    className="flex size-11 items-center justify-center text-[18px] text-estado-erro"
                  >
                    <span className="sr-only">Remover {categoria.rotulo || "categoria"}</span>
                    <span aria-hidden>×</span>
                  </button>
                </div>
              </li>
            );
          })}
        </ul>

        <button
          type="button"
          onClick={() =>
            setCategorias((anterior) => [
              ...anterior,
              { id: "", rotulo: "", icone: "janela", ativo: true, posts: 0 },
            ])
          }
          className="mt-3 min-h-[44px] rounded-pill border border-dashed border-borda-media/40 px-5 text-[13.5px] font-semibold text-texto-forte hover:border-texto-forte"
        >
          + Adicionar categoria
        </button>
      </Cartao>

      {estado.erro && <Erro>{estado.erro}</Erro>}
      {estado.ok && !estado.erro && (
        <p className="rounded-xl border border-frescor-500 bg-frescor-100 px-4 py-3 text-[13px] font-semibold text-escuro-900">
          Categorias salvas.
        </p>
      )}

      <div className="flex flex-wrap gap-3">
        <BotaoPainel type="submit" disabled={enviando}>
          {enviando ? "Salvando…" : "Salvar categorias"}
        </BotaoPainel>
        <Link
          href="/admin/blog"
          className="inline-flex min-h-[44px] items-center rounded-pill px-4 text-[14px] font-semibold text-texto-suave hover:text-texto-forte"
        >
          Voltar ao blog
        </Link>
      </div>
    </form>
  );
}
