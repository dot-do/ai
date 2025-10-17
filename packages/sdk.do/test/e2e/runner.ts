/**
 * E2E Test Runner
 *
 * Provides utilities for running end-to-end tests with proper setup and teardown.
 * Manages test data, cleanup, and resource tracking.
 */

import { create$ } from '../../src/client'
import { getApiKey, getBaseUrl, shouldCleanup } from './config'

export type CleanupFunction = () => Promise<void> | void

export interface E2ETestContext {
  sdk: ReturnType<typeof create$>
  cleanup: CleanupFunction[]
  testId: string
}

/**
 * E2E Test Runner
 *
 * Manages lifecycle of E2E tests:
 * - SDK initialization
 * - Test data creation
 * - Resource cleanup
 * - Error handling
 */
export class E2ETestRunner {
  private sdk: ReturnType<typeof create$>
  private cleanup: CleanupFunction[] = []
  public testId: string

  constructor(testName?: string) {
    this.testId = this.generateTestId(testName)

    // Initialize SDK with test credentials
    this.sdk = create$({
      apiKey: getApiKey(),
    })
  }

  /**
   * Get SDK instance
   */
  getSDK() {
    return this.sdk
  }

  /**
   * Generate unique test ID
   */
  private generateTestId(testName?: string): string {
    const timestamp = Date.now()
    const random = Math.random().toString(36).substring(2, 8)
    const name = testName ? testName.replace(/[^a-z0-9]/gi, '_').toLowerCase() : 'test'
    return `e2e_${name}_${timestamp}_${random}`
  }

  /**
   * Register cleanup function
   *
   * Cleanup functions are called in reverse order (LIFO)
   * to properly teardown dependent resources.
   */
  registerCleanup(fn: CleanupFunction) {
    this.cleanup.unshift(fn) // Add to front for LIFO
  }

  /**
   * Create test namespace
   *
   * Returns a unique namespace for this test run.
   * Automatically registers cleanup to delete all documents.
   */
  async createNamespace(baseName: string): Promise<string> {
    const namespace = `${baseName}_${this.testId}`

    // Register cleanup
    if (shouldCleanup()) {
      this.registerCleanup(async () => {
        try {
          // List and delete all documents in namespace
          const { documents } = await this.sdk.db.list(namespace, { limit: 1000 })
          for (const doc of documents) {
            await this.sdk.db.delete(namespace, doc.id, true) // Hard delete
          }
        } catch (error) {
          console.warn(`Failed to cleanup namespace ${namespace}:`, error)
        }
      })
    }

    return namespace
  }

  /**
   * Create test vector namespace
   *
   * Returns a unique namespace for vector operations.
   * Automatically registers cleanup.
   */
  async createVectorNamespace(baseName: string): Promise<string> {
    const namespace = `${baseName}_${this.testId}`

    // Register cleanup
    if (shouldCleanup()) {
      this.registerCleanup(async () => {
        try {
          // Delete all vectors in namespace
          // Note: Actual implementation depends on vector service API
          console.log(`Cleanup vector namespace: ${namespace}`)
        } catch (error) {
          console.warn(`Failed to cleanup vector namespace ${namespace}:`, error)
        }
      })
    }

    return namespace
  }

  /**
   * Create test cache key
   *
   * Returns a unique cache key for this test.
   * Automatically registers cleanup.
   */
  createCacheKey(baseName: string): string {
    const key = `${baseName}_${this.testId}`

    // Register cleanup
    if (shouldCleanup()) {
      this.registerCleanup(async () => {
        try {
          await this.sdk.cache.delete(key)
        } catch (error) {
          console.warn(`Failed to cleanup cache key ${key}:`, error)
        }
      })
    }

    return key
  }

  /**
   * Create test storage key
   *
   * Returns a unique storage key for this test.
   * Automatically registers cleanup.
   */
  createStorageKey(baseName: string, extension = 'txt'): string {
    const key = `test/${this.testId}/${baseName}.${extension}`

    // Register cleanup
    if (shouldCleanup()) {
      this.registerCleanup(async () => {
        try {
          await this.sdk.storage.delete(key)
        } catch (error) {
          console.warn(`Failed to cleanup storage key ${key}:`, error)
        }
      })
    }

    return key
  }

  /**
   * Wait for async operation
   *
   * Useful for waiting for indexing, processing, etc.
   */
  async wait(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  /**
   * Poll until condition is met
   *
   * Retries a function until it returns true or timeout is reached.
   */
  async pollUntil(
    condition: () => Promise<boolean>,
    options: {
      interval?: number
      timeout?: number
      errorMessage?: string
    } = {}
  ): Promise<void> {
    const { interval = 1000, timeout = 30000, errorMessage = 'Polling timed out' } = options

    const startTime = Date.now()

    while (Date.now() - startTime < timeout) {
      if (await condition()) {
        return
      }
      await this.wait(interval)
    }

    throw new Error(errorMessage)
  }

  /**
   * Run cleanup
   *
   * Executes all registered cleanup functions.
   * Called automatically in afterEach if using createTestContext.
   */
  async teardown() {
    const errors: Error[] = []

    // Run cleanup functions in reverse order (LIFO)
    for (const fn of this.cleanup) {
      try {
        await fn()
      } catch (error) {
        errors.push(error instanceof Error ? error : new Error(String(error)))
      }
    }

    // Clear cleanup array
    this.cleanup = []

    // Throw if any cleanup failed
    if (errors.length > 0) {
      throw new Error(`Cleanup failed with ${errors.length} error(s):\n${errors.map((e) => e.message).join('\n')}`)
    }
  }
}

/**
 * Create test context for E2E tests
 *
 * Helper function to create a test context with automatic cleanup.
 * Use in beforeEach/afterEach hooks.
 *
 * @example
 * ```typescript
 * describe('My E2E Test', () => {
 *   let runner: E2ETestRunner
 *
 *   beforeEach(() => {
 *     runner = new E2ETestRunner('my_test')
 *   })
 *
 *   afterEach(async () => {
 *     await runner.teardown()
 *   })
 *
 *   test('example', async () => {
 *     const namespace = await runner.createNamespace('users')
 *     const user = await runner.getSDK().db.create(namespace, 'user_1', 'User', {
 *       name: 'Test'
 *     })
 *     // Cleanup happens automatically
 *   })
 * })
 * ```
 */
export function createTestContext(testName?: string): E2ETestRunner {
  return new E2ETestRunner(testName)
}
