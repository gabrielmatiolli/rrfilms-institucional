import type { Metadata } from "next";
import Image from "@/components/ui/Imagem";
import Link from "next/link";

import BotaoDeExcluir from "@/components/admin/BotaoDeExcluir";
import { CabecalhoDePagina, LinkPainel, Selo, Vazio } from "@/components/admin/Ui";
import { alternarPublicacao, excluirPost } from "@/app/admin/(painel)/blog/acoes";
import { exigirAdmin } from "@/lib/admin/sessao";
import { prisma } from "@/lib/prisma";
import { dataCurta } from "@/lib/datas";
import { lerBlocos } from "@/lib/admin/blocos";

export const metadata: Metadata = { title: "Blog" };

export default async function BlogAdmin() {
  await exigirAdmin("/admin/blog");

  const posts = await prisma.blogPost.findMany({
    orderBy: [{ publicadoEm: "desc" }, { criadoEm: "desc" }],
    include: { categoria: { select: { rotulo: true } } },
  });

  return (
    <>
      <CabecalhoDePagina
        titulo="Blog"
        descricao={`${posts.length} ${posts.length === 1 ? "artigo" : "artigos"} no total.`}
        acoes={
          <>
            <LinkPainel href="/admin/blog/categorias" tipo="contorno">
              Categorias
            </LinkPainel>
            <LinkPainel href="/admin/blog/novo">Novo post</LinkPainel>
          </>
        }
      />

      {posts.length === 0 ? (
        <Vazio
          titulo="Nenhum artigo ainda"
          descricao="Crie o primeiro post. Enquanto estiver como rascunho, ele não aparece no site."
          acao={<LinkPainel href="/admin/blog/novo">Novo post</LinkPainel>}
        />
      ) : (
        <ul className="flex flex-col gap-3">
          {posts.map((post) => {
            const vazio = lerBlocos(post.conteudo).length === 0;
            const publicado = post.status === "PUBLICADO";

            return (
              <li
                key={post.id}
                className="flex flex-col gap-4 rounded-2xl border border-borda-sutil bg-fundo-superficie p-4 sm:flex-row sm:items-center sm:gap-5"
              >
                <div className="relative aspect-[16/9] w-full shrink-0 overflow-hidden rounded-xl bg-fundo-sutil sm:aspect-square sm:w-[92px]">
                  {post.capa && (
                    <Image
                      src={post.capa}
                      alt=""
                      fill
                      sizes="(max-width: 640px) 100vw, 92px"
                      className="object-cover"
                    />
                  )}
                </div>

                <div className="flex min-w-0 flex-1 flex-col gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <Selo tom={publicado ? "positivo" : "neutro"}>
                      {publicado ? "Publicado" : "Rascunho"}
                    </Selo>
                    {post.destaque && publicado && <Selo tom="atencao">Destaque</Selo>}
                    {vazio && <Selo tom="erro">Sem conteúdo</Selo>}
                  </div>

                  <Link
                    href={`/admin/blog/${post.id}`}
                    className="font-[family-name:var(--tipo-familia-display)] text-[16.5px] font-bold leading-snug text-texto-forte hover:underline"
                  >
                    {post.titulo}
                  </Link>

                  <p className="text-[12.5px] text-texto-suave">
                    {post.categoria?.rotulo ?? "Sem categoria"} · {post.autor} ·{" "}
                    {post.publicadoEm
                      ? `publicado em ${dataCurta(post.publicadoEm)}`
                      : `criado em ${dataCurta(post.criadoEm)}`}{" "}
                    · {post.minutosLeitura} min
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2 sm:shrink-0 sm:flex-col sm:items-stretch">
                  <Link
                    href={`/admin/blog/${post.id}`}
                    className="inline-flex min-h-[44px] items-center justify-center rounded-pill border border-borda-media/40 px-4 text-[13px] font-semibold text-texto-forte hover:border-texto-forte"
                  >
                    Editar
                  </Link>

                  {/* Publicar exige conteúdo; despublicar é sempre possível. */}
                  {(!vazio || publicado) && (
                    <form action={alternarPublicacao}>
                      <input type="hidden" name="id" value={post.id} />
                      <button
                        type="submit"
                        className="inline-flex min-h-[44px] w-full items-center justify-center rounded-pill px-4 text-[13px] font-semibold text-texto-suave hover:text-texto-forte"
                      >
                        {publicado ? "Despublicar" : "Publicar"}
                      </button>
                    </form>
                  )}

                  <BotaoDeExcluir
                    acao={excluirPost}
                    id={post.id}
                    confirmacao={`Excluir "${post.titulo}"? Essa ação não pode ser desfeita.`}
                  />
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}
