import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CardDeBlog } from "@/components/cards/Cartoes";
import { Blocos, SemConteudo } from "@/components/conteudo/Blocos";
import { FaixaDeCta } from "@/components/sections/FaixaDeCta";
import { Breadcrumb, Tag } from "@/components/ui/Elementos";
import { FotoDeUrl } from "@/components/ui/Foto";
import { Secao } from "@/components/ui/Secao";
import { postPorSlug, postsRelacionados } from "@/lib/dados/blog";

/**
 * Página de artigo.
 *
 * O corpo é montado no painel, bloco a bloco, e desenhado aqui pelos padrões do
 * design system. Enquanto o artigo não tem blocos, entra a casca de "texto em
 * produção" — nenhum CTA do design cai em 404.
 */

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await postPorSlug(slug);
  if (!post) return {};

  const semTexto = post.conteudo.length === 0;
  return {
    title: post.titulo,
    description: post.resumo,
    // Artigo sem corpo fica fora do índice até ter o quê indexar.
    robots: semTexto ? { index: false, follow: true } : undefined,
    openGraph: {
      type: "article",
      title: post.titulo,
      description: post.resumo,
      publishedTime: post.publicadoEm.toISOString(),
      authors: [post.autor],
      images: post.capa ? [post.capa] : undefined,
    },
  };
}

export default async function Artigo({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await postPorSlug(slug);
  if (!post) notFound();

  const relacionados = await postsRelacionados(post.slug);

  return (
    <>
      <Secao fundo="pagina" className="pt-[140px]!">
        <article className="mx-auto flex max-w-[760px] flex-col items-start gap-5">
          <Breadcrumb
            trilha={[
              { rotulo: "Início", href: "/" },
              { rotulo: "Blog", href: "/blog" },
              { rotulo: post.categoria },
            ]}
          />
          <Tag>{post.categoria}</Tag>
          <h1 className="t-h1">{post.titulo}</h1>
          <p className="t-micro text-texto-suave">
            {post.meta} · por {post.autor}
          </p>

          <FotoDeUrl
            src={post.capa}
            alt=""
            className="mt-4 aspect-[760/420] w-full"
            sizes="(max-width: 768px) 100vw, 760px"
            prioridade
          />

          <p className="t-corpo-g text-texto-corpo">{post.resumo}</p>

          <div className="mt-2 w-full">
            {post.conteudo.length > 0 ? (
              <Blocos blocos={post.conteudo} />
            ) : (
              <SemConteudo />
            )}
          </div>
        </article>
      </Secao>

      {relacionados.length > 0 && (
        <Secao fundo="sutil">
          <div className="flex flex-col gap-7">
            <p className="t-sobrancelha text-texto-acento">Continue lendo</p>
            <h2 className="t-h2">Outros artigos</h2>
          </div>
          <div className="rolagem-lateral mt-10 md:grid-cols-2 md:gap-6 lg:grid-cols-3">
            {relacionados.map((outro) => (
              <CardDeBlog key={outro.slug} post={outro} />
            ))}
          </div>
        </Secao>
      )}

      <FaixaDeCta />
    </>
  );
}
