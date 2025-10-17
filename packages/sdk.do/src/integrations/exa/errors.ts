/**
 * Exa Errors
 *
 * Auto-generated error handling for Exa Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/exa
 */

/**
 * Error type enum
 */
export enum ExaErrorType {
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
 * Exa Error class
 *
 * Custom error class for Exa Integration operations.
 */
export class ExaError extends Error {
  public readonly code: string | number
  public readonly type: ExaErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: ExaErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'ExaError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ExaError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns ExaError instance
   */
  static fromError(error: any): ExaError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: ExaErrorType; retryable: boolean }> = {
      '401': { type: ExaErrorType.Authentication, retryable: false },
      '429': { type: ExaErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new ExaError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = ExaErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = ExaErrorType.Authentication
    } else if (statusCode === 403) {
      type = ExaErrorType.Authorization
    } else if (statusCode === 404) {
      type = ExaErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = ExaErrorType.Validation
    } else if (statusCode === 429) {
      type = ExaErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = ExaErrorType.Server
      retryable = true
    }

    return new ExaError(message, code, type, {
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
    return this.type === ExaErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === ExaErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === ExaErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === ExaErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === ExaErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === ExaErrorType.Server
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
