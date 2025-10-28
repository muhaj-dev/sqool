// /** @type {import('next').NextConfig} */
// const nextConfig = {}

// module.exports = nextConfig


/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;


// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   reactStrictMode: true,
//   swcMinify: true,
//   experimental: {
//     outputFileTracingExcludes: {
//       '*': [
//         '**/.next/**',
//         '**/node_modules/**',
//         '**/.git/**',
//         '**/.vercel/**',
//         '**/pnpm-lock.yaml',
//       ],
//     },
//   },
//   eslint: {
//     ignoreDuringBuilds: true, // ✅ disables ESLint on build
//   },
// };

// module.exports = nextConfig;
