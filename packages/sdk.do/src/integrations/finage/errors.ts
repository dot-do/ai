/**
 * Finage Errors
 *
 * Auto-generated error handling for Finage Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/finage
 */

/**
 * Error type enum
 */
export enum FinageErrorType {
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
 * Finage Error class
 *
 * Custom error class for Finage Integration operations.
 */
export class FinageError extends Error {
  public readonly code: string | number
  public readonly type: FinageErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: FinageErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'FinageError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, FinageError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns FinageError instance
   */
  static fromError(error: any): FinageError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: FinageErrorType; retryable: boolean }> = {
      '401': { type: FinageErrorType.Authentication, retryable: false },
      '429': { type: FinageErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new FinageError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = FinageErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = FinageErrorType.Authentication
    } else if (statusCode === 403) {
      type = FinageErrorType.Authorization
    } else if (statusCode === 404) {
      type = FinageErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = FinageErrorType.Validation
    } else if (statusCode === 429) {
      type = FinageErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = FinageErrorType.Server
      retryable = true
    }

    return new FinageError(message, code, type, {
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
    return this.type === FinageErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === FinageErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === FinageErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === FinageErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === FinageErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === FinageErrorType.Server
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
