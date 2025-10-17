/**
 * E2E Test Configuration
 *
 * Provides environment-specific configuration for E2E tests.
 * Supports multiple test environments (unit, integration, e2e, staging).
 */

export interface TestEnvironment {
  name: string
  mock: boolean | { external?: boolean; database?: boolean }
  timeout: number
  baseUrl?: string
  cleanup?: boolean
}

export const testEnvironments: Record<string, TestEnvironment> = {
  /**
   * Unit test environment
   * - All external calls mocked
   * - Fast execution
   * - Isolated tests
   */
  unit: {
    name: 'unit',
    mock: true,
    timeout: 5000,
  },

  /**
   * Integration test environment
   * - Real database connections
   * - Mocked external APIs
   * - Medium execution speed
   */
  integration: {
    name: 'integration',
    mock: { external: true, database: false },
    timeout: 30000,
  },

  /**
   * E2E test environment
   * - Real everything
   * - Actual external API calls
   * - Slowest execution
   * - Requires cleanup
   */
  e2e: {
    name: 'e2e',
    mock: false,
    timeout: 60000,
    cleanup: true,
  },

  /**
   * Staging environment
   * - Production-like environment
   * - Real services
   * - Monitored for performance
   */
  staging: {
    name: 'staging',
    mock: false,
    baseUrl: process.env.STAGING_BASE_URL || 'https://staging.do',
    timeout: 60000,
    cleanup: true,
  },
}

/**
 * Get current test environment
 */
export function getTestEnvironment(): TestEnvironment {
  const env = process.env.TEST_ENV || 'e2e'
  return testEnvironments[env] || testEnvironments.e2e
}

/**
 * Check if running in E2E mode
 */
export function isE2E(): boolean {
  const env = getTestEnvironment()
  return env.name === 'e2e' || env.name === 'staging'
}

/**
 * Check if cleanup is enabled
 */
export function shouldCleanup(): boolean {
  return getTestEnvironment().cleanup === true
}

/**
 * Get base URL for API calls
 */
export function getBaseUrl(service: string): string {
  const env = getTestEnvironment()
  if (env.baseUrl) {
    return `${env.baseUrl}/${service}`
  }

  // Use environment variables or defaults
  const envVar = `${service.toUpperCase()}_BASE_URL`
  return process.env[envVar] || `https://${service}.do`
}

/**
 * Get API key for service
 */
export function getApiKey(service?: string): string {
  if (service) {
    const envVar = `${service.toUpperCase()}_API_KEY`
    return process.env[envVar] || process.env.E2E_API_KEY || ''
  }
  return process.env.E2E_API_KEY || process.env.DO_API_KEY || ''
}

/**
 * Skip test if not in E2E mode
 */
export function skipIfNotE2E(testFn: () => void | Promise<void>) {
  if (!isE2E()) {
    return () => {
      console.log('Skipped: Not in E2E mode')
    }
  }
  return testFn
}

/**
 * Test timeout for current environment
 */
export function getTimeout(): number {
  return getTestEnvironment().timeout
}
