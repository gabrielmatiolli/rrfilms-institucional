"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { assinarSessao, conferirSenha } from "@/lib/admin/autenticacao";
import { COOKIE_DE_SESSAO, lerSessao } from "@/lib/admin/sessao";
import { conferirHcaptcha } from "@/lib/captcha";
import { registrarAtividade } from "@/lib/admin/atividade";
import {
  contarFalhaDaConta,
  ipBloqueado,
  ipDoCliente,
  limparTentativasAntigas,
  registrarTentativa,
} from "@/lib/admin/seguranca";
import { LoginAttemptReason } from "@/generated/prisma/client";

const esquema = z.object({
  email: z.string().trim().toLowerCase().email("Informe um e-mail válido."),
  senha: z.string().min(1, "Informe sua senha."),
  lembrar: z.string().optional(),
  de: z.string().optional(),
  captcha: z.string().min(1, "Confirme que você não é um robô."),
});

// Mensagem única para conta bloqueada, IP bloqueado, senha errada e e-mail
// inexistente: qualquer diferença aqui conta a quem está tentando se o e-mail
// existe e em que estado a conta está.
const MENSAGEM_BLOQUEIO = "Muitas tentativas. Tente novamente em 15 minutos.";
const MENSAGEM_CREDENCIAIS = "E-mail ou senha incorretos.";
const MENSAGEM_CAPTCHA = "Não foi possível confirmar o captcha. Tente novamente.";

/** Só aceita voltar para dentro de /admin — impede open redirect via `?de=`. */
function destinoSeguro(de: string | undefined) {
  if (!de || de === "/admin/login") return "/admin";
  if (de !== "/admin" && !de.startsWith("/admin/")) return "/admin";
  // Barra dupla vira URL absoluta ("//evil.com") no navegador.
  if (de.startsWith("//")) return "/admin";
  return de;
}

export interface EstadoDeLogin {
  erro?: string;
}

export async function entrar(
  _anterior: EstadoDeLogin,
  formulario: FormData,
): Promise<EstadoDeLogin> {
  const analise = esquema.safeParse({
    email: formulario.get("email"),
    senha: formulario.get("senha"),
    lembrar: formulario.get("lembrar") ?? undefined,
    de: formulario.get("de") ?? undefined,
    captcha: formulario.get("captcha"),
  });

  if (!analise.success) {
    return { erro: analise.error.issues[0]?.message ?? "Dados inválidos." };
  }

  const { email, senha, lembrar, de, captcha } = analise.data;
  const ip = await ipDoCliente();

  // Camada 1: balde por IP. Cobre também tentativas contra e-mails que não
  // existem, antes de qualquer consulta de usuário ou chamada externa.
  if (await ipBloqueado(ip)) {
    await registrarTentativa({ email, ip, sucesso: false, motivo: LoginAttemptReason.IP_BLOQUEADO });
    return { erro: MENSAGEM_BLOQUEIO };
  }

  const usuario = await prisma.adminUser.findUnique({ where: { email } });

  // Camada 2: conta bloqueada por tentativas consecutivas — antes do captcha e
  // do bcrypt, que são os passos caros.
  if (usuario?.bloqueadoAte && usuario.bloqueadoAte > new Date()) {
    await registrarTentativa({
      email,
      ip,
      sucesso: false,
      motivo: LoginAttemptReason.CONTA_BLOQUEADA,
    });
    return { erro: MENSAGEM_BLOQUEIO };
  }

  const captchaOk = await conferirHcaptcha(captcha).catch(() => false);
  if (!captchaOk) {
    await registrarTentativa({
      email,
      ip,
      sucesso: false,
      motivo: LoginAttemptReason.CAPTCHA_FALHOU,
    });
    return { erro: MENSAGEM_CAPTCHA };
  }

  // conferirSenha compara contra um hash fixo quando `usuario` é null, pra o
  // tempo de resposta não revelar se o e-mail está cadastrado.
  const senhaOk = await conferirSenha(senha, usuario?.passwordHash);

  if (!usuario || !senhaOk) {
    await registrarTentativa({
      email,
      ip,
      sucesso: false,
      motivo: LoginAttemptReason.CREDENCIAIS_INVALIDAS,
    });
    if (usuario) await contarFalhaDaConta(usuario.id, usuario.email);
    return { erro: MENSAGEM_CREDENCIAIS };
  }

  if (!usuario.ativo) {
    await registrarTentativa({ email, ip, sucesso: false, motivo: LoginAttemptReason.CONTA_INATIVA });
    return { erro: MENSAGEM_CREDENCIAIS };
  }

  // Bookkeeping isolado: uma falha aqui não pode impedir quem acertou a senha
  // de receber a sessão.
  try {
    await Promise.all([
      prisma.adminUser.update({
        where: { id: usuario.id },
        data: {
          tentativasFalhas: 0,
          bloqueadoAte: null,
          ultimoLoginEm: new Date(),
          ultimoLoginIp: ip,
        },
      }),
      registrarTentativa({ email, ip, sucesso: true, motivo: LoginAttemptReason.SUCESSO }),
      registrarAtividade(`Entrou no painel`, usuario.nome),
      limparTentativasAntigas(),
    ]);
  } catch (erro) {
    console.error("Falha ao registrar login bem-sucedido:", erro);
  }

  const manterConectado = lembrar === "on";
  const token = await assinarSessao(
    {
      sub: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
      papel: usuario.papel,
      ver: usuario.versaoSessao,
    },
    manterConectado ? "30d" : "12h",
  );

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_DE_SESSAO, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    // Sem maxAge, o cookie morre quando o navegador fecha.
    ...(manterConectado ? { maxAge: 60 * 60 * 24 * 30 } : {}),
  });

  redirect(destinoSeguro(de));
}

export async function sair() {
  const dados = await lerSessao();
  if (dados) await registrarAtividade("Saiu do painel", String(dados.nome));

  (await cookies()).delete(COOKIE_DE_SESSAO);
  redirect("/admin/login");
}
