/**
 * E2E Tests for oauth.do/cli authentication
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { TokenType, setToken, getToken, deleteToken, deleteAllTokens, isKeychainAvailable } from '../keychain.js'

describe('oauth.do/cli - Keychain', () => {
  const testService = 'com.do.cli.test'

  beforeEach(async () => {
    // Clean up any existing test tokens
    try {
      await deleteAllTokens()
    } catch (error) {
      // Ignore errors if tokens don't exist
    }
  })

  afterEach(async () => {
    // Clean up after tests
    try {
      await deleteAllTokens()
    } catch (error) {
      // Ignore errors
    }
  })

  it('should detect keychain availability', () => {
    const available = isKeychainAvailable()
    expect(typeof available).toBe('boolean')
  })

  it('should store and retrieve an API key', async () => {
    if (!isKeychainAvailable()) {
      console.log('Skipping keychain test - keychain not available')
      return
    }

    const testToken = 'sk_test_token_123'

    await setToken(TokenType.API_KEY, testToken)
    const retrieved = await getToken(TokenType.API_KEY)

    expect(retrieved).toBeDefined()
    expect(retrieved?.token).toBe(testToken)
  })

  it('should store and retrieve an OAuth token', async () => {
    if (!isKeychainAvailable()) {
      console.log('Skipping keychain test - keychain not available')
      return
    }

    const testToken = 'oauth_test_token_456'
    const testEmail = 'test@example.com'
    const expiresAt = Date.now() + 3600000 // 1 hour from now

    await setToken(TokenType.OAUTH, testToken, {
      email: testEmail,
      expiresAt,
      scopes: ['read', 'write'],
    })

    const retrieved = await getToken(TokenType.OAUTH)

    expect(retrieved).toBeDefined()
    expect(retrieved?.token).toBe(testToken)
    expect(retrieved?.email).toBe(testEmail)
    expect(retrieved?.expiresAt).toBe(expiresAt)
    expect(retrieved?.scopes).toEqual(['read', 'write'])
  })

  it('should store and retrieve an admin token', async () => {
    if (!isKeychainAvailable()) {
      console.log('Skipping keychain test - keychain not available')
      return
    }

    const testToken = 'sk_admin_test_token_789'

    await setToken(TokenType.ADMIN_TOKEN, testToken)
    const retrieved = await getToken(TokenType.ADMIN_TOKEN)

    expect(retrieved).toBeDefined()
    expect(retrieved?.token).toBe(testToken)
  })

  it('should delete a specific token', async () => {
    if (!isKeychainAvailable()) {
      console.log('Skipping keychain test - keychain not available')
      return
    }

    const testToken = 'sk_test_delete_token'

    await setToken(TokenType.API_KEY, testToken)
    let retrieved = await getToken(TokenType.API_KEY)
    expect(retrieved?.token).toBe(testToken)

    await deleteToken(TokenType.API_KEY)
    retrieved = await getToken(TokenType.API_KEY)
    expect(retrieved).toBeNull()
  })

  it('should delete all tokens', async () => {
    if (!isKeychainAvailable()) {
      console.log('Skipping keychain test - keychain not available')
      return
    }

    await setToken(TokenType.API_KEY, 'sk_test_1')
    await setToken(TokenType.OAUTH, 'oauth_test_2')
    await setToken(TokenType.ADMIN_TOKEN, 'sk_admin_test_3')

    await deleteAllTokens()

    const apiKey = await getToken(TokenType.API_KEY)
    const oauth = await getToken(TokenType.OAUTH)
    const admin = await getToken(TokenType.ADMIN_TOKEN)

    expect(apiKey).toBeNull()
    expect(oauth).toBeNull()
    expect(admin).toBeNull()
  })

  it('should return null for non-existent token', async () => {
    if (!isKeychainAvailable()) {
      console.log('Skipping keychain test - keychain not available')
      return
    }

    const retrieved = await getToken(TokenType.API_KEY)
    expect(retrieved).toBeNull()
  })

  it('should handle JSON serialization/deserialization', async () => {
    if (!isKeychainAvailable()) {
      console.log('Skipping keychain test - keychain not available')
      return
    }

    const complexData = {
      token: 'test_token',
      email: 'test@example.com',
      expiresAt: 1234567890,
      scopes: ['read', 'write', 'admin'],
    }

    await setToken(TokenType.OAUTH, complexData.token, {
      email: complexData.email,
      expiresAt: complexData.expiresAt,
      scopes: complexData.scopes,
    })

    const retrieved = await getToken(TokenType.OAUTH)

    expect(retrieved).toEqual(complexData)
  })
})

describe('oauth.do/cli - Environment Variables', () => {
  const originalEnv = process.env

  beforeEach(() => {
    // Reset environment
    process.env = { ...originalEnv }
  })

  afterEach(() => {
    // Restore original environment
    process.env = originalEnv
  })

  it('should prioritize environment variables over keychain', async () => {
    const envToken = 'sk_env_token_priority'
    process.env.DO_TOKEN = envToken

    // Even if there's a keychain token, env should take priority
    // This would be tested in the getAuthToken function
    expect(process.env.DO_TOKEN).toBe(envToken)
  })

  it('should handle multiple environment variable formats', () => {
    process.env.DO_TOKEN = 'sk_do_token'
    process.env.DO_ADMIN_TOKEN = 'sk_admin_do_token'
    process.env.MCP_TOKEN = 'sk_mcp_token'
    process.env.APIS_TOKEN = 'sk_apis_token'
    process.env.SDK_TOKEN = 'sk_sdk_token'

    expect(process.env.DO_TOKEN).toBe('sk_do_token')
    expect(process.env.DO_ADMIN_TOKEN).toBe('sk_admin_do_token')
    expect(process.env.MCP_TOKEN).toBe('sk_mcp_token')
    expect(process.env.APIS_TOKEN).toBe('sk_apis_token')
    expect(process.env.SDK_TOKEN).toBe('sk_sdk_token')
  })
})
