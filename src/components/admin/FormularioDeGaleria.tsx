"use client";

import { useActionState, useState } from "react";
import Image from "@/components/ui/Imagem";
import Link from "next/link";
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

import CampoDeImagem from "@/components/admin/CampoDeImagem";
import { Area, Campo, estiloDeEntrada } from "@/components/admin/Campos";
import { Aviso, BotaoPainel, Cartao, Erro, TituloDeBloco } from "@/components/admin/Ui";
import { salvarGaleria, type EstadoDaGaleria } from "@/app/admin/(painel)/galerias/acoes";
import { cn } from "@/lib/utils";

export interface ItemDaGaleria {
  id: string;
  imagem: string;
  alt: string;
}

interface Props {
  chave: string;
  valores: {
    sobrancelha: string;
    titulo: string;
    lead: string;
    itens: ItemDaGaleria[];
  };
}

const estadoInicial: EstadoDaGaleria = {};
const MAXIMO = 12;

export default function FormularioDeGaleria({ chave, valores }: Props) {
  const salvar = salvarGaleria.bind(null, chave);
  const [estado, enviar, enviando] = useActionState(salvar, estadoInicial);
  const [itens, setItens] = useState<ItemDaGaleria[]>(valores.itens);

  const sensores = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  function aoSoltar(evento: DragEndEvent) {
    const { active, over } = evento;
    if (!over || active.id === over.id) return;
    setItens((anterior) => {
      const de = anterior.findIndex((i) => i.id === active.id);
      const para = anterior.findIndex((i) => i.id === over.id);
      if (de === -1 || para === -1) return anterior;
      const proximo = [...anterior];
      const [movido] = proximo.splice(de, 1);
      proximo.splice(para, 0, movido);
      return proximo;
    });
  }

  function mover(indice: number, direcao: -1 | 1) {
    const destino = indice + direcao;
    if (destino < 0 || destino >= itens.length) return;
    setItens((anterior) => {
      const proximo = [...anterior];
      [proximo[indice], proximo[destino]] = [proximo[destino], proximo[indice]];
      return proximo;
    });
  }

  return (
    <form action={enviar} className="flex flex-col gap-5">
      <input
        type="hidden"
        name="itens"
        value={JSON.stringify(itens.map(({ imagem, alt }) => ({ imagem, alt })))}
      />

      <Cartao>
        <TituloDeBloco dica="O texto que abre a seção de galeria na página.">
          Cabeçalho da seção
        </TituloDeBloco>
        <div className="flex flex-col gap-5">
          <Campo
            id="sobrancelha"
            rotulo="Sobrancelha"
            required
            maxLength={80}
            defaultValue={valores.sobrancelha}
            placeholder="Obras da RR Film"
            dica="A linha pequena acima do título."
          />
          <Campo
            id="titulo"
            rotulo="Título"
            required
            maxLength={160}
            defaultValue={valores.titulo}
            placeholder="Vidro de cliente, não render de catálogo"
          />
          <Area
            id="lead"
            rotulo="Lead"
            rows={2}
            maxLength={400}
            defaultValue={valores.lead}
            dica="Opcional. Uma linha de apoio abaixo do título."
          />
        </div>
      </Cartao>

      <Cartao>
        <TituloDeBloco
          dica={`Arraste para reordenar. A primeira foto ocupa o bloco largo da grade. ${itens.length}/${MAXIMO} fotos.`}
        >
          Fotos
        </TituloDeBloco>

        {itens.length > 0 && itens.length < 6 && (
          <div className="mb-4">
            <Aviso>
              A grade do design foi desenhada para seis fotos. Com menos, ela se
              ajusta, mas fica diferente do previsto.
            </Aviso>
          </div>
        )}

        <DndContext sensors={sensores} collisionDetection={closestCenter} onDragEnd={aoSoltar}>
          <SortableContext items={itens.map((i) => i.id)} strategy={verticalListSortingStrategy}>
            <ul className="flex flex-col gap-2.5">
              {itens.map((item, indice) => (
                <LinhaDeFoto
                  key={item.id}
                  item={item}
                  indice={indice}
                  total={itens.length}
                  aoMudarAlt={(alt) =>
                    setItens((anterior) =>
                      anterior.map((i) => (i.id === item.id ? { ...i, alt } : i)),
                    )
                  }
                  aoMover={(direcao) => mover(indice, direcao)}
                  aoRemover={() =>
                    setItens((anterior) => anterior.filter((i) => i.id !== item.id))
                  }
                />
              ))}
            </ul>
          </SortableContext>
        </DndContext>

        {itens.length < MAXIMO && (
          <div className="mt-4">
            <CampoDeImagem
              valor=""
              onChange={(url) =>
                url &&
                setItens((anterior) => [
                  ...anterior,
                  { id: `novo-${Date.now()}-${anterior.length}`, imagem: url, alt: "" },
                ])
              }
              pasta="galerias"
              rotulo="Adicionar foto"
              proporcao="aspect-[16/7]"
            />
          </div>
        )}
      </Cartao>

      {estado.erro && <Erro>{estado.erro}</Erro>}
      {estado.ok && !estado.erro && (
        <p className="rounded-xl border border-frescor-500 bg-frescor-100 px-4 py-3 text-[13px] font-semibold text-escuro-900">
          Galeria salva.
        </p>
      )}

      <div className="flex flex-wrap gap-3">
        <BotaoPainel type="submit" disabled={enviando}>
          {enviando ? "Salvando…" : "Salvar galeria"}
        </BotaoPainel>
        <Link
          href="/admin/galerias"
          className="inline-flex min-h-[44px] items-center rounded-pill px-4 text-[14px] font-semibold text-texto-suave hover:text-texto-forte"
        >
          Voltar
        </Link>
      </div>
    </form>
  );
}

