import type { Metadata } from "next";
import Image from "@/components/ui/Imagem";
import Link from "next/link";

import { CabecalhoDePagina, Selo } from "@/components/admin/Ui";
import { exigirAdmin } from "@/lib/admin/sessao";
import { prisma } from "@/lib/prisma";
import { CHAVES_DE_GALERIA } from "@/lib/dados/galerias";

export const metadata: Metadata = { title: "Galerias" };

export default async function GaleriasAdmin() {
  await exigirAdmin("/admin/galerias");

  const galerias = await prisma.galeria.findMany({
    include: { itens: { orderBy: { ordem: "asc" }, take: 4 }, _count: { select: { itens: true } } },
  });
  const porChave = new Map(galerias.map((g) => [g.chave, g]));

  return (
    <>
      <CabecalhoDePagina
        titulo="Galerias"
        descricao="Uma galeria de obra por página do site. Cada uma tem seu cabeçalho e suas fotos."
      />

      <ul className="grid gap-3 sm:grid-cols-2">
        {CHAVES_DE_GALERIA.map(({ chave, nome }) => {
          const galeria = porChave.get(chave);
          const total = galeria?._count.itens ?? 0;

          return (
            <li key={chave}>
              <Link
                href={`/admin/galerias/${chave}`}
                className="flex h-full flex-col gap-3 rounded-2xl border border-borda-sutil bg-fundo-superficie p-4 transition-colors hover:border-texto-forte"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 flex-col gap-1">
                    <p className="font-[family-name:var(--tipo-familia-display)] text-[16px] font-bold text-texto-forte">
                      {nome}
                    </p>
                    <p className="line-clamp-1 text-[12.5px] text-texto-suave">
                      {galeria?.titulo || "Ainda não configurada"}
                    </p>
                  </div>
                  <Selo tom={total === 0 ? "erro" : total < 6 ? "atencao" : "positivo"}>
                    {total === 0 ? "Vazia" : `${total} foto${total > 1 ? "s" : ""}`}
                  </Selo>
                </div>

                {total > 0 && (
                  <div className="grid grid-cols-4 gap-1.5">
                    {galeria?.itens.map((item) => (
                      <div
                        key={item.id}
                        className="relative aspect-square overflow-hidden rounded-lg bg-fundo-sutil"
                      >
                        <Image
                          src={item.imagem}
                          alt=""
                          fill
                          sizes="80px"
                          className="object-cover"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </>
  );
}
