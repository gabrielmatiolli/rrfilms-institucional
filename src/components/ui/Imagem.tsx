import NextImage, { type ImageProps } from "next/image";

/**
 * Substituto direto de `next/image` para toda imagem que pode vir do painel.
 *
 * O que foi enviado pelo painel (/uploads/…) pula o otimizador `/_next/image`
 * e sai pela rota src/app/uploads/[...caminho]/route.ts. Dois motivos: o
 * otimizador pede o arquivo ao próprio servidor, e na Hostinger respondia 400
 * "not a valid image" para arquivo gravado depois do build (o site da
 * Multipatas já passou por isso em produção); e reprocessar não ganharia nada,
 * porque a imagem já sai WebP e com largura limitada do upload — ver
 * src/lib/admin/upload.ts.
 *
 * O acervo do Figma (/fotos/…) existe no build e continua otimizado.
 */
export default function Imagem({ src, unoptimized, ...props }: ImageProps) {
  const enviadaPeloPainel = typeof src === "string" && src.startsWith("/uploads/");
  return <NextImage src={src} unoptimized={unoptimized ?? enviadaPeloPainel} {...props} />;
}
