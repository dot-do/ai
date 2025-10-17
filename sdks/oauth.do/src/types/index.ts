/**
 * Core OAuth and Authentication Types
 */

export interface User {
  id: string
  email: string
  name?: string
  image?: string
  emailVerified?: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Session {
  id: string
  userId: string
  expiresAt: Date
  createdAt: Date
  token: string
}

export interface AuthConfig {
  apiUrl: string
  clientId?: string
  redirectUri?: string
  scopes?: string[]
}

export interface AuthState {
  user: User | null
  session: Session | null
  isLoading: boolean
  isAuthenticated: boolean
  error: Error | null
}

export interface SignInOptions {
  email: string
  password: string
  callbackUrl?: string
}

export interface SignUpOptions {
  email: string
  password: string
  name?: string
  callbackUrl?: string
}

export interface SignOutOptions {
  callbackUrl?: string
}

export interface AuthClient {
  signIn(options: SignInOptions): Promise<Session>
  signUp(options: SignUpOptions): Promise<Session>
  signOut(options?: SignOutOptions): Promise<void>
  getSession(): Promise<Session | null>
  getUser(): Promise<User | null>
  refreshSession(): Promise<Session | null>
}

export interface AuthResponse<T = unknown> {
  success: boolean
  data?: T
  error?: {
    code: string
    message: string
  }
}
