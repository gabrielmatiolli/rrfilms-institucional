import { IconeWhatsapp } from "@/components/ui/Icone";
import { whatsappCom } from "@/lib/dados/configuracao";

/**
 * FAB WhatsApp (Figma nó 26:107).
 *
 * Ação persistente no canto inferior direito, 24px das bordas. Verde Frescor com
 * ícone grafite — não usa o verde do WhatsApp, para não competir com a marca.
 */
export function FabWhatsapp({ whatsapp }: { whatsapp: string }) {
  return (
    <a
      href={whatsappCom(
        whatsapp,
        "Olá! Vim pelo site e quero um orçamento de película para meu vidro.",
      )}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-5 right-5 z-40 flex items-center gap-[10px] rounded-pill bg-frescor-500 py-4 pl-[18px] pr-[22px] text-escuro-900 elevacao-02 transition-colors hover:bg-[#b6d494] md:bottom-6 md:right-6"
    >
      <IconeWhatsapp tamanho={24} />
      <span className="t-botao-m hidden whitespace-nowrap sm:inline">
        Falar no WhatsApp
      </span>
      <span className="sr-only sm:hidden">Falar no WhatsApp</span>
    </a>
  );
}
