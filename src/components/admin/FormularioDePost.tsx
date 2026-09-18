"use client";

import { useActionState, useState } from "react";
import Link from "next/link";

import CampoDeImagem from "@/components/admin/CampoDeImagem";
import { Area, Campo, Interruptor, Selecao } from "@/components/admin/Campos";
import EditorDeBlocos from "@/components/admin/editor/EditorDeBlocos";
import { BotaoPainel, Cartao, Erro, TituloDeBloco } from "@/components/admin/Ui";
import type { EstadoDoPost } from "@/app/admin/(painel)/blog/acoes";
import type { Bloco } from "@/lib/admin/blocos";

export interface ValoresDoPost {
  titulo: string;
  resumo: string;
  autor: string;
  capa: string;
  categoriaId: string;
  status: "PUBLICADO" | "RASCUNHO";
  destaque: boolean;
  conteudo: Bloco[];
  slug?: string;
}

interface Props {
  acao: (anterior: EstadoDoPost, formulario: FormData) => Promise<EstadoDoPost>;
  categorias: { id: string; rotulo: string }[];
  valores: ValoresDoPost;
  rotuloDeEnvio: string;
}

const estadoInicial: EstadoDoPost = {};

export default function FormularioDePost({
  acao,
  categorias,
  valores,
  rotuloDeEnvio,
}: Props) {
  const [estado, enviar, enviando] = useActionState(acao, estadoInicial);
  const [capa, setCapa] = useState(valores.capa);

  return (
    <form action={enviar} className="flex flex-col gap-5">
      {/* A capa sobe antes do envio; o form carrega só a URL. */}
      <input type="hidden" name="capa" value={capa} />

      <Cartao>
        <TituloDeBloco dica="Aparece no card da listagem e no topo do artigo.">
          Identificação
        </TituloDeBloco>
        <div className="flex flex-col gap-5">
          <Campo
            id="titulo"
            rotulo="Título"
            required
            defaultValue={valores.titulo}
            maxLength={180}
            placeholder="Por que a película mais escura não é a que mais refresca"
            dica={
              valores.slug
                ? `Endereço atual: /blog/${valores.slug} — muda junto com o título.`
                : "O endereço do artigo é gerado a partir do título."
            }
          />

          <Area
            id="resumo"
            rotulo="Resumo"
            required
            rows={3}
            maxLength={600}
            defaultValue={valores.resumo}
            dica="Duas ou três linhas. É o que aparece no card e nos buscadores."
          />

          <div className="grid gap-5 sm:grid-cols-2">
            <Campo id="autor" rotulo="Autor" required defaultValue={valores.autor} />
            <Selecao
              id="categoriaId"
              rotulo="Categoria"
              defaultValue={valores.categoriaId}
              opcoes={[
                { valor: "", rotulo: "Sem categoria" },
                ...categorias.map((c) => ({ valor: c.id, rotulo: c.rotulo })),
              ]}
              dica="Usada nos filtros da listagem."
            />
          </div>
        </div>
      </Cartao>

      <Cartao>
        <TituloDeBloco dica="Foto de obra aplicada pela equipe — nada de banco de imagem.">
          Capa
        </TituloDeBloco>
        <CampoDeImagem
          valor={capa}
          onChange={setCapa}
          pasta="blog"
          rotulo="Imagem de capa"
          proporcao="aspect-[16/9]"
        />
      </Cartao>

      <Cartao>
        <TituloDeBloco dica="Monte o artigo bloco a bloco. Arraste para reordenar.">
          Conteúdo
        </TituloDeBloco>
        <EditorDeBlocos nome="conteudo" iniciais={valores.conteudo} pasta="blog" />
      </Cartao>

      <Cartao>
        <TituloDeBloco>Publicação</TituloDeBloco>
        <div className="flex flex-col gap-5">
          <Selecao
            id="status"
            rotulo="Situação"
            defaultValue={valores.status}
            opcoes={[
              { valor: "RASCUNHO", rotulo: "Rascunho — só você vê" },
              { valor: "PUBLICADO", rotulo: "Publicado — vai ao ar no site" },
            ]}
          />
          <Interruptor
            id="destaque"
            rotulo="Post em destaque do blog"
            defaultChecked={valores.destaque}
            dica="Ocupa o bloco grande no topo de /blog. Só um post por vez."
          />
        </div>
      </Cartao>

      {estado.erro && <Erro>{estado.erro}</Erro>}

      <div className="flex flex-wrap gap-3">
        <BotaoPainel type="submit" disabled={enviando}>
          {enviando ? "Salvando…" : rotuloDeEnvio}
        </BotaoPainel>
        <Link
          href="/admin/blog"
          className="inline-flex min-h-[44px] items-center rounded-pill px-4 text-[14px] font-semibold text-texto-suave hover:text-texto-forte"
        >
          Cancelar
        </Link>
      </div>
    </form>
  );
}
