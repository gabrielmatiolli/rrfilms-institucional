"use server";

import { exigirAdmin } from "@/lib/admin/sessao";
import { salvarImagem, type ResultadoDeUpload } from "@/lib/admin/upload";

/**
 * Upload avulso, disparado pelo CampoDeImagem antes de o formulário ser
 * enviado — assim a prévia aparece na hora e o form guarda só a URL.
 */
export async function enviarImagem(formulario: FormData): Promise<ResultadoDeUpload> {
  await exigirAdmin();

  const arquivo = formulario.get("arquivo");
  const pasta = String(formulario.get("pasta") ?? "");

  if (!(arquivo instanceof File)) return { erro: "Nenhum arquivo enviado." };
  return salvarImagem(arquivo, pasta);
}
