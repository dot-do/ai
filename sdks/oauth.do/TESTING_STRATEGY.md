# oauth.do Testing Strategy

**Date**: 2025-10-16
**Status**: Comprehensive testing plan for oauth.do SDK and MCP OAuth integration
**Goal**: Ensure oauth.do is production-ready with rigorous test coverage

---

## Executive Summary

This document outlines a comprehensive testing strategy for the oauth.do SDK across:
1. **Unit Tests** - Core functionality and business logic
2. **Integration Tests** - Service interactions and RPC calls
3. **E2E Tests** - Complete OAuth flows with real providers
4. **MCP OAuth Tests** - Model Context Protocol integration
5. **Performance Tests** - Load testing and benchmarking
6. **Security Tests** - Vulnerability scanning and penetration testing

**Current State**: Basic structure exists, minimal test coverage
**Target State**: 80%+ code coverage, all critical paths tested

---

## 1. Test Coverage Goals

### 1.1 Coverage Targets

| Component | Unit | Integration | E2E | Target Coverage |
|-----------|------|-------------|-----|-----------------|
| oauth.do/client | ✅ Required | ✅ Required | ✅ Required | 90% |
| oauth.do/server | ✅ Required | ✅ Required | ⚠️  Optional | 85% |
| oauth.do/react | ✅ Required | ✅ Required | ✅ Required | 80% |
| workers/auth | ✅ Required | ✅ Required | ✅ Required | 85% |
| workers/oauth | ✅ Required | ✅ Required | ✅ Required | 90% |
| workers/mcp | ⚠️  Optional | ✅ Required | ✅ Required | 75% |

### 1.2 Critical Paths (100% Coverage Required)

1. **Authorization Flow**
   - PKCE generation and validation
   - State parameter creation and verification
   - Redirect URI validation
   - Authorization code exchange

2. **Token Management**
   - Token generation and signing
   - Token validation and introspection
   - Refresh token rotation
   - Token expiration handling

3. **Security Mechanisms**
   - CSRF protection via state parameter
   - XSS prevention in redirect URIs
   - Injection attack prevention
   - Rate limiting enforcement

4. **Session Management**
   - Session creation and sealing
   - Session validation and unsealing
   - Session expiration and cleanup
   - Concurrent session handling

---

## 2. Unit Testing Strategy

### 2.1 oauth.do/client

**Location**: `ai/sdks/oauth.do/src/client/__tests__/`

#### Test Cases

