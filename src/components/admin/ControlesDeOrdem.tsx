interface Props {
  /** Server Action que recebe `id` e `direcao` ("cima" | "baixo"). */
  acao: (formulario: FormData) => Promise<void>;
  id: string;
  primeiro: boolean;
  ultimo: boolean;
  nome: string;
}

/**
 * Subir/descer um item na lista. Dois formulários com Server Action — funciona
 * sem JavaScript e não precisa virar Client Component.
 */
export default function ControlesDeOrdem({ acao, id, primeiro, ultimo, nome }: Props) {
  return (
    <div className="flex items-center">
      {(["cima", "baixo"] as const).map((direcao) => {
        const desabilitado = direcao === "cima" ? primeiro : ultimo;
        return (
          <form key={direcao} action={acao}>
            <input type="hidden" name="id" value={id} />
            <input type="hidden" name="direcao" value={direcao} />
            <button
              type="submit"
              disabled={desabilitado}
              className="flex size-11 items-center justify-center text-[15px] text-texto-suave hover:text-texto-forte disabled:opacity-25"
            >
              <span className="sr-only">
                Mover {nome} para {direcao}
              </span>
              <span aria-hidden>{direcao === "cima" ? "↑" : "↓"}</span>
            </button>
          </form>
        );
      })}
    </div>
  );
}
