import "server-only";
import path from "node:path";

/**
 * Onde ficam, no disco, as imagens enviadas pelo painel.
 *
 * Fonte única de dois lados que têm de apontar para o mesmo lugar: quem grava
 * (`salvarImagem`, em src/lib/admin/upload.ts) e quem serve (a rota
 * src/app/uploads/[...caminho]/route.ts).
 *
 * `UPLOADS_DIR` existe para essa pasta ficar FORA do diretório do app: o deploy
 * da Hostinger substitui a pasta do projeto, e foto de cliente não pode morar
 * em algo que o próximo ZIP sobrescreve. Em produção aponta para a home da
 * conta (`/home/<conta>/dados/uploads`); em dev, para `dados/uploads` dentro do
 * projeto — fora da `public/` também, de propósito: assim a imagem sai pela
 * mesma rota nos dois ambientes, e um erro nela aparece aqui antes de aparecer
 * no ar.
 *
 * Sem a variável, cai em `public/uploads` — o lugar antigo, que ainda é lido.
 */
export function raizDeUploads(): string {
  const configurada = process.env.UPLOADS_DIR?.trim();
  return configurada ? path.resolve(configurada) : raizAntiga();
}

/** Onde o upload morava antes de `UPLOADS_DIR`: dentro do app, em public/. */
function raizAntiga(): string {
  return path.join(process.cwd(), "public", "uploads");
}

/**
 * As pastas onde procurar uma imagem, na ordem: a de hoje e, atrás dela, a
 * antiga — para o que o painel enviou antes desta mudança continuar no ar sem
 * depender de alguém mover arquivo à mão no servidor. A segunda entrada pode
 * sair quando a `public/uploads` do servidor estiver vazia.
 */
export function raizesDeLeitura(): string[] {
  const atual = raizDeUploads();
  const antiga = raizAntiga();
  return atual === antiga ? [atual] : [atual, antiga];
}
