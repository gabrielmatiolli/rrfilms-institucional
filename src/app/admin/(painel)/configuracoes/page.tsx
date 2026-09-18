import type { Metadata } from "next";

import BotaoDeExcluir from "@/components/admin/BotaoDeExcluir";
import {
  FormularioDeNovoUsuario,
  FormularioDeRedefinicao,
  FormularioDeSenha,
} from "@/components/admin/FormulariosDeConta";
import { BotaoPainel, CabecalhoDePagina, Cartao, Selo, TituloDeBloco } from "@/components/admin/Ui";
import {
  alternarAtivoDoUsuario,
  excluirUsuario,
  sairDeTodosOsDispositivos,
} from "@/app/admin/(painel)/configuracoes/acoes";
import { exigirAdmin } from "@/lib/admin/sessao";
import { prisma } from "@/lib/prisma";
import { dataEHora } from "@/lib/datas";

export const metadata: Metadata = { title: "Configurações" };

const MOTIVO = {
  SUCESSO: "Entrou",
  CREDENCIAIS_INVALIDAS: "Senha ou e-mail errado",
  CONTA_BLOQUEADA: "Conta bloqueada",
  CONTA_INATIVA: "Conta inativa",
  IP_BLOQUEADO: "IP bloqueado",
  CAPTCHA_FALHOU: "Captcha falhou",
} as const;

export default async function ConfiguracoesAdmin() {
  const admin = await exigirAdmin("/admin/configuracoes");
  const ehDono = admin.papel === "DONO";

  const [usuarios, tentativas] = await Promise.all([
    ehDono
      ? prisma.adminUser.findMany({ orderBy: [{ papel: "asc" }, { nome: "asc" }] })
      : Promise.resolve([]),
    prisma.loginAttempt.findMany({ orderBy: { criadoEm: "desc" }, take: 25 }),
  ]);

  return (
    <>
      <CabecalhoDePagina
        titulo="Configurações"
        descricao={`Você está conectado como ${admin.email} (${admin.papel.toLowerCase()}).`}
      />

      <FormularioDeSenha />

      <Cartao>
        <TituloDeBloco dica="Use se achar que alguém entrou com a sua conta em outro lugar.">
          Sessões
        </TituloDeBloco>
        <form action={sairDeTodosOsDispositivos}>
          <BotaoPainel type="submit" tipo="contorno">
            Encerrar sessões em todos os dispositivos
          </BotaoPainel>
        </form>
        <p className="mt-3 text-[12.5px] text-texto-suave">
          Você também será desconectado aqui e precisará entrar de novo.
        </p>
      </Cartao>

      {ehDono && (
        <Cartao>
          <TituloDeBloco dica="Quem pode entrar no painel.">Contas de acesso</TituloDeBloco>

          <ul className="mb-4 flex flex-col gap-3">
            {usuarios.map((usuario) => {
              const bloqueado = usuario.bloqueadoAte && usuario.bloqueadoAte > new Date();
              const euMesmo = usuario.id === admin.id;

              return (
                <li
                  key={usuario.id}
                  className="flex flex-col gap-3 rounded-xl border border-borda-sutil bg-fundo-sutil p-3.5"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex min-w-0 flex-col gap-1.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[14.5px] font-semibold text-texto-forte">
                          {usuario.nome}
                        </span>
                        <Selo tom={usuario.papel === "DONO" ? "atencao" : "neutro"}>
                          {usuario.papel === "DONO" ? "Dono" : "Editor"}
                        </Selo>
                        {!usuario.ativo && <Selo tom="erro">Inativa</Selo>}
                        {bloqueado && <Selo tom="erro">Bloqueada</Selo>}
                        {euMesmo && <Selo tom="positivo">Você</Selo>}
                      </div>
                      <p className="truncate text-[12.5px] text-texto-suave">{usuario.email}</p>
                      <p className="text-[12px] text-texto-suave">
                        {usuario.ultimoLoginEm
                          ? `Último acesso em ${dataEHora(usuario.ultimoLoginEm)} · ${usuario.ultimoLoginIp ?? "IP desconhecido"}`
                          : "Nunca acessou"}
                      </p>
                    </div>

                    {!euMesmo && (
                      <div className="flex flex-wrap items-center gap-2 sm:shrink-0">
                        <form action={alternarAtivoDoUsuario}>
                          <input type="hidden" name="id" value={usuario.id} />
                          <button
                            type="submit"
                            className="inline-flex min-h-[44px] items-center rounded-pill border border-borda-media/40 px-4 text-[13px] font-semibold text-texto-forte hover:border-texto-forte"
                          >
                            {usuario.ativo ? "Desativar" : "Reativar"}
                          </button>
                        </form>
                        <BotaoDeExcluir
                          acao={excluirUsuario}
                          id={usuario.id}
                          confirmacao={`Excluir a conta de ${usuario.nome}? Essa ação não pode ser desfeita.`}
                        />
                      </div>
                    )}
                  </div>

                  {!euMesmo && <FormularioDeRedefinicao id={usuario.id} nome={usuario.nome} />}
                </li>
              );
            })}
          </ul>

          <FormularioDeNovoUsuario />
        </Cartao>
      )}

      <Cartao>
        <TituloDeBloco dica="Últimas 25 tentativas, com sucesso ou não.">
          Histórico de acesso
        </TituloDeBloco>

        {tentativas.length === 0 ? (
          <p className="text-[13.5px] text-texto-suave">Nenhuma tentativa registrada ainda.</p>
        ) : (
          <div className="-mx-1 overflow-x-auto">
            <table className="w-full min-w-[520px] text-left text-[12.5px]">
              <thead>
                <tr className="text-texto-suave">
                  <th className="px-1 py-2 font-semibold">Quando</th>
                  <th className="px-1 py-2 font-semibold">E-mail</th>
                  <th className="px-1 py-2 font-semibold">IP</th>
                  <th className="px-1 py-2 font-semibold">Resultado</th>
                </tr>
              </thead>
              <tbody>
                {tentativas.map((tentativa) => (
                  <tr key={tentativa.id} className="border-t border-borda-sutil">
                    <td className="whitespace-nowrap px-1 py-2.5 text-texto-corpo">
                      {dataEHora(tentativa.criadoEm)}
                    </td>
                    <td className="max-w-[180px] truncate px-1 py-2.5 text-texto-corpo">
                      {tentativa.email}
                    </td>
                    <td className="whitespace-nowrap px-1 py-2.5 text-texto-suave">
                      {tentativa.ip}
                    </td>
                    <td className="px-1 py-2.5">
                      <Selo tom={tentativa.sucesso ? "positivo" : "erro"}>
                        {MOTIVO[tentativa.motivo]}
                      </Selo>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Cartao>
    </>
  );
}
