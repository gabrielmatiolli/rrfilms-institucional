import type { Metadata } from "next";

import FormularioDeProduto from "@/components/admin/FormularioDeProduto";
import { CabecalhoDePagina } from "@/components/admin/Ui";
import { criarProduto } from "@/app/admin/(painel)/produtos/acoes";
import { exigirAdmin } from "@/lib/admin/sessao";

export const metadata: Metadata = { title: "Nova linha" };

export default async function NovaLinha() {
  await exigirAdmin("/admin/produtos/novo");

  return (
    <>
      <CabecalhoDePagina
        titulo="Nova linha"
        descricao="Entra no fim da grade. Você reordena depois na lista."
      />
      <FormularioDeProduto
        acao={criarProduto}
        rotuloDeEnvio="Salvar linha"
        valores={{
          nome: "",
          destaque: "",
          promessa: "",
          descricao: "",
          foto: "",
          ativo: true,
          temPaginaPropria: false,
          hrefExterno: "/contato",
          metaTitulo: "",
          metaDescricao: "",
          conteudo: [],
        }}
      />
    </>
  );
}
