/** @type {import('next').NextConfig} */
const nextConfig = {
  // Otimiza o bundle: carrega apenas os ícones importados
  experimental: {
    optimizePackageImports: ["@phosphor-icons/react"],
  },
};

module.exports = nextConfig;
