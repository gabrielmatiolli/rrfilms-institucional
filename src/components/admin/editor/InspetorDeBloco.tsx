"use client";

import Image from "@/components/ui/Imagem";

import CampoDeImagem from "@/components/admin/CampoDeImagem";
import { estiloDeEntrada } from "@/components/admin/Campos";
import EditorDeDados from "@/components/admin/EditorDeDados";
import {
  dadosDoBloco,
  fotosDoBloco,
  guardarLista,
  itensDaLista,
  type Bloco,
  type FotoDeBloco,
} from "@/lib/admin/blocos";
import { cn } from "@/lib/utils";

interface Props {
  bloco: Bloco;
  pasta: "blog" | "produtos";
  atualizar: (chave: string, valor: string) => void;
}

const MAX_FOTOS_NA_GALERIA = 6;

/** Campos de edição de um bloco. Quem chama decide onde isso aparece. */
export default function InspetorDeBloco({ bloco, pasta, atualizar }: Props) {
  switch (bloco.tipo) {
    case "titulo":
      return (
        <div className="flex flex-col gap-3">
          <Linha rotulo="Texto do título">
            <input
              value={bloco.props.texto ?? ""}
              onChange={(e) => atualizar("texto", e.target.value)}
              className={estiloDeEntrada}
            />
          </Linha>
          <Linha rotulo="Nível" dica="H2 divide seções; H3 e H4 são subdivisões.">
            <div className="flex gap-2">
              {["2", "3", "4"].map((nivel) => (
                <button
                  key={nivel}
                  type="button"
                  onClick={() => atualizar("nivel", nivel)}
                  className={cn(
                    "min-h-[44px] flex-1 rounded-xl border text-[13px] font-semibold",
                    (bloco.props.nivel ?? "2") === nivel
                      ? "border-texto-forte bg-fundo-sutil text-texto-forte"
                      : "border-borda-media/35 text-texto-suave",
                  )}
                >
                  H{nivel}
                </button>
              ))}
            </div>
          </Linha>
        </div>
      );

    case "texto":
    case "destaque":
      return (
        <Linha
          rotulo={bloco.tipo === "texto" ? "Parágrafo" : "Parágrafo de destaque"}
          dica={
            bloco.tipo === "destaque"
              ? "Sai em corpo grande — use na abertura do artigo."
              : undefined
          }
        >
          <textarea
            rows={5}
            value={bloco.props.texto ?? ""}
            onChange={(e) => atualizar("texto", e.target.value)}
            className={cn(estiloDeEntrada, "resize-y")}
          />
        </Linha>
      );

    case "citacao":
      return (
        <div className="flex flex-col gap-3">
          <Linha rotulo="Frase">
            <textarea
              rows={3}
              value={bloco.props.texto ?? ""}
              onChange={(e) => atualizar("texto", e.target.value)}
              className={cn(estiloDeEntrada, "resize-y")}
            />
          </Linha>
          <Linha rotulo="Quem disse" dica="Opcional — nome e contexto.">
            <input
              value={bloco.props.autor ?? ""}
              onChange={(e) => atualizar("autor", e.target.value)}
              placeholder="Marina Alcântara · Itatiba"
              className={estiloDeEntrada}
            />
          </Linha>
        </div>
      );

    case "botao":
      return (
        <div className="flex flex-col gap-3">
          <Linha rotulo="Texto do botão">
            <input
              value={bloco.props.rotulo ?? ""}
              onChange={(e) => atualizar("rotulo", e.target.value)}
              className={estiloDeEntrada}
            />
          </Linha>
          <Linha rotulo="Link" dica="Caminho interno (/contato) ou endereço completo.">
            <input
              value={bloco.props.href ?? ""}
              onChange={(e) => atualizar("href", e.target.value)}
              className={estiloDeEntrada}
            />
          </Linha>
        </div>
      );

    case "imagem":
      return (
        <div className="flex flex-col gap-3">
          <CampoDeImagem
            valor={bloco.props.src ?? ""}
            onChange={(url) => atualizar("src", url)}
            pasta={pasta}
            rotulo="Foto"
          />
          <Linha
            rotulo="Texto alternativo"
            dica="O que a foto mostra — é o que o leitor de tela lê."
          >
            <input
              value={bloco.props.alt ?? ""}
              onChange={(e) => atualizar("alt", e.target.value)}
              className={estiloDeEntrada}
            />
          </Linha>
          <Linha rotulo="Legenda" dica="Opcional, aparece abaixo da foto.">
            <input
              value={bloco.props.legenda ?? ""}
              onChange={(e) => atualizar("legenda", e.target.value)}
              className={estiloDeEntrada}
            />
          </Linha>
        </div>
      );

    case "galeria":
      return <CamposDeGaleria bloco={bloco} pasta={pasta} atualizar={atualizar} />;

    case "lista":
      return <CamposDeLista bloco={bloco} atualizar={atualizar} />;

    case "dados":
      return <CamposDeDados bloco={bloco} atualizar={atualizar} />;

    case "espaco":
      return (
        <Linha rotulo="Altura (px)">
          <input
            type="number"
            min={8}
            max={200}
            value={bloco.props.altura ?? "40"}
            onChange={(e) => atualizar("altura", e.target.value)}
            className={estiloDeEntrada}
          />
        </Linha>
      );
  }
}

