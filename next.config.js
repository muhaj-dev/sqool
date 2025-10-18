// /** @type {import('next').NextConfig} */
// const nextConfig = {}

// module.exports = nextConfig


/** @type {import('next').NextConfig} */
const nextConfig = {
  // Add these experimental options
  experimental: {
    webpackBuildWorker: true,
    parallelServerBuildTraces: false,
    parallelServerCompiles: false,
  },
  
  // Disable source maps in production
  productionBrowserSourceMaps: false,
  
  // Optimize for Vercel
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
}

module.exports = nextConfig