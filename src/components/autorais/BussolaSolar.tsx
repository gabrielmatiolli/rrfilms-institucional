"use client";

import { useState } from "react";

import { BotaoLink } from "@/components/ui/Botao";
import { IconeSol } from "@/components/ui/Icone";

/**
 * Bússola solar (Figma nó 58:505).
 *
 * Substitui a grade de seis serviços iguais. O visitante não sabe o nome da
 * película que precisa — ele sabe para onde a janela dele está virada. Girar a
 * bússola move o setor de incidência, reposiciona o sol, recalcula a carga
 * térmica e troca a indicação. É a pergunta que o técnico faz na visita, virada
 * em navegação.
 *
 * No Figma: ON_CLICK nos pontos cardeais, Smart Animate 450ms GENTLE — o setor
 * gira e os números fazem crossfade.
 */

type Orientacao = "oeste" | "norte" | "leste" | "sul";

/** Ângulo do setor no SVG: 0° aponta para a direita (leste). */
const ANGULO: Record<Orientacao, number> = {
  norte: -90,
  leste: 0,
  sul: 90,
  oeste: 180,
};

const CENARIOS: Record<
  Orientacao,
  {
    titulo: string;
    texto: string;
    cargaRotulo: string;
    carga: number;
    indicacao: string;
    beneficio: string;
    href: string;
  }
> = {
  oeste: {
    titulo: "Janela para o oeste",
    texto:
      "A mais quente da casa. Pega sol das 14h às 18h, bem na hora em que todo mundo chega.",
    cargaRotulo: "Esquenta muito",
    carga: 4,
    indicacao: "Nanocerâmica Ultra HD",
    beneficio: "Segura o calor sem escurecer",
    href: "/produtos/nanoceramica-ultra-hd",
  },
  norte: {
    titulo: "Janela para o norte",
    texto:
      "Pega sol o dia inteiro, o ano todo. Não tem hora pior — esquenta sempre um pouco.",
    cargaRotulo: "Esquenta bastante",
    carga: 3,
    indicacao: "Nanocerâmica Ultra HD",
    beneficio: "Segura o calor o dia todo",
    href: "/produtos/nanoceramica-ultra-hd",
  },
  leste: {
    titulo: "Janela para o leste",
    texto:
      "Sol da manhã. Esquenta menos, mas ofusca muito: é a janela que atrapalha a TV e o computador cedo.",
    cargaRotulo: "Ofusca bastante",
    carga: 2,
    indicacao: "Nanocerâmica Ultra HD",
    beneficio: "Acaba com o ofuscamento na tela",
    href: "/produtos/nanoceramica-ultra-hd",
  },
  sul: {
    titulo: "Janela para o sul",
    texto:
      "Quase não pega sol direto. Aqui o problema não é o calor — é o raio que desbota o sofá e o piso mesmo na sombra.",
    cargaRotulo: "Esquenta pouco",
    carga: 1,
    indicacao: "Refletiva Black Silver",
    beneficio: "Bloqueia mais de 99% dos raios UV",
    href: "/servicos#refletiva",
  },
};

const CORES_DA_CARGA = ["#c4dda6", "#fde084", "#faa97e", "#ef5a2e"];

/** Cada ponto fica centrado no respiro em volta do dial (p-8 no celular, p-10 acima). */
const PONTOS: { orientacao: Orientacao; letra: string; posicao: string }[] = [
  {
    orientacao: "norte",
    letra: "N",
    posicao: "left-1/2 top-4 -translate-x-1/2 -translate-y-1/2 sm:top-5",
  },
  {
    orientacao: "leste",
    letra: "L",
    posicao: "right-4 top-1/2 translate-x-1/2 -translate-y-1/2 sm:right-5",
  },
  {
    orientacao: "sul",
    letra: "S",
    posicao: "bottom-4 left-1/2 -translate-x-1/2 translate-y-1/2 sm:bottom-5",
  },
  {
    orientacao: "oeste",
    letra: "O",
    posicao: "left-4 top-1/2 -translate-x-1/2 -translate-y-1/2 sm:left-5",
  },
];

/** Setor de incidência: uma fatia de 80° em volta da direção escolhida. */
function Setor() {
  const raio = 200;
  const meia = (40 * Math.PI) / 180;
  const x1 = raio + raio * Math.cos(-meia);
  const y1 = raio + raio * Math.sin(-meia);
  const x2 = raio + raio * Math.cos(meia);
  const y2 = raio + raio * Math.sin(meia);

  return (
    <path
      d={`M ${raio} ${raio} L ${x1} ${y1} A ${raio} ${raio} 0 0 1 ${x2} ${y2} Z`}
      fill="url(#gradienteDoSol)"
    />
  );
}

const CURVA_GENTLE = "cubic-bezier(0.22, 1, 0.36, 1)";

