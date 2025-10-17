/**
 * Textit Errors
 *
 * Auto-generated error handling for Textit Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/textit
 */

/**
 * Error type enum
 */
export enum TextitErrorType {
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
 * Textit Error class
 *
 * Custom error class for Textit Integration operations.
 */
export class TextitError extends Error {
  public readonly code: string | number
  public readonly type: TextitErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: TextitErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'TextitError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, TextitError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns TextitError instance
   */
  static fromError(error: any): TextitError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: TextitErrorType; retryable: boolean }> = {
      '401': { type: TextitErrorType.Authentication, retryable: false },
      '429': { type: TextitErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new TextitError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = TextitErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = TextitErrorType.Authentication
    } else if (statusCode === 403) {
      type = TextitErrorType.Authorization
    } else if (statusCode === 404) {
      type = TextitErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = TextitErrorType.Validation
    } else if (statusCode === 429) {
      type = TextitErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = TextitErrorType.Server
      retryable = true
    }

    return new TextitError(message, code, type, {
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
    return this.type === TextitErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === TextitErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === TextitErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === TextitErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === TextitErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === TextitErrorType.Server
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
