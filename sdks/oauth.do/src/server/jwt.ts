/**
 * Server-side JWT verification utilities
 */

import { jwtVerify, createRemoteJWKSet, type JWTPayload } from 'jose'

export interface JWTVerifyOptions {
  jwksUrl: string
  issuer?: string
  audience?: string
}

export interface JWTVerifyResult {
  valid: boolean
  payload?: JWTPayload
  error?: string
}

/**
 * Verify a JWT token using JWKS
 */
export async function verifyJWT(
  token: string,
  options: JWTVerifyOptions
): Promise<JWTVerifyResult> {
  try {
    const JWKS = createRemoteJWKSet(new URL(options.jwksUrl))

    const { payload } = await jwtVerify(token, JWKS, {
      issuer: options.issuer,
      audience: options.audience,
    })

    return {
      valid: true,
      payload,
    }
  } catch (error) {
    return {
      valid: false,
      error: error instanceof Error ? error.message : 'JWT verification failed',
    }
  }
}

/**
 * Extract JWT token from Authorization header or Cookie
 */
export function extractToken(headers: Headers): string | null {
  // Try Authorization header first (Bearer token)
  const authHeader = headers.get('Authorization')
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.slice(7)
  }

  // Try Cookie header
  const cookieHeader = headers.get('Cookie')
  if (cookieHeader) {
    const match = cookieHeader.match(/auth_token=([^;]+)/)
    if (match) {
      return match[1]
    }
  }

  return null
}

/**
 * Extract Bearer token from Authorization header
 */
export function extractBearerToken(headers: Headers): string | null {
  const authHeader = headers.get('Authorization')
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.slice(7)
  }
  return null
}

/**
 * Extract token from Cookie header
 */
export function extractCookieToken(headers: Headers, cookieName = 'auth_token'): string | null {
  const cookieHeader = headers.get('Cookie')
  if (cookieHeader) {
    const match = cookieHeader.match(new RegExp(`${cookieName}=([^;]+)`))
    if (match) {
      return match[1]
    }
  }
  return null
}
