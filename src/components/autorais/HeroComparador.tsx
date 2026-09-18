"use client";

import { useRef, useState } from "react";

import { IconeSetaDireita } from "@/components/ui/Icone";

/**
 * Hero · Comparador (Figma nó 53:544).
 *
 * A navegação NÃO vive aqui dentro: ela é uma navbar fixa no nível da página,
 * para o efeito de aplicação da película não passar por cima dela.
 *
 * Arrastar o rodo "aplica" a película sobre a cena: à esquerda da aresta fica a
 * lâmina aplicada (texto nítido, tingido de Conforto, 28 °C) e à direita, o vidro
 * nu (texto lavado, borrado, 41 °C). É o gesto do próprio produto.
 *
 * Pensado primeiro para o toque: o gesto horizontal em qualquer ponto do herói
 * passa o rodo — como limpar a tela do celular — e o gesto vertical continua
 * rolando a página. Teclado e leitor de tela usam um `input[type=range]` que fica
 * fora da tela e desenha o foco no punho.
 */

const TITULO = ["O calor para no vidro.", "A luz continua entrando."];
const LEAD =
  "O sol da tarde para de esquentar a sala e você continua enxergando o jardim. Sem escurecer o vidro.";

/** A cena inteira, nos dois estados. As duas camadas são idênticas em layout. */
function Cena({ aplicada }: { aplicada: boolean }) {
  return (
    <div
      className="absolute inset-0 overflow-hidden"
      style={{
        backgroundImage: aplicada
          ? "linear-gradient(90deg, rgb(243,244,230) 4.3%, rgb(252,206,180) 40.3%, rgb(250,169,126) 76.3%)"
          : "linear-gradient(140.7deg, rgb(255,253,238) 4.3%, rgb(255,242,208) 40.3%, rgb(255,221,173) 76.3%)",
      }}
    >
      {/* Caixilho: montantes e travessa no ângulo de 13° do isótipo */}
      <div aria-hidden className="absolute inset-0 overflow-hidden">
        {[35, 47.8, 60.3, 72.8].map((esquerda) => (
          <span
            key={esquerda}
            className="absolute top-[-150px] h-[1120px] w-[3px]"
            style={{
              left: `${esquerda}%`,
              transform: "rotate(13deg)",
              background: `rgba(36, 40, 43, ${aplicada ? 0.18 : 0.06})`,
            }}
          />
        ))}
        <span
          className="absolute left-[48%] top-[57%] h-[3px] w-[900px] origin-left"
          style={{
            transform: "rotate(13deg)",
            background: `rgba(36, 40, 43, ${aplicada ? 0.18 : 0.06})`,
          }}
        />
      </div>

      {/* Sol — atenuado depois da película */}
      <span
        aria-hidden
        className={`pointer-events-none absolute right-[-8%] top-[-160px] block size-[620px] rounded-full ${
          aplicada ? "blur-[35px]" : "blur-[9px]"
        }`}
        style={{
          background: aplicada
            ? "radial-gradient(circle, rgba(255,255,245,0.3) 0%, rgba(255,237,189,0.1) 50%, rgba(255,219,158,0) 100%)"
            : "radial-gradient(circle, #FFFFFA 0%, rgba(255,246,204,0.85) 42%, rgba(255,219,158,0) 100%)",
        }}
      />

      {/* Ofuscamento e lavagem de luz: só no vidro nu */}
      {!aplicada && (
        <>
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 blur-[15px]"
            style={{
              backgroundImage:
                "repeating-linear-gradient(103deg, rgba(255,255,240,0.62) 0 88px, transparent 88px 250px)",
            }}
          />
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[rgba(255,241,212,0.42)]"
          />
        </>
      )}

      {/* Conteúdo */}
      <div className="conteudo relative flex h-full items-center pb-28 pt-[140px] md:pb-0 md:pt-0">
        <div
          className={`flex w-full max-w-[820px] flex-col items-start gap-6 ${
            aplicada ? "" : "opacity-40"
          }`}
        >
          <p
            className={`t-sobrancelha ${
              aplicada ? "text-texto-acento" : "text-texto-forte"
            }`}
          >
            {aplicada
              ? "Película aplicada · 28 °C no vidro"
              : "Sem película · 41 °C no vidro"}
          </p>
          <h1 className="t-display-l" style={aplicada ? undefined : { filter: "blur(1.5px)" }}>
            {TITULO.map((linha) => (
              <span key={linha} className="block">
                {linha}
              </span>
            ))}
          </h1>
          <p
            className="t-corpo-g max-w-[560px] text-texto-corpo"
            style={aplicada ? undefined : { filter: "blur(0.7px)" }}
          >
            {LEAD}
          </p>
        </div>
      </div>

      {/* Tinta da película e material vidro */}
      {aplicada && (
        <>
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[rgba(250,169,126,0.14)]"
          />
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-white/6 shadow-[inset_0_1px_2px_0_rgba(255,255,255,0.55)]"
          />
        </>
      )}
    </div>
  );
}

/** Deslocamento mínimo, em px, para o gesto contar como arrasto horizontal. */
const LIMIAR = 6;

