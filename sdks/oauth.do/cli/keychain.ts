/**
 * Secure Keychain Storage
 *
 * Manages secure storage of authentication tokens in system keychain.
 * Supports multiple token types: OAuth tokens, DO_TOKEN, DO_ADMIN_TOKEN.
 *
 * Uses @napi-rs/keyring (Rust-based, actively maintained replacement for keytar)
 */

import { Entry } from '@napi-rs/keyring'
import * as os from 'os'

const SERVICE_NAME = 'cli.do'

export enum TokenType {
  OAUTH = 'oauth-token',
  API_KEY = 'api-key',
  ADMIN_TOKEN = 'admin-token',
}

export interface StoredToken {
  value: string
  type: TokenType
  expiresAt?: number
  userId?: string
  email?: string
  scopes?: string[]
  createdAt: number
}

/**
 * Store token securely in system keychain
 */
export async function setToken(type: TokenType, token: string, metadata?: Partial<StoredToken>): Promise<void> {
  const account = `${os.userInfo().username}@${type}`

  const stored: StoredToken = {
    value: token,
    type,
    createdAt: Date.now(),
    ...metadata,
  }

  try {
    const entry = new Entry(SERVICE_NAME, account)
    entry.setPassword(JSON.stringify(stored))
  } catch (error) {
    throw new Error(`Failed to store ${type} in keychain: ${error}`)
  }
}

/**
 * Get token from system keychain
 */
export async function getToken(type: TokenType): Promise<StoredToken | null> {
  const account = `${os.userInfo().username}@${type}`

  try {
    const entry = new Entry(SERVICE_NAME, account)
    const stored = entry.getPassword()
    if (!stored) return null

    const token: StoredToken = JSON.parse(stored)

    // Check if token is expired
    if (token.expiresAt && Date.now() > token.expiresAt) {
      await deleteToken(type)
      return null
    }

    return token
  } catch (error) {
    console.error(`Failed to retrieve ${type} from keychain:`, error)
    return null
  }
}

/**
 * Delete token from system keychain
 */
export async function deleteToken(type: TokenType): Promise<void> {
  const account = `${os.userInfo().username}@${type}`

  try {
    const entry = new Entry(SERVICE_NAME, account)
    entry.deletePassword()
  } catch (error) {
    // Ignore errors if token doesn't exist
  }
}

/**
 * Delete all tokens from keychain
 */
export async function deleteAllTokens(): Promise<void> {
  await Promise.all([deleteToken(TokenType.OAUTH), deleteToken(TokenType.API_KEY), deleteToken(TokenType.ADMIN_TOKEN)])
}

/**
 * Check if keychain is available on this system
 */
export function isKeychainAvailable(): boolean {
  try {
    // @napi-rs/keyring is available if the module loaded successfully
    return typeof Entry === 'function'
  } catch {
    return false
  }
}

/**
 * Get authentication token with priority order:
 * 1. DO_ADMIN_TOKEN env var (highest privilege)
 * 2. OAuth token from keychain
 * 3. DO_TOKEN env var (standard API key)
 * 4. API key from keychain
 *
 * @param service Optional service name for service-specific token lookup
 */
export async function getAuthToken(service?: string): Promise<{
  token: string
  type: 'admin' | 'oauth' | 'apikey'
  source: 'env' | 'keychain'
} | null> {
  // 1. Check DO_ADMIN_TOKEN env var
  if (process.env.DO_ADMIN_TOKEN) {
    return {
      token: process.env.DO_ADMIN_TOKEN,
      type: 'admin',
      source: 'env',
    }
  }

  // 2. Check keychain for OAuth token
  const oauthToken = await getToken(TokenType.OAUTH)
  if (oauthToken) {
    return {
      token: oauthToken.value,
      type: 'oauth',
      source: 'keychain',
    }
  }

  // 3. Check DO_TOKEN env var
  if (process.env.DO_TOKEN) {
    return {
      token: process.env.DO_TOKEN,
      type: 'apikey',
      source: 'env',
    }
  }

  // 4. Check keychain for API key
  const apiKey = await getToken(TokenType.API_KEY)
  if (apiKey) {
    return {
      token: apiKey.value,
      type: 'apikey',
      source: 'keychain',
    }
  }

  // Check admin token in keychain
  const adminToken = await getToken(TokenType.ADMIN_TOKEN)
  if (adminToken) {
    return {
      token: adminToken.value,
      type: 'admin',
      source: 'keychain',
    }
  }

  return null
}
