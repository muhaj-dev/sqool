// /** @type {import('next').NextConfig} */
// const nextConfig = {}

// module.exports = nextConfig


/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    outputFileTracingExcludes: {
      '*': [
        '**/.next/**',
        '**/node_modules/**',
        '**/.git/**',
        '**/.vercel/**',
        '**/pnpm-lock.yaml',
      ],
    },
  },
}

module.exports = nextConfig
