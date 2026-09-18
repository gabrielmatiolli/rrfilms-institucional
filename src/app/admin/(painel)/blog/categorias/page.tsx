import type { Metadata } from "next";

import FormularioDeCategorias from "@/components/admin/FormularioDeCategorias";
import { CabecalhoDePagina } from "@/components/admin/Ui";
import { exigirAdmin } from "@/lib/admin/sessao";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = { title: "Categorias do blog" };

export default async function CategoriasDoBlog() {
  await exigirAdmin("/admin/blog/categorias");

  const categorias = await prisma.blogCategoria.findMany({
    orderBy: { ordem: "asc" },
    include: { _count: { select: { posts: true } } },
  });

  return (
    <>
      <CabecalhoDePagina
        titulo="Categorias do blog"
        descricao="São os filtros que aparecem acima da lista de artigos."
      />
      <FormularioDeCategorias
        iniciais={categorias.map((c) => ({
          id: c.id,
          rotulo: c.rotulo,
          icone: c.icone,
          ativo: c.ativo,
          posts: c._count.posts,
        }))}
      />
    </>
  );
}
