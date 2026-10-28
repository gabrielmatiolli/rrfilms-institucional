"use client";

import { useEffect } from "react";

import { EVENTO_DE_ESCOLHA, lerEscolha, type Escolha } from "@/lib/consentimento";

/**
 * Injeta o Google Tag Manager quando há aceite — na hora, se o visitante aceitou
 * numa visita anterior, ou no clique em "Aceitar" do aviso.
 *
 * Toda a mensuração mora no GTM (GTM-…): GA4, Pixel da Meta e Google Ads são
 * tags configuradas lá pela agência. O site não carrega gtag.js nem fbevents.js
 * por conta própria — fazer isso duplicava as contagens.
 *
 * Um script só, nesta ordem: dataLayer, sinal de consentimento do Google
 * (Consent Mode v2) e snippet do GTM. O GTM precisa achar o consentimento já no
 * dataLayer quando chega. `gtag()` aqui é só o atalho do Google para empurrar o
 * consentimento no dataLayer; não carrega o GA4.
 *
 * O ID chega validado pelo servidor (TagsDeMedicao), por isso pode entrar no
 * código sem escape.
 */
function codigoDoGtm(gtm: string) {
  return [
    "window.dataLayer=window.dataLayer||[];",
    "window.gtag=window.gtag||function(){window.dataLayer.push(arguments);};",
    "gtag('consent','default',{ad_storage:'granted',analytics_storage:'granted',ad_user_data:'granted',ad_personalization:'granted'});",
    // Snippet oficial do GTM.
    `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${gtm}');`,
    // Avisa o GTM — a agência pode usar como acionador.
    "window.dataLayer.push({event:'consentimento_aceito'});",
  ].join("\n");
}

declare global {
  interface Window {
    __rrTagsCarregadas?: boolean;
  }
}

function carregar(gtm: string) {
  if (window.__rrTagsCarregadas) return;
  window.__rrTagsCarregadas = true;

  const script = document.createElement("script");
  script.id = "tags-de-medicao";
  script.text = codigoDoGtm(gtm);
  document.head.appendChild(script);
}

export function CarregadorDeTags({ gtm }: { gtm: string }) {
  useEffect(() => {
    if (lerEscolha() === "aceito") carregar(gtm);

    function aoEscolher(evento: Event) {
      if ((evento as CustomEvent<Escolha>).detail === "aceito") carregar(gtm);
    }
    window.addEventListener(EVENTO_DE_ESCOLHA, aoEscolher);
    return () => window.removeEventListener(EVENTO_DE_ESCOLHA, aoEscolher);
  }, [gtm]);

  return null;
}
