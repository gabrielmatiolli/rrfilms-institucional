/**
 * Blocos de conteúdo do editor — usados no corpo dos posts do blog e nas
 * páginas próprias de produto.
 *
 * Os valores de `props` são sempre string: blocos com lista (galeria, lista,
 * dados) guardam um JSON.stringify() no campo. Isso mantém o inspetor genérico
 * e o JSON do banco estável, sem union type por tipo de bloco.
 *
 * Cada tipo existe porque tem um par no design system — não há bloco que o site
 * não saiba desenhar. Ver src/components/conteudo/Blocos.tsx.
 */

import { ehCaminhoDeImagem } from "@/lib/imagens";

export type TipoDeBloco =
  | "titulo"
  | "texto"
  | "destaque"
  | "imagem"
  | "galeria"
  | "citacao"
  | "lista"
  | "dados"
  | "botao"
  | "espaco";

export interface Bloco {
  id: string;
  tipo: TipoDeBloco;
  props: Record<string, string>;
}

export const BIBLIOTECA_DE_BLOCOS: {
  tipo: TipoDeBloco;
  rotulo: string;
  descricao: string;
}[] = [
  { tipo: "titulo", rotulo: "Título", descricao: "Divide o artigo em seções" },
  { tipo: "texto", rotulo: "Parágrafo", descricao: "Corpo do texto" },
  { tipo: "destaque", rotulo: "Destaque", descricao: "Parágrafo em corpo grande" },
  { tipo: "imagem", rotulo: "Imagem", descricao: "Foto com legenda opcional" },
  { tipo: "galeria", rotulo: "Galeria", descricao: "Grade de até 6 fotos" },
  { tipo: "citacao", rotulo: "Citação", descricao: "Fala de cliente ou técnico" },
  { tipo: "lista", rotulo: "Lista", descricao: "Itens com marcador" },
  { tipo: "dados", rotulo: "Faixa de dados", descricao: "Números como 79% · menos calor" },
  { tipo: "botao", rotulo: "Botão", descricao: "Chamada para ação" },
  { tipo: "espaco", rotulo: "Espaço", descricao: "Respiro entre blocos" },
];

