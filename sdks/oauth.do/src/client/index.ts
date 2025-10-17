/**
 * OAuth Client for Browser and Node.js
 */

import type {
  AuthClient,
  AuthConfig,
  AuthResponse,
  Session,
  SignInOptions,
  SignOutOptions,
  SignUpOptions,
  User,
} from '../types'

export class OAuthClient implements AuthClient {
  private config: AuthConfig
  private sessionToken: string | null = null

  constructor(config: AuthConfig) {
    this.config = config
    this.loadSessionFromStorage()
  }

  private loadSessionFromStorage(): void {
    if (typeof window !== 'undefined') {
      this.sessionToken = localStorage.getItem('oauth_session_token')
    }
  }

  private saveSessionToStorage(token: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('oauth_session_token', token)
    }
    this.sessionToken = token
  }

  private clearSessionFromStorage(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('oauth_session_token')
    }
    this.sessionToken = null
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<AuthResponse<T>> {
    const url = `${this.config.apiUrl}${endpoint}`
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    }

    if (this.sessionToken) {
      headers['Authorization'] = `Bearer ${this.sessionToken}`
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      })

      const data = await response.json()

      if (!response.ok) {
        return {
          success: false,
          error: {
            code: data.code || 'UNKNOWN_ERROR',
            message: data.message || 'An unknown error occurred',
          },
        }
      }

      return {
        success: true,
        data,
      }
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'NETWORK_ERROR',
          message: error instanceof Error ? error.message : 'Network request failed',
        },
      }
    }
  }

  async signIn(options: SignInOptions): Promise<Session> {
    const response = await this.request<Session>('/auth/signin', {
      method: 'POST',
      body: JSON.stringify(options),
    })

    if (!response.success || !response.data) {
      throw new Error(response.error?.message || 'Sign in failed')
    }

    this.saveSessionToStorage(response.data.token)
    return response.data
  }

  async signUp(options: SignUpOptions): Promise<Session> {
    const response = await this.request<Session>('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(options),
    })

    if (!response.success || !response.data) {
      throw new Error(response.error?.message || 'Sign up failed')
    }

    this.saveSessionToStorage(response.data.token)
    return response.data
  }

  async signOut(options?: SignOutOptions): Promise<void> {
    await this.request('/auth/signout', {
      method: 'POST',
      body: JSON.stringify(options || {}),
    })

    this.clearSessionFromStorage()

    if (options?.callbackUrl && typeof window !== 'undefined') {
      window.location.href = options.callbackUrl
    }
  }

  async getSession(): Promise<Session | null> {
    if (!this.sessionToken) {
      return null
    }

    const response = await this.request<Session>('/auth/session')

    if (!response.success || !response.data) {
      this.clearSessionFromStorage()
      return null
    }

    return response.data
  }

  async getUser(): Promise<User | null> {
    if (!this.sessionToken) {
      return null
    }

    const response = await this.request<User>('/auth/user')

    if (!response.success || !response.data) {
      return null
    }

    return response.data
  }

  async refreshSession(): Promise<Session | null> {
    if (!this.sessionToken) {
      return null
    }

    const response = await this.request<Session>('/auth/refresh', {
      method: 'POST',
    })

    if (!response.success || !response.data) {
      this.clearSessionFromStorage()
      return null
    }

    this.saveSessionToStorage(response.data.token)
    return response.data
  }
}

export function createOAuthClient(config: AuthConfig): OAuthClient {
  return new OAuthClient(config)
}
