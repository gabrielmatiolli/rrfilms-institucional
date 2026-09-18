import type { Metadata } from "next";
import { notFound } from "next/navigation";

import FormularioDeGaleria from "@/components/admin/FormularioDeGaleria";
import { CabecalhoDePagina } from "@/components/admin/Ui";
import { exigirAdmin } from "@/lib/admin/sessao";
import { prisma } from "@/lib/prisma";
import { CHAVES_DE_GALERIA } from "@/lib/dados/galerias";

export const metadata: Metadata = { title: "Editar galeria" };

export default async function EditarGaleria({
  params,
}: {
  params: Promise<{ chave: string }>;
}) {
  const { chave } = await params;
  await exigirAdmin(`/admin/galerias/${chave}`);

  const conhecida = CHAVES_DE_GALERIA.find((g) => g.chave === chave);
  if (!conhecida) notFound();

  const galeria = await prisma.galeria.findUnique({
    where: { chave },
    include: { itens: { orderBy: { ordem: "asc" } } },
  });

  return (
    <>
      <CabecalhoDePagina
        titulo={`Galeria · ${conhecida.nome}`}
        descricao="Toda foto do site é de obra aplicada pela equipe — nada de banco de imagem."
      />
      <FormularioDeGaleria
        chave={chave}
        valores={{
          sobrancelha: galeria?.sobrancelha ?? "",
          titulo: galeria?.titulo ?? "",
          lead: galeria?.lead ?? "",
          itens:
            galeria?.itens.map((item) => ({
              id: item.id,
              imagem: item.imagem,
              alt: item.alt,
            })) ?? [],
        }}
      />
    </>
  );
}
