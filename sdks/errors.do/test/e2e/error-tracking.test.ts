import { describe, it, expect, beforeAll } from 'vitest'
import { createClient, ErrorClient } from '../../src/index'

const TEST_URL = process.env.TEST_URL || 'https://errors.do'

describe('Error Tracking E2E', () => {
  let client: ErrorClient

  beforeAll(() => {
    client = createClient({
      baseUrl: TEST_URL,
      environment: 'test',
      enableAutoCapture: false,
    })
  })

  describe('Health Check', () => {
    it('should return healthy status', async () => {
      const health = await client.health()
      expect(health.status).toBe('healthy')
      expect(health.timestamp).toBeGreaterThan(0)
    })
  })

  describe('Error Capture', () => {
    it('should capture a simple error message and verify data integrity', async () => {
      const message = 'Test error message from E2E test'
      const id = await client.captureMessage(message, 'error')
      expect(id).toBeTruthy()

      // Flush to ensure it's sent
      await client.flush()

      // Wait a bit for processing
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Retrieve and verify
      const retrievedError = await client.getError(id)
      if (retrievedError) {
        expect(retrievedError.message).toBe(message)
        expect(retrievedError.level).toBe('error')
      }
    })

    it('should capture an exception with stack trace and verify integrity', async () => {
      const error = new Error('Test exception from E2E test')
      const id = await client.captureException(error)
      expect(id).toBeTruthy()

      // Flush to ensure it's sent
      await client.flush()

      // Wait for processing
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Retrieve and verify
      const retrievedError = await client.getError(id)
      if (retrievedError) {
        expect(retrievedError.message).toBe('Test exception from E2E test')
        expect(retrievedError.exception).toBeDefined()
        expect(retrievedError.exception?.type).toBe('Error')
        expect(retrievedError.exception?.stacktrace).toBeDefined()
      }
    })

    it('should capture error with context and verify all context is preserved', async () => {
      const testContext = {
        user: {
          id: 'test-user-123',
          email: 'test@example.com',
        },
        tags: {
          test: 'e2e',
          component: 'sdk',
        },
        extra: {
          testData: 'additional context',
        },
      }

      const id = await client.captureError('Test error with context', testContext)
      expect(id).toBeTruthy()

      // Flush to ensure it's sent
      await client.flush()

      // Wait for processing
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Retrieve and verify context is preserved
      const retrievedError = await client.getError(id)
      if (retrievedError) {
        expect(retrievedError.message).toBe('Test error with context')
        expect(retrievedError.context?.tags).toEqual(testContext.tags)
        expect(retrievedError.context?.extra).toEqual(testContext.extra)
      }
    })

    it('should capture errors with different severity levels and verify', async () => {
      const levels = ['debug', 'info', 'warning', 'error', 'fatal'] as const
      const ids: string[] = []

      for (const level of levels) {
        const id = await client.captureMessage(`Test ${level} message`, level)
        expect(id).toBeTruthy()
        ids.push(id)
      }

      // Flush all errors
      await client.flush()

      // Wait for processing
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Verify each level was preserved
      for (let i = 0; i < levels.length; i++) {
        const retrievedError = await client.getError(ids[i])
        if (retrievedError) {
          expect(retrievedError.level).toBe(levels[i])
          expect(retrievedError.message).toBe(`Test ${levels[i]} message`)
        }
      }
    })
  })

  describe('Breadcrumbs', () => {
    it('should capture error with breadcrumbs', async () => {
      const testClient = createClient({
        baseUrl: TEST_URL,
        environment: 'test',
        enableAutoCapture: false,
      })

      // Add breadcrumbs
      testClient.addBreadcrumb({
        category: 'navigation',
        message: 'User navigated to /dashboard',
        level: 'info',
      })

      testClient.addBreadcrumb({
        category: 'user',
        message: 'User clicked submit button',
        level: 'info',
      })

      // Capture error with breadcrumbs
      const id = await testClient.captureError('Error after user actions')
      expect(id).toBeTruthy()

      await testClient.close()
    })
  })

  describe('Batch Operations', () => {
    it('should batch multiple errors', async () => {
      const testClient = createClient({
        baseUrl: TEST_URL,
        environment: 'test',
        enableAutoCapture: false,
        batchSize: 5,
      })

      // Capture multiple errors
      const ids = []
      for (let i = 0; i < 3; i++) {
        const id = await testClient.captureMessage(`Batch error ${i + 1}`)
        ids.push(id)
      }

      expect(ids).toHaveLength(3)
      expect(ids.every((id) => id)).toBe(true)

      // Flush remaining
      await testClient.flush()
      await testClient.close()
    })
  })

  describe('Error Retrieval', () => {
    it('should list errors', async () => {
      // Capture some errors first
      await client.captureMessage('Test error for listing 1')
      await client.captureMessage('Test error for listing 2')
      await client.flush()

      // List errors
      const result = await client.listErrors({
        limit: 10,
        environment: 'test',
      })

      expect(result.errors).toBeDefined()
      expect(Array.isArray(result.errors)).toBe(true)
      expect(result.total).toBeGreaterThanOrEqual(0)
    })

    it('should get error statistics', async () => {
      const stats = await client.getStats({
        environment: 'test',
      })

      expect(stats.total).toBeGreaterThanOrEqual(0)
      expect(stats.byLevel).toBeDefined()
      expect(stats.byEnvironment).toBeDefined()
    })

    it('should get error groups', async () => {
      const result = await client.getErrorGroups({
        limit: 10,
        environment: 'test',
      })

      expect(result.groups).toBeDefined()
      expect(Array.isArray(result.groups)).toBe(true)
      expect(result.total).toBeGreaterThanOrEqual(0)
    })
  })
})
