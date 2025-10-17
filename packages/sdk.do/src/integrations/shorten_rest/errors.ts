/**
 * Shorten rest Errors
 *
 * Auto-generated error handling for Shorten rest Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/shorten_rest
 */

/**
 * Error type enum
 */
export enum ShortenRestErrorType {
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
 * Shorten rest Error class
 *
 * Custom error class for Shorten rest Integration operations.
 */
export class ShortenRestError extends Error {
  public readonly code: string | number
  public readonly type: ShortenRestErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: ShortenRestErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'ShortenRestError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ShortenRestError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns ShortenRestError instance
   */
  static fromError(error: any): ShortenRestError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: ShortenRestErrorType; retryable: boolean }> = {
      '401': { type: ShortenRestErrorType.Authentication, retryable: false },
      '429': { type: ShortenRestErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new ShortenRestError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = ShortenRestErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = ShortenRestErrorType.Authentication
    } else if (statusCode === 403) {
      type = ShortenRestErrorType.Authorization
    } else if (statusCode === 404) {
      type = ShortenRestErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = ShortenRestErrorType.Validation
    } else if (statusCode === 429) {
      type = ShortenRestErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = ShortenRestErrorType.Server
      retryable = true
    }

    return new ShortenRestError(message, code, type, {
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
    return this.type === ShortenRestErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === ShortenRestErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === ShortenRestErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === ShortenRestErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === ShortenRestErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === ShortenRestErrorType.Server
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
