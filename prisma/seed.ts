import { config } from "dotenv";
import { PrismaClient, type Prisma } from "../src/generated/prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import bcrypt from "bcryptjs";

import { urlDoDriver } from "../src/lib/urlDoBanco";
import { categorias, depoimentos, galerias, posts, produtos, servicos } from "./dadosIniciais";

/**
 * Popula o banco com o conteúdo que hoje vive fixo em src/content/* e
 * src/lib/site.ts, para o site continuar exatamente igual depois de passar a
 * ler do banco. Roda com `npm run db:seed`.
 *
 * É idempotente: tudo é upsert por slug/chave, então rodar de novo atualiza em
 * vez de duplicar. O que foi editado no painel e não existe aqui fica intacto.
 */

// Mesma precedência do prisma.config.ts e do Next: `.env.local` (dev) vence o
// `.env` (produção). Vale também quando o seed roda direto, sem o `prisma db seed`.
config({ path: ".env.local", quiet: true });
config({ quiet: true });

const adapter = new PrismaMariaDb(urlDoDriver(process.env.DATABASE_URL!), { useTextProtocol: true });
const prisma = new PrismaClient({ adapter });

async function semearAdmin() {
  const nome = process.env.ADMIN_SEED_NOME;
  const email = process.env.ADMIN_SEED_EMAIL?.trim().toLowerCase();
  const senha = process.env.ADMIN_SEED_SENHA;

  if (!nome || !email || !senha) {
    console.log("· Conta de acesso: ADMIN_SEED_* não configurado, pulando.");
    return;
  }

  const existente = await prisma.adminUser.findUnique({ where: { email } });
  if (existente) {
    console.log(`· Conta de acesso: ${email} já existe, senha preservada.`);
    return;
  }

  await prisma.adminUser.create({
    data: {
      nome,
      email,
      papel: "DONO",
      passwordHash: await bcrypt.hash(senha, 12),
    },
  });
  console.log(`· Conta de acesso criada: ${email}`);
}

async function semearCategorias() {
  for (const [ordem, categoria] of categorias.entries()) {
    const campos = { rotulo: categoria.rotulo, icone: categoria.icone, ordem, ativo: true };
    await prisma.blogCategoria.upsert({
      where: { slug: categoria.slug },
      update: campos,
      create: { slug: categoria.slug, ...campos },
    });
  }
  console.log(`· ${categorias.length} categorias do blog`);
}

async function semearPosts() {
  const idPorSlug = new Map(
    (await prisma.blogCategoria.findMany({ select: { id: true, slug: true } })).map((c) => [
      c.slug,
      c.id,
    ]),
  );

  for (const post of posts) {
    const campos = {
      titulo: post.titulo,
      resumo: post.resumo,
      capa: post.capa,
      autor: "Equipe RR Film",
      categoriaId: idPorSlug.get(post.categoria) ?? null,
      minutosLeitura: post.minutos,
      status: "PUBLICADO" as const,
      destaque: post.destaque ?? false,
      publicadoEm: new Date(post.publicadoEm),
      // Os artigos ainda não têm texto — a página mostra a casca "texto em
      // produção" e sai do índice dos buscadores até alguém escrever no painel.
      conteudo: [] as unknown as Prisma.InputJsonValue,
    };

    await prisma.blogPost.upsert({
      where: { slug: post.slug },
      // `conteudo` fica de fora do update: reseedar não pode apagar um artigo
      // que já foi escrito no painel.
      update: { ...campos, conteudo: undefined },
      create: { slug: post.slug, ...campos },
    });
  }
  console.log(`· ${posts.length} posts do blog`);
}

async function semearServicos() {
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
    };
    await prisma.servico.upsert({
      where: { slug: servico.slug },
      update: campos,
      create: { slug: servico.slug, ...campos },
    });
  }
  console.log(`· ${servicos.length} serviços`);
}

async function semearProdutos() {
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
    await prisma.produto.upsert({
      where: { slug: produto.slug },
      update: campos,
      // `conteudo` só no create: reseedar não pode apagar a página de uma linha
      // que já foi montada no painel.
      create: { slug: produto.slug, ...campos, conteudo: [] as unknown as Prisma.InputJsonValue },
    });
  }
  console.log(`· ${produtos.length} linhas de película`);
}

async function semearGalerias() {
  for (const [ordem, galeria] of galerias.entries()) {
    const cabecalho = {
      nomeNoPainel: galeria.nomeNoPainel,
      sobrancelha: galeria.sobrancelha,
      titulo: galeria.titulo,
      lead: galeria.lead,
      ordem,
    };

    const registro = await prisma.galeria.upsert({
      where: { chave: galeria.chave },
      update: cabecalho,
      create: { chave: galeria.chave, ...cabecalho },
    });

    // As fotos só são semeadas na primeira vez: depois disso quem manda é o
    // painel, e reseedar não pode desfazer a curadoria de quem editou.
    const jaTemFotos = await prisma.galeriaItem.count({ where: { galeriaId: registro.id } });
    if (jaTemFotos > 0) continue;

    await prisma.galeriaItem.createMany({
      data: galeria.itens.map((item, indice) => ({
        galeriaId: registro.id,
        imagem: item.imagem,
        alt: item.alt,
        ordem: indice,
      })),
    });
  }
  console.log(`· ${galerias.length} galerias`);
}

async function semearDepoimentos() {
  const jaTem = await prisma.depoimento.count();
  if (jaTem > 0) {
    console.log("· Depoimentos: já existem, preservados.");
    return;
  }

  await prisma.depoimento.createMany({
    data: depoimentos.map((depoimento, ordem) => ({ ...depoimento, ordem })),
  });
  console.log(`· ${depoimentos.length} depoimentos`);
}

async function semearConfiguracao() {
  const dados = {
    telefone: "(11) 97374-2600",
    telefoneLink: "tel:+5511973742600",
    whatsapp: "https://wa.me/5511973742600",
    email: "contato@rrfilm.com.br",
    instagram: "@rrfilmdecor",
    instagramUrl: "https://www.instagram.com/rrfilmdecor",
    horario: "Seg a sex, 8h às 18h",
    atendimento: "Itatiba, SP — atendimento em toda a região",
    cidade: "Itatiba, SP",
    cnpj: "00.000.000/0001-00",
  };

  await prisma.configuracaoSite.upsert({
    where: { id: "singleton" },
    // Não sobrescreve o que já foi corrigido no painel (o CNPJ real, por exemplo).
    update: {},
    create: { id: "singleton", ...dados },
  });
  console.log("· Dados institucionais");
}

async function main() {
  console.log("Semeando o banco da RR Film…");
  await semearAdmin();
  await semearCategorias();
  await semearPosts();
  await semearServicos();
  await semearProdutos();
  await semearGalerias();
  await semearDepoimentos();
  await semearConfiguracao();
  console.log("Pronto.");
}

main()
  .catch((erro) => {
    console.error(erro);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
