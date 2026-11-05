import { LinkComSeta } from "@/components/ui/Elementos";

/**
 * O link "Leia: <título do artigo> →" das páginas de produto.
 *
 * Fecha o circuito que a revisão de copy apontou: o blog explicava o assunto e
 * as páginas de produto não levavam até ele.
 */
export function LinkDeArtigo({
  slug,
  titulo,
}: {
  slug: string;
  titulo: string;
}) {
  return (
    <p className="t-corpo text-texto-suave">
      <LinkComSeta href={`/blog/${slug}`}>Leia: {titulo}</LinkComSeta>
    </p>
  );
}
