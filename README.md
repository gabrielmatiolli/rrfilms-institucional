# RR Film · site institucional

Réplica em Next.js do arquivo Figma **RR Films**
(`https://www.figma.com/design/lrPplCG4cfnJhxSk2d4nWS/RR-Films`), nó `1:3` —
página *Prototype*.

Stack: Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS 4.

```bash
npm run dev       # http://localhost:3000
npm run build     # next build --webpack
npm start         # servidor de produção
npm run lint

npm run db:migrate  # aplica as migrations no banco de dev
npm run db:seed     # popula o banco com o conteúdo inicial
npm run db:studio   # abre o Prisma Studio
```

O `build` consulta o banco: as páginas públicas são pré-renderizadas com o
conteúdo que está no MySQL. Sem `DATABASE_URL` acessível, o build falha.

## Banco de dados

MySQL via Prisma 7, com o adaptador `@prisma/adapter-mariadb` — mesmo arranjo do
site da Multipatas. O schema fica em `prisma/schema.prisma` e o cliente é gerado
em `src/generated/prisma` (fora do controle de versão; o `postinstall` regenera).

Variáveis de ambiente em `.env` — veja `.env.example`:

| Variável | Para quê |
| --- | --- |
| `DATABASE_URL` | Conexão MySQL |
| `JWT_SECRET` | Assina o cookie de sessão do painel (mínimo 32 caracteres) |
| `ADMIN_SEED_*` | Conta de acesso criada pelo `db:seed`, se ainda não existir |
| `NEXT_PUBLIC_HCAPTCHA_SITE_KEY` / `HCAPTCHA_SECRET_KEY` | Captcha do login |

Dois arquivos de ambiente, com as mesmas chaves:

- **`.env`**: produção. Vai dentro do ZIP da Hostinger.
- **`.env.local`**: dev. Nunca vai no ZIP e, quando existe, vence o `.env` —
  no Next, no Prisma (`prisma.config.ts`) e no seed. Em geral só precisa da
  `DATABASE_URL` do MySQL local.

Sem o `.env.local`, tudo o que roda na sua máquina fala com o banco de
produção. Caracteres especiais da senha vão codificados na URL: `#` vira
`%23`, `@` vira `%40`, `:` vira `%3A`, `/` vira `%2F`.

Primeira vez, em máquina nova:

```bash
cp .env.example .env   # e preencha DATABASE_URL, JWT_SECRET e ADMIN_SEED_*
npm run db:migrate
npm run db:seed
```

No banco da Hostinger, **nunca** `migrate dev` nem `migrate reset`: as
migrations nascem no banco local (`npm run db:migrate`) e sobem para produção
com `npm run db:deploy`. O `prisma.config.ts` recusa `migrate dev`, `migrate reset` e
`db push` quando a `DATABASE_URL` não aponta para esta máquina (escape:
`PERMITIR_MIGRATE_REMOTO=1`). Em hospedagem compartilhada o `migrate dev` costuma
falhar de qualquer jeito: ele cria um banco temporário de sombra, e o usuário
do banco em geral não tem permissão para isso.

Cuidado com upload quando o dev aponta para o banco de produção: a imagem é
gravada no `public/uploads` **da sua máquina**, mas o registro vai para o banco
de produção — e o site no ar passa a apontar para um arquivo que não existe no
servidor. Conteúdo com foto se cadastra no painel do site publicado.

O seed é idempotente e conservador: reaplica o conteúdo inicial sem sobrescrever
o que já foi editado no painel. Ele nunca apaga o corpo de um artigo já escrito,
nem refaz as fotos de uma galeria que já tem curadoria, nem troca a senha de uma
conta existente.

Três armadilhas deste banco, todas já encontradas na prática:

- **Nada de `@default` em coluna `TEXT` ou `JSON`.** O MySQL 8 de dev recusa
  (erro 1101) e, em `JSON`, o Prisma descarta o default em silêncio enquanto o
  cliente continua tratando o campo como opcional. A nota no fim do
  `schema.prisma` explica a regra e a alternativa (`VARCHAR` com default).
- **Não leve o banco local para a Hostinger por dump.** O MySQL no Windows grava
  os nomes das tabelas em minúsculas (`adminuser`, `blogpost`); no Linux o nome
  diferencia maiúsculas e o Prisma procura `AdminUser`. Em produção o caminho é
  `prisma migrate deploy` + `db:seed`, e o conteúdo se refaz pelo painel.
- **`next dev` aberto antes do banco.** O cliente do Prisma fica em cache no
  processo, para o hot reload não abrir um pool novo a cada edição. Desde
  `src/lib/prisma.ts` ele é recriado quando a `DATABASE_URL` muda — então
  corrigir a senha no `.env` com o servidor rodando já funciona. Se mesmo assim
  aparecer `pool timeout … active=0 idle=0`, reinicie o `npm run dev`.

