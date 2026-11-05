import { config } from "dotenv";
import { PrismaClient, type Prisma } from "../src/generated/prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

import { galerias, produtos, servicos } from "../prisma/dadosIniciais";
import { urlDoDriver } from "../src/lib/urlDoBanco";
import { site } from "../src/lib/site";

/**
 * Alinha o conteúdo do painel à revisão de copy de 28/10/2026.
 *
 * O `db:seed` é conservador de propósito: ele não sobrescreve o que já foi
 * editado no painel. Isso é certo no dia a dia e errado nesta virada — as linhas
 * de serviço e de produto do banco ainda falam em "Linha Smart", "Proteção UV",
 * "79% menos calor" e apontam para URLs que não existem mais. Este script é o
 * contrário do seed: ele reescreve, uma vez, exatamente os campos que a revisão
 * mudou.
 *
 * O que ele NÃO toca, de propósito:
 *
 * - **Depoimentos.** A autorização é decisão da RR Film; se alguém já aprovou um
 *   depoimento no painel, não é um script que vai despublicar. Ele só relata.
 * - **Fotos de galeria já cadastradas.** A curadoria é do painel. Só cria as
 *   fotos das galerias novas, que nascem vazias.
 * - **Corpo de artigo e de interna.** Nunca.
 *
 * Uso — sem `--aplicar` ele só mostra o que faria:
 *
 *   npm run db:alinhar            # simulação
 *   npm run db:alinhar -- --aplicar
 *
 * Em produção, rode depois do `npm run db:deploy` (a migration dos campos novos
 * do formulário) — ver o README, "Deploy na Hostinger".
 */

// Mesma precedência do prisma.config.ts e do Next: `.env.local` (dev) vence o
// `.env` (produção).
config({ path: ".env.local", quiet: true });
config({ quiet: true });

const APLICAR = process.argv.includes("--aplicar");

const adapter = new PrismaMariaDb(urlDoDriver(process.env.DATABASE_URL!), {
  useTextProtocol: true,
});
const prisma = new PrismaClient({ adapter });

/** Slugs que saíram do portfólio ou mudaram de endereço. */
const SERVICOS_APOSENTADOS = [
  "nanoceramica-ultra-hd",
  "seguranca-e-anti-vandalismo",
  "privacidade-e-jateado",
  "protecao-uv",
  "espelhada-e-refletiva",
];

const PRODUTOS_APOSENTADOS = [
  "nanoceramica-ultra-hd",
  "seguranca-antiestilhaco",
  "refletiva-black-silver",
  "decorativa-jateada",
  "linha-smart",
];

const mudancas: string[] = [];
function anotar(texto: string) {
  mudancas.push(texto);
  console.log(`  ${APLICAR ? "✔" : "·"} ${texto}`);
}

async function alinharServicos() {
  console.log("\nServiços");

  for (const [ordem, servico] of servicos.entries()) {
    const campos = {
      linha: servico.linha,
      tag: servico.tag,
      titulo: servico.titulo,
      descricao: servico.descricao,
      foto: servico.foto,
      href: servico.href,
      dados: servico.dados as unknown as Prisma.InputJsonValue,
      ordem,
      ativo: true,
      // A URL é servida por uma rota de código (src/app/(site)/servicos/…), que
      // vence o /servicos/[slug] do painel. Deixar ligado faria o painel
      // prometer uma interna que ele não desenha.
      temPaginaPropria: false,
    };

    if (APLICAR) {
      await prisma.servico.upsert({
        where: { slug: servico.slug },
        update: campos,
        create: {
          slug: servico.slug,
          ...campos,
          conteudo: [] as unknown as Prisma.InputJsonValue,
        },
      });
    }
    anotar(`${servico.slug} → "${servico.titulo}" (${servico.href})`);
  }

  const aposentados = SERVICOS_APOSENTADOS.filter(
    (slug) => !servicos.some((servico) => servico.slug === slug),
  );
  const existentes = await prisma.servico.findMany({
    where: { slug: { in: aposentados }, ativo: true },
    select: { slug: true },
  });
  for (const { slug } of existentes) {
    if (APLICAR) {
      await prisma.servico.update({
        where: { slug },
        data: { ativo: false, temPaginaPropria: false },
      });
    }
    anotar(`${slug} → desativado (saiu do portfólio ou mudou de URL)`);
  }
}

