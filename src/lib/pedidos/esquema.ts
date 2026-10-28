import { z } from "zod";

/**
 * Regras dos formulários de orçamento. Ficam fora do arquivo da Server Action
 * porque um arquivo "use server" só pode exportar funções assíncronas.
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

const email = z.string().trim().toLowerCase().email("Confira o e-mail.").max(160);
const opcional = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .transform((v) => v || null);

export const esquemaDoContato = z.object({
  origem: z.literal("CONTATO"),
  nome: z.string().trim().min(2, "Informe seu nome.").max(120),
  whatsapp,
  email,
  detalhe: opcional(60),
  mensagem: opcional(3000),
  aceitaWhatsapp: z.boolean(),
});

export const esquemaDeEmpresas = z.object({
  origem: z.literal("EMPRESAS"),
  nome: z.string().trim().min(2, "Informe a empresa.").max(160),
  whatsapp,
  email,
  detalhe: opcional(60),
  mensagem: z.null(),
  aceitaWhatsapp: z.boolean(),
});

export const esquemaDoPedido = z.discriminatedUnion("origem", [
  esquemaDoContato,
  esquemaDeEmpresas,
]);

export type DadosDoPedido = z.infer<typeof esquemaDoPedido>;

/** "(11) 98765-4321" a partir dos dígitos salvos. */
export function formatarTelefone(digitos: string) {
  if (digitos.length === 11) return `(${digitos.slice(0, 2)}) ${digitos.slice(2, 7)}-${digitos.slice(7)}`;
  if (digitos.length === 10) return `(${digitos.slice(0, 2)}) ${digitos.slice(2, 6)}-${digitos.slice(6)}`;
  return digitos;
}

/** Link de conversa no WhatsApp com o número do cliente. */
export function linkDoWhatsapp(digitos: string) {
  return `https://wa.me/55${digitos}`;
}
