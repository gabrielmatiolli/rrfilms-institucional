/**
 * Redirecionamentos 301 da reorganização de URLs (revisão de copy de
 * 28/10/2026). As quatro linhas de película passaram a viver em /servicos/… com
 * nome por extenso, e o card "Proteção UV" virou uma seção da Nanocerâmica.
 *
 * `statusCode: 301` em vez de `permanent: true` (que devolve 308) porque o
 * documento pede 301 nominalmente, e são páginas de conteúdo — só GET, então a
 * troca de método que o 308 evita não é um risco aqui.
 *
 * Redirecionamento é checado antes do sistema de arquivos: a página antiga em
 * /produtos/nanoceramica-ultra-hd foi removida junto, para não ficar código
 * morto que nenhuma URL alcança.
 */
const redirecionamentos = [
  {
    source: "/produtos/nanoceramica-ultra-hd",
    destination: "/servicos/pelicula-nanoceramica",
  },
  {
    source: "/servicos/seguranca-e-anti-vandalismo",
    destination: "/servicos/pelicula-de-seguranca-antiestilhaco",
  },
  {
    source: "/servicos/espelhada-e-refletiva",
    destination: "/servicos/pelicula-refletiva-privacidade",
  },
  {
    source: "/servicos/privacidade-e-jateado",
    destination: "/servicos/vinil-jateado-decorativo",
  },
  // O card "Proteção UV" saiu da grade e virou seção da Nanocerâmica.
  {
    source: "/servicos/protecao-uv",
    destination: "/servicos/pelicula-nanoceramica#protecao-uv",
  },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Permite acessar o servidor de dev pelo IP da rede local (ex: testar no
  // celular pelo mesmo Wi-Fi) — sem isso o Next.js bloqueia como
  // "Unauthorized" os assets (/_next/*) pedidos de uma origem que não seja
  // localhost, e a página carrega sem nenhum JS funcionando.
  allowedDevOrigins: ["192.168.0.*"],
  experimental: {
    // Política de atualização que o `next upgrade` e o aviso do `next dev`
    // seguem: só o que fecha advisory de segurança, nunca "latest" nem
    // experimental. Hoje é o padrão do Next 16.4, e está escrito aqui para o
    // projeto não mudar de política sozinho se o padrão mudar — e para ficar
    // registrado que a subida 16.4.3 → 16.4.6 (19/11/2026) veio de advisory.
    agentUpgrade: "security",
    serverActions: {
      // O padrão do Next é 1MB por request — pequeno demais para o envio de
      // imagens do painel, que sobe por Server Action. salvarImagem() aceita
      // até 8MB; a folga cobre o overhead do multipart.
      bodySizeLimit: "12mb",
    },
  },
  redirects() {
    return redirecionamentos.map((regra) => ({ ...regra, statusCode: 301 }));
  },
};

export default nextConfig;
