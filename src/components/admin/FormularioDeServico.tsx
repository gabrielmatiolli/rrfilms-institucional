"use client";

import { useActionState, useState } from "react";
import Link from "next/link";

import CampoDeImagem from "@/components/admin/CampoDeImagem";
import { Area, Campo, Interruptor, Selecao } from "@/components/admin/Campos";
import EditorDeDados from "@/components/admin/EditorDeDados";
import EditorDeBlocos from "@/components/admin/editor/EditorDeBlocos";
import { BotaoPainel, Cartao, Erro, TituloDeBloco } from "@/components/admin/Ui";
import type { EstadoDoServico } from "@/app/admin/(painel)/servicos/acoes";
import type { Bloco, DadoDeBloco } from "@/lib/admin/blocos";

export interface ValoresDoServico {
  titulo: string;
  tag: string;
  descricao: string;
  linha: "CONFORTO" | "LUZ" | "FRESCOR";
  foto: string;
  ativo: boolean;
  dados: DadoDeBloco[];
  temPaginaPropria: boolean;
  href: string;
  metaTitulo: string;
  metaDescricao: string;
  conteudo: Bloco[];
  slug?: string;
}

interface Props {
  acao: (anterior: EstadoDoServico, formulario: FormData) => Promise<EstadoDoServico>;
  valores: ValoresDoServico;
  rotuloDeEnvio: string;
}

const estadoInicial: EstadoDoServico = {};

export default function FormularioDeServico({ acao, valores, rotuloDeEnvio }: Props) {
  const [estado, enviar, enviando] = useActionState(acao, estadoInicial);
  const [foto, setFoto] = useState(valores.foto);
  const [dados, setDados] = useState<DadoDeBloco[]>(valores.dados);
  // Decide se o CTA do card abre a interna do serviço ou um destino avulso —
  // os dois blocos de campos se excluem.
  const [temPagina, setTemPagina] = useState(valores.temPaginaPropria);

  return (
    <form action={enviar} className="flex flex-col gap-5">
      <input type="hidden" name="foto" value={foto} />
      <input type="hidden" name="dados" value={JSON.stringify(dados)} />

      <Cartao>
        <TituloDeBloco dica="É o card que aparece na grade da página de Serviços.">
          O card
        </TituloDeBloco>
        <div className="flex flex-col gap-5">
          <Campo
            id="titulo"
            rotulo="Título"
            required
            maxLength={120}
            defaultValue={valores.titulo}
            placeholder="Nanocerâmica Ultra HD"
          />
          <Campo
            id="tag"
            rotulo="Etiqueta"
            required
            maxLength={60}
            defaultValue={valores.tag}
            dica="A pílula pequena no topo do card."
          />
          <Area
            id="descricao"
            rotulo="Descrição"
            required
            rows={4}
            maxLength={600}
            defaultValue={valores.descricao}
            dica="Linguagem de cliente final, não técnica. Duas ou três linhas."
          />
          <Selecao
            id="linha"
            rotulo="Família de cor"
            defaultValue={valores.linha}
            opcoes={[
              { valor: "CONFORTO", rotulo: "Conforto — laranja" },
              { valor: "FRESCOR", rotulo: "Frescor — verde" },
              { valor: "LUZ", rotulo: "Luz — amarelo" },
            ]}
            dica="Define a cor do card no design system."
          />
        </div>
      </Cartao>

      <Cartao>
        <TituloDeBloco dica="Para onde vai o botão “Ver serviço”.">Destino</TituloDeBloco>
        <div className="flex flex-col gap-5">
          <Interruptor
            id="temPaginaPropria"
            rotulo="Este serviço tem interna própria"
            checked={temPagina}
            onChange={(e) => setTemPagina(e.target.checked)}
            dica={
              valores.slug
                ? `A interna fica em /servicos/${valores.slug}.`
                : "A interna é criada no endereço /servicos/<nome-do-serviço>."
            }
          />

          {/* Os campos do modo desligado ficam montados e só se escondem: input
              com display:none continua indo no envio. Desmontar faria o save
              gravar vazio por cima do que já estava no banco. */}
          <div className={temPagina ? "hidden" : undefined}>
            <Campo
              id="href"
              rotulo="Destino do card"
              defaultValue={valores.href}
              placeholder="/contato"
              dica="Caminho dentro do site. Aceita âncora, como /servicos#seguranca."
            />
          </div>
        </div>
      </Cartao>

      {/* Mesmo motivo: desligar a interna não apaga o conteúdo nem os
          metadados — eles esperam no banco o dia em que ela for religada. */}
      <div className={temPagina ? "flex flex-col gap-5" : "hidden"}>
        <Cartao>
          <TituloDeBloco dica="O corpo da interna do serviço, montado bloco a bloco.">
            Conteúdo da interna
          </TituloDeBloco>
          <EditorDeBlocos nome="conteudo" iniciais={valores.conteudo} pasta="servicos" />
        </Cartao>

        <Cartao>
          <TituloDeBloco dica="Como a interna aparece no Google e ao ser compartilhada.">
            Busca
          </TituloDeBloco>
          <div className="flex flex-col gap-5">
            <Campo
              id="metaTitulo"
              rotulo="Título na busca"
              maxLength={120}
              defaultValue={valores.metaTitulo}
              dica="Vazio, usa o título do serviço."
            />
            <Area
              id="metaDescricao"
              rotulo="Descrição na busca"
              rows={3}
              maxLength={320}
              defaultValue={valores.metaDescricao}
              dica="Vazio, usa a descrição do card."
            />
          </div>
        </Cartao>
      </div>

      <Cartao>
        <TituloDeBloco>Foto</TituloDeBloco>
        <CampoDeImagem
          valor={foto}
          onChange={setFoto}
          pasta="servicos"
          rotulo="Foto do card"
          proporcao="aspect-[16/10]"
        />
      </Cartao>

      <Cartao>
        <TituloDeBloco dica="A faixa de números no pé do card. Até quatro.">
          Dados técnicos
        </TituloDeBloco>
        <EditorDeDados
          dados={dados}
          onChange={setDados}
          dica="Exemplo: 79% · menos calor."
        />
      </Cartao>

      <Cartao>
        <TituloDeBloco>Publicação</TituloDeBloco>
        <Interruptor
          id="ativo"
          rotulo="Mostrar no site"
          defaultChecked={valores.ativo}
          dica="Desmarcado, o serviço some da página sem ser excluído."
        />
      </Cartao>

      {estado.erro && <Erro>{estado.erro}</Erro>}

      <div className="flex flex-wrap gap-3">
        <BotaoPainel type="submit" disabled={enviando}>
          {enviando ? "Salvando…" : rotuloDeEnvio}
        </BotaoPainel>
        <Link
          href="/admin/servicos"
          className="inline-flex min-h-[44px] items-center rounded-pill px-4 text-[14px] font-semibold text-texto-suave hover:text-texto-forte"
        >
          Cancelar
        </Link>
      </div>
    </form>
  );
}
