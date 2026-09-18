"use client";

import { useId, useRef, useState, useTransition } from "react";
import Image from "@/components/ui/Imagem";

import { enviarImagem } from "@/lib/admin/acoesDeUpload";
import { cn } from "@/lib/utils";

interface Props {
  valor: string;
  onChange: (url: string) => void;
  pasta: "blog" | "servicos" | "produtos" | "galerias" | "depoimentos";
  rotulo?: string;
  dica?: string;
  /** Proporção da prévia — casa com o lugar onde a foto vai aparecer no site. */
  proporcao?: string;
}

/**
 * Envio de imagem do aparelho, com prévia. O arquivo sobe assim que é
 * escolhido e o componente guarda só a URL, então o formulário que envolve
 * isso continua sendo um form comum de texto.
 */
export default function CampoDeImagem({
  valor,
  onChange,
  pasta,
  rotulo = "Imagem",
  dica,
  proporcao = "aspect-[16/10]",
}: Props) {
  const [enviando, iniciarEnvio] = useTransition();
  const [erro, setErro] = useState<string | null>(null);
  const entradaRef = useRef<HTMLInputElement>(null);
  const id = useId();

  function selecionar(arquivo: File | undefined) {
    if (!arquivo) return;
    setErro(null);

    const dados = new FormData();
    dados.set("arquivo", arquivo);
    dados.set("pasta", pasta);

    iniciarEnvio(async () => {
      const resultado = await enviarImagem(dados);
      if (resultado.erro) setErro(resultado.erro);
      else if (resultado.url) onChange(resultado.url);
      // Libera o mesmo arquivo para ser escolhido de novo depois de um erro.
      if (entradaRef.current) entradaRef.current.value = "";
    });
  }

  return (
    <div className="flex flex-col gap-2">
      <p className="text-[13px] font-semibold text-texto-forte">{rotulo}</p>

      <div
        className={cn(
          "relative w-full overflow-hidden rounded-xl border border-dashed border-borda-media/40 bg-fundo-sutil",
          proporcao,
        )}
      >
        {valor ? (
          <Image src={valor} alt="" fill sizes="400px" className="object-cover" />
        ) : (
          <span className="absolute inset-0 flex items-center justify-center text-[12.5px] font-semibold text-texto-suave">
            Sem imagem
          </span>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        <label
          htmlFor={id}
          className="inline-flex min-h-[44px] cursor-pointer items-center justify-center rounded-pill border border-borda-media/40 bg-fundo-superficie px-4 text-[13px] font-semibold text-texto-forte hover:border-texto-forte"
        >
          {enviando ? "Enviando…" : valor ? "Trocar imagem" : "Enviar imagem"}
          <input
            ref={entradaRef}
            id={id}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/avif"
            className="sr-only"
            disabled={enviando}
            onChange={(e) => selecionar(e.target.files?.[0])}
          />
        </label>

        {valor && (
          <button
            type="button"
            onClick={() => onChange("")}
            className="inline-flex min-h-[44px] items-center rounded-pill px-3 text-[13px] font-semibold text-estado-erro hover:underline"
          >
            Remover
          </button>
        )}
      </div>

      {erro && <p className="text-[12.5px] font-semibold text-estado-erro">{erro}</p>}
      {dica && !erro && <p className="text-[12px] text-texto-suave">{dica}</p>}

      <details className="text-[12px] text-texto-suave">
        <summary className="cursor-pointer select-none py-1">Ou usar uma foto já no site</summary>
        <input
          value={valor}
          onChange={(e) => onChange(e.target.value)}
          placeholder="/fotos/casas-hero.jpg"
          className="mt-2 w-full rounded-lg border border-borda-media/35 bg-fundo-sutil px-3 py-2 text-[13px] text-texto-forte focus:border-texto-forte focus:outline-none"
        />
      </details>
    </div>
  );
}
