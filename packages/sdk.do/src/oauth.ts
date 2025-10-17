/**
 * OAuth Service for sdk.do
 * Provides OAuth 2.0 authentication and authorization flows
 *
 * Features:
 * - Authorization Code flow (with PKCE support)
 * - Client Credentials flow
 * - Refresh Token flow
 * - Token validation and introspection
 * - User authentication and sessions
 * - API key management
 * - Permission and scope management
 * - OAuth client registration
 * - OpenID Connect support
 *
 * OAuth 2.0 Flow Diagram:
 *
 * Authorization Code Flow:
 * ┌──────────┐                                           ┌───────────┐
 * │          │──(1) Authorization Request────────────────▶           │
 * │          │                                           │           │
 * │          │◀─(2) Authorization Code──────────────────│           │
 * │  Client  │                                           │   OAuth   │
 * │          │──(3) Exchange Code for Token─────────────▶  Provider │
 * │          │                                           │           │
 * │          │◀─(4) Access Token + Refresh Token────────│           │
 * └──────────┘                                           └───────────┘
 *
 * Usage:
 *
 * ```typescript
 * import { oauth } from 'sdk.do'
 *
 * // Authorization Code flow
 * const authUrl = await oauth.authorize({
 *   clientId: 'your-client-id',
 *   redirectUri: 'https://yourapp.com/callback',
 *   scope: ['read', 'write'],
 *   state: 'random-state'
 * })
 *
 * // Exchange code for tokens
 * const tokens = await oauth.exchangeCode({
 *   code: 'authorization-code',
 *   clientId: 'your-client-id',
 *   clientSecret: 'your-client-secret',
 *   redirectUri: 'https://yourapp.com/callback'
 * })
 *
 * // Refresh tokens
 * const newTokens = await oauth.refresh({
 *   refreshToken: tokens.refreshToken,
 *   clientId: 'your-client-id'
 * })
 * ```
 */

import type { BusinessContext } from './types'

/**
 * OAuth 2.0 token response
 */
export interface OAuthTokens {
  accessToken: string
  tokenType: 'Bearer'
  expiresIn: number // seconds
  refreshToken?: string
  scope?: string
  idToken?: string // OpenID Connect
}

/**
 * Authorization request options
 */
export interface AuthorizeOptions {
  clientId: string
  redirectUri: string
  scope?: string[]
  state?: string
  responseType?: 'code' | 'token'
  codeChallenge?: string // PKCE
  codeChallengeMethod?: 'S256' | 'plain' // PKCE
  prompt?: 'none' | 'login' | 'consent' | 'select_account'
  maxAge?: number // OpenID Connect
  display?: 'page' | 'popup' | 'touch' | 'wap'
  loginHint?: string
  acrValues?: string
  nonce?: string // OpenID Connect
}

/**
 * Code exchange request options
 */
export interface ExchangeCodeOptions {
  code: string
  clientId: string
  clientSecret?: string
  redirectUri: string
  codeVerifier?: string // PKCE
  grantType?: 'authorization_code'
}

/**
 * Refresh token request options
 */
export interface RefreshTokenOptions {
  refreshToken: string
  clientId: string
  clientSecret?: string
  scope?: string[]
  grantType?: 'refresh_token'
}

/**
 * Client credentials request options
 */
export interface ClientCredentialsOptions {
  clientId: string
  clientSecret: string
  scope?: string[]
  grantType?: 'client_credentials'
}

/**
 * Token validation result
 */
export interface TokenValidation {
  valid: boolean
  active?: boolean
  clientId?: string
  username?: string
  scope?: string
  tokenType?: string
  expiresAt?: number
  issuedAt?: number
  subject?: string
  audience?: string
  issuer?: string
  jti?: string // JWT ID
}

/**
 * User information from OAuth provider
 */
export interface UserInfo {
  sub: string // Subject (user ID)
  name?: string
  givenName?: string
  familyName?: string
  middleName?: string
  nickname?: string
  preferredUsername?: string
  profile?: string
  picture?: string
  website?: string
  email?: string
  emailVerified?: boolean
  gender?: string
  birthdate?: string
  zoneinfo?: string
  locale?: string
  phoneNumber?: string
  phoneNumberVerified?: boolean
  address?: {
    formatted?: string
    streetAddress?: string
    locality?: string
    region?: string
    postalCode?: string
    country?: string
  }
  updatedAt?: number
}

