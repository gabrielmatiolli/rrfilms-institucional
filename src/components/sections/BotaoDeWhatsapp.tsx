import { BotaoExterno, type BotaoTamanho, type BotaoTipo } from "@/components/ui/Botao";
import { IconeWhatsapp } from "@/components/ui/Icone";
import {
  mensagemDeWhatsapp,
  rastreioDeWhatsapp,
  type CodigoDeWhatsapp,
} from "@/content/whatsapp";
import { contatoDoSite, whatsappCom } from "@/lib/dados/configuracao";

/**
 * O botão de WhatsApp do site, montado a partir do código da mensagem.
 *
 * Um único botão por bloco, com a mensagem do contexto já preenchida e os
 * atributos `data-produto` / `data-publico` que o Google Tag Manager lê. Passar
 * o código em vez da mensagem evita o que a revisão de copy encontrou no site:
 * o mesmo botão repetido com textos diferentes, e mensagens de casa em bloco de
 * empresa.
 *
 * `contatoDoSite()` é memoizado por request — chamar aqui não gera consulta
 * extra nas páginas que já leram o contato no layout.
 */
export async function BotaoDeWhatsapp({
  codigo,
  rotulo = "Falar no WhatsApp",
  tipo = "vidro",
  tamanho = "G",
  className,
}: {
  codigo: CodigoDeWhatsapp;
  rotulo?: string;
  tipo?: BotaoTipo;
  tamanho?: BotaoTamanho;
  className?: string;
}) {
  const contato = await contatoDoSite();
  const { produto, publico } = rastreioDeWhatsapp(codigo);

  return (
    <BotaoExterno
      href={whatsappCom(contato.whatsapp, mensagemDeWhatsapp(codigo))}
      target="_blank"
      rel="noopener noreferrer"
      tipo={tipo}
      tamanho={tamanho}
      className={className}
      icone={<IconeWhatsapp tamanho={tamanho === "G" ? 20 : 18} />}
      data-produto={produto}
      data-publico={publico}
    >
      {rotulo}
    </BotaoExterno>
  );
}