export function BussolaSolar() {
  const [orientacao, setOrientacao] = useState<Orientacao>("oeste");
  // Giro acumulado: o setor e o sol sempre andam pelo caminho mais curto do
  // círculo, em vez de dar a volta inteira de norte para oeste.
  const [giro, setGiro] = useState(ANGULO.oeste);
  const cenario = CENARIOS[orientacao];

  const escolher = (nova: Orientacao) => {
    setOrientacao(nova);
    setGiro((atual) => atual + ((((ANGULO[nova] - atual) % 360) + 540) % 360) - 180);
  };

  return (
    <div className="relative overflow-hidden rounded-2xl border border-vidro-borda bg-vidro-preenchimento vidro-03">
      <div className="flex flex-col items-center gap-6 p-5 sm:gap-10 sm:p-10 lg:flex-row lg:items-start lg:gap-14 lg:p-[39px]">
        {/* Dial. O respiro em volta abriga os pontos cardeais, então o conjunto
            cabe inteiro em qualquer largura — do celular aos 400px do Figma. */}
        <div className="w-full max-w-[400px] shrink-0 lg:w-[480px] lg:max-w-none">
          <div className="relative p-8 sm:p-10">
            <div className="relative aspect-square w-full">
              <svg viewBox="0 0 400 400" className="absolute inset-0 size-full" aria-hidden>
                <defs>
                  <radialGradient id="gradienteDoSol" cx="0.5" cy="0.5" r="0.5">
                    <stop offset="0%" stopColor="#fde084" stopOpacity="0.1" />
                    <stop offset="55%" stopColor="#fbc97f" stopOpacity="0.55" />
                    <stop offset="100%" stopColor="#f9a97d" stopOpacity="0.25" />
                  </radialGradient>
                </defs>

                {/* Setor de incidência — gira para a orientação escolhida */}
                <g
                  style={{
                    transform: `rotate(${giro}deg)`,
                    transformOrigin: "200px 200px",
                    transition: `transform 450ms ${CURVA_GENTLE}`,
                  }}
                >
                  <Setor />
                </g>

                {/* Anéis */}
                <circle
                  cx="200"
                  cy="200"
                  r="199"
                  fill="none"
                  stroke="rgba(36,40,43,0.18)"
                  strokeWidth="1"
                />
                <circle cx="200" cy="200" r="84" fill="var(--fundo-sutil)" />
                <circle
                  cx="200"
                  cy="200"
                  r="84"
                  fill="none"
                  stroke="rgba(36,40,43,0.08)"
                  strokeWidth="1"
                />
              </svg>

              {/* Janela no centro, proporcional ao dial (64x84 em 400) */}
              <span
                aria-hidden
                className="absolute left-1/2 top-1/2 block h-[21%] w-[16%] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-md border-2 border-texto-forte bg-[rgba(250,169,126,0.35)]"
              >
                <span className="absolute inset-y-0 left-1/2 w-[2px] -translate-x-1/2 bg-texto-forte" />
                <span className="absolute inset-x-0 top-1/2 h-[2px] -translate-y-1/2 bg-texto-forte" />
              </span>

              {/* Sol: um braço que gira com o setor, com o sol a 90% do raio */}
              <span
                aria-hidden
                className="absolute inset-0 block"
                style={{ rotate: `${giro}deg`, transition: `rotate 450ms ${CURVA_GENTLE}` }}
              >
                <span
                  className="absolute left-[90%] top-1/2 block aspect-square w-[7.5%] min-w-[22px] -translate-x-1/2 -translate-y-1/2 text-conforto-500"
                  style={{ rotate: `${-giro}deg`, transition: `rotate 450ms ${CURVA_GENTLE}` }}
                >
                  <IconeSol className="size-full" />
                </span>
              </span>
            </div>

            {/* Pontos cardeais, centrados no respiro em volta do dial.
                No toque ganham um círculo de vidro, para parecerem botões. */}
            {PONTOS.map((ponto) => (
              <button
                key={ponto.letra}
                type="button"
                onClick={() => escolher(ponto.orientacao)}
                aria-pressed={orientacao === ponto.orientacao}
                className={`absolute ${ponto.posicao} flex size-11 items-center justify-center rounded-pill t-botao-m transition-[opacity,background-color] pointer-coarse:border pointer-coarse:border-vidro-borda pointer-coarse:bg-white/60 ${
                  orientacao === ponto.orientacao
                    ? "text-texto-forte opacity-100 pointer-coarse:bg-conforto-500"
                    : "text-texto-suave opacity-55 hover:opacity-100 pointer-coarse:opacity-90"
                }`}
              >
                <span className="sr-only">Janela para o {ponto.orientacao}</span>
                <span aria-hidden>{ponto.letra}</span>
              </button>
            ))}
          </div>

          <p className="hidden text-center t-micro text-texto-suave pointer-coarse:block">
            Toque na direção da sua janela
          </p>
        </div>

        {/* Recomendação */}
        <div className="flex w-full max-w-[700px] flex-col items-start gap-[18px] lg:pt-14">
          <p className="t-sobrancelha text-texto-acento">
            Para onde sua janela está virada?
          </p>
          <h3 className="t-h2">{cenario.titulo}</h3>
          <p className="t-corpo text-texto-suave">{cenario.texto}</p>

          {/* Carga térmica */}
          <div className="flex w-full flex-col gap-2">
            <p className="t-tag text-texto-forte">{cenario.cargaRotulo}</p>
            <div className="flex w-full gap-[6px]" role="img" aria-label={cenario.cargaRotulo}>
              {CORES_DA_CARGA.map((cor, i) => (
                <span
                  key={cor}
                  className="h-[10px] flex-1 rounded-pill transition-colors duration-450"
                  style={{
                    background: i < cenario.carga ? cor : "rgba(196,221,166,0.3)",
                  }}
                />
              ))}
            </div>
          </div>

          {/* Indicação */}
          <div className="flex w-full flex-col items-start gap-4 rounded-[18px] border border-vidro-borda bg-vidro-preenchimento-forte px-6 py-5 vidro-01 sm:flex-row sm:items-center sm:gap-4">
            <div className="flex flex-1 flex-col gap-[3px]">
              <p className="t-tag text-texto-suave">O QUE INDICAMOS</p>
              <p className="t-h5">{cenario.indicacao}</p>
              <p className="t-micro text-texto-suave">{cenario.beneficio}</p>
            </div>
            <BotaoLink href={cenario.href} tamanho="M" className="shrink-0">
              Ver essa película
            </BotaoLink>
          </div>
        </div>
      </div>
    </div>
  );
}