/**
 * API key creation options
 */
export interface CreateApiKeyOptions {
  name: string
  scopes?: string[]
  expiresIn?: string | number // e.g., '30d', 2592000 (seconds)
  metadata?: Record<string, any>
  rateLimit?: {
    requestsPerMinute?: number
    requestsPerHour?: number
    requestsPerDay?: number
  }
}

/**
 * API key
 */
export interface ApiKey {
  id: string
  key: string
  name: string
  scopes: string[]
  createdAt: string
  expiresAt?: string
  lastUsedAt?: string
  metadata?: Record<string, any>
  rateLimit?: {
    requestsPerMinute?: number
    requestsPerHour?: number
    requestsPerDay?: number
  }
  status: 'active' | 'revoked' | 'expired'
}

/**
 * OAuth client registration options
 */
export interface RegisterClientOptions {
  name: string
  redirectUris: string[]
  grantTypes?: ('authorization_code' | 'refresh_token' | 'client_credentials' | 'implicit')[]
  responseTypes?: ('code' | 'token' | 'id_token')[]
  scopes?: string[]
  logoUri?: string
  clientUri?: string
  policyUri?: string
  tosUri?: string
  contacts?: string[]
  metadata?: Record<string, any>
  tokenEndpointAuthMethod?: 'client_secret_basic' | 'client_secret_post' | 'client_secret_jwt' | 'private_key_jwt' | 'none'
}

/**
 * OAuth client
 */
export interface OAuthClient {
  id: string
  clientId: string
  clientSecret?: string
  name: string
  redirectUris: string[]
  grantTypes: string[]
  responseTypes: string[]
  scopes: string[]
  logoUri?: string
  clientUri?: string
  policyUri?: string
  tosUri?: string
  contacts?: string[]
  createdAt: string
  updatedAt: string
  metadata?: Record<string, any>
  status: 'active' | 'suspended' | 'revoked'
}

/**
 * Session creation options
 */
export interface CreateSessionOptions {
  userId: string
  expiresIn?: string | number // e.g., '7d', 604800 (seconds)
  metadata?: Record<string, any>
  ipAddress?: string
  userAgent?: string
}

/**
 * Session
 */
export interface OAuthSession {
  id: string
  userId: string
  token: string
  expiresAt: string
  createdAt: string
  metadata?: Record<string, any>
  ipAddress?: string
  userAgent?: string
  status: 'active' | 'expired' | 'revoked'
}

/**
 * PKCE helper - Generate code verifier
 */
export function generateCodeVerifier(): string {
  const array = new Uint8Array(32)
  crypto.getRandomValues(array)
  return base64UrlEncode(array)
}

/**
 * PKCE helper - Generate code challenge from verifier
 */
export async function generateCodeChallenge(verifier: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(verifier)
  const digest = await crypto.subtle.digest('SHA-256', data)
  return base64UrlEncode(new Uint8Array(digest))
}

/**
 * Base64 URL encoding (without padding)
 */
function base64UrlEncode(buffer: Uint8Array): string {
  const base64 = btoa(String.fromCharCode(...buffer))
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
}

/**
 * OAuth Service implementation
 */
export class OAuthService {
  constructor(
    private client: BusinessContext,
    private options: { baseUrl?: string } = {}
  ) {}

  private get apiUrl(): string {
    return this.options.baseUrl || 'https://oauth.do'
  }

  /**
   * Start OAuth authorization flow
   * Returns the authorization URL to redirect the user to
   *
   * @example
   * ```typescript
   * const authUrl = await oauth.authorize({
   *   clientId: 'your-client-id',
   *   redirectUri: 'https://yourapp.com/callback',
   *   scope: ['read', 'write'],
   *   state: crypto.randomUUID()
   * })
   * // Redirect user to authUrl
   * ```
   */
  async authorize(options: AuthorizeOptions): Promise<string> {
    const params = new URLSearchParams({
      client_id: options.clientId,
      redirect_uri: options.redirectUri,
      response_type: options.responseType || 'code',
      ...(options.scope && { scope: options.scope.join(' ') }),
      ...(options.state && { state: options.state }),
      ...(options.codeChallenge && { code_challenge: options.codeChallenge }),
      ...(options.codeChallengeMethod && { code_challenge_method: options.codeChallengeMethod }),
      ...(options.prompt && { prompt: options.prompt }),
      ...(options.maxAge !== undefined && { max_age: options.maxAge.toString() }),
      ...(options.display && { display: options.display }),
      ...(options.loginHint && { login_hint: options.loginHint }),
      ...(options.acrValues && { acr_values: options.acrValues }),
      ...(options.nonce && { nonce: options.nonce }),
    })

    return `${this.apiUrl}/authorize?${params.toString()}`
  }