## Painel administrativo

Em `/admin`, fora do índice dos buscadores (`noindex` nas páginas, `Disallow` no
`robots.txt`). O site público vive no grupo de rotas `(site)`, que carrega navbar
e rodapé; o painel fica fora dele e compartilha só as fontes e os tokens.

| Rota | O que edita | Reflete em |
| --- | --- | --- |
| `/admin` | — | Números, pendências e atividade recente |
| `/admin/blog` | Artigos, com editor de blocos | `/blog`, `/blog/[slug]`, Home |
| `/admin/blog/categorias` | Os filtros da listagem | `/blog` |
| `/admin/servicos` | A grade de cards | `/servicos` |
| `/admin/produtos` | As linhas de película | Home, `/produtos/[slug]` |
| `/admin/galerias` | As cinco galerias de obra | Home, `/servicos`, `/para-casas`, `/para-empresas`, produto |
| `/admin/conteudo` | Depoimentos e dados institucionais | Rodapé, `/contato`, Home |
| `/admin/configuracoes` | Senha, contas de acesso, histórico | — |

Toda gravação chama `revalidatePath` nas rotas afetadas: a alteração aparece no
site sem precisar de novo deploy.

### Editor de blocos

O corpo dos artigos e das páginas de linha é montado em blocos (título,
parágrafo, destaque, imagem, galeria, citação, lista, faixa de dados, botão,
espaço) e guardado como JSON. Cada tipo tem um par no design system — não existe
bloco que o site não saiba desenhar (`src/components/conteudo/Blocos.tsx`).

Diferente do painel da Multipatas, o editor não é uma tela de composição com
inspetor fixo na lateral: cada bloco é uma linha que abre os próprios campos ao
ser tocada. A mesma interface serve no celular e no computador, porque o cliente
publica post do telefone.

### Login

- Cookie `httpOnly` com JWT HS256 (`jose`), `secure` em produção e `sameSite:
  lax`; 12h por padrão, 30 dias com "manter conectado".
- Senha com bcrypt de 12 rodadas. Quando o e-mail não existe, a comparação roda
  contra um hash fixo, para o tempo de resposta não revelar se a conta existe.
- Bloqueio da conta por 15 minutos após 5 tentativas erradas.
- Bloqueio por IP após 20 falhas em 15 minutos, aplicado antes de qualquer
  consulta — cobre também tentativas contra e-mails que não existem.
- hCaptcha obrigatório. As chaves do `.env.example` são as de teste oficiais do
  hCaptcha (sempre validam); troque pelas reais antes de produção.
- Auditoria de todas as tentativas, com IP e motivo, visível em
  `/admin/configuracoes`.
- Mensagem de erro única para senha errada, conta bloqueada, conta inativa e IP
  bloqueado — qualquer diferença contaria a quem tenta em que estado a conta está.
- `versaoSessao` no usuário invalida em bloco as sessões já emitidas. Sobe na
  troca de senha, na redefinição pelo dono, ao desativar a conta e em "encerrar
  sessões em todos os dispositivos" — sem isso, um token roubado continuaria
  valendo até expirar, mesmo depois de trocar a senha.
- Dois papéis: **editor** mexe no conteúdo, **dono** também gerencia as contas.
- Cada Server Action chama `exigirAdmin()` por conta própria. Layout não protege
  action: elas são endpoints independentes.

### Imagens enviadas pelo painel

Vão para `public/uploads/<pasta>/`, fora do controle de versão. Todo arquivo é
reprocessado pelo `sharp` e regravado como WebP: além de comprimir, isso garante
que só sobrevive o que o decodificador entende como imagem — um arquivo com
payload disfarçado de `.jpg` não chega ao disco. O `type` que o navegador manda
é tratado como dica, não como prova.

## Deploy na Hostinger

Mesmo processo do site da Multipatas: app **Node.js** na Hostinger, enviado como
ZIP do projeto-fonte. A Hostinger instala as dependências, roda o build e sobe o
servidor — nada de `node_modules` nem `.next` no pacote.

1. Gerar o pacote (na raiz deste projeto):

   ```bash
   python scripts/empacotar.py
   ```

   Sai `site-institucional.zip`, com `package.json` na raiz do arquivo.

2. No hPanel, subir o ZIP no app Node.js e conferir:
   - **Node.js 20.9 ou mais novo** (exigência do Next.js 16);
   - build: `npm run build`;
   - start: `npm start`.

