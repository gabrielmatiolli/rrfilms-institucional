"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";

/**
 * Corte da lâmina (Figma nó 56:403).
 *
 * Substitui o "como funciona em 4 passos". As quatro camadas partem empilhadas
 * — a mesma silhueta do isótipo — e se separam conforme o scroll, cada uma se
 * nomeando. Ensina o produto em vez de listar etapas.
 *
 * No Figma: Smart Animate de 900ms, EASE_OUT, disparado no hover.
 * Aqui: o progresso vem do scroll da própria seção (scrub), com translate por
 * camada. Quem pediu menos movimento recebe o estado separado direto.
 */

const CAMADAS = [
  {
    numero: "01",
    titulo: "A camada de fora",
    texto: "Aguenta o pano da faxina toda semana sem riscar nem manchar.",
    tinta: "rgba(255,255,255,0.42)",
    borda: "rgba(255,255,255,0.85)",
  },
  {
    numero: "02",
    titulo: "A camada que segura o calor",
    texto:
      "Deixa a luz entrar e manda o calor de volta para fora. É ela que faz o trabalho.",
    tinta: "rgba(250,169,126,0.62)",
    borda: "rgba(255,255,255,0.9)",
  },
  {
    numero: "03",
    titulo: "A cola",
    texto:
      "Gruda sem bolha e sai sem estragar o vidro. Se o vidro quebrar, ela segura os cacos no lugar.",
    tinta: "rgba(253,224,132,0.34)",
    borda: "rgba(255,255,255,0.8)",
  },
  {
    numero: "04",
    titulo: "Seu vidro",
    texto:
      "Cada casa tem um tipo de vidro. Por isso a gente vai até você antes de indicar qualquer coisa.",
    tinta: "rgba(196,221,166,0.26)",
    borda: "rgba(255,255,255,0.6)",
  },
];

const CONSULTA = "(prefers-reduced-motion: reduce)";

/** Lê a preferência de movimento como fonte externa. O nome começa com "use"
  * porque é um hook de verdade — é a convenção que o React exige. */
function usePrefereMenosMovimento() {
  return useSyncExternalStore(
    (aoMudar) => {
      const consulta = window.matchMedia(CONSULTA);
      consulta.addEventListener("change", aoMudar);
      return () => consulta.removeEventListener("change", aoMudar);
    },
    () => window.matchMedia(CONSULTA).matches,
    () => false,
  );
}

export function CorteDaLamina() {
  const trilho = useRef<HTMLDivElement>(null);
  const [scrub, setScrub] = useState(0);
  const menosMovimento = usePrefereMenosMovimento();

  // Com menos movimento, as camadas já chegam separadas e nomeadas.
  const progresso = menosMovimento ? 1 : scrub;

  useEffect(() => {
    if (menosMovimento) return;

    let pendente = 0;
    const medir = () => {
      pendente = 0;
      const el = trilho.current;
      if (!el) return;
      const caixa = el.getBoundingClientRect();
      // O scrub roda enquanto a seção atravessa a viewport.
      const total = caixa.height - window.innerHeight;
      const andado = -caixa.top;
      setScrub(total > 0 ? Math.min(1, Math.max(0, andado / total)) : 1);
    };

    const aoRolar = () => {
      if (pendente) return;
      pendente = requestAnimationFrame(medir);
    };

    aoRolar();
    window.addEventListener("scroll", aoRolar, { passive: true });
    window.addEventListener("resize", aoRolar);
    return () => {
      window.removeEventListener("scroll", aoRolar);
      window.removeEventListener("resize", aoRolar);
      if (pendente) cancelAnimationFrame(pendente);
    };
  }, [menosMovimento]);

  const centro = (CAMADAS.length - 1) / 2;

  return (
    // No celular o scrub é mais curto: a mesma separação com menos rolagem de polegar.
    <div ref={trilho} className="relative h-[200svh] md:h-[280vh]">
      <div
        className="sticky top-0 flex h-svh items-center overflow-hidden pt-[88px] md:pt-0"
        style={{
          backgroundImage:
            "linear-gradient(137deg, rgb(36,40,43) 0%, rgb(21,24,26) 73.5%)",
        }}
      >
        {/* Brilho quente ao fundo */}
        <span
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-1/2 block size-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[60px] md:size-[900px] md:blur-[80px]"
          style={{
            background:
              "radial-gradient(circle, rgba(250,169,126,0.22) 0%, rgba(250,169,126,0.06) 45%, transparent 70%)",
          }}
        />

        {/* No celular a dica fica embaixo, à esquerda: em cima a navbar cobre, e à
            direita mora o botão do WhatsApp. */}
        <p className="absolute bottom-7 left-5 t-tag text-texto-inverso opacity-50 md:bottom-auto md:left-auto md:right-14 md:top-8">
          {progresso > 0.75
            ? "quatro camadas · mais finas que um fio de cabelo"
            : "role para separar as camadas"}
        </p>

        <div className="conteudo relative flex w-full flex-col gap-3 md:grid md:grid-cols-4 md:gap-6">
          {CAMADAS.map((camada, i) => {
            // Empilhadas, as lâminas ocupam o mesmo lugar, 26px à frente umas das
            // outras; separadas, cada uma vai para a sua linha (celular) ou coluna.
            const recuo = (1 - progresso) * (centro - i);

            return (
              <div
                key={camada.numero}
                className="corte-camada grid grid-cols-[64px_1fr] items-center gap-x-5 md:flex md:flex-col md:items-stretch md:gap-6"
                style={
                  {
                    "--recuo": recuo,
                    transition: "translate 120ms linear",
                  } as React.CSSProperties
                }
              >
                <div
                  className="col-start-2 row-start-1 flex flex-col gap-[3px] self-end transition-opacity duration-500 md:gap-[5px] md:self-auto"
                  style={{ opacity: progresso > 0.35 ? 1 : 0 }}
                >
                  <p className="t-tag text-conforto-500">{camada.numero}</p>
                  <p className="t-h5 text-texto-inverso">
                    {camada.titulo}
                  </p>
                </div>

                <div
                  className="relative col-start-1 row-span-2 row-start-1 aspect-[230/400] w-full rounded-[12px] border-[1.5px] md:rounded-[18px]"
                  style={{
                    background: camada.tinta,
                    borderColor: camada.borda,
                    transform: `rotate(13deg) translate(calc(${recuo} * -1 * var(--leque, 26px)), ${recuo * -6}px)`,
                    boxShadow:
                      "inset 0 1px 5px 0 rgba(255,255,255,0.8), 0 24px 56px -10px rgba(36,40,43,0.4)",
                    transition: "transform 120ms linear",
                  }}
                />

                <p
                  className="col-start-2 row-start-2 self-start t-micro text-texto-inverso transition-opacity duration-500 [@media(max-height:680px)]:hidden md:[@media(max-height:680px)]:block"
                  style={{ opacity: progresso > 0.55 ? 0.75 : 0 }}
                >
                  {camada.texto}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
