/**
 * Metatextai Errors
 *
 * Auto-generated error handling for Metatextai Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/metatextai
 */

/**
 * Error type enum
 */
export enum MetatextaiErrorType {
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
 * Metatextai Error class
 *
 * Custom error class for Metatextai Integration operations.
 */
export class MetatextaiError extends Error {
  public readonly code: string | number
  public readonly type: MetatextaiErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: MetatextaiErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'MetatextaiError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, MetatextaiError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns MetatextaiError instance
   */
  static fromError(error: any): MetatextaiError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: MetatextaiErrorType; retryable: boolean }> = {
      '401': { type: MetatextaiErrorType.Authentication, retryable: false },
      '429': { type: MetatextaiErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new MetatextaiError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = MetatextaiErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = MetatextaiErrorType.Authentication
    } else if (statusCode === 403) {
      type = MetatextaiErrorType.Authorization
    } else if (statusCode === 404) {
      type = MetatextaiErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = MetatextaiErrorType.Validation
    } else if (statusCode === 429) {
      type = MetatextaiErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = MetatextaiErrorType.Server
      retryable = true
    }

    return new MetatextaiError(message, code, type, {
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
    return this.type === MetatextaiErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === MetatextaiErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === MetatextaiErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === MetatextaiErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === MetatextaiErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === MetatextaiErrorType.Server
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
