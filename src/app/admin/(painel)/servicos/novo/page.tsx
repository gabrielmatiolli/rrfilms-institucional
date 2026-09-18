import type { Metadata } from "next";

import FormularioDeServico from "@/components/admin/FormularioDeServico";
import { CabecalhoDePagina } from "@/components/admin/Ui";
import { criarServico } from "@/app/admin/(painel)/servicos/acoes";
import { exigirAdmin } from "@/lib/admin/sessao";

export const metadata: Metadata = { title: "Novo serviço" };

export default async function NovoServico() {
  await exigirAdmin("/admin/servicos/novo");

  return (
    <>
      <CabecalhoDePagina
        titulo="Novo serviço"
        descricao="Entra no fim da grade. Você reordena depois na lista."
      />
      <FormularioDeServico
        acao={criarServico}
        rotuloDeEnvio="Salvar serviço"
        valores={{
          titulo: "",
          tag: "",
          descricao: "",
          linha: "CONFORTO",
          foto: "",
          href: "/contato",
          ativo: true,
          dados: [],
        }}
      />
    </>
  );
}
