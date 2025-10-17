/**
 * Default Next.js configuration for ai-site
 */
module.exports = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    appDir: true,
  },
  webpack: (config, { isServer }) => {
    return config
  },
}
