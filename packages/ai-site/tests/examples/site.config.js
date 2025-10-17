module.exports = {
  name: 'Test Site',
  description: 'A test site for ai-site',
  nextConfig: {
    reactStrictMode: true,
    experimental: {
      appDir: true,
    },
  },
  appDir: './custom-app',
  aiFunctions: {
    enabled: true,
  },
  aiProps: {
    enabled: true,
  },
}
