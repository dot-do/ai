import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['test/e2e/**/*.test.ts'],
    testTimeout: 30000, // 30 seconds for ACID tests
    hookTimeout: 30000,
  },
})
