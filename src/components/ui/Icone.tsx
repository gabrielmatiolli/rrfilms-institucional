// Ícones do sistema.
// Vetores exportados do arquivo Figma "RR Films", seção "01 · Base" (família
// Ícone/*): caixa de 24, traço de 1,5 e terminais arredondados. O traço usa
// `currentColor` para herdar a cor do texto, como no Figma — lá ele está ligado
// à variável cor/texto/forte.
//
// Nota do arquivo de design: "Substituição sinalizada — o KV não define set de ícones."

export type IconeProps = React.SVGProps<SVGSVGElement> & {
  /** Tamanho em px da caixa quadrada. Padrão 24, como no Figma. */
  tamanho?: number;
};

function Base({ tamanho = 24, children, ...props }: IconeProps) {
  return (
    <svg
      width={tamanho}
      height={tamanho}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      {children}
    </svg>
  );
}

export function IconeSol(props: IconeProps) {
  return (
    <Base {...props}>
      <path d="M12 16.4C14.4301 16.4 16.4 14.4301 16.4 12C16.4 9.56995 14.4301 7.6 12 7.6C9.56995 7.6 7.6 9.56995 7.6 12C7.6 14.4301 9.56995 16.4 12 16.4Z" />
      <path d="M12 2.4V4.6M12 19.4V21.6M2.4 12H4.6M19.4 12H21.6M5.2 5.2L6.8 6.8M17.2 17.2L18.8 18.8M18.8 5.2L17.2 6.8M6.8 17.2L5.2 18.8" />
    </Base>
  );
}

export function IconeEscudo(props: IconeProps) {
  return (
    <Base {...props}>
      <path d="M12 2.6L4.6 5.9V11.9C4.6 16.2 7.7 20 12 21.4C16.3 20 19.4 16.2 19.4 11.9V5.9L12 2.6Z" />
      <path d="M9 12L11.2 14.2L15.4 10" />
    </Base>
  );
}

export function IconePrivacidade(props: IconeProps) {
  return (
    <Base {...props}>
      <path d="M2.6 12C2.6 12 6.2 5.9 12 5.9C17.8 5.9 21.4 12 21.4 12C21.4 12 17.8 18.1 12 18.1C6.2 18.1 2.6 12 2.6 12Z" />
      <path d="M12 14.7C13.4912 14.7 14.7 13.4912 14.7 12C14.7 10.5088 13.4912 9.3 12 9.3C10.5088 9.3 9.3 10.5088 9.3 12C9.3 13.4912 10.5088 14.7 12 14.7Z" />
      <path d="M3.6 3.6L20.4 20.4" />
    </Base>
  );
}

export function IconeCasa(props: IconeProps) {
  return (
    <Base {...props}>
      <path d="M3.6 10.4L12 3.4L20.4 10.4V19.6C20.4 19.8652 20.2946 20.1196 20.1071 20.3071C19.9196 20.4946 19.6652 20.6 19.4 20.6H4.6C4.33478 20.6 4.08043 20.4946 3.89289 20.3071C3.70536 20.1196 3.6 19.8652 3.6 19.6V10.4Z" />
      <path d="M9.4 20.6V14.4H14.6V20.6" />
    </Base>
  );
}

export function IconePredio(props: IconeProps) {
  return (
    <Base {...props}>
      <path d="M4 20.6V4.4C4 4.13478 4.10536 3.88043 4.29289 3.69289C4.48043 3.50536 4.73478 3.4 5 3.4H12.2C12.4652 3.4 12.7196 3.50536 12.9071 3.69289C13.0946 3.88043 13.2 4.13478 13.2 4.4V20.6V9.6H19C19.2652 9.6 19.5196 9.70536 19.7071 9.89289C19.8946 10.0804 20 10.3348 20 10.6V20.6" />
      <path d="M2.4 20.6H21.6M7 7.6H10.2M7 11.2H10.2M7 14.8H10.2M16 13.4H17.4M16 16.8H17.4" />
    </Base>
  );
}

export function IconeFolha(props: IconeProps) {
  return (
    <Base {...props}>
      <path d="M6.8 19.3C14.8 18.8 20.6 13 20.6 3.4C10.4 3.4 3.8 8.6 3.8 15.6C3.8 18.5 5.5 20.7 8 21.2" />
    </Base>
  );
}

