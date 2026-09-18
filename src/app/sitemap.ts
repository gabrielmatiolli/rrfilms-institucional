import type { MetadataRoute } from "next";

import { site } from "@/lib/site";
import { slugsPublicados } from "@/lib/dados/blog";
import { produtosComPagina } from "@/lib/dados/produtos";

/**
 * As páginas fixas mais o que o painel publicou: artigos com status PUBLICADO e
 * linhas com página própria. Artigo sem corpo continua fora do índice — quem
 * decide isso é o `robots` da própria página.
 */
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
  ];

  // O sitemap não pode derrubar a resposta se o banco estiver fora do ar.
  const [posts, produtos] = await Promise.all([
    slugsPublicados().catch(() => []),
    produtosComPagina().catch(() => []),
  ]);

  return [
    ...fixas.map(({ caminho, prioridade }) => ({
      url: `${site.url}${caminho}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: prioridade,
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
