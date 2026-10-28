"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { Botao } from "@/components/ui/Botao";
import {
  EVENTO_DE_ABRIR_AVISO,
  abrirAvisoDeCookies,
  lerEscolha,
  salvarEscolha,
  type Escolha,
} from "@/lib/consentimento";

/**
 * Aviso de cookies (LGPD). Aparece até o visitante escolher, e volta pelo link
 * "Preferências de cookies" do rodapé.
 *
 * "Recusar" tem o mesmo peso visual de "Aceitar": a ANPD orienta que recusar
 * seja tão fácil quanto aceitar.
 */
export function AvisoDeCookies() {
  // Fechado até montar: a escolha mora no navegador, e o servidor não sabe dela.
  // Renderizar o aviso no servidor faria ele piscar para quem já escolheu.
  const [aberto, setAberto] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- a escolha só existe no navegador
    if (lerEscolha() === null) setAberto(true);

    const abrir = () => setAberto(true);
    window.addEventListener(EVENTO_DE_ABRIR_AVISO, abrir);
    return () => window.removeEventListener(EVENTO_DE_ABRIR_AVISO, abrir);
  }, []);

  if (!aberto) return null;

  function escolher(escolha: Escolha) {
    salvarEscolha(escolha);
    setAberto(false);
  }

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-labelledby="aviso-de-cookies-titulo"
      className="fixed inset-x-3 bottom-3 z-50 sm:inset-x-auto sm:bottom-6 sm:left-6 sm:max-w-[460px]"
    >
      <div className="flex flex-col gap-4 rounded-2xl border border-vidro-borda bg-fundo-superficie p-5 elevacao-02 sm:p-6">
        <p id="aviso-de-cookies-titulo" className="t-h5 text-texto-forte">
          Cookies
        </p>
        <p className="t-corpo-p text-texto-corpo">
          Com a sua permissão, usamos cookies do Google e da Meta para medir as visitas e
          mostrar nossos anúncios a quem já conhece a RR Film. Sem ela, o site funciona
          igual. Detalhes na{" "}
          <Link href="/politica-de-cookies" className="font-semibold underline underline-offset-4">
            política de cookies
          </Link>
          .
        </p>
        <div className="flex flex-col gap-2.5 sm:flex-row">
          <Botao
            type="button"
            tipo="fantasma"
            tamanho="M"
            mostrarIcone={false}
            className="w-full sm:flex-1"
            onClick={() => escolher("recusado")}
          >
            Recusar
          </Botao>
          <Botao
            type="button"
            tipo="primaria"
            tamanho="M"
            mostrarIcone={false}
            className="w-full sm:flex-1"
            onClick={() => escolher("aceito")}
          >
            Aceitar
          </Botao>
        </div>
      </div>
    </div>
  );
}

/** Link do rodapé (e das políticas) que reabre o aviso para mudar a escolha. */
export function LinkDePreferenciasDeCookies({ className }: { className?: string }) {
  return (
    <button
      type="button"
      onClick={abrirAvisoDeCookies}
      className={className ?? "underline underline-offset-4 transition-opacity hover:opacity-65"}
    >
      Preferências de cookies
    </button>
  );
}