export function IconeTermometro(props: IconeProps) {
  return (
    <Base {...props}>
      <path d="M14 14.6V5.2C14 4.66957 13.7893 4.16086 13.4142 3.78579C13.0391 3.41071 12.5304 3.2 12 3.2C11.4696 3.2 10.9609 3.41071 10.5858 3.78579C10.2107 4.16086 10 4.66957 10 5.2V14.6C9.17836 15.0449 8.52856 15.7512 8.1534 16.6069C7.77825 17.4627 7.69916 18.4191 7.92866 19.3248C8.15816 20.2306 8.68314 21.034 9.42054 21.6078C10.1579 22.1817 11.0656 22.4932 12 22.4932C12.9344 22.4932 13.8421 22.1817 14.5795 21.6078C15.3169 21.034 15.8418 20.2306 16.0713 19.3248C16.3008 18.4191 16.2218 17.4627 15.8466 16.6069C15.4714 15.7512 14.8216 15.0449 14 14.6Z" />
      <path d="M12 9.4V15.4" />
    </Base>
  );
}

export function IconeBrilho(props: IconeProps) {
  return (
    <Base {...props}>
      <path d="M12 2.6L13.9 8.1L19.4 10L13.9 11.9L12 17.4L10.1 11.9L4.6 10L10.1 8.1L12 2.6Z" />
      <path d="M18.8 16.2L19.55 18.05L21.4 18.8L19.55 19.55L18.8 21.4L18.05 19.55L16.2 18.8L18.05 18.05L18.8 16.2Z" />
    </Base>
  );
}

export function IconeSetaDireita(props: IconeProps) {
  return (
    <Base {...props}>
      <path d="M3.8 12H20.2M14.2 18L20.2 12L14.2 6" />
    </Base>
  );
}

/** Espelho horizontal de Ícone/seta-direita, para paginação e carrosséis. */
export function IconeSetaEsquerda({ tamanho = 24, ...props }: IconeProps) {
  return (
    <Base tamanho={tamanho} {...props}>
      <g transform="translate(24 0) scale(-1 1)">
        <path d="M3.8 12H20.2M14.2 18L20.2 12L14.2 6" />
      </g>
    </Base>
  );
}

export function IconeSetaDiagonal(props: IconeProps) {
  return (
    <Base {...props}>
      <path d="M7 17L17 7" />
      <path d="M8.6 7H17V15.4" />
    </Base>
  );
}

export function IconeCheck(props: IconeProps) {
  return (
    <Base {...props}>
      <path d="M4.6 12.6L9.6 17.6L19.4 6.6" />
    </Base>
  );
}

export function IconeChevronBaixo(props: IconeProps) {
  return (
    <Base {...props}>
      <path d="M5 9L12 16L19 9" />
    </Base>
  );
}

export function IconeTelefone(props: IconeProps) {
  return (
    <Base {...props}>
      <path d="M7 3.6H4.4C4.20742 3.59951 4.01682 3.63875 3.8401 3.71528C3.66338 3.7918 3.50435 3.90397 3.37295 4.04475C3.24155 4.18553 3.14061 4.35191 3.07644 4.53349C3.01226 4.71506 2.98624 4.90791 3 5.1C3.4 13.9 10.1 20.6 18.9 21C19.0921 21.0138 19.2849 20.9877 19.4665 20.9236C19.6481 20.8594 19.8145 20.7585 19.9552 20.6271C20.096 20.4957 20.2082 20.3366 20.2847 20.1599C20.3612 19.9832 20.4005 19.7926 20.4 19.6V17L15.8 15.4L13.9 17.8C11.2762 16.3778 9.12224 14.2238 7.7 11.6L10.1 9.7L7 3.6Z" />
    </Base>
  );
}

export function IconeWhatsapp(props: IconeProps) {
  return (
    <Base {...props}>
      <path d="M12 3.2C10.4571 3.20368 8.94221 3.61298 7.60736 4.38685C6.27252 5.16071 5.16461 6.27194 4.39473 7.60909C3.62486 8.94624 3.22009 10.4623 3.22101 12.0052C3.22194 13.5482 3.62852 15.0638 4.4 16.4L3.2 20.8L7.7 19.6C8.87226 20.2839 10.1868 20.6874 11.5409 20.7789C12.895 20.8705 14.2519 20.6476 15.5055 20.1277C16.7592 19.6078 17.8756 18.805 18.7674 17.782C19.6593 16.759 20.3025 15.5436 20.6467 14.2308C20.9909 12.9181 21.0268 11.5434 20.7516 10.2145C20.4764 8.88549 19.8975 7.63818 19.0603 6.57006C18.223 5.50193 17.15 4.64193 15.9252 4.05731C14.7004 3.47268 13.357 3.17926 12 3.2Z" />
      <path d="M9.2 8.6C9.5 8 10.3 8.1 10.5 8.7L11 10C11.1 10.3 11 10.5 10.8 10.7L10.3 11.1C10.1 11.3 10.1 11.5 10.2 11.7C10.8057 12.7335 11.6665 13.5943 12.7 14.2C12.9 14.3 13.1 14.3 13.3 14.1L13.7 13.6C13.9 13.4 14.1 13.3 14.4 13.4L15.7 13.9C16.3 14.1 16.4 14.9 15.8 15.2C14.8 15.8 13.6 15.6 12.4 15C10.9664 14.213 9.78701 13.0336 9 11.6C8.4 10.4 8.2 9.2 8.8 8.2L9.2 8.6Z" />
    </Base>
  );
}

