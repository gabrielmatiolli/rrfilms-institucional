import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";

import { site } from "@/lib/site";

import "./globals.css";

/**
 * Layout raiz — só o documento, as fontes e os metadados.
 *
 * A moldura do site (navbar, rodapé, FAB do WhatsApp) fica em
 * `(site)/layout.tsx`, para que o painel administrativo em `/admin` compartilhe
 * as fontes e os tokens sem herdar a navegação pública. O grupo `(site)` não
 * aparece na URL: as rotas continuam `/`, `/servicos`, `/blog`…
 */

/** Stage Grotesk — a display da marca (pasta FONTES/MARCA do KV). */
const stageGrotesk = localFont({
  src: [
    { path: "../../public/fonts/StageGrotesk-Light.woff2", weight: "300", style: "normal" },
    { path: "../../public/fonts/StageGrotesk-Regular.woff2", weight: "400", style: "normal" },
    { path: "../../public/fonts/StageGrotesk-Medium.woff2", weight: "500", style: "normal" },
    { path: "../../public/fonts/StageGrotesk-Bold.woff2", weight: "700", style: "normal" },
  ],
  variable: "--tipo-familia-display",
  display: "swap",
  fallback: ["Helvetica Neue", "Arial", "sans-serif"],
});

/** Raleway — a família de texto. Variável, de 100 a 900. */
const raleway = localFont({
  src: [
    {
      path: "../../public/fonts/Raleway-VariableFont_wght.ttf",
      weight: "100 900",
      style: "normal",
    },
  ],
  variable: "--tipo-familia-texto",
  display: "swap",
  fallback: ["Helvetica Neue", "Arial", "sans-serif"],
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.nome} · ${site.complemento}`,
    template: `%s · ${site.nome}`,
  },
  description:
    "Películas para vidro em Itatiba e região desde 1997. Conforto térmico, proteção UV, segurança antiestilhaço e decorativas. Medição e orçamento sem custo.",
  keywords: [
    "película para vidro",
    "insulfilm residencial",
    "nanocerâmica",
    "película de segurança",
    "Itatiba",
    "controle solar",
  ],
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: site.url,
    siteName: site.nome,
    title: `${site.nome} · ${site.complemento}`,
    description: site.slogan,
  },
};

/** No celular, a barra do navegador assume o fundo da página. */
export const viewport: Viewport = {
  themeColor: "#f4f4e6",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" className={`${stageGrotesk.variable} ${raleway.variable}`}>
      <body>{children}</body>
    </html>
  );
}