```typescript
// OAuthClient.test.ts
describe('OAuthClient', () => {
  describe('constructor', () => {
    it('should create client with valid config', () => {
      const client = new OAuthClient({ apiUrl: 'https://api.test' })
      expect(client).toBeInstanceOf(OAuthClient)
    })

    it('should throw error with invalid config', () => {
      expect(() => new OAuthClient({ apiUrl: '' })).toThrow()
    })
  })

  describe('signIn', () => {
    it('should send sign-in request with valid credentials', async () => {
      const client = new OAuthClient({ apiUrl: 'https://api.test' })
      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({
          success: true,
          data: { token: 'test-token', expiresAt: Date.now() + 3600000 }
        })
      })
      global.fetch = mockFetch

      const session = await client.signIn({
        email: 'test@example.com',
        password: 'password123'
      })

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.test/auth/signin',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Content-Type': 'application/json'
          })
        })
      )
      expect(session.token).toBe('test-token')
    })

    it('should handle sign-in errors gracefully', async () => {
      const client = new OAuthClient({ apiUrl: 'https://api.test' })
      const mockFetch = vi.fn().mockResolvedValue({
        ok: false,
        json: () => Promise.resolve({
          success: false,
          error: { message: 'Invalid credentials' }
        })
      })
      global.fetch = mockFetch

      await expect(client.signIn({
        email: 'test@example.com',
        password: 'wrong'
      })).rejects.toThrow('Invalid credentials')
    })

    it('should store session token in localStorage', async () => {
      const client = new OAuthClient({ apiUrl: 'https://api.test' })
      const mockSetItem = vi.fn()
      Object.defineProperty(window, 'localStorage', {
        value: { setItem: mockSetItem },
        writable: true
      })

      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({
          success: true,
          data: { token: 'test-token', expiresAt: Date.now() + 3600000 }
        })
      })
      global.fetch = mockFetch

      await client.signIn({
        email: 'test@example.com',
        password: 'password123'
      })

      expect(mockSetItem).toHaveBeenCalledWith(
        'oauth_session_token',
        'test-token'
      )
    })
  })

  describe('getSession', () => {
    it('should retrieve current session', async () => {
      const client = new OAuthClient({ apiUrl: 'https://api.test' })
      const mockGetItem = vi.fn().mockReturnValue('test-token')
      Object.defineProperty(window, 'localStorage', {
        value: { getItem: mockGetItem },
        writable: true
      })

      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({
          success: true,
          data: { token: 'test-token', expiresAt: Date.now() + 3600000 }
        })
      })
      global.fetch = mockFetch

      const session = await client.getSession()
      expect(session).toBeTruthy()
      expect(session?.token).toBe('test-token')
    })

    it('should return null for expired sessions', async () => {
      const client = new OAuthClient({ apiUrl: 'https://api.test' })
      const mockGetItem = vi.fn().mockReturnValue('expired-token')
      Object.defineProperty(window, 'localStorage', {
        value: { getItem: mockGetItem },
        writable: true
      })

      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({
          success: true,
          data: { token: 'expired-token', expiresAt: Date.now() - 1000 }
        })
      })
      global.fetch = mockFetch

      const session = await client.getSession()
      expect(session).toBeNull()
    })
  })

  describe('refreshSession', () => {
    it('should refresh valid session', async () => {
      const client = new OAuthClient({ apiUrl: 'https://api.test' })
      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({
          success: true,
          data: { token: 'new-token', expiresAt: Date.now() + 3600000 }
        })
      })
      global.fetch = mockFetch

      const newSession = await client.refreshSession()
      expect(newSession?.token).toBe('new-token')
    })
  })

  describe('signOut', () => {
    it('should clear session and call signout endpoint', async () => {
      const client = new OAuthClient({ apiUrl: 'https://api.test' })
      const mockRemoveItem = vi.fn()
      Object.defineProperty(window, 'localStorage', {
        value: { removeItem: mockRemoveItem },
        writable: true
      })

      const mockFetch = vi.fn().mockResolvedValue({ ok: true })
      global.fetch = mockFetch

      await client.signOut()

      expect(mockRemoveItem).toHaveBeenCalledWith('oauth_session_token')
      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.test/auth/signout',
        expect.objectContaining({ method: 'POST' })
      )
    })
  })
})
```

### 2.2 oauth.do/server (JWT Verification)

**Location**: `ai/sdks/oauth.do/src/server/__tests__/`

#### Test Cases

```typescript
// jwt.test.ts
import { verifyJWT, extractToken, extractBearerToken, extractCookieToken } from '../jwt'

describe('JWT Server Utilities', () => {
  describe('verifyJWT', () => {
    it('should verify valid JWT token', async () => {
      const token = 'valid-jwt-token'
      const result = await verifyJWT(token, {
        jwksUrl: 'https://auth.test/jwks',
        issuer: 'https://auth.test',
        audience: 'test-audience'
      })

      expect(result.valid).toBe(true)
      expect(result.payload).toBeDefined()
    })

    it('should reject expired JWT token', async () => {
      const token = 'expired-jwt-token'
      const result = await verifyJWT(token, {
        jwksUrl: 'https://auth.test/jwks'
      })

      expect(result.valid).toBe(false)
      expect(result.error).toContain('expired')
    })

    it('should reject JWT with invalid signature', async () => {
      const token = 'invalid-signature-token'
      const result = await verifyJWT(token, {
        jwksUrl: 'https://auth.test/jwks'
      })

      expect(result.valid).toBe(false)
      expect(result.error).toContain('signature')
    })
  })

  describe('extractToken', () => {
    it('should extract Bearer token from Authorization header', () => {
      const headers = new Headers({
        'Authorization': 'Bearer test-token-123'
      })

      const token = extractToken(headers)
      expect(token).toBe('test-token-123')
    })

    it('should extract token from Cookie header', () => {
      const headers = new Headers({
        'Cookie': 'auth_token=cookie-token-456; other=value'
      })

      const token = extractToken(headers)
      expect(token).toBe('cookie-token-456')
    })

    it('should return null when no token present', () => {
      const headers = new Headers()
      const token = extractToken(headers)
      expect(token).toBeNull()
    })

    it('should prioritize Authorization header over Cookie', () => {
      const headers = new Headers({
        'Authorization': 'Bearer bearer-token',
        'Cookie': 'auth_token=cookie-token'
      })

      const token = extractToken(headers)
      expect(token).toBe('bearer-token')
    })
  })

  describe('extractBearerToken', () => {
    it('should extract Bearer token', () => {
      const headers = new Headers({
        'Authorization': 'Bearer test-token'
      })

      expect(extractBearerToken(headers)).toBe('test-token')
    })

    it('should return null for non-Bearer auth', () => {
      const headers = new Headers({
        'Authorization': 'Basic credentials'
      })

      expect(extractBearerToken(headers)).toBeNull()
    })
  })

  describe('extractCookieToken', () => {
    it('should extract token from default cookie name', () => {
      const headers = new Headers({
        'Cookie': 'auth_token=token-123; other=value'
      })

      expect(extractCookieToken(headers)).toBe('token-123')
    })

    it('should extract token from custom cookie name', () => {
      const headers = new Headers({
        'Cookie': 'custom_auth=token-456'
      })

      expect(extractCookieToken(headers, 'custom_auth')).toBe('token-456')
    })
  })
})
```

