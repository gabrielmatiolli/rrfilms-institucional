import type { Metadata } from "next";
import Link from "next/link";

import { CabecalhoDePagina, Cartao, LinkPainel, Selo, TituloDeBloco } from "@/components/admin/Ui";
import { exigirAdmin } from "@/lib/admin/sessao";
import { prisma } from "@/lib/prisma";
import { tempoRelativo } from "@/lib/datas";

export const metadata: Metadata = { title: "Painel" };

const ATALHOS = [
  { href: "/admin/blog", titulo: "Blog", descricao: "Escrever e publicar artigos" },
  { href: "/admin/servicos", titulo: "Serviços", descricao: "A grade da página de Serviços" },
  { href: "/admin/produtos", titulo: "Produtos", descricao: "As linhas de película" },
  { href: "/admin/galerias", titulo: "Galerias", descricao: "As fotos de obra de cada página" },
  { href: "/admin/conteudo", titulo: "Conteúdo", descricao: "Depoimentos e dados de contato" },
  { href: "/admin/configuracoes", titulo: "Configurações", descricao: "Senha, contas e acessos" },
];

export default async function Painel() {
  const admin = await exigirAdmin("/admin");

  const [
    postsPublicados,
    rascunhos,
    servicosAtivos,
    produtosAtivos,
    fotosEmGaleria,
    depoimentosNoAr,
    depoimentosSemAutorizacao,
    atividade,
  ] = await Promise.all([
    prisma.blogPost.count({ where: { status: "PUBLICADO" } }),
    prisma.blogPost.count({ where: { status: "RASCUNHO" } }),
    prisma.servico.count({ where: { ativo: true } }),
    prisma.produto.count({ where: { ativo: true } }),
    prisma.galeriaItem.count(),
    prisma.depoimento.count({ where: { ativo: true, autorizado: true } }),
    prisma.depoimento.count({ where: { ativo: true, autorizado: false } }),
    prisma.activityLog.findMany({ orderBy: { criadoEm: "desc" }, take: 8 }),
  ]);

  const numeros = [
    { valor: postsPublicados, rotulo: "artigos no ar", href: "/admin/blog" },
    { valor: rascunhos, rotulo: "rascunhos", href: "/admin/blog" },
    { valor: servicosAtivos, rotulo: "serviços no site", href: "/admin/servicos" },
    { valor: produtosAtivos, rotulo: "linhas no site", href: "/admin/produtos" },
    { valor: fotosEmGaleria, rotulo: "fotos em galeria", href: "/admin/galerias" },
    { valor: depoimentosNoAr, rotulo: "depoimentos no ar", href: "/admin/conteudo" },
  ];

  return (
    <>
      <CabecalhoDePagina
        titulo={`Olá, ${admin.nome.split(" ")[0]}`}
        descricao="O que está no ar agora e o que a equipe mexeu por último."
        acoes={
          <LinkPainel href="/admin/blog/novo" tipo="secundario">
            Escrever post
          </LinkPainel>
        }
      />

      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {numeros.map((numero) => (
          <li key={numero.rotulo}>
            <Link
              href={numero.href}
              className="flex h-full flex-col gap-1 rounded-2xl border border-borda-sutil bg-fundo-superficie p-4 transition-colors hover:border-texto-forte"
            >
              <span className="font-[family-name:var(--tipo-familia-display)] text-[28px] font-bold leading-none text-texto-forte">
                {numero.valor}
              </span>
              <span className="text-[12.5px] text-texto-suave">{numero.rotulo}</span>
            </Link>
          </li>
        ))}
      </ul>

      {(rascunhos > 0 || depoimentosSemAutorizacao > 0) && (
        <Cartao>
          <TituloDeBloco>Pendências</TituloDeBloco>
          <ul className="flex flex-col gap-2.5">
            {rascunhos > 0 && (
              <li className="flex flex-wrap items-center gap-2 text-[13.5px] text-texto-corpo">
                <Selo tom="atencao">Blog</Selo>
                {rascunhos === 1
                  ? "Um artigo está em rascunho e não aparece no site."
                  : `${rascunhos} artigos estão em rascunho e não aparecem no site.`}
                <Link href="/admin/blog" className="font-semibold text-texto-forte underline-offset-4 hover:underline">
                  Ver
                </Link>
              </li>
            )}
            {depoimentosSemAutorizacao > 0 && (
              <li className="flex flex-wrap items-center gap-2 text-[13.5px] text-texto-corpo">
                <Selo tom="atencao">Depoimentos</Selo>
                {depoimentosSemAutorizacao === 1
                  ? "Um depoimento está ativo sem autorização por escrito — por isso não vai ao ar."
                  : `${depoimentosSemAutorizacao} depoimentos estão ativos sem autorização por escrito.`}
                <Link
                  href="/admin/conteudo"
                  className="font-semibold text-texto-forte underline-offset-4 hover:underline"
                >
                  Ver
                </Link>
              </li>
            )}
          </ul>
        </Cartao>
      )}

      <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
        <Cartao>
          <TituloDeBloco>Onde mexer</TituloDeBloco>
          <ul className="grid gap-2.5 sm:grid-cols-2">
            {ATALHOS.map((atalho) => (
              <li key={atalho.href}>
                <Link
                  href={atalho.href}
                  className="flex h-full flex-col gap-0.5 rounded-xl border border-borda-sutil bg-fundo-sutil px-4 py-3 transition-colors hover:border-texto-forte"
                >
                  <span className="text-[14px] font-semibold text-texto-forte">
                    {atalho.titulo}
                  </span>
                  <span className="text-[12px] text-texto-suave">{atalho.descricao}</span>
                </Link>
              </li>
            ))}
          </ul>
        </Cartao>

        <Cartao>
          <TituloDeBloco>Atividade recente</TituloDeBloco>
          {atividade.length === 0 ? (
            <p className="text-[13.5px] text-texto-suave">Nada por aqui ainda.</p>
          ) : (
            <ul className="flex flex-col gap-3">
              {atividade.map((linha) => (
                <li key={linha.id} className="flex flex-col gap-0.5">
                  <span className="text-[13px] text-texto-corpo">
                    {linha.autor ? <strong className="font-semibold">{linha.autor}</strong> : null}
                    {linha.autor ? " · " : null}
                    {linha.mensagem}
                  </span>
                  <span className="text-[11.5px] text-texto-suave">
                    {tempoRelativo(linha.criadoEm)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Cartao>
      </div>
    </>
  );
}
