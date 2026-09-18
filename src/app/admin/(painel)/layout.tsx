import CascaDoPainel from "@/components/admin/CascaDoPainel";
import { exigirAdmin } from "@/lib/admin/sessao";

/**
 * Toda página dentro de (painel) passa por aqui, então nenhuma delas fica
 * acessível sem sessão. As Server Actions chamam `exigirAdmin()` de novo por
 * conta própria — layout não protege action, elas são endpoints independentes.
 */
export default async function PainelLayout({ children }: { children: React.ReactNode }) {
  const usuario = await exigirAdmin();

  return (
    <CascaDoPainel nome={usuario.nome} papel={usuario.papel}>
      {children}
    </CascaDoPainel>
  );
}
