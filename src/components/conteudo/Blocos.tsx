import Image from "@/components/ui/Imagem";
import Link from "next/link";

import { BotaoLink } from "@/components/ui/Botao";
import {
  dadosDoBloco,
  fotosDoBloco,
  itensDaLista,
  linkPermitido,
  type Bloco,
} from "@/lib/admin/blocos";
import { ehCaminhoDeImagem } from "@/lib/imagens";

/**
 * Desenha no site os blocos montados no painel.
 *
 * Cada tipo cai num padrão que já existe no design system — o editor não
 * oferece nada que o site não saiba desenhar, então não há bloco "órfão"
 * quebrando a página.
 */
export function Blocos({ blocos }: { blocos: readonly Bloco[] }) {
  if (blocos.length === 0) return null;

  return (
    <div className="flex w-full flex-col gap-6">
      {blocos.map((bloco) => (
        <UmBloco key={bloco.id} bloco={bloco} />
      ))}
    </div>
  );
}

function UmBloco({ bloco }: { bloco: Bloco }) {
  switch (bloco.tipo) {
    case "titulo": {
      const texto = bloco.props.texto ?? "";
      if (!texto) return null;
      const nivel = bloco.props.nivel ?? "2";
      if (nivel === "4") return <h4 className="t-h5 mt-2">{texto}</h4>;
      if (nivel === "3") return <h3 className="t-h4 mt-3">{texto}</h3>;
      return <h2 className="t-h3 mt-4">{texto}</h2>;
    }

    case "texto": {
      const texto = bloco.props.texto ?? "";
      if (!texto) return null;
      return <p className="t-corpo whitespace-pre-line text-texto-corpo">{texto}</p>;
    }

    case "destaque": {
      const texto = bloco.props.texto ?? "";
      if (!texto) return null;
      return <p className="t-corpo-g whitespace-pre-line text-texto-corpo">{texto}</p>;
    }

    case "citacao": {
      const texto = bloco.props.texto ?? "";
      if (!texto) return null;
      return (
        <figure className="rounded-2xl border border-vidro-borda bg-vidro-preenchimento p-6 vidro-02 sm:p-8">
          <blockquote className="t-h5 text-texto-forte">{texto}</blockquote>
          {bloco.props.autor && (
            <figcaption className="mt-3 t-micro text-texto-suave">
              {bloco.props.autor}
            </figcaption>
          )}
        </figure>
      );
    }

    case "lista": {
      const itens = itensDaLista(bloco).filter(Boolean);
      if (itens.length === 0) return null;
      return (
        <ul className="flex flex-col gap-2.5">
          {itens.map((item, i) => (
            <li key={i} className="flex gap-3 t-corpo text-texto-corpo">
              <span aria-hidden className="mt-[0.7em] size-1.5 shrink-0 rounded-full bg-acao-secundaria" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      );
    }

    case "dados": {
      const dados = dadosDoBloco(bloco).filter((d) => d.valor || d.rotulo);
      if (dados.length === 0) return null;
      return (
        <dl className="grid grid-cols-2 gap-4 rounded-2xl border border-borda-sutil bg-fundo-superficie p-6 sm:grid-cols-4 sm:gap-6">
          {dados.map((dado, i) => (
            <div key={i} className="flex flex-col gap-1">
              <dt className="sr-only">{dado.rotulo}</dt>
              <dd className="t-h3 text-texto-forte">{dado.valor}</dd>
              <p className="t-micro text-texto-suave">{dado.rotulo}</p>
            </div>
          ))}
        </dl>
      );
    }

    case "imagem": {
      const src = bloco.props.src ?? "";
      // A gravação já valida; isto protege contra conteúdo antigo ou editado
      // direto no banco — o next/image derrubaria a página inteira.
      if (!ehCaminhoDeImagem(src)) return null;
      return (
        <figure className="flex flex-col gap-2.5">
          <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl border border-vidro-borda-baixa">
            <Image
              src={src}
              alt={bloco.props.alt ?? ""}
              fill
              sizes="(max-width: 768px) 100vw, 760px"
              className="object-cover"
            />
          </div>
          {bloco.props.legenda && (
            <figcaption className="t-micro text-texto-suave">{bloco.props.legenda}</figcaption>
          )}
        </figure>
      );
    }

    case "galeria": {
      const fotos = fotosDoBloco(bloco).filter((f) => ehCaminhoDeImagem(f.src));
      if (fotos.length === 0) return null;
      return (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {fotos.map((foto, i) => (
            <div
              key={`${foto.src}-${i}`}
              className="relative aspect-[4/3] overflow-hidden rounded-lg border border-vidro-borda-baixa"
            >
              <Image
                src={foto.src}
                alt={foto.alt}
                fill
                sizes="(max-width: 640px) 50vw, 33vw"
                className="object-cover"
              />
            </div>
          ))}
        </div>
      );
    }

    case "botao": {
      const rotulo = bloco.props.rotulo ?? "";
      const href = bloco.props.href ?? "";
      if (!rotulo || !linkPermitido(href)) return null;
      // Externo, e-mail e telefone saem como <a> comum; o Link do Next é só
      // para navegação dentro do site.
      if (!href.startsWith("/") && !href.startsWith("#")) {
        const externo = /^https?:\/\//i.test(href);
        return (
          <a
            href={href}
            target={externo ? "_blank" : undefined}
            rel={externo ? "noreferrer noopener" : undefined}
            className="inline-flex min-h-[44px] w-fit items-center rounded-pill bg-acao-primaria px-6 t-botao-m text-acao-sobre-primaria"
          >
            {rotulo}
          </a>
        );
      }
      return (
        <div className="w-fit">
          <BotaoLink href={href} tamanho="M">
            {rotulo}
          </BotaoLink>
        </div>
      );
    }

    case "espaco": {
      const altura = Math.min(200, Math.max(8, Number(bloco.props.altura) || 40));
      return <div aria-hidden style={{ height: altura }} />;
    }
  }
}

/** Usado quando um post/produto ainda não tem corpo montado no painel. */
export function SemConteudo() {
  return (
    <div className="w-full rounded-2xl border border-vidro-borda bg-vidro-preenchimento p-8 vidro-02">
      <h2 className="t-h5">Texto em produção</h2>
      <p className="mt-3 t-corpo text-texto-suave">
        O conteúdo ainda está sendo escrito. Enquanto isso, a gente explica tudo
        isso pessoalmente — a visita e a medição não têm custo em Itatiba e região.
      </p>
      <div className="mt-6 flex flex-wrap gap-3">
        <BotaoLink href="/contato" tamanho="M">
          Agendar medição
        </BotaoLink>
        <Link
          href="/blog"
          className="inline-flex min-h-[44px] items-center rounded-pill px-4 t-botao-m text-texto-forte underline-offset-4 hover:underline"
        >
          Voltar ao blog
        </Link>
      </div>
    </div>
  );
}
