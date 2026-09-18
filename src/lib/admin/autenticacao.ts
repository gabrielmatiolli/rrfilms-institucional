import "server-only";
import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";

const RODADAS_SAL = 12;

// Hash bcrypt fixo (não corresponde a nenhuma senha real) — comparado quando
// o e-mail não existe, pra manter o tempo de resposta igual ao de uma senha
// errada em conta existente e não vazar por timing se o e-mail está cadastrado.
const HASH_FALSO = bcrypt.hashSync("conta-inexistente", RODADAS_SAL);

export function gerarHashDeSenha(senha: string) {
  return bcrypt.hash(senha, RODADAS_SAL);
}

export function conferirSenha(senha: string, hash?: string | null) {
  return bcrypt.compare(senha, hash ?? HASH_FALSO);
}

/** Regras mínimas de senha do painel. Devolve null quando a senha passa. */
export function criticarSenha(senha: string): string | null {
  if (senha.length < 10) return "A senha precisa ter pelo menos 10 caracteres.";
  if (!/[a-z]/.test(senha)) return "A senha precisa ter pelo menos uma letra minúscula.";
  if (!/[A-Z]/.test(senha)) return "A senha precisa ter pelo menos uma letra maiúscula.";
  if (!/[0-9]/.test(senha)) return "A senha precisa ter pelo menos um número.";
  return null;
}

export interface DadosDaSessao {
  /** id do AdminUser. */
  sub: string;
  nome: string;
  email: string;
  papel: string;
  /** versaoSessao do usuário no momento da assinatura — ver schema.prisma. */
  ver: number;
  [chave: string]: unknown;
}

function chaveSecreta() {
  const segredo = process.env.JWT_SECRET;
  if (!segredo || segredo.length < 32) {
    throw new Error(
      "JWT_SECRET ausente ou curto demais (mínimo 32 caracteres). Veja o .env.example.",
    );
  }
  return new TextEncoder().encode(segredo);
}

export async function assinarSessao(dados: DadosDaSessao, validade: "12h" | "30d") {
  return new SignJWT(dados)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(validade)
    .sign(chaveSecreta());
}

export async function conferirSessao(token: string): Promise<DadosDaSessao | null> {
  try {
    const { payload } = await jwtVerify(token, chaveSecreta(), { algorithms: ["HS256"] });
    return payload as DadosDaSessao;
  } catch {
    return null;
  }
}
