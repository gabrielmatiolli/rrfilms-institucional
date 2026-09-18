import Link from "next/link";

import { Assinatura } from "@/components/brand/Marca";
import {
  IconeEmail,
  IconePin,
  IconeRelogio,
  IconeTelefone,
  IconeWhatsapp,
} from "@/components/ui/Icone";
import { rodape, site } from "@/lib/site";
import type { ContatoDoSite } from "@/lib/dados/configuracao";

/**
 * Rodapé (Figma nó 31:147).
 *
 * Laranja Conforto com três lâminas de vidro inclinadas ao fundo — a assinatura
 * visual da marca. Quatro colunas de navegação, bloco de contato e faixa legal.
 */
export function Rodape({ contato }: { contato: ContatoDoSite }) {
  const contatos = [
    { Icone: IconeTelefone, texto: contato.telefone, href: contato.telefoneLink },
    { Icone: IconeWhatsapp, texto: contato.instagram, href: contato.instagramUrl },
    { Icone: IconeEmail, texto: contato.email, href: `mailto:${contato.email}` },
    { Icone: IconePin, texto: contato.atendimento },
    { Icone: IconeRelogio, texto: contato.horario },
  ];

  return (
    <footer className="relative isolate overflow-hidden bg-conforto-500 text-escuro-900">
      {/* Lâminas de vidro inclinadas, ancoradas pela direita: menores no celular,
          nas posições do Figma no lg. */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        {[
          { celular: "92px", desktop: "306px" },
          { celular: "12px", desktop: "176px" },
          { celular: "-68px", desktop: "46px" },
        ].map(({ celular, desktop }) => (
          <span
            key={desktop}
            className="absolute right-(--celular) top-[-60px] block h-[300px] w-[110px] rounded-[14px] bg-conforto-100 lg:right-(--desktop) lg:top-[-70px] lg:h-[520px] lg:w-[180px] lg:rounded-lg"
            style={
              {
                "--celular": celular,
                "--desktop": desktop,
                transform: "rotate(14deg)",
              } as React.CSSProperties
            }
          />
        ))}
      </div>

      <div className="conteudo flex flex-col gap-12 pb-14 pt-[72px] lg:flex-row lg:gap-16">
        {/* Marca */}
        <div className="flex w-full flex-col items-start gap-5 lg:w-[340px] lg:shrink-0">
          <Link
            href="/"
            aria-label={`${site.nome} — página inicial`}
            className="flex min-h-11 items-center"
          >
            <Assinatura className="h-[34px] w-auto text-escuro-900" />
          </Link>
          <p className="t-corpo-p">{rodape.descricao}</p>
        </div>

        {/* Colunas de navegação */}
        <div className="grid flex-1 grid-cols-2 gap-8 md:grid-cols-3 lg:gap-8">
          {rodape.colunas.map((coluna) => (
            <nav key={coluna.titulo} className="flex flex-col items-start lg:gap-3">
              <h2 className="mb-1 t-sobrancelha text-escuro-700 opacity-50 lg:mb-0">
                {coluna.titulo}
              </h2>
              {coluna.itens.map((item) => (
                <Link
                  key={item.rotulo}
                  href={item.href}
                  className="py-[9px] t-corpo-p transition-opacity hover:opacity-65 lg:py-0"
                >
                  {item.rotulo}
                </Link>
              ))}
            </nav>
          ))}
        </div>

        {/* Contato */}
        <div className="flex w-full flex-col items-start lg:w-[260px] lg:shrink-0 lg:gap-3">
          <h2 className="mb-1 t-sobrancelha text-escuro-700 opacity-50 lg:mb-0">Contato</h2>
          {contatos.map(({ Icone, texto, href }) => {
            const linha = (
              <>
                <span className="mt-[3px] shrink-0 opacity-70">
                  <Icone tamanho={18} />
                </span>
                <span className="t-corpo-p flex-1">{texto}</span>
              </>
            );
            return href ? (
              <a
                key={texto}
                href={href}
                className="flex w-full items-start gap-[10px] py-[9px] transition-opacity hover:opacity-65 lg:py-0"
              >
                {linha}
              </a>
            ) : (
              <p key={texto} className="flex w-full items-start gap-[10px] py-[9px] lg:py-0">
                {linha}
              </p>
            );
          })}
        </div>
      </div>

      {/* Redes e slogan */}
      <div className="border-t border-alfa-escuro-12">
        <div className="conteudo flex flex-col items-start justify-between gap-6 py-[26px] lg:flex-row lg:items-center">
          <p className="t-h4">{site.slogan}</p>
          <div className="flex flex-wrap items-center gap-3">
            <a
              href={contato.instagramUrl}
              className="rounded-pill bg-alfa-branco-16 px-[18px] py-[10px] t-corpo-destaque transition-colors hover:bg-white/30"
            >
              {contato.instagram}
            </a>
            <a
              href={site.url}
              className="rounded-pill bg-alfa-branco-16 px-[18px] py-[10px] t-corpo-destaque transition-colors hover:bg-white/30"
            >
              {site.urlCurta}
            </a>
            <a
              href={contato.whatsapp}
              className="rounded-pill bg-frescor-500 px-[18px] py-[10px] t-corpo-destaque transition-colors hover:bg-[#b6d494]"
            >
              WhatsApp · {contato.telefone}
            </a>
          </div>
        </div>
      </div>

      {/* Legal */}
      <div className="border-t border-white/12">
        <div className="conteudo flex flex-col gap-2 pb-8 pt-6 t-micro sm:flex-row sm:items-center sm:gap-6">
          <p className="flex-1">
            © {new Date().getFullYear()} {site.nome}® · {site.complemento} Desde{" "}
            {site.fundacao}. CNPJ {contato.cnpj}.
          </p>
          <p className="shrink-0">{site.identidade}</p>
        </div>
      </div>
    </footer>
  );
}
