/**
 * Escolha do visitante sobre cookies de medição e publicidade (LGPD).
 *
 * A escolha fica no localStorage do navegador — é o único dado que o site grava
 * antes do aceite, e é essencial: sem ele o aviso voltaria a cada página.
 *
 * "aceito"   → as tags (GTM, Google Analytics, Google Ads, Pixel da Meta) carregam.
 * "recusado" → nada carrega; se já tinham carregado nesta visita, o
 *              consentimento é revogado e os cookies delas são apagados.
 */

/** Suba a versão quando a política mudar de um jeito que peça novo aceite. */
const VERSAO = "v1";
const CHAVE = "rr_consentimento";

export type Escolha = "aceito" | "recusado";

/** Disparado depois que o visitante escolhe — o carregador de tags escuta. */
export const EVENTO_DE_ESCOLHA = "rr:consentimento";
/** Disparado pelo link "Preferências de cookies" do rodapé — o aviso escuta. */
export const EVENTO_DE_ABRIR_AVISO = "rr:abrir-aviso-de-cookies";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
  }
}

export function lerEscolha(): Escolha | null {
  try {
    const valor = window.localStorage.getItem(CHAVE);
    if (valor === `${VERSAO}:aceito`) return "aceito";
    if (valor === `${VERSAO}:recusado`) return "recusado";
  } catch {
    // Navegador sem localStorage (aba anônima restrita): trata como sem escolha.
  }
  return null;
}

export function salvarEscolha(escolha: Escolha) {
  try {
    window.localStorage.setItem(CHAVE, `${VERSAO}:${escolha}`);
  } catch {
    // Sem como guardar: a escolha vale só para esta página.
  }

  if (escolha === "recusado") revogarNestaVisita();
  window.dispatchEvent(new CustomEvent<Escolha>(EVENTO_DE_ESCOLHA, { detail: escolha }));
}

export function abrirAvisoDeCookies() {
  window.dispatchEvent(new Event(EVENTO_DE_ABRIR_AVISO));
}

/** Prefixos dos cookies gravados pelas tags — ver /politica-de-cookies. */
const COOKIES_DAS_TAGS = ["_ga", "_gid", "_gat", "_gcl_", "_fbp", "_fbc"];

/**
 * Quem aceitou e depois recusou na mesma visita: as tags já estão carregadas e
 * não dá para descarregar script. Então avisa cada uma de que o consentimento
 * caiu e apaga os cookies que elas gravaram. Da próxima página em diante elas
 * nem carregam.
 */
function revogarNestaVisita() {
  window.gtag?.("consent", "update", {
    ad_storage: "denied",
    analytics_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
  });
  window.fbq?.("consent", "revoke");

  const dominio = window.location.hostname.replace(/^www\./, "");
  for (const par of document.cookie.split(";")) {
    const nome = par.split("=")[0]?.trim();
    if (!nome || !COOKIES_DAS_TAGS.some((prefixo) => nome.startsWith(prefixo))) continue;
    for (const alvo of ["", `; domain=${dominio}`, `; domain=.${dominio}`]) {
      document.cookie = `${nome}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/${alvo}`;
    }
  }
}