export function IconeEmail(props: IconeProps) {
  return (
    <Base {...props}>
      <path d="M19.2 5.4H4.8C3.69543 5.4 2.8 6.29543 2.8 7.4V16.6C2.8 17.7046 3.69543 18.6 4.8 18.6H19.2C20.3046 18.6 21.2 17.7046 21.2 16.6V7.4C21.2 6.29543 20.3046 5.4 19.2 5.4Z" />
      <path d="M3.4 6.6L12 12.4L20.6 6.6" />
    </Base>
  );
}

export function IconePin(props: IconeProps) {
  return (
    <Base {...props}>
      <path d="M12 21.4C12 21.4 19 15.2 19 10.3C19 9.38075 18.8189 8.47049 18.4672 7.62122C18.1154 6.77194 17.5998 6.00026 16.9497 5.35025C16.2997 4.70024 15.5281 4.18463 14.6788 3.83284C13.8295 3.48106 12.9193 3.3 12 3.3C11.0807 3.3 10.1705 3.48106 9.32122 3.83284C8.47194 4.18463 7.70026 4.70024 7.05025 5.35025C6.40024 6.00026 5.88463 6.77194 5.53284 7.62122C5.18106 8.47049 5 9.38075 5 10.3C5 15.2 12 21.4 12 21.4Z" />
      <path d="M12 12.9C13.4359 12.9 14.6 11.7359 14.6 10.3C14.6 8.86406 13.4359 7.7 12 7.7C10.5641 7.7 9.4 8.86406 9.4 10.3C9.4 11.7359 10.5641 12.9 12 12.9Z" />
    </Base>
  );
}

export function IconeRelogio(props: IconeProps) {
  return (
    <Base {...props}>
      <path d="M12 20.6C16.7496 20.6 20.6 16.7496 20.6 12C20.6 7.25035 16.7496 3.4 12 3.4C7.25035 3.4 3.4 7.25035 3.4 12C3.4 16.7496 7.25035 20.6 12 20.6Z" />
      <path d="M12 6.8V12.2L15.4 14.2" />
    </Base>
  );
}

export function IconeEstrela(props: IconeProps) {
  return (
    <Base {...props}>
      <path d="M12 3L14.7 8.6L20.8 9.5L16.4 13.8L17.4 19.9L12 17L6.6 19.9L7.6 13.8L3.2 9.5L9.3 8.6L12 3Z" />
    </Base>
  );
}

export function IconeMenu(props: IconeProps) {
  return (
    <Base {...props}>
      <path d="M3.4 7H20.6M3.4 12H20.6M3.4 17H20.6" />
    </Base>
  );
}

export function IconeFechar(props: IconeProps) {
  return (
    <Base {...props}>
      <path d="M5.6 5.6L18.4 18.4M18.4 5.6L5.6 18.4" />
    </Base>
  );
}

export function IconeMais(props: IconeProps) {
  return (
    <Base {...props}>
      <path d="M12 4.6V19.4M4.6 12H19.4" />
    </Base>
  );
}

export function IconeJanela(props: IconeProps) {
  return (
    <Base {...props}>
      <path d="M18.4 3.4H5.6C4.71634 3.4 4 4.11634 4 5V19C4 19.8837 4.71634 20.6 5.6 20.6H18.4C19.2837 20.6 20 19.8837 20 19V5C20 4.11634 19.2837 3.4 18.4 3.4Z" />
      <path d="M12 3.4V20.6M4 12H20" />
    </Base>
  );
}

export function IconeRegua(props: IconeProps) {
  return (
    <Base {...props}>
      <path d="M3.4 14.6L14.6 3.4L20.6 9.4L9.4 20.6L3.4 14.6Z" />
      <path d="M7.2 10.8L9.2 12.8M10.2 7.8L12.2 9.8M13.2 4.8L15.2 6.8" />
    </Base>
  );
}

