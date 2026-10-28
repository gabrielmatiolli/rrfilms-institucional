import type { Metadata } from "next";
import Link from "next/link";

import BotaoDeExcluir from "@/components/admin/BotaoDeExcluir";
import { CabecalhoDePagina, Selo, Vazio } from "@/components/admin/Ui";
import { alterarStatusDoPedido, excluirPedido } from "@/app/admin/(painel)/pedidos/acoes";
import { exigirAdmin } from "@/lib/admin/sessao";
import { prisma } from "@/lib/prisma";
import { dataEHora, tempoRelativo } from "@/lib/datas";
import { formatarTelefone, linkDoWhatsapp } from "@/lib/pedidos/esquema";
import { cn } from "@/lib/utils";
import type { StatusDoPedido } from "@/generated/prisma/client";

export const metadata: Metadata = { title: "Pedidos" };

const STATUS: { valor: StatusDoPedido; rotulo: string; tom: "atencao" | "neutro" | "positivo" | "erro" }[] = [
  { valor: "NOVO", rotulo: "Novo", tom: "atencao" },
  { valor: "EM_ATENDIMENTO", rotulo: "Em atendimento", tom: "neutro" },
  { valor: "FECHADO", rotulo: "Fechado", tom: "positivo" },
  { valor: "DESCARTADO", rotulo: "Descartado", tom: "erro" },
];

const ORIGEM = { CONTATO: "Contato", EMPRESAS: "Para empresas" } as const;
const DETALHE = { CONTATO: "Imóvel", EMPRESAS: "Metragem" } as const;

/** Quantos pedidos a lista mostra por vez — os mais recentes primeiro. */
const LIMITE = 100;

