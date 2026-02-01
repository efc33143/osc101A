/** @type {import('next').NextConfig} */
const nextConfig = {
    transpilePackages: ['@vercel/blob', 'undici'],
    experimental: {
        serverActions: true,
    }
}

module.exports = nextConfig
