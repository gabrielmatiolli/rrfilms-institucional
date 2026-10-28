"use client";

import { useEffect } from "react";

import { registrarCliqueDeContato, type CanalDeContato } from "@/lib/conversao";

/**
 * Conta os cliques em WhatsApp, telefone e e-mail do site inteiro — FAB, navbar,
 * rodapé, faixas de CTA e os cartões de /contato — com um único ouvinte no
 * documento, em vez de mexer em cada link.
 */

function canalDoLink(href: string): CanalDeContato | null {
  if (/^https?:\/\/(wa\.me|api\.whatsapp\.com|web\.whatsapp\.com)\//i.test(href)) return "whatsapp";
  if (href.startsWith("tel:")) return "telefone";
  if (href.startsWith("mailto:")) return "email";
  return null;
}

export function RastreioDeContato() {
  useEffect(() => {
    function aoClicar(evento: MouseEvent) {
      const link = (evento.target as Element | null)?.closest?.("a[href]");
      if (!(link instanceof HTMLAnchorElement)) return;
      const canal = canalDoLink(link.getAttribute("href") ?? "");
      if (canal) registrarCliqueDeContato(canal, window.location.pathname);
    }

    // Fase de captura: conta mesmo se algum componente parar a propagação.
    document.addEventListener("click", aoClicar, true);
    return () => document.removeEventListener("click", aoClicar, true);
  }, []);

  return null;
}
