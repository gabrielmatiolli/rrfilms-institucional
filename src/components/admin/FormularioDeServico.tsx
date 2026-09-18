"use client";

import { useActionState, useState } from "react";
import Link from "next/link";

import CampoDeImagem from "@/components/admin/CampoDeImagem";
import { Area, Campo, Interruptor, Selecao } from "@/components/admin/Campos";
import EditorDeDados from "@/components/admin/EditorDeDados";
import { BotaoPainel, Cartao, Erro, TituloDeBloco } from "@/components/admin/Ui";
import type { EstadoDoServico } from "@/app/admin/(painel)/servicos/acoes";
import type { DadoDeBloco } from "@/lib/admin/blocos";

export interface ValoresDoServico {
  titulo: string;
  tag: string;
  descricao: string;
  linha: "CONFORTO" | "LUZ" | "FRESCOR";
  foto: string;
  href: string;
  ativo: boolean;
  dados: DadoDeBloco[];
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
          <Campo
            id="href"
            rotulo="Destino do card"
            required
            defaultValue={valores.href}
            placeholder="/contato"
            dica="Caminho dentro do site. Aceita âncora, como /servicos#seguranca."
          />
        </div>
      </Cartao>

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
