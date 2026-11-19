import { readFile } from "node:fs/promises";
import path from "node:path";

import { PASTAS_DE_UPLOAD } from "@/lib/imagens";
import { raizesDeLeitura } from "@/lib/uploads";

/**
 * Serve as imagens enviadas pelo painel: /uploads/<pasta>/<arquivo>.
 *
 * Por que uma rota, e não a pasta `public/` direto: o Next lista o conteúdo de
 * `public/` uma única vez, quando o servidor sobe, e em produção só serve o que
 * estava nessa lista (`publicFolderItems`, em
 * node_modules/next/dist/server/lib/router-utils/filesystem.js). Em `next dev`
 * ele confere o disco a cada pedido — daí a pegadinha: a imagem recém-enviada
 * aparece no painel rodando local e devolve 404 no site publicado até o próximo
 * deploy, que é quando o servidor sobe de novo e refaz a lista.
 *
 * Esta rota lê o disco na hora do pedido, então a imagem vale no mesmo
 * instante, em qualquer ambiente. O endereço continua o mesmo: nada muda no
 * banco nem no painel.
 *
 * Arquivo que já estava no disco quando o servidor subiu continua saindo direto
 * pela `public/` — o Next confere a lista dela antes das rotas. Mesmo arquivo,
 * mesmo endereço, só sem passar por aqui.
 */

/** O que o `salvarImagem()` grava é sempre WebP; o resto cobre o que já existe. */
const TIPOS: Record<string, string> = {
  ".webp": "image/webp",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".avif": "image/avif",
};

/** Pasta ou arquivo: começa com letra ou número, o que descarta ".." e "/". */
const SEGMENTO = /^[A-Za-z0-9][A-Za-z0-9._-]*$/;

const PASTAS: ReadonlySet<string> = new Set(PASTAS_DE_UPLOAD);

function naoEncontrada() {
  return new Response("Imagem não encontrada.", {
    status: 404,
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}

export async function GET(
  _pedido: Request,
  { params }: { params: Promise<{ caminho: string[] }> },
) {
  const { caminho } = await params;

  // Só `<pasta>/<arquivo>`, com a pasta entre as conhecidas — é o formato que o
  // upload grava, e é o que fecha a porta para pedir arquivo de fora da pasta.
  if (caminho.length !== 2) return naoEncontrada();

  const [pasta, arquivo] = caminho;
  if (!PASTAS.has(pasta) || !SEGMENTO.test(pasta) || !SEGMENTO.test(arquivo)) {
    return naoEncontrada();
  }

  const tipo = TIPOS[path.extname(arquivo).toLowerCase()];
  if (!tipo) return naoEncontrada();

  let dados: Buffer | undefined;
  for (const raiz of raizesDeLeitura()) {
    const noDisco = path.resolve(raiz, pasta, arquivo);
    // Cinto e suspensório: depois de resolvido, o caminho tem de continuar
    // dentro da pasta de uploads.
    if (!noDisco.startsWith(raiz + path.sep)) continue;
    try {
      dados = await readFile(noDisco);
      break;
    } catch {
      // Não está nesta pasta (ou o caminho é uma pasta): tenta a próxima.
    }
  }

  // Arquivo que não existe não é erro de servidor: o site desenha o lugar da
  // foto vazio, como já faz com post sem capa.
  if (!dados) return naoEncontrada();

  // `new Uint8Array(...)` em vez do Buffer direto: o `Buffer` do Node é tipado
  // sobre `ArrayBufferLike` e o corpo de uma `Response` pede uma view sobre
  // `ArrayBuffer`. A cópia é de uma imagem já pequena e só na primeira visita —
  // depois o `Cache-Control` abaixo resolve no navegador.
  return new Response(new Uint8Array(dados), {
    headers: {
      "Content-Type": tipo,
      // O nome do arquivo é um UUID sorteado no upload: trocar a imagem de um
      // post gera outro endereço, então este nunca muda de conteúdo.
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