### 2.3 oauth.do/react (Hooks)

**Location**: `ai/sdks/oauth.do/src/hooks/__tests__/`

#### Test Cases

```typescript
// useAuth.test.tsx
import { renderHook, act, waitFor } from '@testing-library/react'
import { useAuth } from '../useAuth'
import { OAuthClient } from '../../client'

describe('useAuth', () => {
  it('should initialize with loading state', () => {
    const client = new OAuthClient({ apiUrl: 'https://api.test' })
    const { result } = renderHook(() => useAuth(client))

    expect(result.current.isLoading).toBe(true)
    expect(result.current.isAuthenticated).toBe(false)
    expect(result.current.user).toBeNull()
  })

  it('should load user on mount if session exists', async () => {
    const client = new OAuthClient({ apiUrl: 'https://api.test' })
    vi.spyOn(client, 'getSession').mockResolvedValue({
      id: 'session-1',
      userId: 'user-1',
      expiresAt: new Date(Date.now() + 3600000),
      createdAt: new Date(),
      token: 'test-token'
    })
    vi.spyOn(client, 'getUser').mockResolvedValue({
      id: 'user-1',
      email: 'test@example.com',
      name: 'Test User',
      createdAt: new Date(),
      updatedAt: new Date()
    })

    const { result } = renderHook(() => useAuth(client))

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
      expect(result.current.isAuthenticated).toBe(true)
      expect(result.current.user).toEqual(
        expect.objectContaining({
          email: 'test@example.com'
        })
      )
    })
  })

  it('should sign in user successfully', async () => {
    const client = new OAuthClient({ apiUrl: 'https://api.test' })
    vi.spyOn(client, 'signIn').mockResolvedValue({
      id: 'session-1',
      userId: 'user-1',
      expiresAt: new Date(Date.now() + 3600000),
      createdAt: new Date(),
      token: 'new-token'
    })
    vi.spyOn(client, 'getUser').mockResolvedValue({
      id: 'user-1',
      email: 'test@example.com',
      name: 'Test User',
      createdAt: new Date(),
      updatedAt: new Date()
    })

    const { result } = renderHook(() => useAuth(client))

    await act(async () => {
      await result.current.signIn({
        email: 'test@example.com',
        password: 'password123'
      })
    })

    await waitFor(() => {
      expect(result.current.isAuthenticated).toBe(true)
      expect(result.current.user).toBeTruthy()
    })
  })

  it('should handle sign in errors', async () => {
    const client = new OAuthClient({ apiUrl: 'https://api.test' })
    vi.spyOn(client, 'signIn').mockRejectedValue(
      new Error('Invalid credentials')
    )

    const { result } = renderHook(() => useAuth(client))

    await act(async () => {
      try {
        await result.current.signIn({
          email: 'test@example.com',
          password: 'wrong'
        })
      } catch (error) {
        // Expected error
      }
    })

    await waitFor(() => {
      expect(result.current.error).toBeTruthy()
      expect(result.current.error?.message).toContain('Invalid credentials')
    })
  })

  it('should sign out user successfully', async () => {
    const client = new OAuthClient({ apiUrl: 'https://api.test' })
    vi.spyOn(client, 'signOut').mockResolvedValue()

    const { result } = renderHook(() => useAuth(client))

    // Set initial authenticated state
    act(() => {
      (result.current as any).setState({
        user: { id: 'user-1', email: 'test@example.com' },
        isAuthenticated: true,
        isLoading: false
      })
    })

    await act(async () => {
      await result.current.signOut()
    })

    await waitFor(() => {
      expect(result.current.isAuthenticated).toBe(false)
      expect(result.current.user).toBeNull()
    })
  })
})
```

