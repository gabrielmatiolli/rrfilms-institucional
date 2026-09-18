"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { exigirAdmin } from "@/lib/admin/sessao";
import { registrarAtividade } from "@/lib/admin/atividade";
import { gerarSlug } from "@/lib/admin/slug";
import { icones } from "@/components/ui/Icone";

export interface EstadoDasCategorias {
  erro?: string;
  ok?: boolean;
}

const NOMES_DE_ICONE = Object.keys(icones) as [string, ...string[]];

const esquema = z.array(
  z.object({
    // Vazio = categoria nova, ainda sem registro no banco.
    id: z.string(),
    rotulo: z.string().trim().min(1, "Toda categoria precisa de um nome."),
    icone: z.enum(NOMES_DE_ICONE),
    ativo: z.boolean(),
  }),
);

/**
 * Salva a lista inteira de uma vez: o que sumiu do formulário é excluído, o que
 * tem id é atualizado e o resto é criado. Evita uma action por linha e deixa a
 * ordem da tela ser a ordem gravada.
 */
export async function salvarCategorias(
  _anterior: EstadoDasCategorias,
  formulario: FormData,
): Promise<EstadoDasCategorias> {
  const admin = await exigirAdmin();

  let bruto: unknown;
  try {
    bruto = JSON.parse(String(formulario.get("categorias") ?? "[]"));
  } catch {
    return { erro: "Não foi possível ler a lista." };
  }

  const analise = esquema.safeParse(bruto);
  if (!analise.success) {
    return { erro: analise.error.issues[0]?.message ?? "Dados inválidos." };
  }
  const categorias = analise.data;

  const idsMantidos = categorias.map((c) => c.id).filter(Boolean);

  // Posts da categoria removida ficam sem categoria (onDelete: SetNull).
  await prisma.blogCategoria.deleteMany({
    where: idsMantidos.length > 0 ? { id: { notIn: idsMantidos } } : {},
  });

  const slugsUsados = new Set<string>();
  for (const [ordem, categoria] of categorias.entries()) {
    // Duas categorias com o mesmo nome gerariam o mesmo slug e violariam o
    // índice único — desempata com sufixo.
    const base = gerarSlug(categoria.rotulo) || `categoria-${ordem + 1}`;
    let slug = base;
    let sufixo = 2;
    while (slugsUsados.has(slug)) slug = `${base}-${sufixo++}`;
    slugsUsados.add(slug);

    const campos = {
      slug,
      rotulo: categoria.rotulo,
      icone: categoria.icone,
      ordem,
      ativo: categoria.ativo,
    };

    if (categoria.id) {
      await prisma.blogCategoria.update({ where: { id: categoria.id }, data: campos });
    } else {
      await prisma.blogCategoria.create({ data: campos });
    }
  }

  await registrarAtividade("Atualizou as categorias do blog", admin.nome);

  revalidatePath("/blog");
  // Os cards de post da Home mostram o nome da categoria.
  revalidatePath("/");
  revalidatePath("/admin/blog/categorias");
  return { ok: true };
}
