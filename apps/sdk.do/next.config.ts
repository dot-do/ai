import type { NextConfig } from 'next'
import { remarkCodeHike, recmaCodeHike } from 'codehike/mdx'
import createMDX from '@next/mdx'

const chConfig = {
  components: { code: 'Code' },
  syntaxHighlighting: {
    theme: 'github-dark',
  },
}

const nextConfig: NextConfig = {
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
  reactStrictMode: true,
  webpack: (config) => {
    // Monaco editor worker config
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
    }
    return config
  },
}

const withMDX = createMDX({
  options: {
    remarkPlugins: [[remarkCodeHike, chConfig]],
    recmaPlugins: [[recmaCodeHike, chConfig]],
  },
})

export default withMDX(nextConfig)
