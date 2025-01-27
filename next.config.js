/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',  // Activation de l'export statique
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || '',
  images: {
    unoptimized: true,  // Nécessaire pour l'export statique
  },
  // Désactiver le mode strict pour le moment pendant le développement
  reactStrictMode: false,
  // Ajout de la configuration pour GitHub Pages
  assetPrefix: process.env.NEXT_PUBLIC_BASE_PATH || '',
  trailingSlash: true,
}

module.exports = nextConfig 