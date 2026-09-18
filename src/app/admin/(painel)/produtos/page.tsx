import type { Metadata } from "next";
import Image from "@/components/ui/Imagem";
import Link from "next/link";

import BotaoDeExcluir from "@/components/admin/BotaoDeExcluir";
import ControlesDeOrdem from "@/components/admin/ControlesDeOrdem";
import { CabecalhoDePagina, LinkPainel, Selo, Vazio } from "@/components/admin/Ui";
import { excluirProduto, moverProduto } from "@/app/admin/(painel)/produtos/acoes";
import { exigirAdmin } from "@/lib/admin/sessao";
import { prisma } from "@/lib/prisma";
import { lerBlocos } from "@/lib/admin/blocos";

export const metadata: Metadata = { title: "Produtos" };

export default async function ProdutosAdmin() {
  await exigirAdmin("/admin/produtos");

  const produtos = await prisma.produto.findMany({ orderBy: { ordem: "asc" } });

  return (
    <>
      <CabecalhoDePagina
        titulo="Produtos"
        descricao="As linhas de película do portfólio. A ordem daqui é a ordem na Home."
        acoes={<LinkPainel href="/admin/produtos/novo">Nova linha</LinkPainel>}
      />

      {produtos.length === 0 ? (
        <Vazio
          titulo="Nenhuma linha cadastrada"
          descricao="Cadastre as linhas de película que aparecem na grade da Home."
          acao={<LinkPainel href="/admin/produtos/novo">Nova linha</LinkPainel>}
        />
      ) : (
        <ul className="flex flex-col gap-3">
          {produtos.map((produto, indice) => {
            const semConteudo =
              produto.temPaginaPropria && lerBlocos(produto.conteudo).length === 0;

            return (
              <li
                key={produto.id}
                className="flex flex-col gap-4 rounded-2xl border border-borda-sutil bg-fundo-superficie p-4 sm:flex-row sm:items-center sm:gap-5"
              >
                <div className="relative aspect-[16/9] w-full shrink-0 overflow-hidden rounded-xl bg-fundo-sutil sm:aspect-square sm:w-[92px]">
                  {produto.foto && (
                    <Image
                      src={produto.foto}
                      alt=""
                      fill
                      sizes="(max-width: 640px) 100vw, 92px"
                      className="object-cover"
                    />
                  )}
                </div>

                <div className="flex min-w-0 flex-1 flex-col gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <Selo tom={produto.ativo ? "positivo" : "neutro"}>
                      {produto.ativo ? "No site" : "Oculta"}
                    </Selo>
                    {produto.temPaginaPropria && <Selo>Página própria</Selo>}
                    {semConteudo && <Selo tom="erro">Página sem conteúdo</Selo>}
                  </div>

                  <Link
                    href={`/admin/produtos/${produto.id}`}
                    className="font-[family-name:var(--tipo-familia-display)] text-[16.5px] font-bold leading-snug text-texto-forte hover:underline"
                  >
                    {produto.nome}{" "}
                    <span className="text-texto-acento">{produto.destaque}</span>
                  </Link>

                  <p className="line-clamp-1 text-[13px] text-texto-corpo">{produto.promessa}</p>
                  <p className="text-[12px] text-texto-suave">
                    Botão leva para{" "}
                    {produto.temPaginaPropria ? `/produtos/${produto.slug}` : produto.hrefExterno}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2 sm:shrink-0 sm:flex-col sm:items-stretch">
                  <ControlesDeOrdem
                    acao={moverProduto}
                    id={produto.id}
                    primeiro={indice === 0}
                    ultimo={indice === produtos.length - 1}
                    nome={produto.nome}
                  />
                  <Link
                    href={`/admin/produtos/${produto.id}`}
                    className="inline-flex min-h-[44px] items-center justify-center rounded-pill border border-borda-media/40 px-4 text-[13px] font-semibold text-texto-forte hover:border-texto-forte"
                  >
                    Editar
                  </Link>
                  <BotaoDeExcluir
                    acao={excluirProduto}
                    id={produto.id}
                    confirmacao={`Excluir "${produto.nome} ${produto.destaque}"? Essa ação não pode ser desfeita.`}
                  />
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}
