/**
 * Firecrawl Errors
 *
 * Auto-generated error handling for Firecrawl Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/firecrawl
 */

/**
 * Error type enum
 */
export enum FirecrawlErrorType {
  Authentication = 'authentication',
  Authorization = 'authorization',
  Validation = 'validation',
  NotFound = 'not_found',
  RateLimit = 'rate_limit',
  Server = 'server',
  Network = 'network',
  Unknown = 'unknown',
}

/**
 * Firecrawl Error class
 *
 * Custom error class for Firecrawl Integration operations.
 */
export class FirecrawlError extends Error {
  public readonly code: string | number
  public readonly type: FirecrawlErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: FirecrawlErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'FirecrawlError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, FirecrawlError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns FirecrawlError instance
   */
  static fromError(error: any): FirecrawlError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: FirecrawlErrorType; retryable: boolean }> = {
      '401': { type: FirecrawlErrorType.Authentication, retryable: false },
      '429': { type: FirecrawlErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new FirecrawlError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = FirecrawlErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = FirecrawlErrorType.Authentication
    } else if (statusCode === 403) {
      type = FirecrawlErrorType.Authorization
    } else if (statusCode === 404) {
      type = FirecrawlErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = FirecrawlErrorType.Validation
    } else if (statusCode === 429) {
      type = FirecrawlErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = FirecrawlErrorType.Server
      retryable = true
    }

    return new FirecrawlError(message, code, type, {
      statusCode,
      retryable,
      originalError: error,
    })
  }

  /** Check if error is retryable */
  isRetriable(): boolean {
    return this.retryable
  }

  /** Check if error is authentication error */
  isAuthenticationError(): boolean {
    return this.type === FirecrawlErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === FirecrawlErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === FirecrawlErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === FirecrawlErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === FirecrawlErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === FirecrawlErrorType.Server
  }

  /** Get error details as object */
  toJSON() {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      type: this.type,
      statusCode: this.statusCode,
      retryable: this.retryable,
    }
  }
}
