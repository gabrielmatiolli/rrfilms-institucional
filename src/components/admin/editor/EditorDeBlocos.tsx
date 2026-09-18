"use client";

import { useState } from "react";
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import InspetorDeBloco from "@/components/admin/editor/InspetorDeBloco";
import { useEditorDeBlocos } from "@/components/admin/editor/useEditorDeBlocos";
import {
  BIBLIOTECA_DE_BLOCOS,
  dadosDoBloco,
  fotosDoBloco,
  itensDaLista,
  type Bloco,
} from "@/lib/admin/blocos";
import { cn } from "@/lib/utils";

interface Props {
  nome: string;
  iniciais: Bloco[];
  pasta: "blog" | "produtos";
}

/**
 * Editor de blocos.
 *
 * Em vez da tela de composição com inspetor fixo na lateral (que só cabe em
 * desktop), aqui cada bloco é uma linha que abre os próprios campos ao ser
 * tocada. A mesma interface serve no celular e no computador — e o cliente
 * publica post do telefone.
 *
 * O estado sai serializado num input escondido: o formulário em volta continua
 * sendo um <form> comum, enviado por Server Action.
 */
export default function EditorDeBlocos({ nome, iniciais, pasta }: Props) {
  const editor = useEditorDeBlocos(iniciais);
  const [paletaAberta, setPaletaAberta] = useState(iniciais.length === 0);

  const sensores = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  function aoSoltar(evento: DragEndEvent) {
    const { active, over } = evento;
    if (over && active.id !== over.id) editor.reordenar(String(active.id), String(over.id));
  }

  return (
    <div className="flex flex-col gap-3">
      <input type="hidden" name={nome} value={JSON.stringify(editor.blocos)} />

      {editor.blocos.length === 0 && (
        <p className="rounded-xl border border-dashed border-borda-media/40 bg-fundo-sutil px-4 py-8 text-center text-[13.5px] text-texto-suave">
          O artigo ainda não tem conteúdo. Escolha um bloco abaixo para começar.
        </p>
      )}

      <DndContext sensors={sensores} collisionDetection={closestCenter} onDragEnd={aoSoltar}>
        <SortableContext
          items={editor.blocos.map((b) => b.id)}
          strategy={verticalListSortingStrategy}
        >
          <ul className="flex flex-col gap-2.5">
            {editor.blocos.map((bloco, indice) => (
              <LinhaDeBloco
                key={bloco.id}
                bloco={bloco}
                pasta={pasta}
                aberto={editor.abertoId === bloco.id}
                primeiro={indice === 0}
                ultimo={indice === editor.blocos.length - 1}
                posicao={indice + 1}
                total={editor.blocos.length}
                alternar={() =>
                  editor.setAbertoId(editor.abertoId === bloco.id ? null : bloco.id)
                }
                atualizar={(chave, valor) => editor.atualizar(bloco.id, chave, valor)}
                mover={(direcao) => editor.mover(bloco.id, direcao)}
                duplicar={() => editor.duplicar(bloco.id)}
                remover={() => editor.remover(bloco.id)}
              />
            ))}
          </ul>
        </SortableContext>
      </DndContext>

      {paletaAberta ? (
        <div className="flex flex-col gap-2 rounded-2xl border border-borda-sutil bg-fundo-sutil p-3">
          <div className="flex items-center justify-between">
            <p className="text-[13px] font-semibold text-texto-forte">Adicionar bloco</p>
            {editor.blocos.length > 0 && (
              <button
                type="button"
                onClick={() => setPaletaAberta(false)}
                className="-mr-2 flex size-11 items-center justify-center text-[18px] text-texto-suave"
              >
                <span className="sr-only">Fechar</span>
                <span aria-hidden>×</span>
              </button>
            )}
          </div>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {BIBLIOTECA_DE_BLOCOS.map((item) => (
              <button
                key={item.tipo}
                type="button"
                onClick={() => editor.adicionar(item.tipo)}
                className="flex min-h-[56px] flex-col items-start justify-center rounded-xl border border-borda-media/30 bg-fundo-superficie px-3 py-2 text-left hover:border-texto-forte"
              >
                <span className="text-[13.5px] font-semibold text-texto-forte">{item.rotulo}</span>
                <span className="text-[11.5px] text-texto-suave">{item.descricao}</span>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setPaletaAberta(true)}
          className="min-h-[44px] rounded-pill border border-dashed border-borda-media/40 text-[13.5px] font-semibold text-texto-forte hover:border-texto-forte"
        >
          + Adicionar bloco
        </button>
      )}
    </div>
  );
}

interface LinhaProps {
  bloco: Bloco;
  pasta: "blog" | "produtos";
  aberto: boolean;
  primeiro: boolean;
  ultimo: boolean;
  posicao: number;
  total: number;
  alternar: () => void;
  atualizar: (chave: string, valor: string) => void;
  mover: (direcao: -1 | 1) => void;
  duplicar: () => void;
  remover: () => void;
}

function LinhaDeBloco({
  bloco,
  pasta,
  aberto,
  primeiro,
  ultimo,
  posicao,
  total,
  alternar,
  atualizar,
  mover,
  duplicar,
  remover,
}: LinhaProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: bloco.id,
  });
  const rotulo = BIBLIOTECA_DE_BLOCOS.find((b) => b.tipo === bloco.tipo)?.rotulo ?? bloco.tipo;

  return (
    <li
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={cn(
        "overflow-hidden rounded-2xl border bg-fundo-superficie",
        aberto ? "border-texto-forte" : "border-borda-sutil",
        isDragging && "z-10 opacity-70 shadow-lg",
      )}
    >
      <div className="flex items-center gap-1 px-2 py-2">
        <button
          type="button"
          {...attributes}
          {...listeners}
          aria-label={`Arrastar ${rotulo}, posição ${posicao} de ${total}`}
          className="flex size-11 shrink-0 cursor-grab touch-none items-center justify-center text-[15px] text-texto-suave active:cursor-grabbing"
        >
          <span aria-hidden>⠿</span>
        </button>

        <button
          type="button"
          onClick={alternar}
          aria-expanded={aberto}
          className="flex min-w-0 flex-1 flex-col items-start py-1.5 text-left"
        >
          <span className="text-[13.5px] font-semibold text-texto-forte">{rotulo}</span>
          <span className="line-clamp-1 w-full text-[12.5px] text-texto-suave">
            {resumoDoBloco(bloco)}
          </span>
        </button>

        <div className="flex shrink-0 items-center">
          <BotaoDeLinha
            rotulo="Mover para cima"
            simbolo="↑"
            desabilitado={primeiro}
            aoClicar={() => mover(-1)}
          />
          <BotaoDeLinha
            rotulo="Mover para baixo"
            simbolo="↓"
            desabilitado={ultimo}
            aoClicar={() => mover(1)}
          />
          <BotaoDeLinha rotulo="Duplicar bloco" simbolo="⧉" aoClicar={duplicar} />
          <BotaoDeLinha rotulo="Excluir bloco" simbolo="×" perigo aoClicar={remover} />
        </div>
      </div>

      {aberto && (
        <div className="border-t border-borda-sutil p-4">
          <InspetorDeBloco bloco={bloco} pasta={pasta} atualizar={atualizar} />
        </div>
      )}
    </li>
  );
}

