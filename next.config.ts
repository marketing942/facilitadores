import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // o sync completo da Guru leva ~2 minutos (cota de 360 chamadas/min); o padrão de 60s
  // derrubaria o build
  staticPageGenerationTimeout: 300,
  // há outros package-lock.json nas pastas acima; fixa a raiz neste projeto
  turbopack: { root: path.resolve(".") },
  // a aba "Acessos" mudou de nome; o endereço antigo continua funcionando
  async redirects() {
    return [
      { source: "/acessos", destination: "/ferramentas", permanent: true },
      // a aba Parceiros leva direto ao site oficial
      { source: "/parceiros", destination: "https://cppem.com.br/parceiros", permanent: false },
    ];
  },
  // Sem cacheComponents: o catálogo usa unstable_cache (Data Cache da Vercel), que é
  // compartilhado entre instâncias e não tem o limite de 50s do 'use cache' no build.
};

export default nextConfig;
