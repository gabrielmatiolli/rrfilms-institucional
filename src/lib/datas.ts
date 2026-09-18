const DATA_LONGA = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "long",
  year: "numeric",
  timeZone: "America/Sao_Paulo",
});

const DATA_CURTA = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  timeZone: "America/Sao_Paulo",
});

const DATA_E_HORA = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "America/Sao_Paulo",
});

/** "12 de agosto de 2026" */
export const dataLonga = (data: Date) => DATA_LONGA.format(data);

/** "12/08/2026" */
export const dataCurta = (data: Date) => DATA_CURTA.format(data);

/** "12/08/2026 14:32" */
export const dataEHora = (data: Date) => DATA_E_HORA.format(data);

/**
 * A linha de apoio dos cards do blog, como no Figma:
 * "12 de agosto de 2026 · 6 min de leitura".
 */
export function metaDoPost(publicadoEm: Date, minutos: number, curta = false) {
  const leitura = curta ? `${minutos} min` : `${minutos} min de leitura`;
  return `${dataLonga(publicadoEm)} · ${leitura}`;
}

/** "há 5 minutos", "há 3 dias" — usado no feed de atividade do painel. */
export function tempoRelativo(data: Date) {
  const segundos = Math.round((Date.now() - data.getTime()) / 1000);
  if (segundos < 60) return "agora há pouco";

  const escalas: [limite: number, divisor: number, unidade: Intl.RelativeTimeFormatUnit][] = [
    [3600, 60, "minute"],
    [86400, 3600, "hour"],
    [2592000, 86400, "day"],
    [31536000, 2592000, "month"],
    [Infinity, 31536000, "year"],
  ];

  const formatador = new Intl.RelativeTimeFormat("pt-BR", { numeric: "auto" });
  for (const [limite, divisor, unidade] of escalas) {
    if (segundos < limite) return formatador.format(-Math.round(segundos / divisor), unidade);
  }
  return dataCurta(data);
}