---

## 3. Integration Testing Strategy

### 3.1 workers/auth Integration Tests

**Location**: `workers/auth/src/__tests__/integration/`

#### Test Cases

```typescript
// middleware.integration.test.ts
import { describe, it, expect, beforeAll } from 'vitest'
import { unstable_dev } from 'wrangler'

describe('Auth Middleware Integration', () => {
  let worker: any

  beforeAll(async () => {
    worker = await unstable_dev('src/index.ts', {
      experimental: { disableExperimentalWarning: true }
    })
  })

  it('should reject requests without auth token', async () => {
    const response = await worker.fetch('/api/keys', {
      method: 'GET'
    })

    expect(response.status).toBe(401)
    const body = await response.json()
    expect(body.error).toBe('Unauthorized')
  })

  it('should accept valid JWT token', async () => {
    // Create valid JWT token via oauth.do
    const token = await getValidJWT()

    const response = await worker.fetch('/api/keys', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })

    expect(response.status).toBe(200)
  })

  it('should accept valid API key', async () => {
    // Create valid API key
    const apiKey = 'do_test_key_123'

    const response = await worker.fetch('/api/keys', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`
      }
    })

    expect(response.status).toBe(200)
  })

  it('should reject expired JWT token', async () => {
    const expiredToken = 'expired-jwt-token'

    const response = await worker.fetch('/api/keys', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${expiredToken}`
      }
    })

    expect(response.status).toBe(401)
  })

  it('should properly isolate tenant data', async () => {
    const tenant1Token = await getValidJWT({ tenantId: 1 })
    const tenant2Token = await getValidJWT({ tenantId: 2 })

    // Create API key with tenant 1
    const createResponse = await worker.fetch('/api/keys', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${tenant1Token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name: 'Test Key' })
    })

    expect(createResponse.status).toBe(201)

    // Try to access with tenant 2 - should not see tenant 1's key
    const listResponse = await worker.fetch('/api/keys', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${tenant2Token}`
      }
    })

    const body = await listResponse.json()
    expect(body.keys).toHaveLength(0)
  })
})
```

### 3.2 RPC Integration Tests

**Location**: `workers/auth/src/__tests__/integration/`

```typescript
// rpc.integration.test.ts
describe('Auth Worker RPC Integration', () => {
  it('should communicate with oauth.do via RPC', async () => {
    // Test service binding
    const response = await env.OAUTH.fetch(
      new Request('https://oauth.do/oauth2/introspect', {
        method: 'POST',
        body: new URLSearchParams({ token: 'test-token' })
      })
    )

    expect(response.status).toBe(200)
    const body = await response.json()
    expect(body).toHaveProperty('active')
  })

  it('should handle oauth.do service unavailability', async () => {
    // Simulate oauth.do being unavailable
    vi.spyOn(env.OAUTH, 'fetch').mockRejectedValue(
      new Error('Service unavailable')
    )

    const response = await worker.fetch('/api/keys', {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer test-token'
      }
    })

    expect(response.status).toBe(503)
  })
})
```

---

## 4. E2E Testing Strategy

### 4.1 Complete OAuth Flow

**Location**: `tests/e2e/oauth-flow.test.ts`

```typescript
import { test, expect } from '@playwright/test'

