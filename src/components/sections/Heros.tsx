import Image from "next/image";
import type { ReactNode } from "react";

import { IsotipoDeVidro } from "@/components/brand/IsotipoDeVidro";
import { Breadcrumb } from "@/components/ui/Elementos";
import { fotos, type SlotDeFoto } from "@/content/fotos";

type Trilha = { rotulo: string; href?: string }[];

/**
 * Herói de página interna (Figma: Hero de 02/06/07/08).
 *
 * Foto de obra lavada por uma camada clara, breadcrumb, H1 e lead à esquerda;
 * o isótipo de vidro grande sangrando pela direita.
 */
export function HeroSimples({
  trilha,
  sobrancelha,
  titulo,
  lead,
  foto,
  alturaClasse = "min-h-[420px] md:min-h-[520px]",
}: {
  trilha: Trilha;
  sobrancelha?: string;
  titulo: ReactNode;
  lead?: ReactNode;
  foto: SlotDeFoto;
  alturaClasse?: string;
}) {
  return (
    <section
      className={`relative isolate flex items-center overflow-hidden bg-fundo-pagina pb-12 pt-[120px] md:pb-14 md:pt-[140px] ${alturaClasse}`}
    >
      <Image
        src={fotos[foto]}
        alt=""
        fill
        priority
        sizes="100vw"
        className="-z-20 object-cover"
      />
      {/* Lavagem de luz: a foto entra como textura, não como assunto */}
      <span
        aria-hidden
        className="absolute inset-0 -z-10"
        style={{
          background:
            "linear-gradient(100deg, rgba(252,252,242,0.97) 0%, rgba(250,250,238,0.92) 42%, rgba(244,244,230,0.78) 100%)",
        }}
      />
      <IsotipoDeVidro
        largura={520}
        className="absolute right-[-120px] top-[48px] -z-10 w-[260px] opacity-50 lg:right-[-90px] lg:top-[-60px] lg:w-auto lg:opacity-80"
      />

      <div className="conteudo relative flex flex-col items-start gap-4">
        <Breadcrumb trilha={trilha} />
        {sobrancelha && <p className="t-sobrancelha text-texto-acento">{sobrancelha}</p>}
        <h1 className="t-h1 max-w-[860px]">{titulo}</h1>
        {lead && <p className="t-corpo-g max-w-[620px] text-texto-suave">{lead}</p>}
      </div>
    </section>
  );
}

/**
 * Herói dividido (Figma: Hero de 04 · Para casas e 05 · Para empresas).
 * Metade de conteúdo sobre gradiente, metade de foto da obra.
 */
export function HeroDividido({
  trilha,
  titulo,
  lead,
  acoes,
  chips,
  foto,
  tom = "conforto",
}: {
  trilha: Trilha;
  titulo: ReactNode;
  lead: ReactNode;
  acoes: ReactNode;
  chips?: ReactNode;
  foto: SlotDeFoto;
  tom?: "conforto" | "frescor";
}) {
  const gradiente =
    tom === "conforto"
      ? "linear-gradient(150deg, #fcfcf2 0%, #fdeed9 55%, #fbcfb3 100%)"
      : "linear-gradient(150deg, #fcfcf2 0%, #f1f7e3 55%, #dcecc6 100%)";

  // No celular o título e os botões vêm primeiro, logo abaixo da navbar — a foto
  // desce para depois deles. Do lg em diante, lado a lado como no Figma.
  return (
    <section className="relative isolate grid overflow-hidden lg:grid-cols-2">
      <div
        className="relative flex items-center pb-12 pt-[120px] md:pb-16 md:pt-[140px] lg:min-h-[720px] lg:py-24"
        style={{ backgroundImage: gradiente }}
      >
        <div className="conteudo flex flex-col items-start gap-5 lg:pr-16">
          <Breadcrumb trilha={trilha} />
          <h1 className="t-h1 max-w-[700px]">{titulo}</h1>
          <p className="t-corpo-g max-w-[600px] text-texto-corpo">{lead}</p>
          {/* Botões de largura inteira no celular: alvo grande para o polegar */}
          <div className="mt-2 flex w-full flex-col gap-3 *:w-full sm:w-auto sm:flex-row sm:flex-wrap sm:items-center sm:*:w-auto">
            {acoes}
          </div>
          {chips && <div className="mt-2 flex flex-wrap items-center gap-[10px]">{chips}</div>}
        </div>
      </div>

      <div className="relative aspect-[4/3] sm:aspect-[16/9] lg:aspect-auto lg:min-h-[720px]">
        <Image
          src={fotos[foto]}
          alt="Obra da RR Film"
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover"
        />
      </div>
    </section>
  );
}

/** Chip de vidro estático do herói (Aplicação em 1 dia · Garantia de 15 anos). */
export function ChipDoHeroi({
  icone,
  children,
}: {
  icone: ReactNode;
  children: ReactNode;
}) {
  return (
    <span className="inline-flex items-center gap-2 rounded-pill border border-vidro-borda bg-vidro-preenchimento-forte px-[18px] py-3 t-campo text-texto-forte vidro-01">
      <span className="shrink-0">{icone}</span>
      {children}
    </span>
  );
}
