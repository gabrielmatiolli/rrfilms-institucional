import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import FormularioDePost from "@/components/admin/FormularioDePost";
import { CabecalhoDePagina } from "@/components/admin/Ui";
import { atualizarPost } from "@/app/admin/(painel)/blog/acoes";
import { exigirAdmin } from "@/lib/admin/sessao";
import { prisma } from "@/lib/prisma";
import { lerBlocos } from "@/lib/admin/blocos";
import { dataEHora } from "@/lib/datas";

export const metadata: Metadata = { title: "Editar post" };

export default async function EditarPost({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  await exigirAdmin(`/admin/blog/${id}`);

  const [post, categorias] = await Promise.all([
    prisma.blogPost.findUnique({ where: { id } }),
    prisma.blogCategoria.findMany({
      where: { ativo: true },
      orderBy: { ordem: "asc" },
      select: { id: true, rotulo: true },
    }),
  ]);

  if (!post) notFound();

  // `bind` fixa o id como primeiro argumento: o formulário continua chamando
  // a action com (estadoAnterior, formData).
  const salvar = atualizarPost.bind(null, post.id);

  return (
    <>
      <CabecalhoDePagina
        titulo="Editar post"
        descricao={`Última alteração em ${dataEHora(post.atualizadoEm)}.`}
        acoes={
          post.status === "PUBLICADO" ? (
            <Link
              href={`/blog/${post.slug}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-[44px] items-center rounded-pill border border-borda-media/40 px-5 text-[14px] font-semibold text-texto-forte hover:border-texto-forte"
            >
              Ver no site ↗
            </Link>
          ) : undefined
        }
      />
      <FormularioDePost
        acao={salvar}
        categorias={categorias}
        rotuloDeEnvio="Salvar alterações"
        valores={{
          titulo: post.titulo,
          resumo: post.resumo,
          autor: post.autor,
          capa: post.capa,
          categoriaId: post.categoriaId ?? "",
          status: post.status,
          destaque: post.destaque,
          conteudo: lerBlocos(post.conteudo),
          slug: post.slug,
        }}
      />
    </>
  );
}
