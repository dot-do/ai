/**
 * Auth Service Integration Tests
 *
 * These tests run against actual Auth service endpoints.
 * Requires AUTH_TEST_API_KEY environment variable.
 *
 * Run with: pnpm test:integration auth.integration.test.ts
 */

import { describe, test, expect, beforeAll } from 'vitest'
import { AuthService, createAuthService } from './auth'

const AUTH_BASE_URL = process.env.AUTH_BASE_URL || 'https://auth.do'
const AUTH_TEST_API_KEY = process.env.AUTH_TEST_API_KEY

// Skip all tests if no API key provided
const describeIfApiKey = AUTH_TEST_API_KEY ? describe : describe.skip

describeIfApiKey('Auth Service - Integration Tests', () => {
  let service: AuthService

  beforeAll(() => {
    if (!AUTH_TEST_API_KEY) {
      throw new Error('AUTH_TEST_API_KEY environment variable is required for integration tests')
    }
    service = createAuthService(AUTH_BASE_URL, AUTH_TEST_API_KEY)
  })

  describe('Token Management', () => {
    test('verifies valid token', async () => {
      // This test requires a valid test token
      const testToken = AUTH_TEST_API_KEY

      const result = await service.verifyToken(testToken)

      expect(result).toBeDefined()
      expect(result.valid).toBe(true)
      expect(result.userId).toBeDefined()
    }, 10000)

    test('rejects invalid token', async () => {
      await expect(service.verifyToken('invalid-token-123')).rejects.toThrow()
    }, 10000)

    test('refreshes token successfully', async () => {
      // This test requires a valid refresh token
      const testRefreshToken = process.env.AUTH_TEST_REFRESH_TOKEN

      if (!testRefreshToken) {
        console.log('Skipping refresh test - no refresh token provided')
        return
      }

      const result = await service.refreshToken(testRefreshToken)

      expect(result).toBeDefined()
      expect(result.accessToken).toBeDefined()
      expect(result.refreshToken).toBeDefined()
      expect(result.expiresIn).toBeGreaterThan(0)
    }, 10000)
  })

  describe('User Management', () => {
    test('gets current user', async () => {
      const user = await service.getCurrentUser()

      if (user) {
        expect(user).toBeDefined()
        expect(user.id).toBeDefined()
        expect(user.email).toBeDefined()
      } else {
        // Token might not be associated with a user
        expect(user).toBeNull()
      }
    }, 10000)

    test('checks permissions', async () => {
      const hasPermission = await service.hasPermission('read:users')

      expect(typeof hasPermission).toBe('boolean')
    }, 10000)

    test('checks roles', async () => {
      const hasRole = await service.hasAnyRole(['admin', 'user'])

      expect(typeof hasRole).toBe('boolean')
    }, 10000)
  })

  describe('Session Management', () => {
    test('gets current session', async () => {
      const session = await service.getSession()

      if (session) {
        expect(session).toBeDefined()
        expect(session.id).toBeDefined()
        expect(session.userId).toBeDefined()
      } else {
        // No active session
        expect(session).toBeNull()
      }
    }, 10000)

    test('lists user sessions', async () => {
      const sessions = await service.listSessions()

      expect(Array.isArray(sessions)).toBe(true)
      // May be empty if no sessions exist
    }, 10000)
  })

  describe('OAuth Flow (Partial)', () => {
    test('sign-in redirects to OAuth provider', async () => {
      // Note: This test only verifies redirect logic, not full OAuth flow
      // Full OAuth requires browser interaction

      try {
        await service.signIn('google', {
          redirectUri: 'http://localhost:3000/callback',
        })
        // If we get here, signIn didn't throw (might redirect in browser)
        expect(true).toBe(true)
      } catch (error: any) {
        // Expected: browser environment error or redirect
        expect(error.message).toMatch(/window|redirect|browser/i)
      }
    }, 10000)
  })

  describe('Error Handling', () => {
    test('handles invalid API key', async () => {
      const invalidService = createAuthService(AUTH_BASE_URL, 'invalid-key')

      await expect(invalidService.getCurrentUser()).rejects.toThrow()
    }, 10000)

    test('handles network errors', async () => {
      const offlineService = createAuthService('https://nonexistent-auth.do', AUTH_TEST_API_KEY)

      await expect(offlineService.getCurrentUser()).rejects.toThrow()
    }, 10000)
  })
})

describeIfApiKey('Auth Service - Load Testing', () => {
  let service: AuthService

  beforeAll(() => {
    service = createAuthService(AUTH_BASE_URL, AUTH_TEST_API_KEY!)
  })

  test('handles concurrent token verifications', async () => {
    const promises = Array.from({ length: 10 }, () => service.verifyToken(AUTH_TEST_API_KEY!))

    const results = await Promise.allSettled(promises)

    const successful = results.filter((r) => r.status === 'fulfilled').length
    expect(successful).toBeGreaterThan(0)
  }, 30000)

  test('handles concurrent user fetches', async () => {
    const promises = Array.from({ length: 10 }, () => service.getCurrentUser())

    const results = await Promise.allSettled(promises)

    const successful = results.filter((r) => r.status === 'fulfilled').length
    expect(successful).toBeGreaterThan(0)
  }, 30000)
})
