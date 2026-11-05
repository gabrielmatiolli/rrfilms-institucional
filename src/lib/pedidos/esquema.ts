import { z } from "zod";

import {
  DESTINOS_DA_PELICULA,
  FAIXAS_DE_METRAGEM,
  INTERESSES,
  SEGMENTOS,
} from "@/content/formulario";

/**
 * Regras dos formulários de orçamento. Ficam fora do arquivo da Server Action
 * porque um arquivo "use server" só pode exportar funções assíncronas.
 *
 * Campos da revisão de copy de 28/10/2026: cidade e "para onde é a película"
 * são obrigatórios, o e-mail deixou de ser. As listas de opção são validadas
 * contra src/content/formulario.ts — um `<select>` adulterado no navegador não
 * grava valor inventado no banco.
 */

export const ORIGENS = ["CONTATO", "EMPRESAS"] as const;
export type Origem = (typeof ORIGENS)[number];

/** Telefone com DDD: 10 ou 11 dígitos, com ou sem o 55 na frente. */
function soDigitos(telefone: string) {
  const digitos = telefone.replace(/\D/g, "");
  return digitos.length >= 12 && digitos.startsWith("55") ? digitos.slice(2) : digitos;
}

const whatsapp = z
  .string()
  .trim()
  .transform(soDigitos)
  .refine((d) => d.length === 10 || d.length === 11, "Confira o WhatsApp: DDD + número.");

/** E-mail opcional: vazio vira null; preenchido tem de ser válido. */
const emailOpcional = z
  .string()
  .trim()
  .toLowerCase()
  .max(160)
  .refine((v) => v === "" || z.string().email().safeParse(v).success, "Confira o e-mail.")
  .transform((v) => v || null);

const opcional = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .transform((v) => v || null);

/** Uma das opções da lista. Fora dela, o campo volta como null. */
const umaDasOpcoes = (opcoes: readonly string[]) =>
  z
    .string()
    .trim()
    .transform((v) => (opcoes.includes(v) ? v : null));

/** Mesma lista, mas obrigatória — o site marca o campo como obrigatório. */
const opcaoObrigatoria = (opcoes: readonly string[], erro: string) =>
  z
    .string()
    .trim()
    .refine((v) => opcoes.includes(v), erro);

const cidade = z.string().trim().min(2, "Informe a cidade.").max(80);

export const esquemaDoContato = z.object({
  origem: z.literal("CONTATO"),
  nome: z.string().trim().min(2, "Informe seu nome.").max(120),
  empresa: z.null(),
  whatsapp,
  email: emailOpcional,
  cidade,
  publico: opcaoObrigatoria(
    DESTINOS_DA_PELICULA,
    "Escolha para onde é a película.",
  ),
  interesse: umaDasOpcoes(INTERESSES),
  detalhe: z.null(),
  mensagem: opcional(3000),
  aceitaWhatsapp: z.boolean(),
});

export const esquemaDeEmpresas = z.object({
  origem: z.literal("EMPRESAS"),
  nome: z.string().trim().min(2, "Informe seu nome.").max(120),
  empresa: z.string().trim().min(2, "Informe a empresa.").max(160),
  whatsapp,
  email: emailOpcional,
  cidade,
  publico: opcaoObrigatoria(SEGMENTOS, "Escolha o segmento da empresa."),
  interesse: z.null(),
  detalhe: umaDasOpcoes(FAIXAS_DE_METRAGEM),
  mensagem: opcional(3000),
  aceitaWhatsapp: z.boolean(),
});

export const esquemaDoPedido = z.discriminatedUnion("origem", [
  esquemaDoContato,
  esquemaDeEmpresas,
]);

export type DadosDoPedido = z.infer<typeof esquemaDoPedido>;

/** "(11) 98765-4321" a partir dos dígitos salvos. */
export function formatarTelefone(digitos: string) {
  if (digitos.length === 11)
    return `(${digitos.slice(0, 2)}) ${digitos.slice(2, 7)}-${digitos.slice(7)}`;
  if (digitos.length === 10)
    return `(${digitos.slice(0, 2)}) ${digitos.slice(2, 6)}-${digitos.slice(6)}`;
  return digitos;
}

/** Link de conversa no WhatsApp com o número do cliente. */
export function linkDoWhatsapp(digitos: string) {
  return `https://wa.me/55${digitos}`;
}
