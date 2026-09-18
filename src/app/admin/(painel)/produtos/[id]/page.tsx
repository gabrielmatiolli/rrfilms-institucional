import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import FormularioDeProduto from "@/components/admin/FormularioDeProduto";
import { CabecalhoDePagina } from "@/components/admin/Ui";
import { atualizarProduto } from "@/app/admin/(painel)/produtos/acoes";
import { exigirAdmin } from "@/lib/admin/sessao";
import { prisma } from "@/lib/prisma";
import { lerBlocos } from "@/lib/admin/blocos";
import { dataEHora } from "@/lib/datas";

export const metadata: Metadata = { title: "Editar linha" };

export default async function EditarProduto({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  await exigirAdmin(`/admin/produtos/${id}`);

  const produto = await prisma.produto.findUnique({ where: { id } });
  if (!produto) notFound();

  const salvar = atualizarProduto.bind(null, produto.id);

  return (
    <>
      <CabecalhoDePagina
        titulo="Editar linha"
        descricao={`Última alteração em ${dataEHora(produto.atualizadoEm)}.`}
        acoes={
          produto.ativo && produto.temPaginaPropria ? (
            <Link
              href={`/produtos/${produto.slug}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-[44px] items-center rounded-pill border border-borda-media/40 px-5 text-[14px] font-semibold text-texto-forte hover:border-texto-forte"
            >
              Ver no site ↗
            </Link>
          ) : undefined
        }
      />
      <FormularioDeProduto
        acao={salvar}
        rotuloDeEnvio="Salvar alterações"
        valores={{
          nome: produto.nome,
          destaque: produto.destaque,
          promessa: produto.promessa,
          descricao: produto.descricao,
          foto: produto.foto,
          ativo: produto.ativo,
          temPaginaPropria: produto.temPaginaPropria,
          hrefExterno: produto.hrefExterno,
          metaTitulo: produto.metaTitulo,
          metaDescricao: produto.metaDescricao,
          conteudo: lerBlocos(produto.conteudo),
          slug: produto.slug,
        }}
      />
    </>
  );
}
