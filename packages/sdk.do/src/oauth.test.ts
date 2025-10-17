/**
 * Tests for OAuth Service
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { OAuthService, generateCodeVerifier, generateCodeChallenge } from './oauth'
import type { BusinessContext } from './types'

// Mock fetch globally
global.fetch = vi.fn()

// Mock crypto for PKCE
Object.defineProperty(global, 'crypto', {
  value: {
    getRandomValues: (array: Uint8Array) => {
      for (let i = 0; i < array.length; i++) {
        array[i] = Math.floor(Math.random() * 256)
      }
      return array
    },
    subtle: {
      digest: async (algorithm: string, data: BufferSource) => {
        // Simple mock SHA-256 digest
        const bytes = new Uint8Array(data as ArrayBuffer)
        const hash = new Uint8Array(32)
        for (let i = 0; i < 32; i++) {
          hash[i] = bytes[i % bytes.length] ^ (i * 7)
        }
        return hash.buffer
      },
    },
  },
  writable: true,
  configurable: true,
})

describe('OAuth Service', () => {
  let oauth: OAuthService
  let mockClient: BusinessContext

  beforeEach(() => {
    // Reset mocks
    vi.clearAllMocks()

    // Create mock client
    mockClient = {} as BusinessContext

    // Create OAuth service
    oauth = new OAuthService(mockClient, { baseUrl: 'https://oauth.do' })
  })

  describe('Authorization Flow', () => {
    it('should generate authorization URL', async () => {
      const url = await oauth.authorize({
        clientId: 'test-client',
        redirectUri: 'https://app.com/callback',
        scope: ['read', 'write'],
        state: 'random-state',
      })

      expect(url).toContain('https://oauth.do/authorize')
      expect(url).toContain('client_id=test-client')
      expect(url).toContain('redirect_uri=https%3A%2F%2Fapp.com%2Fcallback')
      expect(url).toContain('scope=read+write')
      expect(url).toContain('state=random-state')
      expect(url).toContain('response_type=code')
    })

    it('should generate authorization URL with PKCE', async () => {
      const url = await oauth.authorize({
        clientId: 'test-client',
        redirectUri: 'https://app.com/callback',
        codeChallenge: 'challenge-string',
        codeChallengeMethod: 'S256',
      })

      expect(url).toContain('code_challenge=challenge-string')
      expect(url).toContain('code_challenge_method=S256')
    })

    it('should generate authorization URL with OpenID Connect parameters', async () => {
      const url = await oauth.authorize({
        clientId: 'test-client',
        redirectUri: 'https://app.com/callback',
        scope: ['openid', 'profile', 'email'],
        nonce: 'random-nonce',
        prompt: 'consent',
        maxAge: 3600,
      })

      expect(url).toContain('scope=openid+profile+email')
      expect(url).toContain('nonce=random-nonce')
      expect(url).toContain('prompt=consent')
      expect(url).toContain('max_age=3600')
    })

    it('should exchange authorization code for tokens', async () => {
      const mockResponse = {
        access_token: 'access-token-123',
        token_type: 'Bearer',
        expires_in: 3600,
        refresh_token: 'refresh-token-456',
        scope: 'read write',
      }

      ;(global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      })

      const tokens = await oauth.exchangeCode({
        code: 'auth-code-123',
        clientId: 'test-client',
        clientSecret: 'test-secret',
        redirectUri: 'https://app.com/callback',
      })

      expect(tokens.accessToken).toBe('access-token-123')
      expect(tokens.tokenType).toBe('Bearer')
      expect(tokens.expiresIn).toBe(3600)
      expect(tokens.refreshToken).toBe('refresh-token-456')
      expect(tokens.scope).toBe('read write')
    })

    it('should handle token exchange errors', async () => {
      ;(global.fetch as any).mockResolvedValueOnce({
        ok: false,
        statusText: 'Bad Request',
        json: async () => ({ error: 'invalid_grant' }),
      })

      await expect(
        oauth.exchangeCode({
          code: 'invalid-code',
          clientId: 'test-client',
          clientSecret: 'test-secret',
          redirectUri: 'https://app.com/callback',
        })
      ).rejects.toThrow('Token exchange failed: invalid_grant')
    })
  })

  describe('Token Refresh', () => {
    it('should refresh access token', async () => {
      const mockResponse = {
        access_token: 'new-access-token',
        token_type: 'Bearer',
        expires_in: 3600,
        refresh_token: 'new-refresh-token',
      }

      ;(global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      })

      const tokens = await oauth.refresh({
        refreshToken: 'old-refresh-token',
        clientId: 'test-client',
        clientSecret: 'test-secret',
      })

      expect(tokens.accessToken).toBe('new-access-token')
      expect(tokens.refreshToken).toBe('new-refresh-token')
    })

    it('should refresh with custom scope', async () => {
      const mockResponse = {
        access_token: 'new-access-token',
        token_type: 'Bearer',
        expires_in: 3600,
        scope: 'read',
      }

      ;(global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      })

      const tokens = await oauth.refresh({
        refreshToken: 'refresh-token',
        clientId: 'test-client',
        scope: ['read'],
      })

      expect(tokens.scope).toBe('read')

      // Verify fetch was called with scope parameter
      const fetchCall = (global.fetch as any).mock.calls[0]
      const body = fetchCall[1].body
      expect(body.toString()).toContain('scope=read')
    })

    it('should handle refresh errors', async () => {
      ;(global.fetch as any).mockResolvedValueOnce({
        ok: false,
        statusText: 'Unauthorized',
        json: async () => ({ error: 'invalid_token' }),
      })

      await expect(
        oauth.refresh({
          refreshToken: 'invalid-token',
          clientId: 'test-client',
        })
      ).rejects.toThrow('Token refresh failed: invalid_token')
    })
  })

  describe('Client Credentials Flow', () => {
    it('should get token with client credentials', async () => {
      const mockResponse = {
        access_token: 'client-access-token',
        token_type: 'Bearer',
        expires_in: 7200,
        scope: 'api:read api:write',
      }

      ;(global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      })

      const tokens = await oauth.clientCredentials({
        clientId: 'test-client',
        clientSecret: 'test-secret',
        scope: ['api:read', 'api:write'],
      })

      expect(tokens.accessToken).toBe('client-access-token')
      expect(tokens.scope).toBe('api:read api:write')
      expect(tokens.refreshToken).toBeUndefined() // No refresh token in client credentials
    })

    it('should handle client credentials errors', async () => {
      ;(global.fetch as any).mockResolvedValueOnce({
        ok: false,
        statusText: 'Unauthorized',
        json: async () => ({ error: 'invalid_client' }),
      })

      await expect(
        oauth.clientCredentials({
          clientId: 'invalid-client',
          clientSecret: 'invalid-secret',
        })
      ).rejects.toThrow('Client credentials flow failed: invalid_client')
    })
  })

  describe('Token Validation', () => {
    it('should validate active token', async () => {
      const mockResponse = {
        active: true,
        client_id: 'test-client',
        username: 'testuser',
        scope: 'read write',
        token_type: 'Bearer',
        exp: 1234567890,
        iat: 1234564290,
        sub: 'user-123',
      }

      ;(global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      })

      const validation = await oauth.validateToken('valid-token')

      expect(validation.valid).toBe(true)
      expect(validation.active).toBe(true)
      expect(validation.clientId).toBe('test-client')
      expect(validation.username).toBe('testuser')
      expect(validation.scope).toBe('read write')
    })

    it('should validate inactive token', async () => {
      const mockResponse = {
        active: false,
      }

      ;(global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      })

      const validation = await oauth.validateToken('expired-token')

      expect(validation.valid).toBe(false)
      expect(validation.active).toBe(false)
    })

    it('should handle validation errors', async () => {
      ;(global.fetch as any).mockResolvedValueOnce({
        ok: false,
        statusText: 'Internal Server Error',
      })

      await expect(oauth.validateToken('token')).rejects.toThrow('Token validation failed')
    })
  })

  describe('Token Revocation', () => {
    it('should revoke access token', async () => {
      ;(global.fetch as any).mockResolvedValueOnce({
        ok: true,
      })

      await expect(oauth.revokeToken('token-to-revoke')).resolves.not.toThrow()

      const fetchCall = (global.fetch as any).mock.calls[0]
      const body = fetchCall[1].body
      expect(body.toString()).toContain('token=token-to-revoke')
    })

    it('should revoke with token type hint', async () => {
      ;(global.fetch as any).mockResolvedValueOnce({
        ok: true,
      })

      await oauth.revokeToken('refresh-token', 'refresh_token')

      const fetchCall = (global.fetch as any).mock.calls[0]
      const body = fetchCall[1].body
      expect(body.toString()).toContain('token_type_hint=refresh_token')
    })
  })

  describe('User Info (OpenID Connect)', () => {
    it('should get user information', async () => {
      const mockUserInfo = {
        sub: 'user-123',
        name: 'Test User',
        email: 'test@example.com',
        emailVerified: true,
        picture: 'https://example.com/avatar.jpg',
      }

      ;(global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockUserInfo,
      })

      const userInfo = await oauth.getUserInfo('access-token')

      expect(userInfo.sub).toBe('user-123')
      expect(userInfo.name).toBe('Test User')
      expect(userInfo.email).toBe('test@example.com')
      expect(userInfo.emailVerified).toBe(true)

      expect(global.fetch).toHaveBeenCalledWith(
        'https://oauth.do/userinfo',
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: 'Bearer access-token',
          }),
        })
      )
    })

    it('should handle user info errors', async () => {
      ;(global.fetch as any).mockResolvedValueOnce({
        ok: false,
        statusText: 'Unauthorized',
      })

      await expect(oauth.getUserInfo('invalid-token')).rejects.toThrow('Failed to get user info')
    })
  })

  describe('API Key Management', () => {
    it('should create API key', async () => {
      const mockApiKey = {
        id: 'key-123',
        key: 'sk_test_abc123',
        name: 'Production Key',
        scopes: ['read', 'write'],
        createdAt: '2025-01-01T00:00:00Z',
        expiresAt: '2025-02-01T00:00:00Z',
        status: 'active',
      }

      ;(global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockApiKey,
      })

      const apiKey = await oauth.createApiKey({
        name: 'Production Key',
        scopes: ['read', 'write'],
        expiresIn: '30d',
      })

      expect(apiKey.id).toBe('key-123')
      expect(apiKey.key).toBe('sk_test_abc123')
      expect(apiKey.name).toBe('Production Key')
      expect(apiKey.scopes).toEqual(['read', 'write'])
    })

    it('should list API keys', async () => {
      const mockApiKeys = {
        apiKeys: [
          { id: 'key-1', name: 'Key 1', status: 'active' },
          { id: 'key-2', name: 'Key 2', status: 'active' },
        ],
      }

      ;(global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockApiKeys,
      })

      const apiKeys = await oauth.listApiKeys()

      expect(apiKeys).toHaveLength(2)
      expect(apiKeys[0].id).toBe('key-1')
      expect(apiKeys[1].id).toBe('key-2')
    })

    it('should get API key by ID', async () => {
      const mockApiKey = {
        id: 'key-123',
        name: 'Test Key',
        status: 'active',
      }

      ;(global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockApiKey,
      })

      const apiKey = await oauth.getApiKey('key-123')

      expect(apiKey.id).toBe('key-123')
    })

    it('should revoke API key', async () => {
      ;(global.fetch as any).mockResolvedValueOnce({
        ok: true,
      })

      await expect(oauth.revokeApiKey('key-123')).resolves.not.toThrow()

      expect(global.fetch).toHaveBeenCalledWith('https://oauth.do/api-keys/key-123', {
        method: 'DELETE',
      })
    })
  })

  describe('OAuth Client Management', () => {
    it('should register OAuth client', async () => {
      const mockClient = {
        id: 'client-123',
        clientId: 'test-client-id',
        clientSecret: 'test-client-secret',
        name: 'My Application',
        redirectUris: ['https://app.com/callback'],
        grantTypes: ['authorization_code', 'refresh_token'],
        responseTypes: ['code'],
        scopes: ['read', 'write'],
        status: 'active',
        createdAt: '2025-01-01T00:00:00Z',
        updatedAt: '2025-01-01T00:00:00Z',
      }

      ;(global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockClient,
      })

      const client = await oauth.registerClient({
        name: 'My Application',
        redirectUris: ['https://app.com/callback'],
        grantTypes: ['authorization_code', 'refresh_token'],
      })

      expect(client.clientId).toBe('test-client-id')
      expect(client.clientSecret).toBe('test-client-secret')
      expect(client.name).toBe('My Application')
    })

    it('should list OAuth clients', async () => {
      const mockClients = {
        clients: [
          { id: 'client-1', name: 'App 1', status: 'active' },
          { id: 'client-2', name: 'App 2', status: 'active' },
        ],
      }

      ;(global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockClients,
      })

      const clients = await oauth.listClients()

      expect(clients).toHaveLength(2)
      expect(clients[0].id).toBe('client-1')
    })

    it('should get OAuth client', async () => {
      const mockClient = {
        id: 'client-123',
        name: 'Test Client',
        status: 'active',
      }

      ;(global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockClient,
      })

      const client = await oauth.getClient('client-123')

      expect(client.id).toBe('client-123')
    })

    it('should update OAuth client', async () => {
      const mockClient = {
        id: 'client-123',
        name: 'Updated Name',
        status: 'active',
      }

      ;(global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockClient,
      })

      const client = await oauth.updateClient('client-123', {
        name: 'Updated Name',
      })

      expect(client.name).toBe('Updated Name')
    })

    it('should delete OAuth client', async () => {
      ;(global.fetch as any).mockResolvedValueOnce({
        ok: true,
      })

      await expect(oauth.deleteClient('client-123')).resolves.not.toThrow()

      expect(global.fetch).toHaveBeenCalledWith('https://oauth.do/clients/client-123', {
        method: 'DELETE',
      })
    })
  })

  describe('Session Management', () => {
    it('should create session', async () => {
      const mockSession = {
        id: 'session-123',
        userId: 'user-456',
        token: 'session-token-abc',
        expiresAt: '2025-01-08T00:00:00Z',
        createdAt: '2025-01-01T00:00:00Z',
        status: 'active',
      }

      ;(global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockSession,
      })

      const session = await oauth.createSession({
        userId: 'user-456',
        expiresIn: '7d',
      })

      expect(session.id).toBe('session-123')
      expect(session.userId).toBe('user-456')
      expect(session.status).toBe('active')
    })

    it('should validate session', async () => {
      const mockSession = {
        id: 'session-123',
        userId: 'user-456',
        status: 'active',
      }

      ;(global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockSession,
      })

      const session = await oauth.validateSession('session-123')

      expect(session.status).toBe('active')
    })

    it('should revoke session', async () => {
      ;(global.fetch as any).mockResolvedValueOnce({
        ok: true,
      })

      await expect(oauth.revokeSession('session-123')).resolves.not.toThrow()

      expect(global.fetch).toHaveBeenCalledWith('https://oauth.do/sessions/session-123', {
        method: 'DELETE',
      })
    })
  })

  describe('Permission Management', () => {
    it('should check permission', async () => {
      ;(global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ hasPermission: true }),
      })

      const hasPermission = await oauth.checkPermission('users:write')

      expect(hasPermission).toBe(true)
    })

    it('should return false for missing permission', async () => {
      ;(global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ hasPermission: false }),
      })

      const hasPermission = await oauth.checkPermission('admin:delete')

      expect(hasPermission).toBe(false)
    })

    it('should get user permissions', async () => {
      const mockPermissions = {
        permissions: ['users:read', 'users:write', 'posts:read'],
      }

      ;(global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockPermissions,
      })

      const permissions = await oauth.getPermissions()

      expect(permissions).toHaveLength(3)
      expect(permissions).toContain('users:read')
      expect(permissions).toContain('users:write')
      expect(permissions).toContain('posts:read')
    })
  })

  describe('PKCE Helpers', () => {
    it('should generate code verifier', () => {
      const verifier = generateCodeVerifier()

      expect(verifier).toBeTruthy()
      expect(typeof verifier).toBe('string')
      expect(verifier.length).toBeGreaterThan(0)
      // Base64 URL encoding should not contain +, /, or =
      expect(verifier).not.toMatch(/[+/=]/)
    })

    it('should generate code challenge from verifier', async () => {
      const verifier = 'test-verifier-12345'
      const challenge = await generateCodeChallenge(verifier)

      expect(challenge).toBeTruthy()
      expect(typeof challenge).toBe('string')
      expect(challenge.length).toBeGreaterThan(0)
      // Base64 URL encoding should not contain +, /, or =
      expect(challenge).not.toMatch(/[+/=]/)
    })

    it('should generate different challenges for different verifiers', async () => {
      const verifier1 = 'verifier-1'
      const verifier2 = 'verifier-2'

      const challenge1 = await generateCodeChallenge(verifier1)
      const challenge2 = await generateCodeChallenge(verifier2)

      expect(challenge1).not.toBe(challenge2)
    })
  })
})
