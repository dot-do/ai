/**
 * Typeform Errors
 *
 * Auto-generated error handling for Typeform Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/typeform
 */

/**
 * Error type enum
 */
export enum TypeformErrorType {
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
 * Typeform Error class
 *
 * Custom error class for Typeform Integration operations.
 */
export class TypeformError extends Error {
  public readonly code: string | number
  public readonly type: TypeformErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: TypeformErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'TypeformError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, TypeformError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns TypeformError instance
   */
  static fromError(error: any): TypeformError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: TypeformErrorType; retryable: boolean }> = {
      '401': { type: TypeformErrorType.Authentication, retryable: false },
      '403': { type: TypeformErrorType.Authorization, retryable: false },
      '404': { type: TypeformErrorType.NotFound, retryable: false },
      '429': { type: TypeformErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new TypeformError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = TypeformErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = TypeformErrorType.Authentication
    } else if (statusCode === 403) {
      type = TypeformErrorType.Authorization
    } else if (statusCode === 404) {
      type = TypeformErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = TypeformErrorType.Validation
    } else if (statusCode === 429) {
      type = TypeformErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = TypeformErrorType.Server
      retryable = true
    }

    return new TypeformError(message, code, type, {
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
    return this.type === TypeformErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === TypeformErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === TypeformErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === TypeformErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === TypeformErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === TypeformErrorType.Server
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
