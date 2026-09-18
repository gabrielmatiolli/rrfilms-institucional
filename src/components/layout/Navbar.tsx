"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { Assinatura } from "@/components/brand/Marca";
import { IconeFechar, IconeMenu, IconeSetaDireita, IconeTelefone } from "@/components/ui/Icone";
import { navegacao, site } from "@/lib/site";

/**
 * Navbar (Figma nó 26:52).
 *
 * Barra flutuante de vidro, 24px do topo e 40px das laterais. Material
 * Vidro/04 · Flutuante — o conteúdo passa por baixo e refrata. Por isso ela vive
 * no nível da página, e não dentro do herói: o efeito de aplicação da película
 * não pode passar por cima dela.
 *
 * A página atual é marcada por uma faixa laranja abaixo do rótulo — não por
 * sublinhado, que brigaria com a leitura sobre vidro.
 */
export function Navbar({
  telefone,
  telefoneLink,
}: {
  telefone: string;
  telefoneLink: string;
}) {
  const caminho = usePathname();
  const [aberto, setAberto] = useState(false);
  const [caminhoAnterior, setCaminhoAnterior] = useState(caminho);

  // Fecha o menu ao trocar de página, ajustando o estado durante o render —
  // é o padrão do React para estado derivado, sem o efeito em cascata.
  if (caminho !== caminhoAnterior) {
    setCaminhoAnterior(caminho);
    setAberto(false);
  }

  // Trava o scroll enquanto o menu mobile está aberto.
  useEffect(() => {
    document.body.style.overflow = aberto ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [aberto]);

  const ativo = (href: string) =>
    href === "/" ? caminho === "/" : caminho.startsWith(href);

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50 px-5 pt-4 md:px-10 md:pt-6">
      <nav
        aria-label="Navegação principal"
        className="pointer-events-auto mx-auto flex max-w-[1360px] items-center gap-6 rounded-pill border border-vidro-borda bg-vidro-preenchimento-forte py-3 pl-6 pr-3 vidro-04 md:gap-10 md:pl-7 md:pr-4"
      >
        <Link
          href="/"
          aria-label={`${site.nome} — página inicial`}
          className="flex min-h-11 shrink-0 items-center text-texto-forte"
        >
          <Assinatura className="h-[26px] w-auto md:h-[30px]" />
        </Link>

        {/* Links — desktop */}
        <ul className="hidden min-w-0 flex-1 items-center justify-center gap-[30px] lg:flex">
          {navegacao.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={ativo(item.href) ? "page" : undefined}
                className="flex flex-col items-center gap-[7px] pt-1"
              >
                <span
                  className={`t-nav whitespace-nowrap transition-colors ${
                    ativo(item.href)
                      ? "text-texto-forte"
                      : "text-texto-corpo hover:text-texto-forte"
                  }`}
                >
                  {item.rotulo}
                </span>
                <span
                  aria-hidden
                  className={`h-[3px] w-full rounded-pill transition-colors ${
                    ativo(item.href) ? "bg-conforto-500" : "bg-transparent"
                  }`}
                />
              </Link>
            </li>
          ))}
        </ul>

        {/* Ações */}
        <div className="ml-auto flex shrink-0 items-center gap-[10px] lg:ml-0">
          <a
            href={telefoneLink}
            className="hidden items-center gap-2 pr-2 text-texto-forte transition-opacity hover:opacity-70 xl:flex"
          >
            <IconeTelefone tamanho={20} />
            <span className="t-campo whitespace-nowrap">{telefone}</span>
          </a>

          <Link
            href="/contato"
            className="hidden items-center gap-2 rounded-pill bg-acao-secundaria px-[22px] py-[13px] text-acao-sobre-secundaria transition-colors hover:bg-conforto-300 sm:flex"
          >
            <span className="t-botao-m whitespace-nowrap">Orçamento grátis</span>
            <IconeSetaDireita tamanho={18} />
          </Link>

          <button
            type="button"
            onClick={() => setAberto((v) => !v)}
            aria-expanded={aberto}
            aria-controls="menu-mobile"
            className="flex size-11 items-center justify-center rounded-pill border border-vidro-borda bg-white/50 text-texto-forte lg:hidden"
          >
            <span className="sr-only">{aberto ? "Fechar menu" : "Abrir menu"}</span>
            {aberto ? <IconeFechar /> : <IconeMenu />}
          </button>
        </div>
      </nav>

      {/* Menu mobile */}
      {aberto && (
        <div
          id="menu-mobile"
          className="pointer-events-auto mx-auto mt-3 max-h-[calc(100svh-120px)] max-w-[1360px] overflow-y-auto overscroll-contain rounded-2xl border border-vidro-borda bg-vidro-preenchimento-forte p-4 vidro-03 lg:hidden"
        >
          <ul className="flex flex-col">
            {navegacao.map((item) => (
              <li key={item.href} className="border-b border-vidro-borda-baixa last:border-0">
                <Link
                  href={item.href}
                  aria-current={ativo(item.href) ? "page" : undefined}
                  className="flex min-h-[52px] items-center justify-between py-3"
                >
                  <span
                    className={`t-nav ${
                      ativo(item.href) ? "text-texto-forte" : "text-texto-corpo"
                    }`}
                  >
                    {item.rotulo}
                  </span>
                  {ativo(item.href) && (
                    <span aria-hidden className="size-2 rounded-pill bg-conforto-500" />
                  )}
                </Link>
              </li>
            ))}
          </ul>

          {/* No celular o CTA sai da barra (não cabe); aqui ele volta, inteiro. */}
          <div className="mt-3 flex flex-col gap-2">
            <Link
              href="/contato"
              className="flex min-h-[52px] items-center justify-center gap-2 rounded-pill bg-acao-secundaria px-[22px] text-acao-sobre-secundaria transition-colors hover:bg-conforto-300"
            >
              <span className="t-botao-m">Orçamento grátis</span>
              <IconeSetaDireita tamanho={18} />
            </Link>
            <a
              href={telefoneLink}
              className="flex min-h-11 items-center justify-center gap-2 text-texto-forte"
            >
              <IconeTelefone tamanho={20} />
              <span className="t-campo">{telefone}</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
