/**
 * As opções dos formulários de orçamento, e como uma página de produto
 * pré-seleciona a opção certa pela URL.
 *
 * Ficam aqui, e não dentro do componente, porque quem monta o link é a página
 * de produto (`/contato?interesse=calor`) e quem resolve o valor é o formulário:
 * com as duas pontas no mesmo arquivo, um rótulo renomeado não deixa a
 * pré-seleção silenciosamente sem efeito.
 */

/** Campo 5 — "Para onde é a película?" (obrigatório em /contato). */
export const DESTINOS_DA_PELICULA = [
  "Casa",
  "Apartamento",
  "Empresa ou escritório",
  "Clínica ou consultório",
  "Comércio",
  "Projeto de arquitetura",
] as const;

/** Campo 6 — "O que você procura?". */
export const INTERESSES = [
  "Não sei, quero uma indicação",
  "Menos calor (Nanocerâmica)",
  "Segurança (Antiestilhaço)",
  "Privacidade (Refletiva)",
  "Jateado ou decorativo",
  "Remover ou trocar película",
] as const;

/** Segmento — o formulário corporativo de /para-empresas. */
export const SEGMENTOS = [
  "Escritório",
  "Clínica ou consultório",
  "Comércio",
  "Arquitetura ou vidraçaria",
  "Outro",
] as const;

/** Metragem aproximada de vidro (opcional). */
export const FAIXAS_DE_METRAGEM = [
  "Até 100 m²",
  "De 100 a 300 m²",
  "De 300 a 1.000 m²",
  "Acima de 1.000 m²",
  "Não sei — preciso de medição",
] as const;

/**
 * `?interesse=` → a opção do campo 6. A chave é o que as páginas de produto
 * colocam no link; use `linkDoContato()` para montar.
 */
const INTERESSE_POR_CHAVE: Record<string, (typeof INTERESSES)[number]> = {
  calor: "Menos calor (Nanocerâmica)",
  seguranca: "Segurança (Antiestilhaço)",
  privacidade: "Privacidade (Refletiva)",
  jateado: "Jateado ou decorativo",
  manutencao: "Remover ou trocar película",
};

export type ChaveDeInteresse = keyof typeof INTERESSE_POR_CHAVE;

export function interesseDaUrl(chave: string | undefined) {
  return chave ? INTERESSE_POR_CHAVE[chave] : undefined;
}

/** `?tipo=empresa` abre o formulário já em "Empresa ou escritório". */
export function destinoDaUrl(tipo: string | undefined) {
  return tipo === "empresa" ? "Empresa ou escritório" : undefined;
}

/** Monta o link para /contato a partir de uma página de produto. */
export function linkDoContato({
  interesse,
  empresa = false,
}: {
  interesse?: ChaveDeInteresse;
  empresa?: boolean;
} = {}) {
  const parametros = new URLSearchParams();
  if (empresa) parametros.set("tipo", "empresa");
  if (interesse) parametros.set("interesse", interesse);
  const consulta = parametros.toString();
  return consulta ? `/contato?${consulta}` : "/contato";
}
