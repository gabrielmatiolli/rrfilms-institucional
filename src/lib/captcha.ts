import "server-only";

interface RespostaHcaptcha {
  success: boolean;
  [chave: string]: unknown;
}

/** true quando o hCaptcha confirma o token. Lança se a chave não estiver configurada. */
export async function conferirHcaptcha(token: string) {
  if (!token) return false;

  const segredo = process.env.HCAPTCHA_SECRET_KEY;
  if (!segredo) throw new Error("HCAPTCHA_SECRET_KEY não configurado. Veja o .env.example.");

  const corpo = new URLSearchParams({ secret: segredo, response: token });
  const resposta = await fetch("https://hcaptcha.com/siteverify", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: corpo,
  });

  if (!resposta.ok) return false;
  const dados = (await resposta.json()) as RespostaHcaptcha;
  return dados.success === true;
}
