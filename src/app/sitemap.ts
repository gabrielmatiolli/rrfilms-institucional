import type { MetadataRoute } from "next";

import { site } from "@/lib/site";
import { slugsPublicados } from "@/lib/dados/blog";
import { produtosComPagina } from "@/lib/dados/produtos";
import { servicosComPagina } from "@/lib/dados/servicos";

/**
 * As páginas fixas mais o que o painel publicou: artigos com status PUBLICADO,
 * serviços com interna própria e linhas com página própria. Artigo sem corpo
 * continua fora do índice — quem decide isso é o `robots` da própria página.
 *
 * Dinâmico pelo mesmo motivo do layout de `(site)`: pré-renderizado no build,
 * o sitemap congelaria na lista de artigos que existia naquele dia.
 */
export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const fixas: { caminho: string; prioridade: number }[] = [
    { caminho: "", prioridade: 1 },
    { caminho: "/servicos", prioridade: 0.9 },
    { caminho: "/produtos/nanoceramica-ultra-hd", prioridade: 0.9 },
    { caminho: "/para-casas", prioridade: 0.9 },
    { caminho: "/para-empresas", prioridade: 0.9 },
    { caminho: "/contato", prioridade: 0.8 },
    { caminho: "/a-marca", prioridade: 0.6 },
    { caminho: "/blog", prioridade: 0.6 },
    { caminho: "/politica-de-privacidade", prioridade: 0.2 },
    { caminho: "/politica-de-cookies", prioridade: 0.2 },
  ];

  // O sitemap não pode derrubar a resposta se o banco estiver fora do ar.
  const [posts, produtos, servicos] = await Promise.all([
    slugsPublicados().catch(() => []),
    produtosComPagina().catch(() => []),
    servicosComPagina().catch(() => []),
  ]);

  return [
    ...fixas.map(({ caminho, prioridade }) => ({
      url: `${site.url}${caminho}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: prioridade,
    })),
    ...servicos.map((servico) => ({
      url: `${site.url}/servicos/${servico.slug}`,
      lastModified: servico.atualizadoEm,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...produtos.map((produto) => ({
      url: `${site.url}/produtos/${produto.slug}`,
      lastModified: produto.atualizadoEm,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...posts.map((post) => ({
      url: `${site.url}/blog/${post.slug}`,
      lastModified: post.atualizadoEm,
      changeFrequency: "monthly" as const,
      priority: 0.5,
    })),
  ];
}
