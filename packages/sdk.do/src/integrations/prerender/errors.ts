/**
 * Prerender Errors
 *
 * Auto-generated error handling for Prerender Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/prerender
 */

/**
 * Error type enum
 */
export enum PrerenderErrorType {
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
 * Prerender Error class
 *
 * Custom error class for Prerender Integration operations.
 */
export class PrerenderError extends Error {
  public readonly code: string | number
  public readonly type: PrerenderErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: PrerenderErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'PrerenderError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, PrerenderError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns PrerenderError instance
   */
  static fromError(error: any): PrerenderError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: PrerenderErrorType; retryable: boolean }> = {
      '401': { type: PrerenderErrorType.Authentication, retryable: false },
      '429': { type: PrerenderErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new PrerenderError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = PrerenderErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = PrerenderErrorType.Authentication
    } else if (statusCode === 403) {
      type = PrerenderErrorType.Authorization
    } else if (statusCode === 404) {
      type = PrerenderErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = PrerenderErrorType.Validation
    } else if (statusCode === 429) {
      type = PrerenderErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = PrerenderErrorType.Server
      retryable = true
    }

    return new PrerenderError(message, code, type, {
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
    return this.type === PrerenderErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === PrerenderErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === PrerenderErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === PrerenderErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === PrerenderErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === PrerenderErrorType.Server
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
