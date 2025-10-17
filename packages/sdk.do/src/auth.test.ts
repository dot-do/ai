/**
 * Tests for Auth Service
 */

import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest'
import { AuthService, createAuthService } from './auth'
import type { AuthUser, Session, RefreshTokenResponse, SignInOptions, SignOutOptions } from './auth'

// Mock window.location
const mockLocation = {
  href: '',
}

describe('AuthService', () => {
  let mockFetch: ReturnType<typeof vi.fn>
  let service: AuthService
  let originalWindow: any

  beforeEach(() => {
    mockFetch = vi.fn()
    global.fetch = mockFetch

    // Mock window for browser-only methods
    originalWindow = global.window
    const mockLocalStorage = {
      removeItem: vi.fn(),
    }
    global.window = {
      location: mockLocation,
      localStorage: mockLocalStorage,
    } as any
    global.localStorage = mockLocalStorage as any

    service = new AuthService('https://test.api.do', 'test-api-key')
  })

  afterEach(() => {
    global.window = originalWindow
  })

  describe('constructor', () => {
    test('creates service with default baseUrl', () => {
      const defaultService = new AuthService()
      expect(defaultService).toBeInstanceOf(AuthService)
    })

    test('creates service with custom baseUrl and apiKey', () => {
      expect(service).toBeInstanceOf(AuthService)
    })
  })

  describe('signIn()', () => {
    test('redirects to OAuth provider with default options', async () => {
      await service.signIn()

      expect(mockLocation.href).toBe('https://test.api.do/auth/sign-in')
    })

    test('redirects to OAuth provider with custom provider', async () => {
      await service.signIn({ provider: 'google' })

      expect(mockLocation.href).toBe('https://test.api.do/auth/sign-in?provider=google')
    })

    test('redirects with redirect URI and scopes', async () => {
      const options: SignInOptions = {
        provider: 'github',
        redirectUri: 'https://app.do/callback',
        scopes: ['read:user', 'repo'],
      }

      await service.signIn(options)

      expect(mockLocation.href).toContain('provider=github')
      expect(mockLocation.href).toContain('redirect_uri=https%3A%2F%2Fapp.do%2Fcallback')
      expect(mockLocation.href).toContain('scopes=read%3Auser+repo')
    })

    test('redirects with state parameter', async () => {
      await service.signIn({ state: 'csrf_token_123' })

      expect(mockLocation.href).toContain('state=csrf_token_123')
    })

    test('throws error in server environment', async () => {
      delete global.window

      await expect(service.signIn()).rejects.toThrow('signIn() can only be called in browser environment. Use direct OAuth flow in server environments.')

      global.window = originalWindow
    })
  })

  describe('handleCallback()', () => {
    test('exchanges OAuth code for user', async () => {
      const mockUser: AuthUser = {
        id: 'user_123',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockUser,
      })

      const result = await service.handleCallback('oauth_code_123')

      expect(mockFetch).toHaveBeenCalledWith('https://test.api.do/auth/callback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer test-api-key',
        },
        body: JSON.stringify({ code: 'oauth_code_123' }),
      })

      expect(result.id).toBe('user_123')
      expect(result.email).toBe('test@example.com')
    })

    test('throws error on invalid OAuth code', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        text: async () => 'Invalid authorization code',
      })

      await expect(service.handleCallback('invalid_code')).rejects.toThrow('Auth callback failed: Invalid authorization code')
    })
  })

  describe('getCurrentUser()', () => {
    test('retrieves current authenticated user', async () => {
      const mockUser: AuthUser = {
        id: 'user_123',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        emailVerified: true,
        permissions: ['read', 'write'],
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockUser,
      })

      const result = await service.getCurrentUser()

      expect(mockFetch).toHaveBeenCalledWith('https://test.api.do/auth/me', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer test-api-key',
        },
      })

      expect(result?.id).toBe('user_123')
      expect(result?.permissions).toContain('write')
    })

    test('returns null when no user is authenticated (401)', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        statusText: 'Unauthorized',
      })

      const result = await service.getCurrentUser()

      expect(result).toBeNull()
    })

    test('returns null on fetch error', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'))

      const result = await service.getCurrentUser()

      expect(result).toBeNull()
    })
  })

  describe('signOut()', () => {
    test('signs out user with default options', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true }),
      })

      await service.signOut()

      expect(mockFetch).toHaveBeenCalledWith('https://test.api.do/auth/sign-out', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer test-api-key',
        },
        body: JSON.stringify({}),
      })

      expect(global.window.localStorage.removeItem).toHaveBeenCalledWith('auth_token')
      expect(global.window.localStorage.removeItem).toHaveBeenCalledWith('refresh_token')
    })

    test('signs out user with revokeAll option', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true }),
      })

      const options: SignOutOptions = {
        revokeAll: true,
      }

      await service.signOut(options)

      expect(mockFetch).toHaveBeenCalledWith('https://test.api.do/auth/sign-out', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer test-api-key',
        },
        body: JSON.stringify(options),
      })
    })

    test('throws error on sign-out failure', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
      })

      await expect(service.signOut()).rejects.toThrow('Sign out failed: Internal Server Error')
    })
  })

  describe('refreshToken()', () => {
    test('refreshes access token using refresh token', async () => {
      const mockResponse: RefreshTokenResponse = {
        accessToken: 'new_access_token_123',
        refreshToken: 'new_refresh_token_456',
        expiresAt: 1633046400,
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      })

      const result = await service.refreshToken('refresh_token_789')

      expect(mockFetch).toHaveBeenCalledWith('https://test.api.do/auth/refresh', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer test-api-key',
        },
        body: JSON.stringify({ refreshToken: 'refresh_token_789' }),
      })

      expect(result.accessToken).toBe('new_access_token_123')
      expect(result.expiresAt).toBe(1633046400)
    })

    test('throws error on invalid refresh token', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        statusText: 'Invalid refresh token',
      })

      await expect(service.refreshToken('invalid_token')).rejects.toThrow('Token refresh failed: Invalid refresh token')
    })
  })

  describe('verifyToken()', () => {
    test('verifies valid token and returns user', async () => {
      const mockUser: AuthUser = {
        id: 'user_123',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockUser,
      })

      const result = await service.verifyToken('valid_token_123')

      expect(mockFetch).toHaveBeenCalledWith('https://test.api.do/auth/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer valid_token_123',
        },
      })

      expect(result.id).toBe('user_123')
    })

    test('throws error on invalid token', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        statusText: 'Token expired',
      })

      await expect(service.verifyToken('expired_token')).rejects.toThrow('Token verification failed: Token expired')
    })
  })

  describe('hasPermission()', () => {
    test('returns true when user has permission', async () => {
      const mockUser: AuthUser = {
        id: 'user_123',
        email: 'test@example.com',
        permissions: ['read', 'write', 'delete'],
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockUser,
      })

      const result = await service.hasPermission('write')

      expect(result).toBe(true)
    })

    test('returns false when user does not have permission', async () => {
      const mockUser: AuthUser = {
        id: 'user_123',
        email: 'test@example.com',
        permissions: ['read'],
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockUser,
      })

      const result = await service.hasPermission('admin')

      expect(result).toBe(false)
    })

    test('returns false when user has no permissions', async () => {
      const mockUser: AuthUser = {
        id: 'user_123',
        email: 'test@example.com',
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockUser,
      })

      const result = await service.hasPermission('write')

      expect(result).toBe(false)
    })

    test('returns false when user is not authenticated', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
      })

      const result = await service.hasPermission('write')

      expect(result).toBe(false)
    })
  })

  describe('hasAnyRole()', () => {
    test('returns true when user has any of the roles', async () => {
      const mockUser: AuthUser = {
        id: 'user_123',
        email: 'test@example.com',
        permissions: ['user', 'moderator'],
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockUser,
      })

      const result = await service.hasAnyRole('admin', 'moderator')

      expect(result).toBe(true)
    })

    test('returns false when user has none of the roles', async () => {
      const mockUser: AuthUser = {
        id: 'user_123',
        email: 'test@example.com',
        permissions: ['user'],
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockUser,
      })

      const result = await service.hasAnyRole('admin', 'moderator')

      expect(result).toBe(false)
    })

    test('returns false when user is not authenticated', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
      })

      const result = await service.hasAnyRole('admin', 'moderator')

      expect(result).toBe(false)
    })
  })

  describe('hasAllRoles()', () => {
    test('returns true when user has all of the roles', async () => {
      const mockUser: AuthUser = {
        id: 'user_123',
        email: 'test@example.com',
        permissions: ['user', 'verified', 'premium'],
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockUser,
      })

      const result = await service.hasAllRoles('user', 'verified')

      expect(result).toBe(true)
    })

    test('returns false when user is missing any role', async () => {
      const mockUser: AuthUser = {
        id: 'user_123',
        email: 'test@example.com',
        permissions: ['user'],
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockUser,
      })

      const result = await service.hasAllRoles('user', 'admin')

      expect(result).toBe(false)
    })

    test('returns false when user is not authenticated', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
      })

      const result = await service.hasAllRoles('user', 'admin')

      expect(result).toBe(false)
    })
  })

  describe('getSession()', () => {
    test('retrieves current session', async () => {
      const mockSession: Session = {
        id: 'session_123',
        userId: 'user_123',
        accessToken: 'token_abc',
        refreshToken: 'refresh_xyz',
        expiresAt: 1633046400,
        createdAt: 1633000000,
        updatedAt: 1633020000,
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockSession,
      })

      const result = await service.getSession()

      expect(mockFetch).toHaveBeenCalledWith('https://test.api.do/auth/session', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer test-api-key',
        },
      })

      expect(result?.id).toBe('session_123')
      expect(result?.userId).toBe('user_123')
    })

    test('returns null when no session exists (401)', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
      })

      const result = await service.getSession()

      expect(result).toBeNull()
    })

    test('returns null on fetch error', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'))

      const result = await service.getSession()

      expect(result).toBeNull()
    })
  })

  describe('listSessions()', () => {
    test('retrieves all sessions for current user', async () => {
      const mockSessions: Session[] = [
        {
          id: 'session_123',
          userId: 'user_123',
          accessToken: 'token_abc',
          createdAt: 1633000000,
          updatedAt: 1633020000,
        },
        {
          id: 'session_456',
          userId: 'user_123',
          accessToken: 'token_def',
          createdAt: 1632900000,
          updatedAt: 1632920000,
        },
      ]

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ sessions: mockSessions }),
      })

      const result = await service.listSessions()

      expect(mockFetch).toHaveBeenCalledWith('https://test.api.do/auth/sessions', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer test-api-key',
        },
      })

      expect(result).toHaveLength(2)
      expect(result[0].id).toBe('session_123')
      expect(result[1].id).toBe('session_456')
    })

    test('returns empty array when no sessions exist', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ sessions: [] }),
      })

      const result = await service.listSessions()

      expect(result).toEqual([])
    })

    test('throws error on session list failure', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
      })

      await expect(service.listSessions()).rejects.toThrow('Failed to list sessions: Internal Server Error')
    })
  })

  describe('revokeSession()', () => {
    test('revokes session by ID', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true }),
      })

      await service.revokeSession('session_456')

      expect(mockFetch).toHaveBeenCalledWith('https://test.api.do/auth/sessions/session_456', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer test-api-key',
        },
      })
    })

    test('throws error when session not found', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Session not found',
      })

      await expect(service.revokeSession('invalid_session')).rejects.toThrow('Failed to revoke session: Session not found')
    })

    test('throws error on revoke failure', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
      })

      await expect(service.revokeSession('session_123')).rejects.toThrow('Failed to revoke session: Internal Server Error')
    })
  })

  describe('createAuthService', () => {
    test('creates service instance with factory function', () => {
      const factoryService = createAuthService('https://test.do', 'test-key')
      expect(factoryService).toBeInstanceOf(AuthService)
    })

    test('creates service instance with default parameters', () => {
      const factoryService = createAuthService()
      expect(factoryService).toBeInstanceOf(AuthService)
    })
  })
})
