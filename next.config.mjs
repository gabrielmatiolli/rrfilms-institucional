/** @type {import('next').NextConfig} */
const nextConfig = {
  // Permite acessar o servidor de dev pelo IP da rede local (ex: testar no
  // celular pelo mesmo Wi-Fi) — sem isso o Next.js bloqueia como
  // "Unauthorized" os assets (/_next/*) pedidos de uma origem que não seja
  // localhost, e a página carrega sem nenhum JS funcionando.
  allowedDevOrigins: ["192.168.0.*"],
  experimental: {
    serverActions: {
      // O padrão do Next é 1MB por request — pequeno demais para o envio de
      // imagens do painel, que sobe por Server Action. salvarImagem() aceita
      // até 8MB; a folga cobre o overhead do multipart.
      bodySizeLimit: "12mb",
    },
  },
};

export default nextConfig;
