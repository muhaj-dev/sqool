// /** @type {import('next').NextConfig} */
// const nextConfig = {}

// module.exports = nextConfig


/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    outputFileTracingIncludes: {
      // include only safe directories if needed in future
      // e.g. ['src/**']
    },
  },
}

module.exports = nextConfig
