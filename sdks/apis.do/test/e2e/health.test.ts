import { describe, it, expect, beforeAll } from 'vitest'
import { createClient } from '../../src/index'

/**
 * End-to-End Tests for APIs.do SDK
 *
 * These tests hit the actual deployed API to ensure the SDK works correctly.
 *
 * To run these tests against a specific environment:
 * - Production: TEST_URL=https://apis.do pnpm test:e2e
 * - Preview: TEST_URL=https://api.{branch-name}.workers.dev pnpm test:e2e
 * - Development: TEST_URL=http://localhost:3002 pnpm test:e2e
 *
 * IMPORTANT: These tests require TEST_URL to be explicitly set.
 * They default to localhost to avoid affecting production metrics in CI.
 */

describe('E2E: APIs.do SDK', () => {
  const baseUrl = process.env.TEST_URL || 'http://localhost:3002'
  let client: ReturnType<typeof createClient>

  beforeAll(() => {
    client = createClient({ baseUrl })
    console.log(`Running E2E tests against: ${baseUrl}`)
  })

  describe('Health Check', () => {
    it('should get API health', async () => {
      const health = await client.health()

      expect(health).toBeDefined()
      expect(health.$context).toBe('https://api.do')
      expect(health.$type).toBe('ApiGateway')
      expect(health.api.name).toBe('api-worker')
      expect(health.api.status).toBe('healthy')
      expect(health.api.version).toBe('1.0.0')
    })

    it('should check if API is healthy', async () => {
      const isHealthy = await client.isHealthy()
      expect(isHealthy).toBe(true)
    })

    it('should get API endpoints', async () => {
      const endpoints = await client.getEndpoints()

      expect(endpoints).toBeDefined()
      expect(endpoints.webhooks).toBeDefined()
      expect(endpoints.ai).toBeDefined()
      expect(endpoints.admin).toBeDefined()
      expect(endpoints.repos).toBeDefined()
      expect(endpoints.oauth).toBeDefined()
      expect(endpoints.user).toBeDefined()
    })
  })

  describe('User Info', () => {
    it('should get user information', async () => {
      const user = await client.user()

      expect(user).toBeDefined()
      expect(user.authenticated).toBeDefined()
      expect(user.ip).toBeDefined()
      expect(user.asn).toBeDefined()
      expect(user.country).toBeDefined()
      expect(user.colo).toBeDefined()
      expect(user.timestamp).toBeGreaterThan(0)
      expect(user.latency).toBeGreaterThanOrEqual(0)
    })
  })

  describe('Error Handling', () => {
    it('should handle invalid endpoints gracefully', async () => {
      const invalidClient = createClient({ baseUrl: 'https://invalid-url-that-does-not-exist.example.com' })

      await expect(invalidClient.health()).rejects.toThrow()
    })

    it('should handle timeouts', async () => {
      const timeoutClient = createClient({ baseUrl, timeout: 1 })

      await expect(timeoutClient.health()).rejects.toThrow()
    })
  })

  describe('Performance', () => {
    it('should respond within acceptable time', async () => {
      const start = Date.now()
      await client.health()
      const duration = Date.now() - start

      expect(duration).toBeLessThan(1000) // Should respond within 1 second
    })

    it('should handle concurrent requests', async () => {
      const requests = Array.from({ length: 5 }, () => client.health())

      const results = await Promise.all(requests)

      results.forEach((result) => {
        expect(result.api.status).toBe('healthy')
      })
    })
  })
})
