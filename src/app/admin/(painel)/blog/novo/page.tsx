import type { Metadata } from "next";

import FormularioDePost from "@/components/admin/FormularioDePost";
import { CabecalhoDePagina } from "@/components/admin/Ui";
import { criarPost } from "@/app/admin/(painel)/blog/acoes";
import { exigirAdmin } from "@/lib/admin/sessao";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = { title: "Novo post" };

export default async function NovoPost() {
  const admin = await exigirAdmin("/admin/blog/novo");

  const categorias = await prisma.blogCategoria.findMany({
    where: { ativo: true },
    orderBy: { ordem: "asc" },
    select: { id: true, rotulo: true },
  });

  return (
    <>
      <CabecalhoDePagina
        titulo="Novo post"
        descricao="Enquanto estiver como rascunho, nada disso aparece no site."
      />
      <FormularioDePost
        acao={criarPost}
        categorias={categorias}
        rotuloDeEnvio="Salvar post"
        valores={{
          titulo: "",
          resumo: "",
          autor: admin.nome,
          capa: "",
          categoriaId: "",
          status: "RASCUNHO",
          destaque: false,
          conteudo: [],
        }}
      />
    </>
  );
}
