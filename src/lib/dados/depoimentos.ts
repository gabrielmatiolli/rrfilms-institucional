import { cache } from "react";

import { prisma } from "@/lib/prisma";
import type { Fala } from "@/components/cards/Cartoes";

/**
 * Depoimentos que vão ao ar.
 *
 * `autorizado` é filtro, não enfeite: o componente Depoimento do arquivo de
 * design registra que nome real de cliente só entra no site com autorização
 * por escrito. Sem a marcação no painel, o depoimento não aparece — nem
 * marcado como ativo.
 */
export const listarDepoimentos = cache(async (): Promise<Fala[]> => {
  const depoimentos = await prisma.depoimento.findMany({
    where: { ativo: true, autorizado: true },
    orderBy: { ordem: "asc" },
  });

  return depoimentos.map((depoimento) => ({
    citacao: depoimento.citacao,
    nome: depoimento.nome,
    contexto: depoimento.contexto,
  }));
});
