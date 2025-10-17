/**
 * Shared authentication types for .do platform CLIs
 */

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

export interface DeviceAuthorizationResponse {
  device_code: string
  user_code: string
  verification_uri: string
  verification_uri_complete?: string
  expires_in: number
  interval: number
}

export interface TokenResponse {
  access_token: string
  token_type: string
  expires_in: number
  refresh_token?: string
  scope?: string
}

export interface UserInfo {
  id: string
  email: string
  first_name?: string
  last_name?: string
  email_verified?: boolean
}

export interface TokenValidationResult {
  active: boolean
  scope?: string
  exp?: number
  sub?: string
  email?: string
}

export interface AuthToken {
  token: string
  type: 'admin' | 'oauth' | 'apikey'
  source: 'env' | 'keychain'
}