export function criarBloco(tipo: TipoDeBloco): Bloco {
  const id = `${tipo}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  switch (tipo) {
    case "titulo":
      return { id, tipo, props: { texto: "Novo título", nivel: "2" } };
    case "texto":
      return { id, tipo, props: { texto: "Novo parágrafo." } };
    case "destaque":
      return { id, tipo, props: { texto: "Parágrafo de abertura, em corpo grande." } };
    case "imagem":
      return { id, tipo, props: { src: "", alt: "", legenda: "" } };
    case "galeria":
      return { id, tipo, props: { imagens: "[]" } };
    case "citacao":
      return { id, tipo, props: { texto: "Frase do cliente.", autor: "" } };
    case "lista":
      return { id, tipo, props: { itens: '["Primeiro item"]' } };
    case "dados":
      return { id, tipo, props: { itens: '[{"valor":"79%","rotulo":"menos calor"}]' } };
    case "botao":
      return { id, tipo, props: { rotulo: "Agendar medição", href: "/contato" } };
    case "espaco":
      return { id, tipo, props: { altura: "40" } };
  }
}

// --- Listas guardadas como JSON em props -----------------------------------

export interface FotoDeBloco {
  src: string;
  alt: string;
}

export interface DadoDeBloco {
  valor: string;
  rotulo: string;
}

function lerJson<T>(bruto: string | undefined, valido: (item: unknown) => item is T): T[] {
  try {
    const analisado: unknown = JSON.parse(bruto || "[]");
    return Array.isArray(analisado) ? analisado.filter(valido) : [];
  } catch {
    return [];
  }
}

const ehTexto = (item: unknown): item is string => typeof item === "string";

const ehFoto = (item: unknown): item is FotoDeBloco =>
  typeof item === "object" &&
  item !== null &&
  typeof (item as FotoDeBloco).src === "string" &&
  typeof (item as FotoDeBloco).alt === "string";

const ehDado = (item: unknown): item is DadoDeBloco =>
  typeof item === "object" &&
  item !== null &&
  typeof (item as DadoDeBloco).valor === "string" &&
  typeof (item as DadoDeBloco).rotulo === "string";

export const fotosDoBloco = (bloco: Bloco) => lerJson(bloco.props.imagens, ehFoto);
export const itensDaLista = (bloco: Bloco) => lerJson(bloco.props.itens, ehTexto);
export const dadosDoBloco = (bloco: Bloco) => lerJson(bloco.props.itens, ehDado);

export const guardarLista = (itens: unknown[]) => JSON.stringify(itens);

// --- Validação e leitura ----------------------------------------------------

const TIPOS = new Set<string>(BIBLIOTECA_DE_BLOCOS.map((b) => b.tipo));
const MAX_BLOCOS = 300;

/**
 * Converte o Json do Prisma em Bloco[] descartando o que não bate com o
 * formato. O conteúdo vem do banco, mas passou por um form — nada impede que
 * um post antigo tenha um tipo de bloco que não existe mais.
 *
 * Das props, só sobrevivem valores string: um objeto ali viraria filho de
 * elemento React no site e derrubaria a página.
 */
export function lerBlocos(bruto: unknown): Bloco[] {
  if (!Array.isArray(bruto)) return [];

  const blocos: Bloco[] = [];
  for (const item of bruto) {
    if (typeof item !== "object" || item === null) continue;
    const { id, tipo, props } = item as Record<string, unknown>;
    if (typeof id !== "string" || typeof tipo !== "string" || !TIPOS.has(tipo)) continue;
    if (typeof props !== "object" || props === null) continue;

    const limpas: Record<string, string> = {};
    for (const [chave, valor] of Object.entries(props)) {
      if (typeof valor === "string") limpas[chave] = valor;
    }
    blocos.push({ id, tipo: tipo as TipoDeBloco, props: limpas });
  }
  return blocos;
}

/**
 * Destinos aceitos no bloco de botão. Lista do que é permitido, não do que é
 * proibido: `javascript:`, `data:` e qualquer esquema que alguém invente ficam
 * de fora sem precisar serem previstos.
 */
export function linkPermitido(href: string): boolean {
  const valor = href.trim();
  if (valor.startsWith("/")) return !valor.startsWith("//");
  if (valor.startsWith("#")) return valor.length > 1;
  return /^(https?:\/\/|mailto:|tel:)/i.test(valor);
}

/**
 * Confere o conteúdo antes de gravar. Devolve a primeira mensagem de erro, com
 * o número do bloco, ou null quando está tudo certo. Roda nas Server Actions —
 * o editor já monta os blocos certos, mas a action é um endpoint e aceita o
 * que chegar.
 */
export function validarBlocos(blocos: Bloco[]): string | null {
  if (blocos.length > MAX_BLOCOS) {
    return `O conteúdo passou do limite de ${MAX_BLOCOS} blocos.`;
  }

  for (const [indice, bloco] of blocos.entries()) {
    const numero = indice + 1;

    if (bloco.tipo === "imagem") {
      const src = bloco.props.src ?? "";
      if (src && !ehCaminhoDeImagem(src)) {
        return `A imagem do bloco ${numero} precisa ser uma foto do próprio site (o endereço começa com /).`;
      }
    }

    if (bloco.tipo === "galeria") {
      if (fotosDoBloco(bloco).some((foto) => !ehCaminhoDeImagem(foto.src))) {
        return `A galeria do bloco ${numero} tem uma foto que não é do próprio site.`;
      }
    }

    if (bloco.tipo === "botao") {
      const href = bloco.props.href ?? "";
      if (href && !linkPermitido(href)) {
        return `O link do botão do bloco ${numero} não é aceito. Use um caminho do site (/contato), um endereço https://, mailto: ou tel:.`;
      }
    }
  }

  return null;
}

/** Texto corrido dos blocos — usado para estimar o tempo de leitura. */
export function textoDosBlocos(blocos: Bloco[]): string {
  return blocos
    .map((bloco) => {
      switch (bloco.tipo) {
        case "lista":
          return itensDaLista(bloco).join(" ");
        case "dados":
          return dadosDoBloco(bloco)
            .map((d) => `${d.valor} ${d.rotulo}`)
            .join(" ");
        case "galeria":
        case "espaco":
          return "";
        default:
          return [bloco.props.texto, bloco.props.legenda, bloco.props.autor]
            .filter(Boolean)
            .join(" ");
      }
    })
    .join(" ");
}

/** ~200 palavras por minuto, mínimo de 1. */
export function minutosDeLeitura(blocos: Bloco[]): number {
  const palavras = textoDosBlocos(blocos).trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(palavras / 200));
}
