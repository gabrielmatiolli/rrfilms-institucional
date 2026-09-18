"use client";

import { useActionState } from "react";

import { Campo } from "@/components/admin/Campos";
import { BotaoPainel, Cartao, Erro, TituloDeBloco } from "@/components/admin/Ui";
import { salvarContato, type EstadoDoConteudo } from "@/app/admin/(painel)/conteudo/acoes";
import type { ContatoDoSite } from "@/lib/dados/configuracao";

const estadoInicial: EstadoDoConteudo = {};

export default function FormularioDeContato({ valores }: { valores: ContatoDoSite }) {
  const [estado, enviar, enviando] = useActionState(salvarContato, estadoInicial);

  return (
    <form action={enviar} className="flex flex-col gap-5">
      <Cartao>
        <TituloDeBloco dica="Alimentam o rodapé, a página de Contato e o botão de WhatsApp.">
          Dados institucionais
        </TituloDeBloco>

        <div className="flex flex-col gap-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <Campo
              id="telefone"
              rotulo="Telefone"
              required
              defaultValue={valores.telefone}
              placeholder="(11) 97374-2600"
              dica="Como aparece escrito no site."
            />
            <Campo
              id="telefoneLink"
              rotulo="Link do telefone"
              required
              defaultValue={valores.telefoneLink}
              placeholder="tel:+5511973742600"
              dica="O que o celular disca ao tocar no número."
            />
          </div>

          <Campo
            id="whatsapp"
            rotulo="WhatsApp"
            required
            type="url"
            defaultValue={valores.whatsapp}
            placeholder="https://wa.me/5511973742600"
          />

          <Campo
            id="email"
            rotulo="E-mail"
            required
            type="email"
            defaultValue={valores.email}
          />

          <div className="grid gap-5 sm:grid-cols-2">
            <Campo
              id="instagram"
              rotulo="Instagram"
              required
              defaultValue={valores.instagram}
              placeholder="@rrfilmdecor"
            />
            <Campo
              id="instagramUrl"
              rotulo="Link do Instagram"
              required
              type="url"
              defaultValue={valores.instagramUrl}
            />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <Campo
              id="horario"
              rotulo="Horário"
              required
              defaultValue={valores.horario}
              placeholder="Seg a sex, 8h às 18h"
            />
            <Campo
              id="cidade"
              rotulo="Cidade"
              required
              defaultValue={valores.cidade}
              placeholder="Itatiba, SP"
            />
          </div>

          <Campo
            id="atendimento"
            rotulo="Área de atendimento"
            required
            defaultValue={valores.atendimento}
            placeholder="Itatiba, SP — atendimento em toda a região"
          />

          <Campo
            id="cnpj"
            rotulo="CNPJ"
            required
            defaultValue={valores.cnpj}
            dica="Aparece no rodapé. O valor 00.000.000/0001-00 é o do arquivo de design — troque pelo real."
          />
        </div>
      </Cartao>

      {estado.erro && <Erro>{estado.erro}</Erro>}
      {estado.ok && !estado.erro && (
        <p className="rounded-xl border border-frescor-500 bg-frescor-100 px-4 py-3 text-[13px] font-semibold text-escuro-900">
          Dados salvos.
        </p>
      )}

      <BotaoPainel type="submit" disabled={enviando} className="self-start">
        {enviando ? "Salvando…" : "Salvar dados"}
      </BotaoPainel>
    </form>
  );
}