  /**
   * Exchange authorization code for access token
   *
   * @example
   * ```typescript
   * const tokens = await oauth.exchangeCode({
   *   code: 'authorization-code',
   *   clientId: 'your-client-id',
   *   clientSecret: 'your-client-secret',
   *   redirectUri: 'https://yourapp.com/callback'
   * })
   * ```
   */
  async exchangeCode(options: ExchangeCodeOptions): Promise<OAuthTokens> {
    const response = await fetch(`${this.apiUrl}/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: options.grantType || 'authorization_code',
        code: options.code,
        client_id: options.clientId,
        redirect_uri: options.redirectUri,
        ...(options.clientSecret && { client_secret: options.clientSecret }),
        ...(options.codeVerifier && { code_verifier: options.codeVerifier }),
      }),
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'unknown_error' }))
      throw new Error(`Token exchange failed: ${error.error || response.statusText}`)
    }

    const data = await response.json()

    return {
      accessToken: data.access_token,
      tokenType: data.token_type,
      expiresIn: data.expires_in,
      refreshToken: data.refresh_token,
      scope: data.scope,
      idToken: data.id_token,
    }
  }

  /**
   * Refresh access token using refresh token
   *
   * @example
   * ```typescript
   * const newTokens = await oauth.refresh({
   *   refreshToken: 'refresh-token',
   *   clientId: 'your-client-id',
   *   clientSecret: 'your-client-secret'
   * })
   * ```
   */
  async refresh(options: RefreshTokenOptions): Promise<OAuthTokens> {
    const response = await fetch(`${this.apiUrl}/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: options.grantType || 'refresh_token',
        refresh_token: options.refreshToken,
        client_id: options.clientId,
        ...(options.clientSecret && { client_secret: options.clientSecret }),
        ...(options.scope && { scope: options.scope.join(' ') }),
      }),
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'unknown_error' }))
      throw new Error(`Token refresh failed: ${error.error || response.statusText}`)
    }

    const data = await response.json()

    return {
      accessToken: data.access_token,
      tokenType: data.token_type,
      expiresIn: data.expires_in,
      refreshToken: data.refresh_token,
      scope: data.scope,
      idToken: data.id_token,
    }
  }

  /**
   * Get access token using client credentials flow
   *
   * @example
   * ```typescript
   * const tokens = await oauth.clientCredentials({
   *   clientId: 'your-client-id',
   *   clientSecret: 'your-client-secret',
   *   scope: ['api:read', 'api:write']
   * })
   * ```
   */
  async clientCredentials(options: ClientCredentialsOptions): Promise<OAuthTokens> {
    const response = await fetch(`${this.apiUrl}/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: options.grantType || 'client_credentials',
        client_id: options.clientId,
        client_secret: options.clientSecret,
        ...(options.scope && { scope: options.scope.join(' ') }),
      }),
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'unknown_error' }))
      throw new Error(`Client credentials flow failed: ${error.error || response.statusText}`)
    }

    const data = await response.json()

    return {
      accessToken: data.access_token,
      tokenType: data.token_type,
      expiresIn: data.expires_in,
      scope: data.scope,
    }
  }

  /**
   * Validate an access token
   *
   * @example
   * ```typescript
   * const validation = await oauth.validateToken('access-token')
   * if (validation.valid) {
   *   console.log('Token is valid for user:', validation.username)
   * }
   * ```
   */
  async validateToken(token: string): Promise<TokenValidation> {
    const response = await fetch(`${this.apiUrl}/introspect`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        token,
      }),
    })

    if (!response.ok) {
      throw new Error(`Token validation failed: ${response.statusText}`)
    }

    const data = await response.json()

    return {
      valid: data.active === true,
      active: data.active,
      clientId: data.client_id,
      username: data.username,
      scope: data.scope,
      tokenType: data.token_type,
      expiresAt: data.exp,
      issuedAt: data.iat,
      subject: data.sub,
      audience: data.aud,
      issuer: data.iss,
      jti: data.jti,
    }
  }

  /**
   * Revoke an access or refresh token
   *
   * @example
   * ```typescript
   * await oauth.revokeToken('access-token')
   * ```
   */
  async revokeToken(token: string, tokenTypeHint?: 'access_token' | 'refresh_token'): Promise<void> {
    const response = await fetch(`${this.apiUrl}/revoke`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        token,
        ...(tokenTypeHint && { token_type_hint: tokenTypeHint }),
      }),
    })

    if (!response.ok) {
      throw new Error(`Token revocation failed: ${response.statusText}`)
    }
  }

  /**
   * Get user information from OAuth provider (OpenID Connect)
   *
   * @example
   * ```typescript
   * const user = await oauth.getUserInfo('access-token')
   * console.log(user.email, user.name)
   * ```
   */
  async getUserInfo(accessToken: string): Promise<UserInfo> {
    const response = await fetch(`${this.apiUrl}/userinfo`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to get user info: ${response.statusText}`)
    }

    return response.json()
  }

  /**
   * Create an API key
   *
   * @example
   * ```typescript
   * const apiKey = await oauth.createApiKey({
   *   name: 'Production API Key',
   *   scopes: ['read', 'write'],
   *   expiresIn: '30d'
   * })
   * console.log('API Key:', apiKey.key)
   * ```
   */
  async createApiKey(options: CreateApiKeyOptions): Promise<ApiKey> {
    const response = await fetch(`${this.apiUrl}/api-keys`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(options),
    })

    if (!response.ok) {
      throw new Error(`Failed to create API key: ${response.statusText}`)
    }

    return response.json()
  }

  /**
   * List API keys
   *
   * @example
   * ```typescript
   * const apiKeys = await oauth.listApiKeys()
   * ```
   */
  async listApiKeys(): Promise<ApiKey[]> {
    const response = await fetch(`${this.apiUrl}/api-keys`, {
      method: 'GET',
    })

    if (!response.ok) {
      throw new Error(`Failed to list API keys: ${response.statusText}`)
    }

    const data = await response.json()
    return data.apiKeys || []
  }

  /**
   * Get an API key by ID
   *
   * @example
   * ```typescript
   * const apiKey = await oauth.getApiKey('key-id')
   * ```
   */
  async getApiKey(id: string): Promise<ApiKey> {
    const response = await fetch(`${this.apiUrl}/api-keys/${id}`, {
      method: 'GET',
    })

    if (!response.ok) {
      throw new Error(`Failed to get API key: ${response.statusText}`)
    }

    return response.json()
  }

  /**
   * Revoke an API key
   *
   * @example
   * ```typescript
   * await oauth.revokeApiKey('key-id')
   * ```
   */
  async revokeApiKey(id: string): Promise<void> {
    const response = await fetch(`${this.apiUrl}/api-keys/${id}`, {
      method: 'DELETE',
    })

    if (!response.ok) {
      throw new Error(`Failed to revoke API key: ${response.statusText}`)
    }
  }

  /**
   * Register a new OAuth client
   *
   * @example
   * ```typescript
   * const client = await oauth.registerClient({
   *   name: 'My Application',
   *   redirectUris: ['https://myapp.com/callback'],
   *   grantTypes: ['authorization_code', 'refresh_token']
   * })
   * console.log('Client ID:', client.clientId)
   * console.log('Client Secret:', client.clientSecret)
   * ```
   */
  async registerClient(options: RegisterClientOptions): Promise<OAuthClient> {
    const response = await fetch(`${this.apiUrl}/clients`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(options),
    })

    if (!response.ok) {
      throw new Error(`Failed to register OAuth client: ${response.statusText}`)
    }

    return response.json()
  }

  /**
   * List OAuth clients
   *
   * @example
   * ```typescript
   * const clients = await oauth.listClients()
   * ```
   */
  async listClients(): Promise<OAuthClient[]> {
    const response = await fetch(`${this.apiUrl}/clients`, {
      method: 'GET',
    })

    if (!response.ok) {
      throw new Error(`Failed to list OAuth clients: ${response.statusText}`)
    }

    const data = await response.json()
    return data.clients || []
  }

  /**
   * Get an OAuth client by ID
   *
   * @example
   * ```typescript
   * const client = await oauth.getClient('client-id')
   * ```
   */
  async getClient(id: string): Promise<OAuthClient> {
    const response = await fetch(`${this.apiUrl}/clients/${id}`, {
      method: 'GET',
    })

    if (!response.ok) {
      throw new Error(`Failed to get OAuth client: ${response.statusText}`)
    }

    return response.json()
  }

  /**
   * Update an OAuth client
   *
   * @example
   * ```typescript
   * await oauth.updateClient('client-id', {
   *   name: 'Updated Name',
   *   redirectUris: ['https://newapp.com/callback']
   * })
   * ```
   */
  async updateClient(id: string, updates: Partial<RegisterClientOptions>): Promise<OAuthClient> {
    const response = await fetch(`${this.apiUrl}/clients/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    })

    if (!response.ok) {
      throw new Error(`Failed to update OAuth client: ${response.statusText}`)
    }

    return response.json()
  }

  /**
   * Delete an OAuth client
   *
   * @example
   * ```typescript
   * await oauth.deleteClient('client-id')
   * ```
   */
  async deleteClient(id: string): Promise<void> {
    const response = await fetch(`${this.apiUrl}/clients/${id}`, {
      method: 'DELETE',
    })

    if (!response.ok) {
      throw new Error(`Failed to delete OAuth client: ${response.statusText}`)
    }
  }

  /**
   * Create a user session
   *
   * @example
   * ```typescript
   * const session = await oauth.createSession({
   *   userId: 'user-123',
   *   expiresIn: '7d'
   * })
   * ```
   */
  async createSession(options: CreateSessionOptions): Promise<OAuthSession> {
    const response = await fetch(`${this.apiUrl}/sessions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(options),
    })

    if (!response.ok) {
      throw new Error(`Failed to create session: ${response.statusText}`)
    }

    return response.json()
  }

  /**
   * Validate a session
   *
   * @example
   * ```typescript
   * const session = await oauth.validateSession('session-id')
   * if (session.status === 'active') {
   *   console.log('Session is valid for user:', session.userId)
   * }
   * ```
   */
  async validateSession(id: string): Promise<OAuthSession> {
    const response = await fetch(`${this.apiUrl}/sessions/${id}`, {
      method: 'GET',
    })

    if (!response.ok) {
      throw new Error(`Failed to validate session: ${response.statusText}`)
    }

    return response.json()
  }

  /**
   * Revoke a session
   *
   * @example
   * ```typescript
   * await oauth.revokeSession('session-id')
   * ```
   */
  async revokeSession(id: string): Promise<void> {
    const response = await fetch(`${this.apiUrl}/sessions/${id}`, {
      method: 'DELETE',
    })

    if (!response.ok) {
      throw new Error(`Failed to revoke session: ${response.statusText}`)
    }
  }

  /**
   * Check if user has a specific permission
   *
   * @example
   * ```typescript
   * const hasPermission = await oauth.checkPermission('users:write')
   * ```
   */
  async checkPermission(permission: string): Promise<boolean> {
    const response = await fetch(`${this.apiUrl}/permissions/check`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ permission }),
    })

    if (!response.ok) {
      throw new Error(`Failed to check permission: ${response.statusText}`)
    }

    const data = await response.json()
    return data.hasPermission === true
  }

  /**
   * Get user permissions
   *
   * @example
   * ```typescript
   * const permissions = await oauth.getPermissions()
   * console.log('User permissions:', permissions)
   * ```
   */
  async getPermissions(): Promise<string[]> {
    const response = await fetch(`${this.apiUrl}/permissions`, {
      method: 'GET',
    })

    if (!response.ok) {
      throw new Error(`Failed to get permissions: ${response.statusText}`)
    }

    const data = await response.json()
    return data.permissions || []
  }
}

/**
 * Create an OAuthService instance
 */
export function createOAuthService(client: BusinessContext, options?: { baseUrl?: string }): OAuthService {
  return new OAuthService(client, options)
}
