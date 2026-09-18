import Image from "next/image";

/**
 * Isótipo de vidro (Figma nó 156:317).
 *
 * O isótipo em material de vidro, usado como elemento gráfico grande e
 * decorativo — nunca como logotipo. Vetor exportado do arquivo de design.
 */
export function IsotipoDeVidro({
  className = "",
  largura = 420,
}: {
  className?: string;
  largura?: number;
}) {
  return (
    <span aria-hidden className={`pointer-events-none block ${className}`}>
      <Image
        src="/brand/isotipo-de-vidro.svg"
        alt=""
        width={largura}
        height={Math.round((largura * 540) / 441.282)}
        priority={false}
      />
    </span>
  );
}