function BotaoDeLinha({
  rotulo,
  simbolo,
  aoClicar,
  desabilitado,
  perigo,
}: {
  rotulo: string;
  simbolo: string;
  aoClicar: () => void;
  desabilitado?: boolean;
  perigo?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={aoClicar}
      disabled={desabilitado}
      className={cn(
        "flex size-11 items-center justify-center text-[15px] disabled:opacity-25",
        perigo ? "text-estado-erro" : "text-texto-suave hover:text-texto-forte",
      )}
    >
      <span className="sr-only">{rotulo}</span>
      <span aria-hidden>{simbolo}</span>
    </button>
  );
}

/** Uma linha de prévia do conteúdo, para reconhecer o bloco fechado. */
function resumoDoBloco(bloco: Bloco): string {
  switch (bloco.tipo) {
    case "galeria": {
      const total = fotosDoBloco(bloco).length;
      return total === 0 ? "Sem fotos" : `${total} foto${total > 1 ? "s" : ""}`;
    }
    case "lista":
      return itensDaLista(bloco).join(" · ") || "Lista vazia";
    case "dados":
      return (
        dadosDoBloco(bloco)
          .map((d) => `${d.valor} ${d.rotulo}`.trim())
          .join(" · ") || "Sem números"
      );
    case "imagem":
      return bloco.props.alt || bloco.props.src || "Sem imagem";
    case "botao":
      return `${bloco.props.rotulo ?? ""} → ${bloco.props.href ?? ""}`;
    case "espaco":
      return `${bloco.props.altura ?? "40"}px`;
    default:
      return bloco.props.texto || "Vazio";
  }
}