Variáveis de ambiente: agora existem. O `.env` vai dentro do ZIP (o
`scripts/empacotar.py` avisa se ele estiver faltando). No servidor, a
`DATABASE_URL` aponta para o MySQL da própria Hostinger.

Depois do primeiro deploy, aplicar as migrations e semear, pelo terminal do
app Node.js:

```bash
npx prisma migrate deploy
npm run db:seed
```

Os deploys seguintes só precisam do `migrate deploy`, e apenas quando houver
migration nova. As imagens enviadas pelo painel ficam em `public/uploads` no
servidor e **não** vão no ZIP — o pacote leva só a pasta vazia, para o primeiro
upload ter onde cair.

O que foi ajustado para esse deploy:

- `next.config.mjs` em vez de `.ts` — o servidor carrega a config sem precisar
  transpilar TypeScript;
- build com `--webpack`, como no Multipatas;
- `sharp` como dependência explícita, para o otimizador de imagens do Next
  (`/_next/image`) rodar no Linux da Hostinger. As fotos saem redimensionadas e
  em WebP — a de 490 KB do herói de Para casas chega a 118 KB;
- favicon, ícone SVG e ícone da tela inicial do iOS com o isótipo (o
  `favicon.ico` ainda era o padrão do Next.js);
- `robots.txt` e `sitemap.xml`. As páginas de artigo do blog ficam fora do
  sitemap e com `noindex` enquanto não tiverem texto.

## Como o arquivo de design virou código

| Figma | Aqui |
| --- | --- |
| Variáveis (`cor/*`, `tipo/*`, `raio/*`) | `src/app/globals.css` — `@theme` do Tailwind + espelho com os nomes do Figma em `:root` |
| Estilos de texto (Display/L, Título/H2, Corpo/Grande…) | classes `.t-display-l`, `.t-h2`, `.t-corpo-g`… em `globals.css` |
| Materiais Vidro/01…05 e Elevação/02 | utilitários `vidro-01`…`vidro-05` e `elevacao-02` |
| `00 · Marca` | `src/components/brand/Marca.tsx` — isótipo e wordmark vetorizados, em `currentColor` |
| `01 · Base` (28 ícones) | `src/components/ui/Icone.tsx` — mesmos paths, caixa 24, traço 1,5 |
| `02 · Formulário` | `src/components/ui/Formulario.tsx` |
| `03 · Navegação` | `src/components/layout/` |
| `04 · Conteúdo` | `src/components/ui/`, `src/components/cards/`, `src/components/sections/` |
| `05 · Autorais` | `src/components/autorais/` |

As oito páginas do protótipo:

| Figma | Rota |
| --- | --- |
| 01 · Home | `/` |
| 02 · Serviços | `/servicos` |
| 03 · Produto · Nanocerâmica Ultra HD | `/produtos/nanoceramica-ultra-hd` |
| 04 · Para casas | `/para-casas` |
| 05 · Para empresas | `/para-empresas` |
| 06 · Blog | `/blog` |
| 07 · Contato | `/contato` |
| 08 · A marca | `/a-marca` |

## Mobile first

O arquivo do Figma só tem desktop (1440). O código parte do celular: os estilos
sem prefixo valem para a tela pequena, e `sm:` (40rem), `md:` (48rem) e `lg:`
(64rem) acrescentam o layout de telas maiores. As interações foram pensadas
primeiro para o toque, que não tem hover.

Padrões usados (em `src/app/globals.css`, camada `components`):

- **`.rolagem-lateral`** — listas de cards viram fileira de arrasto lateral, com
  o próximo card aparecendo na borda; do `md` em diante, grade. Usada nas Linhas,
  nos Depoimentos e no Blog da Home.
- **`.linha-de-chips`** — filtros numa linha só, arrastável; quebram linha a
  partir do `lg`.
- **`pointer-coarse:` / `pointer-fine:`** — instruções que dependem do gesto
  ("Toque para limpar o vidro" x "Passe o mouse…") e affordances só de toque.
- **`svh`** — alturas de tela cheia usam a altura pequena da viewport, que não
  pula quando a barra do navegador do celular aparece.
- **Alvos de 44px** — botões, pontos da bússola, paginação, links do rodapé e do
  menu. Onde o visual não pode crescer, a área de toque cresce por padding com
  margem negativa.
- **Ordem de leitura do celular = ordem do DOM** — no Contato, os atalhos de
  WhatsApp/telefone vêm antes do formulário; em Para casas/empresas, título e
  botões antes da foto. O `lg:` reposiciona para o layout do Figma.

As regras base (`body`, `:focus-visible`, `img`) ficam em `@layer base`. Fora de
camada, no Tailwind 4, elas venceriam os utilitários (`min-w-*`, `rounded-*`).