export default async function PedidosAdmin({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  await exigirAdmin("/admin/pedidos");

  const { status: filtroBruto } = await searchParams;
  const filtro = STATUS.find((s) => s.valor === filtroBruto)?.valor;

  const [pedidos, contagem] = await Promise.all([
    prisma.pedidoDeOrcamento.findMany({
      where: filtro ? { status: filtro } : undefined,
      orderBy: { criadoEm: "desc" },
      take: LIMITE,
    }),
    prisma.pedidoDeOrcamento.groupBy({ by: ["status"], _count: { _all: true } }),
  ]);

  const total = (valor?: StatusDoPedido) =>
    contagem
      .filter((linha) => !valor || linha.status === valor)
      .reduce((soma, linha) => soma + linha._count._all, 0);

  const abas = [{ valor: undefined, rotulo: "Todos" }, ...STATUS];

  return (
    <>
      <CabecalhoDePagina
        titulo="Pedidos de orçamento"
        descricao="O que chegou pelos formulários de /contato e /para-empresas. Mude o status conforme o atendimento anda."
      />

      <nav aria-label="Filtrar por status" className="-mt-2 flex flex-wrap gap-2">
        {abas.map((aba) => {
          const ativo = aba.valor === filtro;
          return (
            <Link
              key={aba.rotulo}
              href={aba.valor ? `/admin/pedidos?status=${aba.valor}` : "/admin/pedidos"}
              aria-current={ativo ? "page" : undefined}
              className={cn(
                "inline-flex min-h-[40px] items-center gap-2 rounded-pill border px-4 text-[13px] font-semibold transition-colors",
                ativo
                  ? "border-texto-forte bg-acao-primaria text-acao-sobre-primaria"
                  : "border-borda-media/40 bg-fundo-superficie text-texto-forte hover:border-texto-forte",
              )}
            >
              {aba.rotulo}
              <span className={cn("text-[12px]", ativo ? "opacity-70" : "text-texto-suave")}>
                {total(aba.valor)}
              </span>
            </Link>
          );
        })}
      </nav>

      {pedidos.length === 0 ? (
        <Vazio
          titulo={filtro ? "Nenhum pedido com esse status" : "Nenhum pedido ainda"}
          descricao="Os pedidos enviados pelos formulários do site aparecem aqui, e a equipe também recebe um aviso por e-mail."
        />
      ) : (
        <ul className="flex flex-col gap-3">
          {pedidos.map((pedido) => {
            const status = STATUS.find((s) => s.valor === pedido.status) ?? STATUS[0];
            return (
              <li
                key={pedido.id}
                className="flex flex-col gap-4 rounded-2xl border border-borda-sutil bg-fundo-superficie p-4 sm:p-5"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex min-w-0 flex-col gap-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <Selo tom={status.tom}>{status.rotulo}</Selo>
                      <Selo>{ORIGEM[pedido.origem]}</Selo>
                      {!pedido.emailEnviado && <Selo tom="neutro">Sem aviso por e-mail</Selo>}
                    </div>
                    <p className="font-[family-name:var(--tipo-familia-display)] text-[17px] font-bold leading-snug text-texto-forte">
                      {pedido.nome}
                    </p>
                    <p className="text-[12px] text-texto-suave">
                      {tempoRelativo(pedido.criadoEm)} · {dataEHora(pedido.criadoEm)}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2 sm:shrink-0">
                    <a
                      href={linkDoWhatsapp(pedido.whatsapp)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-[44px] items-center rounded-pill bg-frescor-500 px-4 text-[13px] font-semibold text-escuro-900 hover:bg-[#b6d494]"
                    >
                      WhatsApp {formatarTelefone(pedido.whatsapp)}
                    </a>
                    <a
                      href={`mailto:${pedido.email}`}
                      className="inline-flex min-h-[44px] items-center rounded-pill border border-borda-media/40 px-4 text-[13px] font-semibold text-texto-forte hover:border-texto-forte"
                    >
                      {pedido.email}
                    </a>
                  </div>
                </div>

                <dl className="grid gap-x-6 gap-y-2 text-[13px] sm:grid-cols-[auto_1fr]">
                  <dt className="text-texto-suave">{DETALHE[pedido.origem]}</dt>
                  <dd className="text-texto-corpo">{pedido.detalhe ?? "Não informado"}</dd>
                  <dt className="text-texto-suave">Orçamento por WhatsApp</dt>
                  <dd className="text-texto-corpo">{pedido.aceitaWhatsapp ? "Aceita" : "Não aceita"}</dd>
                  {pedido.mensagem && (
                    <>
                      <dt className="text-texto-suave">Sobre o vidro</dt>
                      <dd className="whitespace-pre-wrap text-texto-corpo">{pedido.mensagem}</dd>
                    </>
                  )}
                </dl>

                <div className="flex flex-wrap items-center justify-between gap-2 border-t border-borda-sutil pt-3">
                  <form action={alterarStatusDoPedido} className="flex flex-wrap items-center gap-2">
                    <input type="hidden" name="id" value={pedido.id} />
                    <label htmlFor={`status-${pedido.id}`} className="text-[13px] text-texto-suave">
                      Status
                    </label>
                    <select
                      id={`status-${pedido.id}`}
                      name="status"
                      defaultValue={pedido.status}
                      className="min-h-[44px] rounded-xl border border-borda-media/40 bg-fundo-superficie px-3 text-[13.5px] text-texto-forte"
                    >
                      {STATUS.map((s) => (
                        <option key={s.valor} value={s.valor}>
                          {s.rotulo}
                        </option>
                      ))}
                    </select>
                    <button
                      type="submit"
                      className="inline-flex min-h-[44px] items-center rounded-pill border border-borda-media/40 px-4 text-[13px] font-semibold text-texto-forte hover:border-texto-forte"
                    >
                      Salvar
                    </button>
                  </form>
                  <BotaoDeExcluir
                    acao={excluirPedido}
                    id={pedido.id}
                    confirmacao={`Excluir o pedido de "${pedido.nome}"? Os dados somem de vez — use quando o cliente pedir.`}
                  />
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {pedidos.length === LIMITE && (
        <p className="text-[12.5px] text-texto-suave">
          Mostrando os {LIMITE} mais recentes. Use os filtros de status para achar os anteriores.
        </p>
      )}
    </>
  );
}