test.describe('OAuth Flow E2E', () => {
  test('should complete full authorization code flow', async ({ page }) => {
    // 1. Navigate to login page
    await page.goto('http://localhost:3000/login')

    // 2. Click "Sign in with Google"
    await page.click('[data-testid="google-signin"]')

    // 3. Should redirect to oauth.do
    await expect(page).toHaveURL(/oauth\.do\/oauth2\/authorize/)

    // 4. Should then redirect to Google
    await expect(page).toHaveURL(/accounts\.google\.com/)

    // 5. Enter Google credentials (test account)
    await page.fill('[type="email"]', 'test@example.com')
    await page.click('#identifierNext')
    await page.fill('[type="password"]', 'test-password')
    await page.click('#passwordNext')

    // 6. Should redirect back to oauth.do callback
    await expect(page).toHaveURL(/oauth\.do\/oauth2\/callback/)

    // 7. Should redirect to app with session
    await expect(page).toHaveURL('http://localhost:3000/')

    // 8. Verify user is authenticated
    await expect(page.locator('[data-testid="user-menu"]')).toBeVisible()
    await expect(page.locator('[data-testid="user-email"]')).toContainText('test@example.com')
  })

  test('should handle OAuth errors gracefully', async ({ page }) => {
    // Test error handling
    await page.goto('http://localhost:3000/login')
    await page.click('[data-testid="google-signin"]')

    // Simulate user denial
    await page.click('[data-testid="deny-access"]')

    // Should show error message
    await expect(page.locator('[data-testid="error-message"]')).toContainText(
      'Authentication failed'
    )
  })

  test('should refresh expired tokens automatically', async ({ page, context }) => {
    // Set up expired session
    await context.addCookies([{
      name: 'auth_token',
      value: 'expired-token',
      domain: 'localhost',
      path: '/'
    }])

    // Navigate to protected page
    await page.goto('http://localhost:3000/dashboard')

    // Should automatically refresh token
    await expect(page).not.toHaveURL(/login/)
    await expect(page.locator('[data-testid="dashboard"]')).toBeVisible()
  })
})
```

---

## 5. MCP OAuth Testing Strategy

### 5.1 MCP Discovery Flow

**Location**: `tests/mcp/oauth-discovery.test.ts`

```typescript
import { Client } from '@modelcontextprotocol/sdk/client'

describe('MCP OAuth Discovery', () => {
  it('should discover Authorization Server via Protected Resource Metadata', async () => {
    // 1. MCP client requests resource (unauthenticated)
    const response = await fetch('https://mcp.do/v1/tools')

    // 2. Should receive 401 with WWW-Authenticate header
    expect(response.status).toBe(401)
    expect(response.headers.get('WWW-Authenticate')).toContain('Bearer')

    // 3. Extract resource metadata URL
    const wwwAuth = response.headers.get('WWW-Authenticate')
    const metadataUrlMatch = wwwAuth?.match(/resource_metadata="([^"]+)"/)
    expect(metadataUrlMatch).toBeTruthy()

    const metadataUrl = metadataUrlMatch![1]

    // 4. Fetch Protected Resource Metadata
    const metadataResponse = await fetch(metadataUrl)
    expect(metadataResponse.status).toBe(200)

    const metadata = await metadataResponse.json()

    // 5. Verify oauth.do is listed as Authorization Server
    expect(metadata.authorization_servers).toContain('https://oauth.do')
    expect(metadata.scopes_supported).toContain('mcp:tools:read')
  })

  it('should complete MCP OAuth flow', async () => {
    // Create MCP client
    const client = new Client({
      name: 'test-client',
      version: '1.0.0'
    })

    // Initiate OAuth flow
    const authUrl = await client.oauth.getAuthorizationUrl({
      authServer: 'https://oauth.do',
      scopes: ['mcp:tools:read']
    })

    expect(authUrl).toContain('oauth.do/oauth2/authorize')
    expect(authUrl).toContain('code_challenge') // PKCE required

    // Simulate user authorization
    const code = await simulateUserAuthorization(authUrl)

    // Exchange code for token
    const tokens = await client.oauth.exchangeCode(code)

    expect(tokens.accessToken).toBeTruthy()
    expect(tokens.refreshToken).toBeTruthy()

    // Use token to access MCP resource
    const resourceResponse = await fetch('https://mcp.do/v1/tools', {
      headers: {
        'Authorization': `Bearer ${tokens.accessToken}`
      }
    })

    expect(resourceResponse.status).toBe(200)
  })
})
```

### 5.2 Token Introspection Tests

```typescript
describe('MCP Token Introspection', () => {
  it('should validate active tokens via introspection', async () => {
    const token = await getValidMCPToken()

    const response = await fetch('https://oauth.do/oauth2/introspect', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({ token })
    })

    expect(response.status).toBe(200)

    const introspection = await response.json()
    expect(introspection.active).toBe(true)
    expect(introspection.scope).toContain('mcp:tools:read')
    expect(introspection.sub).toBeTruthy()
  })

  it('should reject expired tokens', async () => {
    const expiredToken = await getExpiredMCPToken()

    const response = await fetch('https://oauth.do/oauth2/introspect', {
      method: 'POST',
      body: new URLSearchParams({ token: expiredToken })
    })

    const introspection = await response.json()
    expect(introspection.active).toBe(false)
  })

  it('should cache introspection results', async () => {
    const token = await getValidMCPToken()

    // First introspection
    const start1 = Date.now()
    await fetch('https://oauth.do/oauth2/introspect', {
      method: 'POST',
      body: new URLSearchParams({ token })
    })
    const duration1 = Date.now() - start1

    // Second introspection (should be cached)
    const start2 = Date.now()
    await fetch('https://oauth.do/oauth2/introspect', {
      method: 'POST',
      body: new URLSearchParams({ token })
    })
    const duration2 = Date.now() - start2

    // Cached request should be significantly faster
    expect(duration2).toBeLessThan(duration1 / 2)
  })
})
```

---

## 6. Performance Testing

### 6.1 Load Testing

**Tool**: k6 (https://k6.io/)
**Location**: `tests/performance/`

```javascript
// oauth-load-test.js
import http from 'k6/http'
import { check, sleep } from 'k6'