function LinhaDeFoto({
  item,
  indice,
  total,
  aoMudarAlt,
  aoMover,
  aoRemover,
}: {
  item: ItemDaGaleria;
  indice: number;
  total: number;
  aoMudarAlt: (alt: string) => void;
  aoMover: (direcao: -1 | 1) => void;
  aoRemover: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: item.id,
  });

  return (
    <li
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={cn(
        "flex items-start gap-2 rounded-xl border border-borda-sutil bg-fundo-sutil p-2.5",
        isDragging && "z-10 opacity-70 shadow-lg",
      )}
    >
      <button
        type="button"
        {...attributes}
        {...listeners}
        className="flex size-11 shrink-0 cursor-grab touch-none items-center justify-center text-[15px] text-texto-suave active:cursor-grabbing"
      >
        <span className="sr-only">
          Arrastar foto {indice + 1} de {total}
        </span>
        <span aria-hidden>⠿</span>
      </button>

      <div className="relative size-14 shrink-0 overflow-hidden rounded-lg bg-fundo-pagina">
        {item.imagem && (
          <Image src={item.imagem} alt="" fill sizes="56px" className="object-cover" />
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-1 pt-1">
        <input
          value={item.alt}
          onChange={(e) => aoMudarAlt(e.target.value)}
          placeholder="Descreva a foto"
          aria-label={`Texto alternativo da foto ${indice + 1}`}
          className={cn(estiloDeEntrada, "py-2 text-[13.5px]")}
        />
        {indice === 0 && (
          <span className="text-[11.5px] text-texto-suave">Ocupa o bloco largo da grade.</span>
        )}
      </div>

      <div className="flex shrink-0 items-center">
        <button
          type="button"
          onClick={() => aoMover(-1)}
          disabled={indice === 0}
          className="flex size-11 items-center justify-center text-[14px] text-texto-suave disabled:opacity-25"
        >
          <span className="sr-only">Mover para cima</span>
          <span aria-hidden>↑</span>
        </button>
        <button
          type="button"
          onClick={() => aoMover(1)}
          disabled={indice === total - 1}
          className="flex size-11 items-center justify-center text-[14px] text-texto-suave disabled:opacity-25"
        >
          <span className="sr-only">Mover para baixo</span>
          <span aria-hidden>↓</span>
        </button>
        <button
          type="button"
          onClick={aoRemover}
          className="flex size-11 items-center justify-center text-[18px] text-estado-erro"
        >
          <span className="sr-only">Remover foto {indice + 1}</span>
          <span aria-hidden>×</span>
        </button>
      </div>
    </li>
  );
}