async function alinharProdutos() {
  console.log("\nLinhas de película");

  for (const [ordem, produto] of produtos.entries()) {
    const campos = {
      nome: produto.nome,
      destaque: produto.destaque,
      promessa: produto.promessa,
      descricao: produto.descricao,
      foto: produto.foto,
      hrefExterno: produto.href,
      temPaginaPropria: false,
      ordem,
      ativo: true,
    };

    if (APLICAR) {
      await prisma.produto.upsert({
        where: { slug: produto.slug },
        update: campos,
        create: {
          slug: produto.slug,
          ...campos,
          conteudo: [] as unknown as Prisma.InputJsonValue,
        },
      });
    }
    anotar(`${produto.slug} → "${produto.nome}" (${produto.href})`);
  }

  const aposentados = PRODUTOS_APOSENTADOS.filter(
    (slug) => !produtos.some((produto) => produto.slug === slug),
  );
  const existentes = await prisma.produto.findMany({
    where: { slug: { in: aposentados }, ativo: true },
    select: { slug: true },
  });
  for (const { slug } of existentes) {
    if (APLICAR) {
      await prisma.produto.update({
        where: { slug },
        data: { ativo: false, temPaginaPropria: false },
      });
    }
    anotar(`${slug} → desativado`);
  }
}

async function alinharGalerias() {
  console.log("\nGalerias");

  for (const [ordem, galeria] of galerias.entries()) {
    const cabecalho = {
      nomeNoPainel: galeria.nomeNoPainel,
      sobrancelha: galeria.sobrancelha,
      titulo: galeria.titulo,
      lead: galeria.lead,
      ordem,
    };

    if (!APLICAR) {
      anotar(`${galeria.chave} → "${galeria.titulo}"`);
      continue;
    }

    const registro = await prisma.galeria.upsert({
      where: { chave: galeria.chave },
      update: cabecalho,
      create: { chave: galeria.chave, ...cabecalho },
    });
    anotar(`${galeria.chave} → "${galeria.titulo}"`);

    // Fotos só na galeria que nasce vazia: curadoria do painel não se desfaz.
    const jaTemFotos = await prisma.galeriaItem.count({
      where: { galeriaId: registro.id },
    });
    if (jaTemFotos > 0) continue;

    await prisma.galeriaItem.createMany({
      data: galeria.itens.map((item, indice) => ({
        galeriaId: registro.id,
        imagem: item.imagem,
        alt: item.alt,
        ordem: indice,
      })),
    });
    anotar(`${galeria.chave} → ${galeria.itens.length} fotos iniciais`);
  }
}

async function alinharConfiguracao() {
  console.log("\nDados institucionais");

  const atual = await prisma.configuracaoSite.findUnique({ where: { id: "singleton" } });
  const dados = {
    cnpj: site.cnpj,
    horario: site.horario,
    atendimento: site.atendimento,
  };

  if (!atual) {
    if (APLICAR) {
      await prisma.configuracaoSite.create({
        data: {
          id: "singleton",
          telefone: site.telefone,
          telefoneLink: site.telefoneLink,
          whatsapp: site.whatsapp,
          email: site.email,
          instagram: site.instagram,
          instagramUrl: site.instagramUrl,
          cidade: site.cidade,
          ...dados,
        },
      });
    }
    anotar("linha criada com os dados de src/lib/site.ts");
    return;
  }

  for (const [campo, valor] of Object.entries(dados) as [keyof typeof dados, string][]) {
    if (atual[campo] === valor) continue;
    if (APLICAR) {
      await prisma.configuracaoSite.update({
        where: { id: "singleton" },
        data: { [campo]: valor },
      });
    }
    anotar(`${campo}: "${atual[campo]}" → "${valor}"`);
  }
}

async function conferirDepoimentos() {
  console.log("\nDepoimentos (só conferência — este script não publica nem oculta)");

  const todos = await prisma.depoimento.findMany({
    select: { nome: true, ativo: true, autorizado: true },
    orderBy: { ordem: "asc" },
  });

  if (todos.length === 0) {
    console.log("  · nenhum cadastrado: o bloco da Home fica oculto.");
    return;
  }

  const publicados = todos.filter((d) => d.ativo && d.autorizado);
  for (const depoimento of todos) {
    const estado =
      depoimento.ativo && depoimento.autorizado
        ? "publicado"
        : depoimento.autorizado
          ? "autorizado, inativo"
          : "sem autorização";
    console.log(`  · ${depoimento.nome}: ${estado}`);
  }
  if (publicados.length > 0) {
    console.log(
      `\n  Atenção: ${publicados.length} depoimento(s) estão no ar. A revisão de copy pede\n  autorização por escrito do cliente, com nome e cidade. Confirme em\n  /admin/conteudo — ou desmarque "autorizado" para ocultar o bloco.`,
    );
  }
}

async function main() {
  console.log(
    APLICAR
      ? "Alinhando o conteúdo do painel à revisão de copy de 28/10/2026…"
      : "SIMULAÇÃO — nada será gravado. Rode com `-- --aplicar` para valer.",
  );

  await alinharServicos();
  await alinharProdutos();
  await alinharGalerias();
  await alinharConfiguracao();
  await conferirDepoimentos();

  console.log(
    APLICAR
      ? `\nPronto. ${mudancas.length} alteração(ões) gravadas.`
      : `\n${mudancas.length} alteração(ões) seriam gravadas. Rode com \`-- --aplicar\`.`,
  );
}

main()
  .catch((erro) => {
    console.error(erro);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
