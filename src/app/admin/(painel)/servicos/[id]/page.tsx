import type { Metadata } from "next";
import { notFound } from "next/navigation";

import FormularioDeServico from "@/components/admin/FormularioDeServico";
import { CabecalhoDePagina } from "@/components/admin/Ui";
import { atualizarServico } from "@/app/admin/(painel)/servicos/acoes";
import { exigirAdmin } from "@/lib/admin/sessao";
import { prisma } from "@/lib/prisma";
import { dadosDeServico } from "@/lib/dados/servicos";
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
          href: servico.href,
          ativo: servico.ativo,
          dados: dadosDeServico(servico.dados),
        }}
      />
    </>
  );
}
