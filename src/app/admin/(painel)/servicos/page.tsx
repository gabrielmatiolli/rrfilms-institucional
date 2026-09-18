import type { Metadata } from "next";
import Image from "@/components/ui/Imagem";
import Link from "next/link";

import BotaoDeExcluir from "@/components/admin/BotaoDeExcluir";
import ControlesDeOrdem from "@/components/admin/ControlesDeOrdem";
import { CabecalhoDePagina, LinkPainel, Selo, Vazio } from "@/components/admin/Ui";
import { excluirServico, moverServico } from "@/app/admin/(painel)/servicos/acoes";
import { exigirAdmin } from "@/lib/admin/sessao";
import { prisma } from "@/lib/prisma";
import { dadosDeServico } from "@/lib/dados/servicos";

export const metadata: Metadata = { title: "Serviços" };

const NOME_DA_LINHA = {
  CONFORTO: "Conforto",
  LUZ: "Luz",
  FRESCOR: "Frescor",
} as const;

export default async function ServicosAdmin() {
  await exigirAdmin("/admin/servicos");

  const servicos = await prisma.servico.findMany({ orderBy: { ordem: "asc" } });

  return (
    <>
      <CabecalhoDePagina
        titulo="Serviços"
        descricao="A grade de cards da página de Serviços. A ordem daqui é a ordem no site."
        acoes={<LinkPainel href="/admin/servicos/novo">Novo serviço</LinkPainel>}
      />

      {servicos.length === 0 ? (
        <Vazio
          titulo="Nenhum serviço cadastrado"
          descricao="Cadastre os serviços que aparecem na grade da página de Serviços."
          acao={<LinkPainel href="/admin/servicos/novo">Novo serviço</LinkPainel>}
        />
      ) : (
        <ul className="flex flex-col gap-3">
          {servicos.map((servico, indice) => (
            <li
              key={servico.id}
              className="flex flex-col gap-4 rounded-2xl border border-borda-sutil bg-fundo-superficie p-4 sm:flex-row sm:items-center sm:gap-5"
            >
              <div className="relative aspect-[16/9] w-full shrink-0 overflow-hidden rounded-xl bg-fundo-sutil sm:aspect-square sm:w-[92px]">
                {servico.foto && (
                  <Image
                    src={servico.foto}
                    alt=""
                    fill
                    sizes="(max-width: 640px) 100vw, 92px"
                    className="object-cover"
                  />
                )}
              </div>

              <div className="flex min-w-0 flex-1 flex-col gap-2">
                <div className="flex flex-wrap items-center gap-2">
                  <Selo tom={servico.ativo ? "positivo" : "neutro"}>
                    {servico.ativo ? "No site" : "Oculto"}
                  </Selo>
                  <Selo>{NOME_DA_LINHA[servico.linha]}</Selo>
                </div>

                <Link
                  href={`/admin/servicos/${servico.id}`}
                  className="font-[family-name:var(--tipo-familia-display)] text-[16.5px] font-bold leading-snug text-texto-forte hover:underline"
                >
                  {servico.titulo}
                </Link>

                <p className="line-clamp-2 text-[12.5px] text-texto-suave">{servico.descricao}</p>

                <p className="text-[12px] text-texto-suave">
                  {dadosDeServico(servico.dados)
                    .map((d) => `${d.valor} ${d.rotulo}`)
                    .join(" · ") || "Sem números"}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2 sm:shrink-0 sm:flex-col sm:items-stretch">
                <ControlesDeOrdem
                  acao={moverServico}
                  id={servico.id}
                  primeiro={indice === 0}
                  ultimo={indice === servicos.length - 1}
                  nome={servico.titulo}
                />
                <Link
                  href={`/admin/servicos/${servico.id}`}
                  className="inline-flex min-h-[44px] items-center justify-center rounded-pill border border-borda-media/40 px-4 text-[13px] font-semibold text-texto-forte hover:border-texto-forte"
                >
                  Editar
                </Link>
                <BotaoDeExcluir
                  acao={excluirServico}
                  id={servico.id}
                  confirmacao={`Excluir "${servico.titulo}"? Essa ação não pode ser desfeita.`}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
