import NextImage, { type ImageProps } from "next/image";

/**
 * Substituto direto de `next/image` para toda imagem que pode vir do painel.
 *
 * O que foi enviado pelo painel (/uploads/…) pula o otimizador `/_next/image`:
 * na Hostinger ele responde 400 "not a valid image" para arquivos gravados
 * depois do build, mesmo válidos — o site da Multipatas já passou por isso em
 * produção. Servir o arquivo direto não pesa, porque ele já sai otimizado do
 * upload (WebP, largura limitada — ver src/lib/admin/upload.ts).
 *
 * O acervo do Figma (/fotos/…) existe no build e continua otimizado.
 */
export default function Imagem({ src, unoptimized, ...props }: ImageProps) {
  const enviadaPeloPainel = typeof src === "string" && src.startsWith("/uploads/");
  return <NextImage src={src} unoptimized={unoptimized ?? enviadaPeloPainel} {...props} />;
}
