/**
 * Authentication Service for SDK.do
 *
 * Provides methods for authentication, session management, and user operations.
 * Integrates with WorkOS AuthKit via the oauth worker.
 *
 * @example
 * ```typescript
 * import { $ } from 'sdk.do'
 *
 * // Sign in (redirects to OAuth provider)
 * await $.auth.signIn()
 *
 * // Get current user
 * const user = await $.auth.getCurrentUser()
 *
 * // Sign out
 * await $.auth.signOut()
 * ```
 */

// ============================================================================
// TYPES
// ============================================================================

export interface AuthUser {
  id: string
  email: string
  firstName?: string
  lastName?: string
  emailVerified?: boolean
  organizationId?: string
  permissions?: string[]
  createdAt?: string
  updatedAt?: string
}

export interface SignInOptions {
  /**
   * Redirect URI after successful authentication
   * @default Current page URL
   */
  redirectUri?: string

  /**
   * OAuth provider to use
   * @default 'authkit'
   */
  provider?: 'authkit' | 'google' | 'github' | 'microsoft'

  /**
   * Additional OAuth scopes to request
   */
  scopes?: string[]

  /**
   * State parameter for CSRF protection
   */
  state?: string
}

export interface Session {
  id: string
  userId: string
  accessToken: string
  refreshToken?: string
  expiresAt?: number
  createdAt: number
  updatedAt: number
}

export interface RefreshTokenResponse {
  accessToken: string
  refreshToken?: string
  expiresAt: number
}

export interface SignOutOptions {
  /**
   * Revoke all sessions for this user
   * @default false
   */
  revokeAll?: boolean
}

// ============================================================================
// AUTH SERVICE
// ============================================================================

export class AuthService {
  private baseUrl: string
  private apiKey?: string

  constructor(baseUrl = 'https://api.do', apiKey?: string) {
    this.baseUrl = baseUrl
    this.apiKey = apiKey
  }

