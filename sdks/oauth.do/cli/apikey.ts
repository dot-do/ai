/**
 * API Key management utilities
 *
 * Helpers for managing API keys across different services
 */

import { setToken, getToken, deleteToken, TokenType } from './keychain.js'

export interface ApiKeyConfig {
  /**
   * Service name for namespacing (e.g., 'mcp', 'apis', 'sdk')
   */
  service: string

  /**
   * Environment variable name to check
   */
  envVar?: string
}

/**
 * Store an API key for a service
 */
export async function setApiKey(service: string, apiKey: string, metadata?: { email?: string }): Promise<void> {
  await setToken(TokenType.API_KEY, apiKey, {
    userId: service,
    ...metadata,
  })
}

/**
 * Get API key for a service
 *
 * Checks in order:
 * 1. Environment variable (if specified)
 * 2. Keychain storage
 */
export async function getApiKey(config: ApiKeyConfig): Promise<string | null> {
  const { service, envVar } = config

  // Check environment variable first
  if (envVar && process.env[envVar]) {
    return process.env[envVar]
  }

  // Check keychain
  const token = await getToken(TokenType.API_KEY)
  if (token && token.userId === service) {
    return token.value
  }

  return null
}

/**
 * Delete API key for a service
 */
export async function deleteApiKey(service: string): Promise<void> {
  await deleteToken(TokenType.API_KEY)
}

/**
 * Validate API key format
 *
 * Basic validation - checks if key looks like a valid API key
 */
export function validateApiKeyFormat(apiKey: string): boolean {
  // Must be at least 20 characters
  if (apiKey.length < 20) {
    return false
  }

  // Should contain alphanumeric characters
  if (!/^[a-zA-Z0-9_-]+$/.test(apiKey)) {
    return false
  }

  return true
}

/**
 * Mask API key for display (show first/last 4 chars)
 */
export function maskApiKey(apiKey: string): string {
  if (apiKey.length <= 8) {
    return '****'
  }

  const first = apiKey.slice(0, 4)
  const last = apiKey.slice(-4)
  const middle = '*'.repeat(Math.min(apiKey.length - 8, 20))

  return `${first}${middle}${last}`
}
