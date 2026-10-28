import type { Metadata } from "next";
import Link from "next/link";

import { CardDeBlog } from "@/components/cards/Cartoes";
import { HeroSimples } from "@/components/sections/Heros";
import { Botao, BotaoLink } from "@/components/ui/Botao";
import { ChipDeVidroLink, Paginacao, Tag } from "@/components/ui/Elementos";
import { FotoDeUrl } from "@/components/ui/Foto";
import { Campo } from "@/components/ui/Formulario";
import { icones } from "@/components/ui/Icone";
import { Secao } from "@/components/ui/Secao";
import { listarFiltros, listarPosts, postEmDestaque } from "@/lib/dados/blog";

const metadataBase: Metadata = {
  title: "Blog",
  description:
    "Comparações honestas, sem marketing, e o que ninguém conta antes de vender película para vidro.",
};

/**
 * O destino de um chip. A âncora leva de volta à lista: sem ela a navegação
 * cairia no topo da página e o leitor não veria o resultado do filtro.
 */
function enderecoDoFiltro(slug: string) {
  return slug ? `/blog?categoria=${encodeURIComponent(slug)}#artigos` : "/blog#artigos";
}

/** `/blog?categoria=<slug>` — o chip de filtro acima da lista de artigos. */
export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ categoria?: string }>;
}): Promise<Metadata> {
  const { categoria } = await searchParams;
  if (!categoria) return metadataBase;

  // A listagem filtrada é quase a mesma página: o canônico aponta para /blog
  // para os buscadores não tratarem cada chip como conteúdo duplicado.
  return { ...metadataBase, alternates: { canonical: "/blog" } };
}

export default async function Blog({
  searchParams,
}: {
  searchParams: Promise<{ categoria?: string }>;
}) {
  const [{ categoria: pedida }, filtros] = await Promise.all([
    searchParams,
    listarFiltros(),
  ]);

  // Categoria que não existe mais (link antigo, URL digitada à mão) cai em "Todos".
  const ativa = filtros.find((filtro) => filtro.slug && filtro.slug === pedida)?.slug;

  // Com um filtro ligado a grade mostra a categoria inteira; o bloco grande do
  // topo é da capa do blog, não de uma categoria.
  const [destaque, todos] = await Promise.all([
    ativa ? null : postEmDestaque(),
    listarPosts(ativa),
  ]);

  // O post em destaque já ocupa o bloco grande do topo — não se repete na grade.
  const posts = todos.filter((post) => post.slug !== destaque?.slug);

  return (
    <>
      <HeroSimples
        trilha={[{ rotulo: "Início", href: "/" }, { rotulo: "Blog" }]}
        titulo="O que a gente explica na visita, por escrito"
        lead="Comparações honestas, sem marketing, e o que ninguém conta antes de vender."
        foto="blog-destaque"
        alturaClasse="min-h-[340px] md:min-h-[420px]"
      />

      {/* Post em destaque */}
      {destaque && (
        <Secao fundo="pagina">
          <article className="grid overflow-hidden rounded-2xl border border-vidro-borda bg-vidro-preenchimento vidro-02 lg:grid-cols-2">
            <FotoDeUrl
              src={destaque.capa}
              alt=""
              arredondamento="rounded-none"
              className="aspect-[640/420] lg:aspect-auto lg:h-full"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            <div className="flex flex-col items-start gap-5 p-6 sm:p-14">
              <Tag>{destaque.categoria}</Tag>
              <h2 className="t-h2">
                <Link href={`/blog/${destaque.slug}`}>{destaque.titulo}</Link>
              </h2>
              <p className="t-corpo text-texto-suave">{destaque.resumo}</p>
              <p className="t-micro text-texto-suave">{destaque.meta}</p>
              <BotaoLink href={`/blog/${destaque.slug}`} tamanho="M" tipo="secundaria">
                Ler o artigo
              </BotaoLink>
            </div>
          </article>
        </Secao>
      )}

      {/* Artigos */}
      <Secao fundo="pagina" id="artigos">
        {filtros.length > 1 && (
          <div className="linha-de-chips">
            {filtros.map((filtro) => {
              const Icone = icones[filtro.icone];
              return (
                <ChipDeVidroLink
                  key={filtro.slug || "todos"}
                  href={enderecoDoFiltro(filtro.slug)}
                  ativo={filtro.slug === (ativa ?? "")}
                >
                  <span className="mr-2 inline-flex">
                    <Icone tamanho={18} />
                  </span>
                  {filtro.rotulo}
                </ChipDeVidroLink>
              );
            })}
          </div>
        )}

        {posts.length > 0 ? (
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <CardDeBlog key={post.slug} post={post} />
            ))}
          </div>
        ) : ativa ? (
          <p className="mt-10 t-corpo text-texto-suave">
            Ainda não há artigo nesta categoria.{" "}
            <Link href={enderecoDoFiltro("")} className="underline">
              Ver todos os artigos
            </Link>
            .
          </p>
        ) : (
          <p className="mt-10 t-corpo text-texto-suave">
            {destaque
              ? "Por enquanto só temos o artigo acima. Em breve tem mais."
              : "Os primeiros artigos estão sendo escritos. Enquanto isso, a gente explica tudo isso na visita."}
          </p>
        )}

        {/* A paginação entra quando a listagem passar de uma página. */}
        {posts.length > 9 && (
          <div className="mt-14">
            <Paginacao pagina={1} total={Math.ceil(posts.length / 9)} />
          </div>
        )}
      </Secao>

      {/* Newsletter */}
      <Secao fundo="pagina">
        <div className="relative isolate grid items-center gap-8 overflow-hidden rounded-2xl bg-fundo-inverso p-6 sm:p-14 lg:grid-cols-2">
          {/* Lâminas de vidro inclinadas, ancoradas pela direita */}
          <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
            {[
              { celular: "70px", desktop: "160px", alfa: 0.16 },
              { celular: "0px", desktop: "40px", alfa: 0.26 },
              { celular: "-70px", desktop: "-80px", alfa: 0.36 },
            ].map(({ celular, desktop, alfa }) => (
              <span
                key={desktop}
                className="absolute bottom-[-60px] right-(--celular) block h-[240px] w-[80px] rounded-[14px] border border-white/16 lg:bottom-auto lg:right-(--desktop) lg:top-[-70px] lg:h-[383px] lg:w-[140px] lg:rounded-[18px]"
                style={
                  {
                    "--celular": celular,
                    "--desktop": desktop,
                    transform: "rotate(14deg)",
                    background: `rgba(250, 169, 126, ${alfa})`,
                  } as React.CSSProperties
                }
              />
            ))}
          </div>

          <div className="flex flex-col gap-3 text-texto-inverso">
            <h2 className="t-h4 text-texto-inverso">
              Um e-mail por mês, sem propaganda
            </h2>
            <p className="t-corpo-p opacity-70">
              Um artigo técnico e um caso real de aplicação. Você cancela em um clique.
            </p>
          </div>

          <form className="flex flex-col items-start gap-4 sm:flex-row sm:items-end">
            <div className="w-full sm:flex-1 [&_label]:text-texto-inverso">
              <Campo
                id="newsletter"
                rotulo="E-mail"
                type="email"
                placeholder="voce@email.com.br"
                autoComplete="email"
                required
              />
            </div>
            <Botao type="submit" tipo="secundaria" className="w-full shrink-0 sm:w-auto">
              Assinar
            </Botao>
          </form>
        </div>
      </Secao>
    </>
  );
}
