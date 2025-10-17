import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'node',
    include: ['test/**/*.test.ts'],
    exclude: ['node_modules', 'dist'],
    globals: true,
    deps: {
      inline: ['vitest'],
    },
  },
  resolve: {
    conditions: ['node'],
  },
})
