/**
 * Klaviyo Errors
 *
 * Auto-generated error handling for Klaviyo Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/klaviyo
 */

/**
 * Error type enum
 */
export enum KlaviyoErrorType {
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
 * Klaviyo Error class
 *
 * Custom error class for Klaviyo Integration operations.
 */
export class KlaviyoError extends Error {
  public readonly code: string | number
  public readonly type: KlaviyoErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: KlaviyoErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'KlaviyoError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, KlaviyoError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns KlaviyoError instance
   */
  static fromError(error: any): KlaviyoError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: KlaviyoErrorType; retryable: boolean }> = {
      '401': { type: KlaviyoErrorType.Authentication, retryable: false },
      '429': { type: KlaviyoErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new KlaviyoError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = KlaviyoErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = KlaviyoErrorType.Authentication
    } else if (statusCode === 403) {
      type = KlaviyoErrorType.Authorization
    } else if (statusCode === 404) {
      type = KlaviyoErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = KlaviyoErrorType.Validation
    } else if (statusCode === 429) {
      type = KlaviyoErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = KlaviyoErrorType.Server
      retryable = true
    }

    return new KlaviyoError(message, code, type, {
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
    return this.type === KlaviyoErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === KlaviyoErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === KlaviyoErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === KlaviyoErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === KlaviyoErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === KlaviyoErrorType.Server
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
