import { cache } from "react";

import { prisma } from "@/lib/prisma";
import type { ServicoDeCard, LinhaDeCard } from "@/components/cards/Cartoes";
import type { DadoDeBloco } from "@/lib/admin/blocos";
import { caminhoOuVazio } from "@/lib/imagens";

/** O enum do banco é maiúsculo; o design system usa minúsculo. */
const LINHA: Record<"CONFORTO" | "LUZ" | "FRESCOR", LinhaDeCard> = {
  CONFORTO: "conforto",
  LUZ: "luz",
  FRESCOR: "frescor",
};

/** Lê a coluna Json `dados` descartando o que não for par valor/legenda. */
export function dadosDeServico(bruto: unknown): DadoDeBloco[] {
  if (!Array.isArray(bruto)) return [];
  return bruto.filter(
    (item): item is DadoDeBloco =>
      typeof item === "object" &&
      item !== null &&
      typeof (item as DadoDeBloco).valor === "string" &&
      typeof (item as DadoDeBloco).rotulo === "string",
  );
}

/** Serviços ativos, na ordem definida no painel. */
export const listarServicos = cache(async (): Promise<ServicoDeCard[]> => {
  const servicos = await prisma.servico.findMany({
    where: { ativo: true },
    orderBy: { ordem: "asc" },
  });

  return servicos.map((servico) => ({
    linha: LINHA[servico.linha],
    tag: servico.tag,
    titulo: servico.titulo,
    descricao: servico.descricao,
    foto: caminhoOuVazio(servico.foto),
    dados: dadosDeServico(servico.dados),
    href: servico.href,
  }));
});
