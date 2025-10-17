/**
 * Corrently Errors
 *
 * Auto-generated error handling for Corrently Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/corrently
 */

/**
 * Error type enum
 */
export enum CorrentlyErrorType {
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
 * Corrently Error class
 *
 * Custom error class for Corrently Integration operations.
 */
export class CorrentlyError extends Error {
  public readonly code: string | number
  public readonly type: CorrentlyErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: CorrentlyErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'CorrentlyError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, CorrentlyError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns CorrentlyError instance
   */
  static fromError(error: any): CorrentlyError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: CorrentlyErrorType; retryable: boolean }> = {
      '401': { type: CorrentlyErrorType.Authentication, retryable: false },
      '429': { type: CorrentlyErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new CorrentlyError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = CorrentlyErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = CorrentlyErrorType.Authentication
    } else if (statusCode === 403) {
      type = CorrentlyErrorType.Authorization
    } else if (statusCode === 404) {
      type = CorrentlyErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = CorrentlyErrorType.Validation
    } else if (statusCode === 429) {
      type = CorrentlyErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = CorrentlyErrorType.Server
      retryable = true
    }

    return new CorrentlyError(message, code, type, {
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
    return this.type === CorrentlyErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === CorrentlyErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === CorrentlyErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === CorrentlyErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === CorrentlyErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === CorrentlyErrorType.Server
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
