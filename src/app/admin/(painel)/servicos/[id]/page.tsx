import type { Metadata } from "next";
import { notFound } from "next/navigation";

import FormularioDeServico from "@/components/admin/FormularioDeServico";
import { CabecalhoDePagina } from "@/components/admin/Ui";
import { atualizarServico } from "@/app/admin/(painel)/servicos/acoes";
import { exigirAdmin } from "@/lib/admin/sessao";
import { prisma } from "@/lib/prisma";
import { dadosDeServico } from "@/lib/dados/servicos";
import { lerBlocos } from "@/lib/admin/blocos";
import { dataEHora } from "@/lib/datas";

export const metadata: Metadata = { title: "Editar serviço" };

export default async function EditarServico({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  await exigirAdmin(`/admin/servicos/${id}`);

  const servico = await prisma.servico.findUnique({ where: { id } });
  if (!servico) notFound();

  const salvar = atualizarServico.bind(null, servico.id);

  return (
    <>
      <CabecalhoDePagina
        titulo="Editar serviço"
        descricao={`Última alteração em ${dataEHora(servico.atualizadoEm)}.`}
      />
      <FormularioDeServico
        acao={salvar}
        rotuloDeEnvio="Salvar alterações"
        valores={{
          titulo: servico.titulo,
          tag: servico.tag,
          descricao: servico.descricao,
          linha: servico.linha,
          foto: servico.foto,
          ativo: servico.ativo,
          dados: dadosDeServico(servico.dados),
          temPaginaPropria: servico.temPaginaPropria,
          href: servico.href,
          metaTitulo: servico.metaTitulo,
          metaDescricao: servico.metaDescricao,
          conteudo: lerBlocos(servico.conteudo),
          slug: servico.slug,
        }}
      />
    </>
  );
}
