import type { Esquema } from "@/lib/schema";

/**
 * Desenha os dados estruturados da página como `<script type="application/ld+json">`.
 *
 * O "<" vira `<` na serialização: é a recomendação do próprio Next para
 * JSON-LD, porque `JSON.stringify` não escapa tag de HTML e o conteúdo pode vir
 * do banco (nome de depoimento, título de artigo).
 */
export function DadosEstruturados({ dados }: { dados: Esquema | Esquema[] }) {
  const lista = Array.isArray(dados) ? dados : [dados];

  return (
    <>
      {lista.map((esquema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(esquema).replace(/</g, "\\u003c"),
          }}
        />
      ))}
    </>
  );
}