export function HeroComparador() {
  // O Figma abre a Home em Aplicação=0%: o texto chega ilegível e o visitante
  // aplica a película para ler.
  const [aplicacao, setAplicacao] = useState(0);
  const [arrastando, setArrastando] = useState(false);
  const secao = useRef<HTMLElement>(null);
  const gesto = useRef<{ id: number; x: number; y: number; ativo: boolean } | null>(
    null,
  );

  // O termômetro anda de 41 °C (vidro nu) a 28 °C (película aplicada).
  const temperatura = Math.round(41 - (aplicacao / 100) * 13);

  const posicionar = (clientX: number) => {
    const caixa = secao.current?.getBoundingClientRect();
    if (!caixa) return;
    const valor = ((clientX - caixa.left) / caixa.width) * 100;
    setAplicacao(Math.round(Math.min(100, Math.max(0, valor))));
  };

  const aoPressionar = (e: React.PointerEvent<HTMLElement>) => {
    if (e.pointerType === "mouse") {
      if (e.button !== 0) return;
      e.preventDefault(); // sem seleção de texto ao arrastar com o mouse
    }
    gesto.current = { id: e.pointerId, x: e.clientX, y: e.clientY, ativo: false };
  };

  const aoMover = (e: React.PointerEvent<HTMLElement>) => {
    const g = gesto.current;
    if (!g || g.id !== e.pointerId) return;
    if (!g.ativo) {
      const dx = Math.abs(e.clientX - g.x);
      const dy = Math.abs(e.clientY - g.y);
      // Só vira arrasto quando o gesto é claramente horizontal; o vertical é
      // do navegador, que rola a página.
      if (dx < LIMIAR || dx < dy) return;
      g.ativo = true;
      setArrastando(true);
      try {
        e.currentTarget.setPointerCapture(e.pointerId);
      } catch {
        // O dedo já saiu da tela entre dois eventos: segue sem captura.
      }
    }
    posicionar(e.clientX);
  };

  const aoSoltar = (e: React.PointerEvent<HTMLElement>) => {
    if (gesto.current?.id !== e.pointerId) return;
    gesto.current = null;
    setArrastando(false);
  };

  return (
    <section
      ref={secao}
      aria-label="Comparador: o mesmo vidro com e sem película"
      onPointerDown={aoPressionar}
      onPointerMove={aoMover}
      onPointerUp={aoSoltar}
      onPointerCancel={aoSoltar}
      className={`relative isolate h-svh max-h-[820px] min-h-[600px] touch-pan-y overflow-hidden ${
        arrastando ? "cursor-grabbing select-none" : "cursor-grab"
      }`}
    >
      <Cena aplicada={false} />

      {/* A lâmina aplicada vive por cima, recortada na posição do rodo */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{ clipPath: `inset(0 ${100 - aplicacao}% 0 0)` }}
      >
        <Cena aplicada />
      </div>

      {/* A aresta do rodo */}
      <span
        aria-hidden
        className="absolute inset-y-0 z-10 w-px bg-white/70 shadow-[0_0_12px_rgba(255,255,255,0.6)]"
        style={{ left: `${aplicacao}%` }}
      />

      {/* Punho do rodo. O range fica fora da tela e só serve a teclado e leitor
          de tela; o foco dele aparece desenhado no punho. */}
      <div className="absolute inset-x-0 bottom-8 z-20 md:bottom-[124px]">
        <label className="sr-only" htmlFor="rodo">
          Aplicar a película no vidro
        </label>
        <input
          id="rodo"
          type="range"
          min={0}
          max={100}
          step={5}
          value={aplicacao}
          onChange={(e) => setAplicacao(Number(e.target.value))}
          aria-valuetext={`${aplicacao}% aplicada, ${temperatura} graus no vidro`}
          className="peer sr-only"
        />
        <span
          aria-hidden
          className={`mx-6 flex w-fit items-center justify-center gap-2 rounded-pill bg-[rgba(36,40,43,0.94)] py-[14px] pl-[18px] pr-5 text-texto-inverso shadow-[0_8px_24px_-4px_rgba(36,40,43,0.34)] peer-focus-visible:outline-2 peer-focus-visible:outline-offset-4 peer-focus-visible:outline-texto-acento ${
            arrastando ? "" : "transition-[margin] duration-300 ease-out"
          }`}
          style={{
            marginInlineStart: `clamp(24px, ${aplicacao}%, calc(100% - 232px))`,
          }}
        >
          <IconeSetaDireita tamanho={18} />
          <span className="t-botao-m whitespace-nowrap">Arraste para aplicar</span>
        </span>
      </div>

      {/* Temperatura no celular e no tablet: uma leitura compacta, que não
          disputa a largura com o título. */}
      <p
        aria-hidden
        className="absolute right-5 top-[104px] z-10 flex items-center gap-2 rounded-pill border border-white/85 bg-white/60 px-3 py-[6px] vidro-01 md:right-10 md:top-[124px] xl:hidden"
      >
        <span
          className="block size-2.5 rounded-pill"
          style={{
            background: `color-mix(in oklab, #ef5a2e ${Math.round(
              ((temperatura - 28) / 13) * 100,
            )}%, #fde084)`,
          }}
        />
        <span className="t-botao-m text-texto-forte">{temperatura}°</span>
        <span className="t-micro text-texto-suave">no vidro</span>
      </p>

      {/* Termômetro */}
      <div aria-hidden className="absolute right-10 top-[250px] z-10 hidden xl:block">
        <div className="relative h-[300px] w-14 overflow-hidden rounded-pill border border-white/85 bg-white/55 vidro-01">
          <span
            className="absolute inset-x-0 bottom-0 block transition-[height] duration-300"
            style={{
              height: `${45 + (temperatura - 28) * 3.5}%`,
              background: "linear-gradient(to bottom, #ef5a2e, #fde084)",
            }}
          />
        </div>
        <p className="mt-2 text-center t-botao-m text-texto-forte">{temperatura}°</p>
        <p className="text-center t-micro text-texto-suave">no vidro</p>
      </div>
    </section>
  );
}
