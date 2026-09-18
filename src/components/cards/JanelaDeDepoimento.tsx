"use client";

import { useState } from "react";

import { Estrelas, type Fala } from "@/components/cards/Cartoes";

/**
 * Janela de depoimento (Figma nó 58:532).
 *
 * Depoimento dentro de um caixilho de verdade, com montante e travessa. Chega
 * embaçado e, ao limpar o vidro, o texto aparece — o gesto é o mesmo do produto.
 * No Figma: MOUSE_ENTER/LEAVE, Smart Animate de 350ms, EASE_OUT.
 *
 * Partindo do celular: no toque não existe hover, então um toque limpa (e outro
 * volta a embaçar). Com mouse, o hover continua limpando; no teclado, o foco. A
 * instrução muda com o tipo de ponteiro — "toque" ou "passe o mouse".
 */
export function JanelaDeDepoimento({ fala }: { fala: Fala }) {
  const [limpa, setLimpa] = useState(false);

  return (
    <figure
      tabIndex={0}
      data-limpa={limpa}
      onClick={() => setLimpa((v) => !v)}
      className="group relative flex min-h-[440px] cursor-pointer flex-col overflow-hidden rounded-lg border-[3px] border-texto-forte md:h-[470px]"
      style={{
        backgroundImage:
          "linear-gradient(117deg, rgb(252,206,180) 0%, rgb(253,240,214) 73.5%)",
      }}
    >
      {/* Brilhos diagonais do vidro */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "repeating-linear-gradient(110deg, rgba(255,255,255,0.35) 0 30px, transparent 30px 140px)",
        }}
      />

      {/* Caixilho: montante e travessa */}
      <span aria-hidden className="absolute inset-y-0 left-1/2 w-[3px] bg-texto-forte" />
      <span aria-hidden className="absolute inset-x-0 top-[38%] h-[3px] bg-texto-forte" />

      {/* Citação */}
      <div className="relative flex flex-1 flex-col justify-between gap-6 p-7 sm:p-8">
        <div className="flex items-center gap-3">
          <span className="flex size-11 items-center justify-center rounded-pill bg-conforto-300 t-h5 text-escuro-900">
            {fala.inicial ?? fala.nome.charAt(0)}
          </span>
          <div className="flex flex-col gap-1">
            <Estrelas tamanho={15} />
            <span className="t-micro text-texto-suave">Avaliação no Google</span>
          </div>
        </div>

        <blockquote className="t-corpo-g text-texto-forte">{fala.citacao}</blockquote>

        <figcaption className="flex flex-col gap-[2px]">
          <span className="t-corpo-destaque text-texto-forte">{fala.nome}</span>
          <span className="t-micro text-texto-corpo">{fala.contexto}</span>
        </figcaption>
      </div>

      {/* Vidro fosco — sai no toque, no hover e no foco */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-white/45 backdrop-blur-[3.5px] transition-[opacity,backdrop-filter] duration-[350ms] ease-out group-hover:bg-white/[0.02] group-hover:opacity-0 group-hover:backdrop-blur-none group-focus-visible:bg-white/[0.02] group-focus-visible:opacity-0 group-focus-visible:backdrop-blur-none group-data-[limpa=true]:bg-white/[0.02] group-data-[limpa=true]:opacity-0 group-data-[limpa=true]:backdrop-blur-none"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute bottom-6 left-7 rounded-pill bg-white/70 px-3 py-1 t-tag text-texto-forte transition-opacity duration-300 group-hover:opacity-0 group-focus-visible:opacity-0 group-data-[limpa=true]:opacity-0"
      >
        <span className="pointer-coarse:hidden">passe o mouse para limpar</span>
        <span className="hidden pointer-coarse:inline">toque para limpar</span>
      </span>
    </figure>
  );
}
