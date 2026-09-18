import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Blocos, SemConteudo } from "@/components/conteudo/Blocos";
import { FaixaDeCta } from "@/components/sections/FaixaDeCta";
import { Breadcrumb } from "@/components/ui/Elementos";
import { FotoDeUrl } from "@/components/ui/Foto";
import { Secao } from "@/components/ui/Secao";
import { produtoPorSlug } from "@/lib/dados/produtos";

/**
 * Página de linha criada pelo painel.
 *
 * A Nanocerâmica Ultra HD tem rota própria e desenhada à mão
 * (/produtos/nanoceramica-ultra-hd) — o Next resolve a rota estática antes
 * desta, então ela continua com o layout do Figma. As linhas cadastradas
 * depois caem aqui, com o corpo montado no editor de blocos.
 */

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const produto = await produtoPorSlug(slug);
  if (!produto) return {};

  return {
    title: produto.metaTitulo,
    description: produto.metaDescricao,
    openGraph: {
      title: produto.metaTitulo,
      description: produto.metaDescricao,
      images: produto.foto ? [produto.foto] : undefined,
    },
  };
}

export default async function PaginaDeProduto({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const produto = await produtoPorSlug(slug);
  if (!produto) notFound();

  return (
    <>
      <Secao fundo="pagina" className="pt-[140px]!">
        <div className="mx-auto flex max-w-[860px] flex-col items-start gap-5">
          <Breadcrumb
            trilha={[
              { rotulo: "Início", href: "/" },
              { rotulo: "Serviços", href: "/servicos" },
              { rotulo: `${produto.nome} ${produto.destaque}` },
            ]}
          />

          <h1 className="t-h1">
            <span className="block">{produto.nome}</span>
            <span className="block text-texto-acento">{produto.destaque}</span>
          </h1>

          <p className="t-h4 text-texto-forte">{produto.promessa}</p>
          <p className="t-corpo-g text-texto-corpo">{produto.descricao}</p>

          {produto.foto && (
            <FotoDeUrl
              src={produto.foto}
              alt={`Aplicação da linha ${produto.nome} ${produto.destaque}`}
              className="mt-4 aspect-[860/460] w-full"
              sizes="(max-width: 768px) 100vw, 860px"
              prioridade
            />
          )}

          <div className="mt-2 w-full">
            {produto.conteudo.length > 0 ? (
              <Blocos blocos={produto.conteudo} />
            ) : (
              <SemConteudo />
            )}
          </div>
        </div>
      </Secao>

      <FaixaDeCta />
    </>
  );
}
