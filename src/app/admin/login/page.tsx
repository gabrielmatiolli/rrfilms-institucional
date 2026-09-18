import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { Assinatura } from "@/components/brand/Marca";
import FormularioDeLogin from "@/components/admin/FormularioDeLogin";
import { usuarioLogado } from "@/lib/admin/sessao";

export const metadata: Metadata = { title: "Entrar" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ de?: string | string[] }>;
}) {
  // Já autenticado não precisa ver o formulário de novo.
  if (await usuarioLogado()) redirect("/admin");

  // O destino pós-login é lido aqui, no servidor, e desce por prop. Com
  // useSearchParams() no formulário, o Next exigiria um <Suspense> em volta —
  // e o formulário sairia num segmento de streaming revelado depois, em vez de
  // vir no HTML inicial e hidratar junto com a página. A validação de verdade
  // do destino acontece na action (destinoSeguro), não aqui.
  const { de } = await searchParams;

  return (
    <div className="flex min-h-screen items-center justify-center px-5 py-12">
      <div className="flex w-full max-w-[440px] flex-col items-center gap-7 rounded-2xl border border-vidro-borda bg-vidro-preenchimento-forte px-6 py-10 vidro-02 sm:px-10">
        <Assinatura className="h-9 w-auto text-texto-forte" />

        <div className="flex flex-col items-center gap-1.5 text-center">
          <h1 className="font-[family-name:var(--tipo-familia-display)] text-[24px] font-bold text-texto-forte">
            Painel administrativo
          </h1>
          <p className="text-[13.5px] text-texto-suave">
            Acesso restrito à equipe RR Film
          </p>
        </div>

        <FormularioDeLogin de={typeof de === "string" ? de : ""} />
      </div>
    </div>
  );
}
