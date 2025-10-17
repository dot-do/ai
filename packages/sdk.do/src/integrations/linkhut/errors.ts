/**
 * Linkhut Errors
 *
 * Auto-generated error handling for Linkhut Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/linkhut
 */

/**
 * Error type enum
 */
export enum LinkhutErrorType {
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
 * Linkhut Error class
 *
 * Custom error class for Linkhut Integration operations.
 */
export class LinkhutError extends Error {
  public readonly code: string | number
  public readonly type: LinkhutErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: LinkhutErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'LinkhutError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, LinkhutError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns LinkhutError instance
   */
  static fromError(error: any): LinkhutError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: LinkhutErrorType; retryable: boolean }> = {
      '401': { type: LinkhutErrorType.Authentication, retryable: false },
      '429': { type: LinkhutErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new LinkhutError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = LinkhutErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = LinkhutErrorType.Authentication
    } else if (statusCode === 403) {
      type = LinkhutErrorType.Authorization
    } else if (statusCode === 404) {
      type = LinkhutErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = LinkhutErrorType.Validation
    } else if (statusCode === 429) {
      type = LinkhutErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = LinkhutErrorType.Server
      retryable = true
    }

    return new LinkhutError(message, code, type, {
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
    return this.type === LinkhutErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === LinkhutErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === LinkhutErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === LinkhutErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === LinkhutErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === LinkhutErrorType.Server
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
