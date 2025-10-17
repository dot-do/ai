/**
 * Server-side exports (for Next.js API routes, Cloudflare Workers, etc.)
 */

export { OAuthClient, createOAuthClient } from './client/index'
export type { AuthClient, AuthConfig, AuthResponse, Session, User } from './types'

// JWT verification utilities
export {
  verifyJWT,
  extractToken,
  extractBearerToken,
  extractCookieToken,
  type JWTVerifyOptions,
  type JWTVerifyResult,
} from './server/jwt'

// TODO: Add middleware helpers for Next.js, Express, Hono, etc.
