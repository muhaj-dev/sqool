// /** @type {import('next').NextConfig} */
// const nextConfig = {}

// module.exports = nextConfig

// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   reactStrictMode: true,
//   // Remove these experimental settings as they can cause issues
//   eslint: {
//     ignoreDuringBuilds: true,
//   },
//   // Add this for better error handling
//   logging: {
//     fetches: {
//       fullUrl: true,
//     },
//   },
// };

// module.exports = nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