function Linha({
  rotulo,
  dica,
  children,
}: {
  rotulo: string;
  dica?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[13px] font-semibold text-texto-forte">{rotulo}</span>
      {children}
      {dica && <span className="text-[12px] text-texto-suave">{dica}</span>}
    </label>
  );
}

function CamposDeGaleria({ bloco, pasta, atualizar }: Props) {
  const fotos = fotosDoBloco(bloco);

  function guardar(proximas: FotoDeBloco[]) {
    atualizar("imagens", guardarLista(proximas));
  }

  return (
    <div className="flex flex-col gap-3">
      <p className="text-[13px] font-semibold text-texto-forte">
        Fotos ({fotos.length}/{MAX_FOTOS_NA_GALERIA})
      </p>

      {fotos.map((foto, i) => (
        <div
          key={`${foto.src}-${i}`}
          className="flex items-start gap-3 rounded-xl border border-borda-sutil bg-fundo-sutil p-3"
        >
          <div className="relative size-14 shrink-0 overflow-hidden rounded-lg bg-fundo-pagina">
            {foto.src && <Image src={foto.src} alt="" fill sizes="56px" className="object-cover" />}
          </div>
          <input
            value={foto.alt}
            onChange={(e) =>
              guardar(fotos.map((f, idx) => (idx === i ? { ...f, alt: e.target.value } : f)))
            }
            placeholder="Descreva a foto"
            className={cn(estiloDeEntrada, "py-2 text-[13px]")}
          />
          <button
            type="button"
            onClick={() => guardar(fotos.filter((_, idx) => idx !== i))}
            aria-label={`Remover foto ${i + 1}`}
            className="flex size-11 shrink-0 items-center justify-center text-[18px] text-estado-erro"
          >
            ×
          </button>
        </div>
      ))}

      {fotos.length < MAX_FOTOS_NA_GALERIA && (
        <CampoDeImagem
          valor=""
          onChange={(url) => url && guardar([...fotos, { src: url, alt: "" }])}
          pasta={pasta}
          rotulo="Adicionar foto"
          proporcao="aspect-[16/7]"
        />
      )}
    </div>
  );
}

function CamposDeLista({ bloco, atualizar }: Omit<Props, "pasta">) {
  const itens = itensDaLista(bloco);

  function guardar(proximos: string[]) {
    atualizar("itens", guardarLista(proximos));
  }

  return (
    <div className="flex flex-col gap-2.5">
      <p className="text-[13px] font-semibold text-texto-forte">Itens</p>
      {itens.map((item, i) => (
        <div key={i} className="flex items-center gap-2">
          <input
            value={item}
            onChange={(e) => guardar(itens.map((v, idx) => (idx === i ? e.target.value : v)))}
            className={cn(estiloDeEntrada, "py-2.5 text-[14px]")}
          />
          <button
            type="button"
            onClick={() => guardar(itens.filter((_, idx) => idx !== i))}
            aria-label={`Remover item ${i + 1}`}
            className="flex size-11 shrink-0 items-center justify-center text-[18px] text-estado-erro"
          >
            ×
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => guardar([...itens, ""])}
        className="min-h-[44px] self-start rounded-pill border border-borda-media/40 px-4 text-[13px] font-semibold text-texto-forte hover:border-texto-forte"
      >
        + Adicionar item
      </button>
    </div>
  );
}

function CamposDeDados({ bloco, atualizar }: Omit<Props, "pasta">) {
  return (
    <EditorDeDados
      dados={dadosDoBloco(bloco)}
      onChange={(proximos) => atualizar("itens", guardarLista(proximos))}
      dica="Valor e o que ele significa."
    />
  );
}