## Componentes autorais

As peças que o arquivo de design marca como "autorais" carregam a interação
descrita no Figma, adaptada para código e para o toque:

- **Hero · Comparador** — abre em Aplicação 0%, como a Home do Figma. O gesto
  horizontal em qualquer ponto do herói passa o rodo (como limpar a tela do
  celular); o vertical continua rolando a página (`touch-action: pan-y`).
  Teclado e leitor de tela usam um `input[type=range]` fora da tela. No celular e
  no tablet, a temperatura aparece numa leitura compacta no lugar do termômetro.
- **Corte da lâmina** — as quatro camadas partem empilhadas e se separam com o
  scroll. No celular, se separam na vertical, uma por linha; do `md` em diante,
  na horizontal, uma por coluna. Com `prefers-reduced-motion`, já chegam
  separadas.
- **Bússola solar** — tocar/clicar num ponto cardeal gira o setor de incidência
  pelo caminho mais curto, reposiciona o sol, recalcula a carga térmica e troca a
  indicação. O dial é fluido; no toque, os pontos viram botões de vidro.
- **Segmento dividido** — uma faixa só, partida pela diagonal de 13° do isótipo.
  No celular os lados empilham e a diagonal corre na horizontal; do `md` em
  diante, lado a lado, e o hover (só de mouse) empurra a aresta.
- **Janela de depoimento** — o depoimento chega embaçado. No toque, um toque
  limpa e outro embaça; com mouse, o hover limpa; no teclado, o foco.
- **Linha de película** — as cinco linhas reais do portfólio.

## Tipografia

Stage Grotesk (display) e Raleway (texto) são carregadas com `next/font/local` a
partir de `public/fonts`, copiadas da pasta `FONTES` do KV. Nenhuma requisição a
CDN de fontes.

## Fotos

`public/fotos` traz as 42 imagens únicas que o próprio arquivo Figma usa nos
preenchimentos — todas de obra aplicada pela equipe. `src/content/fotos.ts`
mapeia cada posição do design para o arquivo, já sem duplicatas, e ainda serve
os heróis e os componentes autorais.

O conteúdo editável (artigos, serviços, linhas, galerias, depoimentos, dados de
contato) saiu de `src/content/*` e foi para o banco — o seed em
`prisma/dadosIniciais.ts` carrega exatamente os mesmos textos e fotos, para o
site não mudar na virada.

## Pontos que fogem do Figma (de propósito)

1. **Celular e tablet.** O Figma não desenha essas telas; o comportamento de
   cada página nelas está descrito em "Mobile first", acima.
2. **Erros de conteúdo do arquivo corrigidos.** Em dois cards o Figma traz
   "Rejeita até **15 anos** da energia solar" e "**15 anos** / menos calor" —
   um valor de garantia no lugar de um percentual. Usei **79%**, que é o padrão
   do próprio componente `Card de serviço` no design system. Na página do
   produto, a faixa de dados trazia "15 anos do calor do sol barrado"; usei
   **95%**, o número da ficha técnica da mesma página.
3. **Breadcrumbs.** Todas as páginas internas do Figma repetem
   "Início / Serviços / Nanocerâmica Ultra HD". Aqui cada página tem a sua.
4. **`/blog/[slug]`.** O design desenha os CTAs "Ler o artigo" mas não a página
   do artigo. Existe uma casca na linguagem do sistema para nenhum CTA cair em
   404 — falta o texto de cada post.
5. **Formulários.** Marcação e validação nativa prontas, sem back-end: ainda
   não há endpoint de envio definido.
6. **Mapa do Contato.** O Figma deixa um marcador de mapa; aqui entra um
   `iframe` do OpenStreetMap centrado em Itatiba, para trocar pelo provedor que
   o cliente preferir.

## Pendências para produção

Resolvidas pelo painel, sem deploy:

- **CNPJ real no rodapé** — `/admin/conteudo` (o Figma usa `00.000.000/0001-00`).
- **Texto dos artigos do blog** — `/admin/blog`. Os sete artigos foram semeados
  publicados e sem corpo, como o site já estava: a página mostra a casca "texto
  em produção" e sai do índice dos buscadores até alguém escrever.
- **Autorização dos depoimentos** — `/admin/conteudo` tem a marcação por
  depoimento, e o site só publica os autorizados. Os três vieram do Figma
  marcados como autorizados, para o site não mudar na virada; confirme antes de
  produção.

Ainda dependem de código ou de material:

- Chaves reais do hCaptcha (hoje o `.env` usa as de teste).
- Endpoint dos formulários de contato, orçamento corporativo e newsletter.
- Ficha técnica em PDF para o botão "Baixar ficha em PDF".
