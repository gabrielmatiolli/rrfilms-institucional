type ValorDeClasse = string | number | null | undefined | false | ValorDeClasse[];

function achatar(entrada: ValorDeClasse[], saida: string[]) {
  for (const valor of entrada) {
    if (!valor) continue;
    if (Array.isArray(valor)) achatar(valor, saida);
    else saida.push(String(valor));
  }
}

/** Junta nomes de classe, descartando valores falsos. */
export function cn(...entradas: ValorDeClasse[]) {
  const saida: string[] = [];
  achatar(entradas, saida);
  return saida.join(" ");
}
