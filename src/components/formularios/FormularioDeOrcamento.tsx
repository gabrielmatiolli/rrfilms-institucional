"use client";

import Link from "next/link";
import { useActionState, useEffect, useRef, useState, startTransition } from "react";

import { Botao } from "@/components/ui/Botao";
import { AreaDeTexto, Campo, Checkbox, Selecao } from "@/components/ui/Formulario";
import { IconeCheck } from "@/components/ui/Icone";
import { enviarPedido, type EstadoDoPedido } from "@/lib/pedidos/acoes";
import { registrarPedidoDeOrcamento } from "@/lib/conversao";

/**
 * Os dois formulários de orçamento do site — /contato e /para-empresas.
 *
 * Envia pela Server Action `enviarPedido` e só dispara a conversão (GTM, GA4,
 * Google Ads e Meta) quando o servidor confirma que o pedido foi salvo. Clique
 * em "Enviar" com campo errado não conta.
 */

const estadoInicial: EstadoDoPedido = { situacao: "inicial" };

type Props =
  | { origem: "contato"; tiposDeImovel: readonly string[] }
  | { origem: "empresas"; faixasDeMetragem: readonly string[] };

export function FormularioDeOrcamento(props: Props) {
  const [estado, acao, enviando] = useActionState(enviarPedido, estadoInicial);
  const [abertoEm, setAbertoEm] = useState("");
  const conversaoDisparada = useRef<string | null>(null);

  // Hora em que o formulário ficou utilizável — o servidor recusa envio rápido
  // demais para ser de gente. Marcada no navegador, depois da hidratação.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- só existe no navegador
    setAbertoEm(String(Date.now()));
  }, []);

  useEffect(() => {
    if (estado.situacao !== "enviado" || conversaoDisparada.current === estado.id) return;
    conversaoDisparada.current = estado.id;
    registrarPedidoDeOrcamento(props.origem);
  }, [estado, props.origem]);

  if (estado.situacao === "enviado") {
    return (
      <div role="status" className="flex flex-col items-start gap-4">
        <span className="flex size-12 items-center justify-center rounded-pill bg-frescor-500 text-escuro-900">
          <IconeCheck tamanho={22} />
        </span>
        <h3 className="t-h4">Pedido recebido</h3>
        <p className="t-corpo text-texto-suave">
          {props.origem === "empresas"
            ? "O comercial responde em até 1 dia útil com a simulação."
            : "A gente responde em até 1 dia útil para combinar a medição."}
        </p>
      </div>
    );
  }

  return (
    <form
      className={props.origem === "contato" ? "flex flex-col gap-6" : "flex flex-col gap-5"}
      // Envio por onSubmit, e não por action={…}: com action o React limpa o
      // formulário a cada envio, e quem errou um campo perderia tudo que digitou.
      onSubmit={(evento) => {
        evento.preventDefault();
        const dados = new FormData(evento.currentTarget);
        startTransition(() => acao(dados));
      }}
    >
      <input type="hidden" name="origem" value={props.origem === "contato" ? "CONTATO" : "EMPRESAS"} />
      <input type="hidden" name="aberto_em" value={abertoEm} />
      {/* Campo-isca: fora da tela e fora do Tab. Gente não vê; robô preenche. */}
      <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor={`site-${props.origem}`}>Não preencha este campo</label>
        <input id={`site-${props.origem}`} name="site" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      {props.origem === "contato" ? (
        <>
          <div className="grid gap-4 sm:grid-cols-2">
            <Campo
              id="nome"
              name="nome"
              rotulo="Nome"
              placeholder="Como podemos te chamar"
              autoComplete="name"
              maxLength={120}
              required
            />
            <Campo
              id="whatsapp"
              name="whatsapp"
              rotulo="WhatsApp"
              type="tel"
              placeholder="(11) 90000-0000"
              autoComplete="tel"
              inputMode="tel"
              required
            />
          </div>

          <Campo
            id="email"
            name="email"
            rotulo="E-mail"
            type="email"
            placeholder="voce@email.com.br"
            ajuda="Usamos só para retornar o orçamento."
            autoComplete="email"
            required
          />

          <Selecao id="tipo-de-imovel" name="detalhe" rotulo="Tipo de imóvel" opcoes={props.tiposDeImovel} />

          <AreaDeTexto
            id="sobre-o-vidro"
            name="mensagem"
            rotulo="Conte do seu vidro"
            rows={5}
            maxLength={3000}
            placeholder="Quantas janelas, para onde estão viradas, qual o problema — calor, claridade, privacidade ou segurança."
            ajuda="Quanto mais detalhe, mais preciso o orçamento."
          />

          <Checkbox
            id="consentimento"
            name="aceita_whatsapp"
            rotulo="Aceito receber o orçamento por WhatsApp"
            defaultChecked
          />
        </>
      ) : (
        <>
          <Campo
            id="empresa"
            name="nome"
            rotulo="Empresa"
            placeholder="Razão social"
            autoComplete="organization"
            maxLength={160}
            required
          />
          <Campo
            id="email-corporativo"
            name="email"
            rotulo="E-mail corporativo"
            type="email"
            placeholder="voce@empresa.com.br"
            ajuda="Usamos só para retornar o orçamento."
            autoComplete="email"
            required
          />
          <Campo
            id="whatsapp-corporativo"
            name="whatsapp"
            rotulo="WhatsApp"
            type="tel"
            placeholder="(11) 90000-0000"
            autoComplete="tel"
            inputMode="tel"
            required
          />
          <Selecao
            id="metragem"
            name="detalhe"
            rotulo="Metragem aproximada de vidro"
            ajuda="Se não souber, a gente mede na visita."
            opcoes={props.faixasDeMetragem}
          />
          <Checkbox
            id="consentimento-corporativo"
            name="aceita_whatsapp"
            rotulo="Aceito receber o orçamento por WhatsApp"
            defaultChecked
          />
        </>
      )}

      <p className="t-micro text-texto-suave">
        Usamos seus dados só para responder ao pedido e preparar o orçamento. Veja a{" "}
        <Link href="/politica-de-privacidade" className="underline underline-offset-4">
          política de privacidade
        </Link>
        .
      </p>

      {estado.situacao === "erro" && (
        <p role="alert" className="t-corpo-p text-estado-erro">
          {estado.mensagem}
        </p>
      )}

      <Botao
        type="submit"
        disabled={enviando || !abertoEm}
        className="w-full disabled:cursor-wait disabled:opacity-60 sm:w-fit"
      >
        {enviando
          ? "Enviando…"
          : props.origem === "contato"
            ? "Enviar e receber orçamento"
            : "Solicitar simulação"}
      </Botao>
    </form>
  );
}
