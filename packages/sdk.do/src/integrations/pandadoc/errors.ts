/**
 * Pandadoc Errors
 *
 * Auto-generated error handling for Pandadoc Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/pandadoc
 */

/**
 * Error type enum
 */
export enum PandadocErrorType {
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
 * Pandadoc Error class
 *
 * Custom error class for Pandadoc Integration operations.
 */
export class PandadocError extends Error {
  public readonly code: string | number
  public readonly type: PandadocErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: PandadocErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'PandadocError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, PandadocError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns PandadocError instance
   */
  static fromError(error: any): PandadocError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: PandadocErrorType; retryable: boolean }> = {
      '401': { type: PandadocErrorType.Authentication, retryable: false },
      '429': { type: PandadocErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new PandadocError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = PandadocErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = PandadocErrorType.Authentication
    } else if (statusCode === 403) {
      type = PandadocErrorType.Authorization
    } else if (statusCode === 404) {
      type = PandadocErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = PandadocErrorType.Validation
    } else if (statusCode === 429) {
      type = PandadocErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = PandadocErrorType.Server
      retryable = true
    }

    return new PandadocError(message, code, type, {
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
    return this.type === PandadocErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === PandadocErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === PandadocErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === PandadocErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === PandadocErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === PandadocErrorType.Server
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
