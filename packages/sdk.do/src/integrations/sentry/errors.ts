/**
 * Sentry Errors
 *
 * Auto-generated error handling for Sentry Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/sentry
 */

/**
 * Error type enum
 */
export enum SentryErrorType {
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
 * Sentry Error class
 *
 * Custom error class for Sentry Integration operations.
 */
export class SentryError extends Error {
  public readonly code: string | number
  public readonly type: SentryErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: SentryErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'SentryError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, SentryError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns SentryError instance
   */
  static fromError(error: any): SentryError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: SentryErrorType; retryable: boolean }> = {
      '401': { type: SentryErrorType.Authentication, retryable: false },
      '403': { type: SentryErrorType.Authorization, retryable: false },
      '404': { type: SentryErrorType.NotFound, retryable: false },
      '400': { type: SentryErrorType.Validation, retryable: false },
      '429': { type: SentryErrorType.RateLimit, retryable: true },
      '500': { type: SentryErrorType.Server, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new SentryError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = SentryErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = SentryErrorType.Authentication
    } else if (statusCode === 403) {
      type = SentryErrorType.Authorization
    } else if (statusCode === 404) {
      type = SentryErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = SentryErrorType.Validation
    } else if (statusCode === 429) {
      type = SentryErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = SentryErrorType.Server
      retryable = true
    }

    return new SentryError(message, code, type, {
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
    return this.type === SentryErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === SentryErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === SentryErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === SentryErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === SentryErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === SentryErrorType.Server
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
