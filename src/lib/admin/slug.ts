/** "Nanocerâmica Ultra HD" -> "nanoceramica-ultra-hd" */
export function gerarSlug(valor: string) {
  return valor
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-+|-+$)/g, "");
}
