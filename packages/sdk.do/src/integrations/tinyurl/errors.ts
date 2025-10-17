/**
 * Tinyurl Errors
 *
 * Auto-generated error handling for Tinyurl Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/tinyurl
 */

/**
 * Error type enum
 */
export enum TinyurlErrorType {
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
 * Tinyurl Error class
 *
 * Custom error class for Tinyurl Integration operations.
 */
export class TinyurlError extends Error {
  public readonly code: string | number
  public readonly type: TinyurlErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: TinyurlErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'TinyurlError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, TinyurlError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns TinyurlError instance
   */
  static fromError(error: any): TinyurlError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: TinyurlErrorType; retryable: boolean }> = {
      '401': { type: TinyurlErrorType.Authentication, retryable: false },
      '429': { type: TinyurlErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new TinyurlError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = TinyurlErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = TinyurlErrorType.Authentication
    } else if (statusCode === 403) {
      type = TinyurlErrorType.Authorization
    } else if (statusCode === 404) {
      type = TinyurlErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = TinyurlErrorType.Validation
    } else if (statusCode === 429) {
      type = TinyurlErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = TinyurlErrorType.Server
      retryable = true
    }

    return new TinyurlError(message, code, type, {
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
    return this.type === TinyurlErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === TinyurlErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === TinyurlErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === TinyurlErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === TinyurlErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === TinyurlErrorType.Server
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