  /**
   * Get authorization headers for authenticated requests
   */
  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    }

    if (this.apiKey) {
      headers['Authorization'] = `Bearer ${this.apiKey}`
    }

    return headers
  }

  /**
   * Sign in - Redirects to OAuth provider
   *
   * @example
   * ```typescript
   * // Sign in with default provider (AuthKit)
   * await $.auth.signIn()
   *
   * // Sign in with specific provider
   * await $.auth.signIn({ provider: 'google' })
   * ```
   */
  async signIn(options: SignInOptions = {}): Promise<void> {
    const { provider = 'authkit', redirectUri, scopes, state } = options

    // Build authorization URL
    const authUrl = new URL('/auth/sign-in', this.baseUrl)

    if (provider !== 'authkit') {
      authUrl.searchParams.set('provider', provider)
    }

    if (redirectUri) {
      authUrl.searchParams.set('redirect_uri', redirectUri)
    }

    if (scopes) {
      authUrl.searchParams.set('scopes', scopes.join(' '))
    }

    if (state) {
      authUrl.searchParams.set('state', state)
    }

    // Redirect to auth URL
    if (typeof window !== 'undefined') {
      window.location.href = authUrl.toString()
    } else {
      throw new Error('signIn() can only be called in browser environment. Use direct OAuth flow in server environments.')
    }
  }

  /**
   * Handle OAuth callback
   * Exchanges authorization code for access token
   *
   * @param code - Authorization code from OAuth provider
   * @returns Authentication response with user and tokens
   */
  async handleCallback(code: string): Promise<AuthUser> {
    const response = await fetch(`${this.baseUrl}/auth/callback`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ code }),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Auth callback failed: ${error}`)
    }

    return response.json()
  }

  /**
   * Get current authenticated user
   *
   * @example
   * ```typescript
   * const user = await $.auth.getCurrentUser()
   * console.log(user.email) // 'user@example.com'
   * ```
   */
  async getCurrentUser(): Promise<AuthUser | null> {
    try {
      const response = await fetch(`${this.baseUrl}/auth/me`, {
        headers: this.getHeaders(),
      })

      if (response.status === 401) {
        return null
      }

      if (!response.ok) {
        throw new Error(`Failed to get current user: ${response.statusText}`)
      }

      return response.json()
    } catch (error) {
      console.error('Error getting current user:', error)
      return null
    }
  }

  /**
   * Sign out current user
   *
   * @example
   * ```typescript
   * await $.auth.signOut()
   * ```
   */
  async signOut(options: SignOutOptions = {}): Promise<void> {
    const response = await fetch(`${this.baseUrl}/auth/sign-out`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(options),
    })

    if (!response.ok) {
      throw new Error(`Sign out failed: ${response.statusText}`)
    }

    // Clear local session if in browser
    if (typeof window !== 'undefined') {
      // Optionally clear any client-side tokens
      localStorage.removeItem('auth_token')
      localStorage.removeItem('refresh_token')
    }
  }

  /**
   * Refresh access token using refresh token
   *
   * @param refreshToken - Refresh token
   * @returns New access token and refresh token
   */
  async refreshToken(refreshToken: string): Promise<RefreshTokenResponse> {
    const response = await fetch(`${this.baseUrl}/auth/refresh`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ refreshToken }),
    })

    if (!response.ok) {
      throw new Error(`Token refresh failed: ${response.statusText}`)
    }

    return response.json()
  }

  /**
   * Verify access token
   *
   * @param token - Access token to verify
   * @returns User information if token is valid
   */
  async verifyToken(token: string): Promise<AuthUser> {
    const response = await fetch(`${this.baseUrl}/auth/verify`, {
      method: 'POST',
      headers: {
        ...this.getHeaders(),
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      throw new Error(`Token verification failed: ${response.statusText}`)
    }

    return response.json()
  }

  /**
   * Check if user has specific permission
   *
   * @param permission - Permission to check
   * @returns True if user has permission
   *
   * @example
   * ```typescript
   * const canEdit = await $.auth.hasPermission('posts:edit')
   * ```
   */
  async hasPermission(permission: string): Promise<boolean> {
    const user = await this.getCurrentUser()

    if (!user || !user.permissions) {
      return false
    }

    return user.permissions.includes(permission)
  }

  /**
   * Check if user has any of the specified roles
   *
   * @param roles - Roles to check
   * @returns True if user has any of the roles
   */
  async hasAnyRole(...roles: string[]): Promise<boolean> {
    const user = await this.getCurrentUser()

    if (!user || !user.permissions) {
      return false
    }

    return roles.some((role) => user.permissions?.includes(role))
  }

  /**
   * Check if user has all of the specified roles
   *
   * @param roles - Roles to check
   * @returns True if user has all of the roles
   */
  async hasAllRoles(...roles: string[]): Promise<boolean> {
    const user = await this.getCurrentUser()

    if (!user || !user.permissions) {
      return false
    }

    return roles.every((role) => user.permissions?.includes(role))
  }

  /**
   * Get current session
   *
   * @returns Current session or null if not authenticated
   */
  async getSession(): Promise<Session | null> {
    try {
      const response = await fetch(`${this.baseUrl}/auth/session`, {
        headers: this.getHeaders(),
      })

      if (response.status === 401) {
        return null
      }

      if (!response.ok) {
        throw new Error(`Failed to get session: ${response.statusText}`)
      }

      return response.json()
    } catch (error) {
      console.error('Error getting session:', error)
      return null
    }
  }

  /**
   * List all active sessions for current user
   *
   * @returns Array of active sessions
   */
  async listSessions(): Promise<Session[]> {
    const response = await fetch(`${this.baseUrl}/auth/sessions`, {
      headers: this.getHeaders(),
    })

    if (!response.ok) {
      throw new Error(`Failed to list sessions: ${response.statusText}`)
    }

    const data = await response.json<{ sessions: Session[] }>()
    return data.sessions
  }

  /**
   * Revoke a specific session
   *
   * @param sessionId - Session ID to revoke
   */
  async revokeSession(sessionId: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/auth/sessions/${sessionId}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    })

    if (!response.ok) {
      throw new Error(`Failed to revoke session: ${response.statusText}`)
    }
  }
}

/**
 * Create auth service instance
 */
export function createAuthService(baseUrl?: string, apiKey?: string): AuthService {
  return new AuthService(baseUrl, apiKey)
}

/**
 * Default auth service instance
 */
export const auth = createAuthService()
