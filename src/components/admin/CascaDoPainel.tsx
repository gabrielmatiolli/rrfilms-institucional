"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Assinatura, Isotipo } from "@/components/brand/Marca";
import { sair } from "@/app/admin/login/acoes";
import { cn } from "@/lib/utils";

const ITENS = [
  { rotulo: "Painel", href: "/admin" },
  { rotulo: "Blog", href: "/admin/blog" },
  { rotulo: "Serviços", href: "/admin/servicos" },
  { rotulo: "Produtos", href: "/admin/produtos" },
  { rotulo: "Galerias", href: "/admin/galerias" },
  { rotulo: "Conteúdo", href: "/admin/conteudo" },
  { rotulo: "Configurações", href: "/admin/configuracoes" },
];

function estaAtivo(href: string, caminho: string) {
  return href === "/admin" ? caminho === "/admin" : caminho.startsWith(href);
}

export default function CascaDoPainel({
  nome,
  papel,
  children,
}: {
  nome: string;
  papel: string;
  children: React.ReactNode;
}) {
  const caminho = usePathname();
  const [menuAberto, setMenuAberto] = useState(false);

  // A gaveta fecha no onClick de cada link, e não num efeito que observa a
  // rota: assim não há render em cascata a cada navegação.

  // Trava o scroll do fundo enquanto a gaveta está aberta.
  useEffect(() => {
    if (!menuAberto) return;
    const anterior = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = anterior;
    };
  }, [menuAberto]);

  return (
    <div className="flex min-h-screen w-full flex-col lg:flex-row">
      {/* Barra do celular */}
      <header className="sticky top-0 z-40 flex items-center justify-between gap-3 border-b border-escuro-700 bg-fundo-inverso px-4 py-3 lg:hidden">
        <Link href="/admin" className="flex items-center gap-2.5 text-texto-inverso">
          <Isotipo className="h-6 w-auto" />
          <span className="text-[11px] font-semibold uppercase tracking-[1.2px] opacity-70">
            Painel
          </span>
        </Link>
        <button
          type="button"
          onClick={() => setMenuAberto((v) => !v)}
          aria-expanded={menuAberto}
          aria-controls="menu-do-painel"
          className="-mr-2 flex size-11 items-center justify-center rounded-xl text-texto-inverso"
        >
          <span className="sr-only">{menuAberto ? "Fechar menu" : "Abrir menu"}</span>
          <span aria-hidden className="flex flex-col gap-[5px]">
            <span
              className={cn(
                "block h-[2px] w-5 bg-current transition-transform",
                menuAberto && "translate-y-[7px] rotate-45",
              )}
            />
            <span
              className={cn("block h-[2px] w-5 bg-current transition-opacity", menuAberto && "opacity-0")}
            />
            <span
              className={cn(
                "block h-[2px] w-5 bg-current transition-transform",
                menuAberto && "-translate-y-[7px] -rotate-45",
              )}
            />
          </span>
        </button>
      </header>

      {menuAberto && (
        <button
          type="button"
          aria-label="Fechar menu"
          onClick={() => setMenuAberto(false)}
          className="fixed inset-0 z-40 bg-escuro-900/45 lg:hidden"
        />
      )}

      {/* Gaveta no celular, coluna fixa no desktop */}
      <aside
        id="menu-do-painel"
        className={cn(
          "fixed inset-y-0 right-0 z-50 flex w-[80%] max-w-[300px] flex-col bg-fundo-inverso transition-transform duration-200",
          "lg:sticky lg:top-0 lg:z-auto lg:h-screen lg:w-[248px] lg:max-w-none lg:translate-x-0",
          menuAberto ? "translate-x-0" : "translate-x-full",
        )}
      >
        <div className="hidden flex-col gap-2 px-6 pb-6 pt-8 lg:flex">
          <Link href="/admin">
            <Assinatura className="h-7 w-auto text-texto-inverso" />
          </Link>
          <p className="text-[10.5px] font-semibold uppercase tracking-[1.2px] text-texto-inverso/50">
            Painel administrativo
          </p>
        </div>

        <div className="flex items-center justify-between px-5 pb-4 pt-5 lg:hidden">
          <p className="text-[11px] font-semibold uppercase tracking-[1.2px] text-texto-inverso/50">
            Navegação
          </p>
          <button
            type="button"
            onClick={() => setMenuAberto(false)}
            className="-mr-2 flex size-11 items-center justify-center text-[20px] text-texto-inverso"
          >
            <span className="sr-only">Fechar menu</span>
            <span aria-hidden>×</span>
          </button>
        </div>

        <div className="h-px w-full bg-escuro-700" />

        <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-3.5 py-4">
          {ITENS.map((item) => {
            const ativo = estaAtivo(item.href, caminho);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMenuAberto(false)}
                aria-current={ativo ? "page" : undefined}
                className={cn(
                  "relative flex min-h-[44px] items-center rounded-xl px-4 text-[14.5px] font-semibold transition-colors",
                  ativo
                    ? "bg-alfa-branco-16 text-texto-inverso"
                    : "text-texto-inverso/70 hover:bg-white/8 hover:text-texto-inverso",
                )}
              >
                {ativo && (
                  <span className="absolute left-0 top-1/2 h-4 w-[3px] -translate-y-1/2 rounded-r-full bg-acao-secundaria" />
                )}
                {item.rotulo}
              </Link>
            );
          })}
        </nav>

        <div className="flex flex-col gap-3 px-5 pb-6 pt-4">
          <div className="h-px w-full bg-escuro-700" />
          <Link
            href="/"
            target="_blank"
            rel="noreferrer"
            onClick={() => setMenuAberto(false)}
            className="flex min-h-[44px] items-center text-[13px] font-semibold text-texto-inverso/70 hover:text-texto-inverso"
          >
            Ver o site ↗
          </Link>
          <div className="flex items-end justify-between gap-3">
            <div className="flex min-w-0 flex-col">
              <p className="truncate text-[13.5px] font-semibold text-texto-inverso">{nome}</p>
              <p className="text-[11.5px] capitalize text-texto-inverso/50">
                {papel.toLowerCase()}
              </p>
            </div>
            <form action={sair}>
              <button
                type="submit"
                className="rounded-pill border border-escuro-700 px-3.5 py-2 text-[12.5px] font-semibold text-texto-inverso/70 hover:border-texto-inverso/40 hover:text-texto-inverso"
              >
                Sair
              </button>
            </form>
          </div>
        </div>
      </aside>

      <main className="min-w-0 flex-1 px-4 py-6 sm:px-7 sm:py-9 lg:px-10">
        <div className="mx-auto flex w-full max-w-[1100px] flex-col gap-7">{children}</div>
      </main>
    </div>
  );
}
