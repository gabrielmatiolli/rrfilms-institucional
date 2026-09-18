"use client";

import { useActionState, useState } from "react";
import Link from "next/link";

import CampoDeImagem from "@/components/admin/CampoDeImagem";
import { Area, Campo, Interruptor } from "@/components/admin/Campos";
import EditorDeBlocos from "@/components/admin/editor/EditorDeBlocos";
import { BotaoPainel, Cartao, Erro, TituloDeBloco } from "@/components/admin/Ui";
import type { EstadoDoProduto } from "@/app/admin/(painel)/produtos/acoes";
import type { Bloco } from "@/lib/admin/blocos";

export interface ValoresDoProduto {
  nome: string;
  destaque: string;
  promessa: string;
  descricao: string;
  foto: string;
  ativo: boolean;
  temPaginaPropria: boolean;
  hrefExterno: string;
  metaTitulo: string;
  metaDescricao: string;
  conteudo: Bloco[];
  slug?: string;
}

interface Props {
  acao: (anterior: EstadoDoProduto, formulario: FormData) => Promise<EstadoDoProduto>;
  valores: ValoresDoProduto;
  rotuloDeEnvio: string;
}

const estadoInicial: EstadoDoProduto = {};

export default function FormularioDeProduto({ acao, valores, rotuloDeEnvio }: Props) {
  const [estado, enviar, enviando] = useActionState(acao, estadoInicial);
  const [foto, setFoto] = useState(valores.foto);
  // Decide se o CTA do card leva a uma página gerada aqui ou a um destino
  // avulso — os dois blocos de campos se excluem.
  const [temPagina, setTemPagina] = useState(valores.temPaginaPropria);

  return (
    <form action={enviar} className="flex flex-col gap-5">
      <input type="hidden" name="foto" value={foto} />

      <Cartao>
        <TituloDeBloco dica="O card que aparece na Home e na grade de linhas.">
          A linha
        </TituloDeBloco>
        <div className="flex flex-col gap-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <Campo
              id="nome"
              rotulo="Nome"
              required
              maxLength={80}
              defaultValue={valores.nome}
              placeholder="Nanocerâmica"
              dica="Primeira linha do título."
            />
            <Campo
              id="destaque"
              rotulo="Destaque"
              required
              maxLength={80}
              defaultValue={valores.destaque}
              placeholder="Ultra HD"
              dica="Segunda linha, na cor de acento."
            />
          </div>

          <Campo
            id="promessa"
            rotulo="Promessa"
            required
            maxLength={240}
            defaultValue={valores.promessa}
            placeholder="O calor para no vidro. A vista continua lá."
            dica="Uma frase. É o que o cliente lê primeiro."
          />

          <Area
            id="descricao"
            rotulo="Descrição"
            required
            rows={4}
            maxLength={800}
            defaultValue={valores.descricao}
            dica="Para que serve e onde se aplica, em linguagem de cliente final."
          />
        </div>
      </Cartao>

      <Cartao>
        <TituloDeBloco dica="Opcional — sem foto, o card mostra um painel de vidro vazio.">
          Foto
        </TituloDeBloco>
        <CampoDeImagem
          valor={foto}
          onChange={setFoto}
          pasta="produtos"
          rotulo="Foto da linha"
          proporcao="aspect-[16/9]"
        />
      </Cartao>

      <Cartao>
        <TituloDeBloco dica="Para onde vai o botão “Conheça a linha”.">Destino</TituloDeBloco>
        <div className="flex flex-col gap-5">
          <Interruptor
            id="temPaginaPropria"
            rotulo="Esta linha tem página própria"
            checked={temPagina}
            onChange={(e) => setTemPagina(e.target.checked)}
            dica={
              valores.slug
                ? `A página fica em /produtos/${valores.slug}.`
                : "A página é criada no endereço /produtos/<nome-da-linha>."
            }
          />

          {/* Os campos do modo desligado ficam montados e só se escondem: input
              com display:none continua indo no envio. Desmontar faria o save
              gravar vazio por cima do que já estava no banco. */}
          <div className={temPagina ? "hidden" : undefined}>
            <Campo
              id="hrefExterno"
              rotulo="Destino do botão"
              defaultValue={valores.hrefExterno}
              placeholder="/servicos#seguranca"
              dica="Caminho dentro do site. Aceita âncora."
            />
          </div>
        </div>
      </Cartao>

      {/* Mesmo motivo: desligar a página própria não apaga o conteúdo nem os
          metadados — eles esperam no banco o dia em que ela for religada. */}
      <div className={temPagina ? "flex flex-col gap-5" : "hidden"}>
        <Cartao>
          <TituloDeBloco dica="O corpo da página da linha, montado bloco a bloco.">
            Conteúdo da página
          </TituloDeBloco>
          <EditorDeBlocos nome="conteudo" iniciais={valores.conteudo} pasta="produtos" />
        </Cartao>

        <Cartao>
          <TituloDeBloco dica="Como a página aparece no Google e ao ser compartilhada.">
            Busca
          </TituloDeBloco>
          <div className="flex flex-col gap-5">
            <Campo
              id="metaTitulo"
              rotulo="Título na busca"
              maxLength={120}
              defaultValue={valores.metaTitulo}
              dica="Vazio, usa o nome e o destaque da linha."
            />
            <Area
              id="metaDescricao"
              rotulo="Descrição na busca"
              rows={3}
              maxLength={320}
              defaultValue={valores.metaDescricao}
              dica="Vazio, usa a promessa."
            />
          </div>
        </Cartao>
      </div>

      <Cartao>
        <TituloDeBloco>Publicação</TituloDeBloco>
        <Interruptor
          id="ativo"
          rotulo="Mostrar no site"
          defaultChecked={valores.ativo}
          dica="Desmarcado, a linha some da grade sem ser excluída."
        />
      </Cartao>

      {estado.erro && <Erro>{estado.erro}</Erro>}

      <div className="flex flex-wrap gap-3">
        <BotaoPainel type="submit" disabled={enviando}>
          {enviando ? "Salvando…" : rotuloDeEnvio}
        </BotaoPainel>
        <Link
          href="/admin/produtos"
          className="inline-flex min-h-[44px] items-center rounded-pill px-4 text-[14px] font-semibold text-texto-suave hover:text-texto-forte"
        >
          Cancelar
        </Link>
      </div>
    </form>
  );
}
