/**
 * Caminho de imagem servido pelo próprio site: /fotos/… (acervo do Figma) ou
 * /uploads/… (enviado pelo painel).
 *
 * É um tipo e não só `string` porque o site tem dois vocabulários de imagem que
 * se parecem: o slot do arquivo de design ("casas-ambiente-1", ver
 * src/content/fotos.ts) e o caminho do arquivo ("/fotos/amostra-luz.jpg"). Com
 * `string`, passar um slot onde se espera caminho compila e só quebra em
 * produção, no next/image. Com a barra no tipo, quebra no `tsc`.
 */
export type CaminhoDeImagem = `/${string}`;

/** Aceita só caminho local: com barra inicial, sem "//" (URL externa) nem "..". */
export function ehCaminhoDeImagem(valor: string): valor is CaminhoDeImagem {
  return valor.startsWith("/") && !valor.startsWith("//") && !valor.includes("..");
}

/**
 * Para ler caminhos vindos do banco. A gravação já valida (ver as actions do
 * painel), então isto é só a última linha de defesa: um valor inválido vira
 * "sem imagem", que todo componente de foto sabe desenhar, em vez de derrubar a
 * página inteira com erro do next/image.
 */
export function caminhoOuVazio(valor: string | null | undefined): CaminhoDeImagem | "" {
  return valor && ehCaminhoDeImagem(valor) ? valor : "";
}
