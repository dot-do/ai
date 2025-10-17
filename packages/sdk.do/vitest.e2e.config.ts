import { defineConfig } from 'vitest/config'
import { resolve } from 'path'

/**
 * Vitest Configuration for E2E Tests
 *
 * E2E tests run against real services and external APIs.
 * They are slower than unit/integration tests but provide the highest confidence.
 *
 * Test Environment Variables:
 * - TEST_ENV: Test environment (unit|integration|e2e|staging) - defaults to 'e2e'
 * - E2E_API_KEY: API key for .do platform authentication
 * - DO_API_KEY: Alternative API key for .do platform
 * - OPENAI_API_KEY: OpenAI API key for AI tests
 * - ANTHROPIC_API_KEY: Anthropic API key for AI tests
 * - E2E_CLEANUP: Enable cleanup after tests (defaults to true in e2e mode)
 *
 * Usage:
 *   pnpm test:e2e              # Run all E2E tests
 *   pnpm test:e2e database     # Run database E2E tests
 *   pnpm test:e2e --watch      # Run in watch mode
 */
export default defineConfig({
  resolve: {
    alias: {
      graphdl: resolve(__dirname, '../graphdl/src/index.ts'),
    },
  },
  test: {
    // E2E test settings
    globals: true,
    environment: 'node',

    // Include only E2E test files
    include: ['test/e2e/**/*.e2e.test.ts'],

    // Exclude unit and integration tests
    exclude: ['test/**/*.test.ts', 'test/**/*.spec.ts', 'src/**/*.test.ts', 'examples/**/*'],

    // E2E tests are slower - increase timeouts
    testTimeout: 60000, // 60 seconds per test
    hookTimeout: 30000, // 30 seconds for beforeEach/afterEach

    // Run tests sequentially to avoid rate limits and resource conflicts
    // Parallel execution can cause race conditions with shared resources
    pool: 'forks',
    poolOptions: {
      forks: {
        singleFork: true, // Run tests in a single worker
      },
    },

    // Retry failed tests once (network issues, rate limits, etc.)
    retry: 1,

    // Enable detailed output for debugging
    reporters: ['verbose'],

    // Coverage configuration (optional for E2E)
    coverage: {
      enabled: false, // E2E tests don't need coverage
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['src/**/*.ts'],
      exclude: ['src/**/*.test.ts', 'test/**/*', 'examples/**/*'],
    },

    // Setup files
    setupFiles: [],

    // Teardown (cleanup is handled by E2ETestRunner)
    teardownTimeout: 30000,

    // Environment variables
    env: {
      TEST_ENV: process.env.TEST_ENV || 'e2e',
      E2E_CLEANUP: process.env.E2E_CLEANUP || 'true',
    },
  },
})
