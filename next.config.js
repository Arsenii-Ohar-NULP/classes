/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
    reactStrictMode: false,
    experimental: {
      appDir: true
    },
    images: {
      minimumCacheTTL: 60,
    },
  }
  
  module.exports = nextConfig