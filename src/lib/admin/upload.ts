import "server-only";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import sharp from "sharp";

import { ehCaminhoDeImagem } from "@/lib/imagens";

const TIPOS_ACEITOS = new Set(["image/jpeg", "image/png", "image/webp", "image/avif"]);
const TAMANHO_MAXIMO = 8 * 1024 * 1024;
// Uploads pulam o otimizador (ver src/components/ui/Imagem.tsx): o arquivo
// gravado aqui é o mesmo que o celular baixa, sem srcset. 1920 cobre tela 2x em
// todo espaço de até 960px de CSS — a foto larga da galeria no desktop incluída
// — sem mandar 2400px para um card de 410px no telefone.
const LARGURA_MAXIMA = 1920;

/** Pastas permitidas — evita que um `folder` vindo do form escape do diretório. */
const PASTAS = new Set(["blog", "servicos", "produtos", "galerias", "depoimentos"]);

export interface ResultadoDeUpload {
  url?: string;
  erro?: string;
}

/**
 * Recebe um arquivo do <input type="file">, confere o conteúdo de verdade e
 * regrava como WebP em public/uploads/<pasta>/.
 *
 * Reprocessar com o sharp (que já é dependência do projeto, pelo otimizador de
 * imagens do Next) faz mais do que comprimir: só sobrevive o que o decodificador
 * realmente entende como imagem, então um arquivo com payload disfarçado de
 * .jpg não chega ao disco. O `file.type` do navegador é só uma dica — quem
 * decide é o `metadata()`.
 */
export async function salvarImagem(arquivo: File, pasta: string): Promise<ResultadoDeUpload> {
  if (!(arquivo instanceof File) || arquivo.size === 0) {
    return { erro: "Nenhum arquivo enviado." };
  }
  if (!PASTAS.has(pasta)) {
    return { erro: "Destino de upload inválido." };
  }
  if (arquivo.size > TAMANHO_MAXIMO) {
    return { erro: "A imagem precisa ter no máximo 8 MB." };
  }
  if (arquivo.type && !TIPOS_ACEITOS.has(arquivo.type)) {
    return { erro: "Formato não aceito. Envie JPG, PNG, WebP ou AVIF." };
  }

  const entrada = Buffer.from(await arquivo.arrayBuffer());

  let saida: Buffer;
  try {
    const imagem = sharp(entrada, { failOn: "error" });
    const info = await imagem.metadata();
    if (!info.width || !info.height) return { erro: "O arquivo não é uma imagem válida." };

    saida = await imagem
      .rotate() // aplica a orientação do EXIF antes de descartá-lo
      .resize({ width: LARGURA_MAXIMA, withoutEnlargement: true })
      .webp({ quality: 82 })
      .toBuffer();
  } catch {
    return { erro: "Não foi possível processar essa imagem." };
  }

  const diretorio = path.join(process.cwd(), "public", "uploads", pasta);
  await mkdir(diretorio, { recursive: true });

  const nome = `${randomUUID()}.webp`;
  await writeFile(path.join(diretorio, nome), saida);

  return { url: `/uploads/${pasta}/${nome}` };
}

/**
 * Aceita tanto um caminho de imagem do próprio site (/fotos/…, /uploads/…)
 * quanto vazio. Rejeita URL externa e qualquer coisa com esquema — o que entra
 * aqui vai parar num `src` de <Image>.
 */
export function caminhoDeImagemValido(valor: string): boolean {
  return !valor || ehCaminhoDeImagem(valor);
}
