"use client";

import Image from "next/image";
import { useState } from "react";

import { BotaoLink } from "@/components/ui/Botao";
import { IconeCasa, IconeCheck, IconePredio } from "@/components/ui/Icone";
import { fotos } from "@/content/fotos";

/**
 * Segmento dividido (Figma nó 60:610).
 *
 * Substitui os dois cards lado a lado. Uma faixa só, partida pela diagonal de
 * -13° do isótipo: quente à esquerda (casas), fria à direita (empresas). Passar
 * o mouse empurra a aresta para o lado escolhido e aquele lado ganha peso — a
 * escolha acontece no gesto, não num clique.
 *
 * No Figma: MOUSE_ENTER por metade, Smart Animate 420ms GENTLE.
 * Aqui: clip-path polygon com transição na coordenada do vértice.
 */

const LADOS = {
  casas: {
    sobrancelha: "Residencial",
    titulo: "CASAS",
    itens: [
      "A sala que para de esquentar à tarde",
      "Sofá e piso que não desbotam",
      "Privacidade sem perder a vista",
    ],
    rotulo: "Ver soluções para casa",
    href: "/para-casas",
  },
  empresas: {
    sobrancelha: "Corporativo",
    titulo: "EMPRESAS",
    itens: [
      "Conta de energia mais baixa",
      "Fachada uniforme em todo o prédio",
      "Manutenção e suporte depois da entrega",
    ],
    rotulo: "Ver soluções para empresa",
    href: "/para-empresas",
  },
} as const;

export function SegmentoDividido() {
  const [foco, setFoco] = useState<"neutro" | "casas" | "empresas">("neutro");

  // A aresta a 50% no repouso; o hover empurra 12 pontos para o lado escolhido.
  // Só vale do md em diante, onde os lados ficam lado a lado — a geometria dos
  // dois layouts mora em globals.css (.segmento-*), partindo do celular.
  const corte = foco === "casas" ? 62 : foco === "empresas" ? 38 : 50;

  // O "empurrar" é gesto de mouse. No toque, o navegador emula mouseenter no
  // tap e a aresta ficaria presa num lado; por isso filtramos o tipo de ponteiro.
  const aoEntrar = (lado: "casas" | "empresas") => (e: React.PointerEvent) => {
    if (e.pointerType === "mouse") setFoco(lado);
  };
  const aoSair = (e: React.PointerEvent) => {
    if (e.pointerType === "mouse") setFoco("neutro");
  };

  return (
    <div
      className="relative isolate overflow-hidden rounded-[28px] md:rounded-[36px]"
      style={{ "--corte": `${corte}%` } as React.CSSProperties}
    >
      {/* Lado quente: casas */}
      <div className="segmento-quente absolute inset-0">
        <Image
          src={fotos["segmento-casas"]}
          alt=""
          fill
          sizes="(max-width: 768px) 100vw, 60vw"
          className="object-cover"
        />
        <span className="absolute inset-0 bg-conforto-500/70" />
      </div>

      {/* Lado frio: empresas */}
      <div className="segmento-frio absolute inset-0">
        <Image
          src={fotos["segmento-empresas"]}
          alt=""
          fill
          sizes="(max-width: 768px) 100vw, 60vw"
          className="object-cover"
        />
        <span className="absolute inset-0 bg-frescor-500/70" />
      </div>

      {/* A aresta de vidro entre os dois lados */}
      <span
        aria-hidden
        className="segmento-aresta absolute z-10 block bg-white/90 shadow-[0_0_12px_rgba(255,255,255,0.55)]"
      />

      {/* Conteúdo */}
      <div className="relative z-20 grid gap-10 p-5 sm:p-10 md:grid-cols-2 md:gap-10 md:p-14">
        {(["casas", "empresas"] as const).map((lado) => {
          const dados = LADOS[lado];
          const Icone = lado === "casas" ? IconeCasa : IconePredio;
          return (
            <div
              key={lado}
              onPointerEnter={aoEntrar(lado)}
              onPointerLeave={aoSair}
              onFocus={() => setFoco(lado)}
              onBlur={() => setFoco("neutro")}
              className={`flex flex-col items-start gap-4 rounded-2xl p-6 transition-[transform,box-shadow] duration-[420ms] sm:p-8 ${
                lado === "casas" ? "bg-conforto-500" : "bg-frescor-500"
              } ${foco === lado ? "elevacao-02 md:scale-[1.02]" : ""}`}
            >
              <span className="flex size-16 items-center justify-center rounded-[22px] border border-white/75 bg-alfa-branco-16 text-escuro-900 vidro-05">
                <Icone tamanho={30} />
              </span>
              <p className="t-sobrancelha text-escuro-900">{dados.sobrancelha}</p>
              <h3 className="t-h1">{dados.titulo}</h3>
              <ul className="flex flex-col gap-2">
                {dados.itens.map((item) => (
                  <li key={item} className="flex items-center gap-[10px] t-corpo-p text-escuro-900">
                    <span className="shrink-0 text-escuro-900">
                      <IconeCheck tamanho={17} />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
              <BotaoLink href={dados.href} tamanho="M" className="mt-2">
                {dados.rotulo}
              </BotaoLink>
            </div>
          );
        })}
      </div>
    </div>
  );
}
