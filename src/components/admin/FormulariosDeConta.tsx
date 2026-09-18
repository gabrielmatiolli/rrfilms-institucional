"use client";

import { useActionState, useState } from "react";

import { Campo, Selecao } from "@/components/admin/Campos";
import { BotaoPainel, Cartao, Erro, TituloDeBloco } from "@/components/admin/Ui";
import {
  criarUsuario,
  redefinirSenhaDeUsuario,
  trocarSenha,
  type EstadoDaConta,
} from "@/app/admin/(painel)/configuracoes/acoes";

const estadoInicial: EstadoDaConta = {};

const REGRA_DE_SENHA =
  "Mínimo de 10 caracteres, com maiúscula, minúscula e número.";

function Resultado({ estado }: { estado: EstadoDaConta }) {
  if (estado.erro) return <Erro>{estado.erro}</Erro>;
  if (estado.ok) {
    return (
      <p className="rounded-xl border border-frescor-500 bg-frescor-100 px-4 py-3 text-[13px] font-semibold text-escuro-900">
        {estado.ok}
      </p>
    );
  }
  return null;
}

export function FormularioDeSenha() {
  const [estado, enviar, enviando] = useActionState(trocarSenha, estadoInicial);

  return (
    <Cartao>
      <TituloDeBloco dica="Trocar a senha desconecta a conta de todos os outros dispositivos.">
        Minha senha
      </TituloDeBloco>
      <form action={enviar} className="flex flex-col gap-5">
        <Campo
          id="senhaAtual"
          rotulo="Senha atual"
          type="password"
          autoComplete="current-password"
          required
        />
        <div className="grid gap-5 sm:grid-cols-2">
          <Campo
            id="senhaNova"
            rotulo="Senha nova"
            type="password"
            autoComplete="new-password"
            required
            dica={REGRA_DE_SENHA}
          />
          <Campo
            id="confirmacao"
            rotulo="Repita a senha nova"
            type="password"
            autoComplete="new-password"
            required
          />
        </div>

        <Resultado estado={estado} />

        <BotaoPainel type="submit" disabled={enviando} className="self-start">
          {enviando ? "Trocando…" : "Trocar senha"}
        </BotaoPainel>
      </form>
    </Cartao>
  );
}

export function FormularioDeNovoUsuario() {
  const [estado, enviar, enviando] = useActionState(criarUsuario, estadoInicial);
  const [aberto, setAberto] = useState(false);

  if (!aberto) {
    return (
      <button
        type="button"
        onClick={() => setAberto(true)}
        className="min-h-[44px] self-start rounded-pill border border-dashed border-borda-media/40 px-5 text-[13.5px] font-semibold text-texto-forte hover:border-texto-forte"
      >
        + Criar conta de acesso
      </button>
    );
  }

  return (
    <Cartao>
      <TituloDeBloco dica="O editor mexe no conteúdo; o dono também gerencia as contas.">
        Nova conta de acesso
      </TituloDeBloco>
      <form action={enviar} className="flex flex-col gap-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <Campo id="nome" rotulo="Nome" required maxLength={80} />
          <Campo id="email" rotulo="E-mail" type="email" required autoComplete="off" />
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <Campo
            id="senha"
            rotulo="Senha inicial"
            type="password"
            required
            autoComplete="new-password"
            dica={REGRA_DE_SENHA}
          />
          <Selecao
            id="papel"
            rotulo="Papel"
            defaultValue="EDITOR"
            opcoes={[
              { valor: "EDITOR", rotulo: "Editor — só conteúdo" },
              { valor: "DONO", rotulo: "Dono — conteúdo e contas" },
            ]}
          />
        </div>

        <Resultado estado={estado} />

        <div className="flex flex-wrap gap-3">
          <BotaoPainel type="submit" disabled={enviando}>
            {enviando ? "Criando…" : "Criar conta"}
          </BotaoPainel>
          <button
            type="button"
            onClick={() => setAberto(false)}
            className="inline-flex min-h-[44px] items-center rounded-pill px-4 text-[14px] font-semibold text-texto-suave hover:text-texto-forte"
          >
            Cancelar
          </button>
        </div>
      </form>
    </Cartao>
  );
}

export function FormularioDeRedefinicao({ id, nome }: { id: string; nome: string }) {
  const [estado, enviar, enviando] = useActionState(redefinirSenhaDeUsuario, estadoInicial);
  const [aberto, setAberto] = useState(false);

  if (!aberto) {
    return (
      <button
        type="button"
        onClick={() => setAberto(true)}
        className="inline-flex min-h-[44px] items-center justify-center rounded-pill px-4 text-[13px] font-semibold text-texto-suave hover:text-texto-forte"
      >
        Redefinir senha
      </button>
    );
  }

  return (
    <form action={enviar} className="flex w-full flex-col gap-2.5">
      <input type="hidden" name="id" value={id} />
      <Campo
        id={`senha-${id}`}
        name="senha"
        rotulo={`Senha nova de ${nome}`}
        type="password"
        required
        autoComplete="new-password"
        dica={REGRA_DE_SENHA}
      />

      <Resultado estado={estado} />

      <div className="flex flex-wrap gap-2">
        <BotaoPainel type="submit" disabled={enviando} tipo="contorno" className="text-[13px]">
          {enviando ? "Salvando…" : "Salvar senha"}
        </BotaoPainel>
        <button
          type="button"
          onClick={() => setAberto(false)}
          className="inline-flex min-h-[44px] items-center px-3 text-[13px] font-semibold text-texto-suave"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
