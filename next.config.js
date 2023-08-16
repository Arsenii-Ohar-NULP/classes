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
    async redirects() {
        return [
            {
                source: '/',
                destination: '/auth/login',
                permanent: true
            }
        ]
    }
}

module.exports = nextConfig