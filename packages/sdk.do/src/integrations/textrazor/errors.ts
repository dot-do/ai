/**
 * Textrazor Errors
 *
 * Auto-generated error handling for Textrazor Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/textrazor
 */

/**
 * Error type enum
 */
export enum TextrazorErrorType {
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
 * Textrazor Error class
 *
 * Custom error class for Textrazor Integration operations.
 */
export class TextrazorError extends Error {
  public readonly code: string | number
  public readonly type: TextrazorErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: TextrazorErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'TextrazorError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, TextrazorError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns TextrazorError instance
   */
  static fromError(error: any): TextrazorError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: TextrazorErrorType; retryable: boolean }> = {
      '401': { type: TextrazorErrorType.Authentication, retryable: false },
      '429': { type: TextrazorErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new TextrazorError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = TextrazorErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = TextrazorErrorType.Authentication
    } else if (statusCode === 403) {
      type = TextrazorErrorType.Authorization
    } else if (statusCode === 404) {
      type = TextrazorErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = TextrazorErrorType.Validation
    } else if (statusCode === 429) {
      type = TextrazorErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = TextrazorErrorType.Server
      retryable = true
    }

    return new TextrazorError(message, code, type, {
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
    return this.type === TextrazorErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === TextrazorErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === TextrazorErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === TextrazorErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === TextrazorErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === TextrazorErrorType.Server
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
