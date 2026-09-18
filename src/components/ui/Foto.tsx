import Image from "@/components/ui/Imagem";

import { fotos, type SlotDeFoto } from "@/content/fotos";
import type { CaminhoDeImagem } from "@/lib/imagens";

/**
 * Área de foto (Figma nó 29:90).
 *
 * Marcador de onde entra fotografia do cliente — agora com as fotos reais que
 * o arquivo de design já carrega. Toda foto do site é de obra aplicada pela
 * equipe em Itatiba e região.
 */
export function Foto({
  slot,
  ...resto
}: {
  slot: SlotDeFoto;
  alt: string;
  className?: string;
  arredondamento?: string;
  prioridade?: boolean;
  sizes?: string;
}) {
  return <FotoDeUrl src={fotos[slot]} {...resto} />;
}

/**
 * Mesma moldura, mas a partir de um caminho de imagem em vez de um slot do
 * arquivo de design — é o que o conteúdo vindo do banco usa.
 */
export function FotoDeUrl({
  src,
  alt,
  className = "",
  arredondamento = "rounded-xl",
  prioridade = false,
  sizes = "(max-width: 768px) 100vw, 50vw",
}: {
  src: CaminhoDeImagem | "";
  alt: string;
  className?: string;
  arredondamento?: string;
  prioridade?: boolean;
  sizes?: string;
}) {
  return (
    <div
      className={`relative overflow-hidden bg-conforto-100 ${arredondamento} ${className}`}
    >
      {src && (
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={prioridade}
          className="object-cover"
        />
      )}
    </div>
  );
}

/** Textura de lâminas diagonais que o Figma usa por cima das capas. */
export function TexturaDeLaminas({ opacidade = 0.1 }: { opacidade?: number }) {
  return (
    <span
      aria-hidden
      className="pointer-events-none absolute inset-0"
      style={{
        opacity: opacidade,
        backgroundImage:
          "repeating-linear-gradient(110deg, rgba(255,255,255,0.55) 0 34px, transparent 34px 120px)",
      }}
    />
  );
}
