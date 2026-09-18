"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import HCaptcha from "@hcaptcha/react-hcaptcha";

import { Campo } from "@/components/admin/Campos";
import { BotaoPainel, Erro } from "@/components/admin/Ui";
import { entrar, type EstadoDeLogin } from "@/app/admin/login/acoes";

const estadoInicial: EstadoDeLogin = {};

export default function FormularioDeLogin({ de }: { de: string }) {
  const [estado, acao, enviando] = useActionState(entrar, estadoInicial);
  const [tokenCaptcha, setTokenCaptcha] = useState("");
  const [mostrarDica, setMostrarDica] = useState(false);
  const captchaRef = useRef<HCaptcha>(null);

  const chaveDoSite = process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY ?? "";

  // Um token do hCaptcha só vale uma vez: depois de uma tentativa recusada é
  // preciso resolver de novo, senão o próximo envio falha no siteverify.
  useEffect(() => {
    if (estado.erro) {
      captchaRef.current?.resetCaptcha();
      // eslint-disable-next-line react-hooks/set-state-in-effect -- limpa o token após falha
      setTokenCaptcha("");
    }
  }, [estado.erro]);

  return (
    <form action={acao} className="flex w-full flex-col gap-5">
      <input type="hidden" name="de" value={de} />
      <input type="hidden" name="captcha" value={tokenCaptcha} />

      <Campo
        id="email"
        rotulo="E-mail"
        type="email"
        autoComplete="email"
        required
        placeholder="voce@rrfilm.com.br"
      />

      <Campo
        id="senha"
        rotulo="Senha"
        type="password"
        autoComplete="current-password"
        required
        placeholder="••••••••••"
      />

      {estado.erro && <Erro>{estado.erro}</Erro>}

      <div className="flex flex-wrap items-center justify-between gap-2">
        <label className="-my-2 flex cursor-pointer items-center gap-2 py-2 text-[13px] text-texto-suave">
          <input
            type="checkbox"
            name="lembrar"
            className="size-4 accent-[var(--acao-secundaria)]"
          />
          Manter conectado
        </label>
        <button
          type="button"
          onClick={() => setMostrarDica((v) => !v)}
          className="-my-2 py-2 text-[13px] font-semibold text-texto-forte underline-offset-4 hover:underline"
        >
          Esqueci minha senha
        </button>
      </div>

      {mostrarDica && (
        <p className="-mt-2 text-[12.5px] text-texto-suave">
          Peça a redefinição a quem tem acesso de dono do painel. Por segurança,
          não existe recuperação por e-mail.
        </p>
      )}

      <div className="flex justify-center">
        <HCaptcha
          ref={captchaRef}
          sitekey={chaveDoSite}
          languageOverride="pt-BR"
          onVerify={(token) => setTokenCaptcha(token)}
          onExpire={() => setTokenCaptcha("")}
          onError={() => setTokenCaptcha("")}
        />
      </div>

      <BotaoPainel type="submit" disabled={enviando || !tokenCaptcha} className="w-full">
        {enviando ? "Entrando…" : "Entrar"}
      </BotaoPainel>
    </form>
  );
}