export const options = {
  stages: [
    { duration: '1m', target: 100 },  // Ramp up to 100 users
    { duration: '5m', target: 100 },  // Stay at 100 users
    { duration: '1m', target: 0 },    // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<200'],  // 95% of requests under 200ms
    http_req_failed: ['rate<0.01'],    // Error rate under 1%
  },
}

export default function () {
  // Test token introspection endpoint
  const response = http.post('https://oauth.do/oauth2/introspect', {
    token: __ENV.TEST_TOKEN
  })

  check(response, {
    'is status 200': (r) => r.status === 200,
    'is fast enough': (r) => r.timings.duration < 100,
  })

  sleep(1)
}
```

### 6.2 Benchmark Tests

```typescript
// benchmark.test.ts
import { bench } from 'vitest'
import { verifyJWT, extractToken } from 'oauth.do/server'

describe('Performance Benchmarks', () => {
  bench('JWT verification', async () => {
    await verifyJWT('test-token', {
      jwksUrl: 'https://auth.test/jwks'
    })
  }, { iterations: 1000 })

  bench('Token extraction', () => {
    const headers = new Headers({
      'Authorization': 'Bearer test-token'
    })
    extractToken(headers)
  }, { iterations: 10000 })

  bench('Session validation', async () => {
    await client.getSession()
  }, { iterations: 1000 })
})
```

---

## 7. Security Testing

### 7.1 Vulnerability Scanning

**Tools**:
- OWASP ZAP
- Snyk
- npm audit

```bash
# Run security scan
npm audit

# Check for known vulnerabilities
snyk test

