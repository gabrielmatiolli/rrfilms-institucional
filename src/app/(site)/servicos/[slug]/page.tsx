import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CardDeServico } from "@/components/cards/Cartoes";
import { Blocos, SemConteudo } from "@/components/conteudo/Blocos";
import { FaixaDeCta } from "@/components/sections/FaixaDeCta";
import { Breadcrumb, Tag } from "@/components/ui/Elementos";
import { FotoDeUrl } from "@/components/ui/Foto";
import { Secao } from "@/components/ui/Secao";
import { outrosServicos, servicoPorSlug } from "@/lib/dados/servicos";

/**
 * A interna do serviço, criada pelo painel.
 *
 * Só responde para quem está com "tem interna própria" ligado — sem isso o card
 * da grade continua apontando para o destino avulso e esta rota devolve 404, em
 * vez de publicar uma página vazia.
 */

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const servico = await servicoPorSlug(slug);
  if (!servico) return {};

  const semTexto = servico.conteudo.length === 0;
  return {
    title: servico.metaTitulo,
    description: servico.metaDescricao,
    // Interna sem corpo fica fora do índice até ter o quê indexar.
    robots: semTexto ? { index: false, follow: true } : undefined,
    openGraph: {
      title: servico.metaTitulo,
      description: servico.metaDescricao,
      images: servico.foto ? [servico.foto] : undefined,
    },
  };
}

export default async function PaginaDeServico({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const servico = await servicoPorSlug(slug);
  if (!servico) notFound();

  const outros = await outrosServicos(servico.slug);

  return (
    <>
      <Secao fundo="pagina" className="pt-[140px]!">
        <div className="mx-auto flex max-w-[860px] flex-col items-start gap-5">
          <Breadcrumb
            trilha={[
              { rotulo: "Início", href: "/" },
              { rotulo: "Serviços", href: "/servicos" },
              { rotulo: servico.titulo },
            ]}
          />

          <Tag tom={servico.linha}>{servico.tag}</Tag>
          <h1 className="t-h1">{servico.titulo}</h1>
          <p className="t-corpo-g text-texto-corpo">{servico.descricao}</p>

          {servico.dados && servico.dados.length > 0 && (
            <div className="flex flex-wrap gap-8 pt-2">
              {servico.dados.map((dado) => (
                <div key={dado.rotulo} className="flex flex-col gap-[2px]">
                  <p className="t-h3">{dado.valor}</p>
                  <p className="t-micro text-texto-suave">{dado.rotulo}</p>
                </div>
              ))}
            </div>
          )}

          {servico.foto && (
            <FotoDeUrl
              src={servico.foto}
              alt={`Aplicação de ${servico.titulo}`}
              className="mt-4 aspect-[860/460] w-full"
              sizes="(max-width: 768px) 100vw, 860px"
              prioridade
            />
          )}

          <div className="mt-2 w-full">
            {servico.conteudo.length > 0 ? (
              <Blocos blocos={servico.conteudo} />
            ) : (
              <SemConteudo voltar={{ href: "/servicos", rotulo: "Ver todos os serviços" }} />
            )}
          </div>
        </div>
      </Secao>

      {outros.length > 0 && (
        <Secao fundo="sutil">
          <div className="flex flex-col gap-7">
            <p className="t-sobrancelha text-texto-acento">Veja também</p>
            <h2 className="t-h2">Outros serviços</h2>
          </div>
          <div className="rolagem-lateral mt-10 md:grid-cols-2 md:gap-6 lg:grid-cols-3">
            {outros.map((outro) => (
              <CardDeServico key={outro.titulo} servico={outro} />
            ))}
          </div>
        </Secao>
      )}

      <FaixaDeCta />
    </>
  );
}
