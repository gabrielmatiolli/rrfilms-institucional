import type { Metadata } from "next";

import FormularioDeContato from "@/components/admin/FormularioDeContato";
import FormularioDeDepoimentos from "@/components/admin/FormularioDeDepoimentos";
import { CabecalhoDePagina } from "@/components/admin/Ui";
import { exigirAdmin } from "@/lib/admin/sessao";
import { prisma } from "@/lib/prisma";
import { contatoDoSite } from "@/lib/dados/configuracao";

export const metadata: Metadata = { title: "Conteúdo do site" };

export default async function ConteudoAdmin() {
  await exigirAdmin("/admin/conteudo");

  const [depoimentos, contato] = await Promise.all([
    prisma.depoimento.findMany({ orderBy: { ordem: "asc" } }),
    contatoDoSite(),
  ]);

  return (
    <>
      <CabecalhoDePagina
        titulo="Conteúdo do site"
        descricao="Depoimentos de clientes e os dados que aparecem no rodapé e no Contato."
      />

      <FormularioDeDepoimentos
        iniciais={depoimentos.map((d) => ({
          id: d.id,
          citacao: d.citacao,
          nome: d.nome,
          contexto: d.contexto,
          ativo: d.ativo,
          autorizado: d.autorizado,
        }))}
      />

      <FormularioDeContato valores={contato} />
    </>
  );
}
