import { CarregadorDeTags } from "./CarregadorDeTags";

/**
 * A mensuração do site público: só o Google Tag Manager. GA4, Pixel da Meta e
 * Google Ads são tags dentro do contêiner, administradas pela agência.
 *
 * Nada carrega antes de o visitante aceitar no aviso de cookies (LGPD) — quem
 * decide isso é o `CarregadorDeTags`, no navegador. Aqui, no servidor, só se
 * conferem o ID do .env e o ambiente:
 *
 * - só no build de produção (em `npm run dev` visita de teste entraria nos
 *   mesmos relatórios do site no ar);
 * - só no site público — o /admin não passa pelo layout que monta isto;
 * - ID com formato errado é ignorado, com aviso no log, em vez de quebrar a
 *   página — inclusive o engano de colar o snippet inteiro na variável.
 *
 * Sem o `<noscript>` do GTM de propósito: sem JavaScript não há como pedir o
 * consentimento, e o fallback rastrearia sem pedir.
 */
export function TagsDeMedicao() {
  if (process.env.NODE_ENV !== "production") return null;

  const gtm = process.env.NEXT_PUBLIC_GTM_ID?.trim();
  if (!gtm) return null;
  if (!/^GTM-[A-Z0-9]+$/.test(gtm)) {
    console.warn(`NEXT_PUBLIC_GTM_ID ignorado: "${gtm}" não parece um ID de contêiner do GTM.`);
    return null;
  }

  return <CarregadorDeTags gtm={gtm} />;
}
