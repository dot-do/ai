/**
 * Utility functions for Composio client
 */

import { isRetryableError, mapError } from './errors.js'

/**
 * Sleep for specified milliseconds
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * Calculate exponential backoff delay with jitter
 */
export function calculateBackoff(attempt: number, baseDelay: number = 1000): number {
  const exponentialDelay = baseDelay * Math.pow(2, attempt)
  const jitter = Math.random() * 1000
  return exponentialDelay + jitter
}

/**
 * Retry a function with exponential backoff
 */
export async function retry<T>(
  fn: () => Promise<T>,
  options: {
    maxRetries?: number
    baseDelay?: number
    onRetry?: (error: any, attempt: number) => void
  } = {}
): Promise<T> {
  const { maxRetries = 3, baseDelay = 1000, onRetry } = options

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn()
    } catch (error) {
      const mappedError = mapError(error)

      // Don't retry if max retries reached
      if (attempt === maxRetries) {
        throw mappedError
      }

      // Only retry retryable errors
      if (!isRetryableError(mappedError)) {
        throw mappedError
      }

      // Calculate backoff delay
      const delay = calculateBackoff(attempt, baseDelay)

      // Call retry callback if provided
      if (onRetry) {
        onRetry(mappedError, attempt + 1)
      }

      // Wait before retrying
      await sleep(delay)
    }
  }

  throw new Error('Max retries exceeded')
}

/**
 * Get environment variable with fallback
 */
export function getEnvVar(key: string, fallback?: string): string | undefined {
  // Try process.env first
  if (typeof process !== 'undefined' && process.env) {
    const value = process.env[key]
    if (value !== undefined) return value
  }

  // Return fallback
  return fallback
}

/**
 * Validate API key
 */
export function validateApiKey(apiKey?: string): string {
  const key = apiKey || getEnvVar('COMPOSIO_API_KEY')

  if (!key) {
    throw new Error('Composio API key is required. Provide it via constructor or COMPOSIO_API_KEY environment variable.')
  }

  return key
}

/**
 * Build query string from filters
 */
export function buildQueryString(filters: Record<string, any>): string {
  const params = new URLSearchParams()

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      params.append(key, String(value))
    }
  })

  const queryString = params.toString()
  return queryString ? `?${queryString}` : ''
}

/**
 * Create abort controller with timeout
 */
export function createTimeoutController(timeoutMs: number): AbortController {
  const controller = new AbortController()

  setTimeout(() => {
    controller.abort()
  }, timeoutMs)

  return controller
}