export function IconeCertificado(props: IconeProps) {
  return (
    <Base {...props}>
      <path d="M12 15C15.3137 15 18 12.3137 18 9C18 5.68629 15.3137 3 12 3C8.68629 3 6 5.68629 6 9C6 12.3137 8.68629 15 12 15Z" />
      <path d="M8.4 14.2L6.8 20.8L12 18.4L17.2 20.8L15.6 14.2" />
    </Base>
  );
}

export function IconeEquipe(props: IconeProps) {
  return (
    <Base {...props}>
      <path d="M8.4 11C10.2778 11 11.8 9.47777 11.8 7.6C11.8 5.72223 10.2778 4.2 8.4 4.2C6.52223 4.2 5 5.72223 5 7.6C5 9.47777 6.52223 11 8.4 11Z" />
      <path d="M2.6 20.4C2.6 17.2 5.2 14.6 8.4 14.6C11.6 14.6 14.2 17.2 14.2 20.4" />
      <path d="M15.6 4.6C16.337 4.7828 16.9916 5.20705 17.4594 5.80513C17.9273 6.4032 18.1815 7.14067 18.1815 7.9C18.1815 8.65933 17.9273 9.3968 17.4594 9.99487C16.9916 10.5929 16.337 11.0172 15.6 11.2M21.4 20.4C21.4 17.8 19.7 15.6 17.3 14.9" />
    </Base>
  );
}

export function IconePlay(props: IconeProps) {
  return (
    <Base {...props}>
      <path d="M12 20.8C16.8601 20.8 20.8 16.8601 20.8 12C20.8 7.13989 16.8601 3.2 12 3.2C7.13989 3.2 3.2 7.13989 3.2 12C3.2 16.8601 7.13989 20.8 12 20.8Z" />
      <path d="M10 8.4L16 12L10 15.6V8.4Z" />
    </Base>
  );
}

export function IconeGota(props: IconeProps) {
  return (
    <Base {...props}>
      <path d="M12 3.2C9.1 6.6 5.8 9.8 5.8 13.6C5.8 14.4142 5.96037 15.2204 6.27195 15.9726C6.58353 16.7249 7.04021 17.4083 7.61594 17.9841C8.19166 18.5598 8.87514 19.0165 9.62736 19.3281C10.3796 19.6396 11.1858 19.8 12 19.8C12.8142 19.8 13.6204 19.6396 14.3726 19.3281C15.1249 19.0165 15.8083 18.5598 16.3841 17.9841C16.9598 17.4083 17.4165 16.7249 17.7281 15.9726C18.0396 15.2204 18.2 14.4142 18.2 13.6C18.2 9.8 14.9 6.6 12 3.2Z" />
    </Base>
  );
}

export function IconeMoeda(props: IconeProps) {
  return (
    <Base {...props}>
      <path d="M12 20.6C16.7496 20.6 20.6 16.7496 20.6 12C20.6 7.25035 16.7496 3.4 12 3.4C7.25035 3.4 3.4 7.25035 3.4 12C3.4 16.7496 7.25035 20.6 12 20.6Z" />
      <path d="M14.6 9.2C14.3123 8.78073 13.9228 8.44146 13.468 8.21406C13.0132 7.98666 12.508 7.87859 12 7.9C10.5 7.9 9.4 8.8 9.4 10C9.4 12.9 14.6 11.5 14.6 14.3C14.6 15.5 13.5 16.4 12 16.4C11.492 16.4214 10.9868 16.3133 10.532 16.0859C10.0772 15.8585 9.68769 15.5193 9.4 15.1M12 6.4V17.6" />
    </Base>
  );
}

/** Mapa nome → componente, para listas de conteúdo declararem o ícone por string. */
export const icones = {
  sol: IconeSol,
  escudo: IconeEscudo,
  privacidade: IconePrivacidade,
  casa: IconeCasa,
  predio: IconePredio,
  folha: IconeFolha,
  termometro: IconeTermometro,
  brilho: IconeBrilho,
  "seta-direita": IconeSetaDireita,
  "seta-esquerda": IconeSetaEsquerda,
  "seta-diagonal": IconeSetaDiagonal,
  check: IconeCheck,
  "chevron-baixo": IconeChevronBaixo,
  telefone: IconeTelefone,
  whatsapp: IconeWhatsapp,
  email: IconeEmail,
  pin: IconePin,
  relogio: IconeRelogio,
  estrela: IconeEstrela,
  menu: IconeMenu,
  fechar: IconeFechar,
  mais: IconeMais,
  janela: IconeJanela,
  regua: IconeRegua,
  certificado: IconeCertificado,
  equipe: IconeEquipe,
  play: IconePlay,
  gota: IconeGota,
  moeda: IconeMoeda,
} as const;

export type NomeDeIcone = keyof typeof icones;