# OWASP ZAP scan
zap-cli quick-scan --self-contained https://oauth.do
```

### 7.2 Penetration Testing Scenarios

**Location**: `tests/security/`

```typescript
// security.test.ts
describe('Security Tests', () => {
  it('should prevent CSRF attacks via state parameter', async () => {
    // Attempt to bypass state validation
    const response = await fetch('https://oauth.do/oauth2/callback?code=test&state=forged')
    expect(response.status).toBe(400)
  })

  it('should prevent XSS in redirect URIs', async () => {
    const maliciousRedirect = 'javascript:alert(1)'
    const response = await fetch(
      `https://oauth.do/oauth2/authorize?redirect_uri=${encodeURIComponent(maliciousRedirect)}`
    )
    expect(response.status).toBe(400)
  })

  it('should enforce rate limiting', async () => {
    // Send 100 requests rapidly
    const requests = Array.from({ length: 100 }, () =>
      fetch('https://oauth.do/oauth2/token', { method: 'POST' })
    )

    const responses = await Promise.all(requests)
    const rateLimited = responses.filter(r => r.status === 429)

    expect(rateLimited.length).toBeGreaterThan(0)
  })

  it('should prevent SQL injection in API key queries', async () => {
    const maliciousKey = "'; DROP TABLE api_keys; --"
    const response = await worker.fetch('/api/keys', {
      headers: {
        'Authorization': `Bearer ${maliciousKey}`
      }
    })

    expect(response.status).toBe(401)

    // Verify table still exists
    const listResponse = await worker.fetch('/api/keys', {
      headers: {
        'Authorization': `Bearer ${validToken}`
      }
    })
    expect(listResponse.status).toBe(200)
  })
})
```

---

## 8. Implementation Plan

### 8.1 Phase 1: Unit Tests (Week 1)

**Day 1-2**: oauth.do/client tests
- [ ] OAuthClient class tests
- [ ] Sign in/out functionality
- [ ] Session management
- [ ] Error handling

**Day 3-4**: oauth.do/server tests
- [ ] JWT verification tests
- [ ] Token extraction tests
- [ ] Error handling

**Day 5**: oauth.do/react tests
- [ ] useAuth hook tests
- [ ] State management
- [ ] Error handling

### 8.2 Phase 2: Integration Tests (Week 2)

**Day 1-3**: workers/auth integration
- [ ] Middleware tests
- [ ] RPC communication tests
- [ ] Database interaction tests

**Day 4-5**: MCP integration
- [ ] Discovery flow tests
- [ ] Token introspection tests
- [ ] End-to-end MCP tests

### 8.3 Phase 3: E2E & Performance (Week 3)

**Day 1-2**: E2E tests with Playwright
- [ ] Complete OAuth flows
- [ ] Error scenarios
- [ ] Multi-provider tests

**Day 3-4**: Performance testing
- [ ] Load tests with k6
- [ ] Benchmark critical paths
- [ ] Optimize bottlenecks

**Day 5**: Security testing
- [ ] Vulnerability scanning
- [ ] Penetration testing
- [ ] Fix security issues

### 8.4 Phase 4: MCP OAuth Implementation (Week 4)

**Day 1-2**: Add MCP endpoints
- [ ] Protected Resource Metadata endpoint
- [ ] Token Introspection endpoint
- [ ] Update workers/mcp middleware

**Day 3-4**: Testing & Documentation
- [ ] MCP OAuth tests
- [ ] Integration guide
- [ ] API documentation

**Day 5**: Deployment & Monitoring
- [ ] Deploy to staging
- [ ] Monitor metrics
- [ ] Beta release

---

## 9. Success Metrics

### 9.1 Test Coverage Metrics

- **Unit Test Coverage**: ≥ 85%
- **Integration Test Coverage**: ≥ 75%
- **E2E Test Coverage**: All critical paths
- **Test Execution Time**: < 5 minutes for unit tests

### 9.2 Performance Metrics

- **Token Introspection**: P95 < 50ms
- **JWT Verification**: P95 < 30ms
- **Session Validation**: P95 < 20ms
- **Complete OAuth Flow**: P95 < 2s

### 9.3 Reliability Metrics

- **Test Pass Rate**: ≥ 99%
- **Flaky Test Rate**: < 1%
- **Security Scan**: 0 high/critical vulnerabilities
- **Uptime**: ≥ 99.9%

---

## 10. Testing Infrastructure

### 10.1 Test Environment Setup

```yaml
# .github/workflows/test.yml
name: Test Suite

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  unit-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: 'pnpm'

      - name: Install dependencies
        run: pnpm install

      - name: Run unit tests
        run: pnpm test:unit --coverage

      - name: Upload coverage
        uses: codecov/codecov-action@v3

  integration-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Run integration tests
        run: pnpm test:integration

  e2e-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Install Playwright
        run: pnpm exec playwright install --with-deps

      - name: Run E2E tests
        run: pnpm test:e2e
```

### 10.2 Local Testing Setup

```bash
# Install dependencies
pnpm install

# Run all tests
pnpm test

# Run specific test suites
pnpm test:unit          # Unit tests only
pnpm test:integration   # Integration tests only
pnpm test:e2e           # E2E tests only
pnpm test:mcp           # MCP OAuth tests only

# Run with coverage
pnpm test:coverage

# Run in watch mode
pnpm test:watch

# Run performance tests
pnpm test:perf

# Run security scans
pnpm test:security
```

---

## 11. Next Steps

1. **Create GitHub Issue**: Track testing implementation progress
2. **Set up CI/CD**: Configure GitHub Actions for automated testing
3. **Write Tests**: Follow implementation plan (phases 1-4)
4. **Review & Iterate**: Address test failures and gaps
5. **Document Results**: Update this strategy based on findings

---

**End of Testing Strategy**

Generated by Claude Code on 2025-10-16
Location: `/Users/nathanclevenger/sandbox/3/ai/sdks/oauth.do/TESTING_STRATEGY.md`
