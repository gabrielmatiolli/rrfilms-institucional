import { BotaoExterno, BotaoLink } from "@/components/ui/Botao";
import { IconeWhatsapp } from "@/components/ui/Icone";
import { contatoDoSite, whatsappCom } from "@/lib/dados/configuracao";

/**
 * Faixa de CTA (Figma nó 30:169).
 *
 * Fechamento de página. Bloco grafite com lâminas de vidro laranja ao fundo — a
 * assinatura visual da marca. Sempre com dois caminhos: orçamento e WhatsApp.
 */
export async function FaixaDeCta({
  titulo = "Descubra quanto calor o seu vidro deixa entrar",
  lead = "Medição e orçamento sem custo em Itatiba e região. Campinas e Jundiaí sob consulta.",
  rotuloPrimario = "Agendar medição",
  mensagem = "Olá! Quero agendar uma medição gratuita.",
}: {
  titulo?: string;
  lead?: string;
  rotuloPrimario?: string;
  mensagem?: string;
}) {
  // contatoDoSite e memoizado por request: chamar aqui nao gera consulta
  // extra nas paginas que ja leram o contato no layout.
  const contato = await contatoDoSite();

  return (
    <section className="secao bg-fundo-pagina">
      <div className="conteudo">
        <div className="relative isolate flex flex-col items-start justify-between gap-8 overflow-hidden rounded-[28px] bg-fundo-inverso px-6 py-10 sm:px-12 sm:py-12 md:rounded-[36px] lg:min-h-[300px] lg:flex-row lg:items-center lg:gap-12 lg:px-16 lg:py-0">
          {/* Lâminas de vidro inclinadas, ancoradas pela direita: no celular ficam
              menores, atrás dos botões; no lg, nas posições do Figma. */}
          <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
            {[
              { celular: "110px", desktop: "352px", alfa: 0.16 },
              { celular: "40px", desktop: "222px", alfa: 0.26 },
              { celular: "-30px", desktop: "92px", alfa: 0.36 },
            ].map(({ celular, desktop, alfa }) => (
              <span
                key={desktop}
                className="absolute bottom-[-90px] right-(--celular) block h-[300px] w-[90px] rounded-[14px] border border-white/16 lg:bottom-auto lg:right-(--desktop) lg:top-[-60px] lg:h-[420px] lg:w-[150px] lg:rounded-[18px]"
                style={
                  {
                    "--celular": celular,
                    "--desktop": desktop,
                    transform: "rotate(14deg)",
                    background: `rgba(250, 169, 126, ${alfa})`,
                  } as React.CSSProperties
                }
              />
            ))}
          </div>

          <div className="flex max-w-[600px] flex-col gap-[14px] text-texto-inverso">
            <h2 className="t-h2 text-texto-inverso">{titulo}</h2>
            <p className="t-corpo-g opacity-70">{lead}</p>
          </div>

          {/* Botões de largura inteira no celular */}
          <div className="flex w-full shrink-0 flex-col gap-3 *:w-full sm:w-auto sm:flex-row sm:flex-wrap sm:items-center sm:*:w-auto">
            <BotaoLink href="/contato" tipo="secundaria">
              {rotuloPrimario}
            </BotaoLink>
            <BotaoExterno
              href={whatsappCom(contato.whatsapp, mensagem)}
              target="_blank"
              rel="noopener noreferrer"
              tipo="frescor"
              icone={<IconeWhatsapp tamanho={20} />}
            >
              WhatsApp
            </BotaoExterno>
          </div>
        </div>
      </div>
    </section>
  );
}
