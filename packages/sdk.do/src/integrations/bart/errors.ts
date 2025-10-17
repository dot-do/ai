/**
 * Bart Errors
 *
 * Auto-generated error handling for Bart Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/bart
 */

/**
 * Error type enum
 */
export enum BartErrorType {
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
 * Bart Error class
 *
 * Custom error class for Bart Integration operations.
 */
export class BartError extends Error {
  public readonly code: string | number
  public readonly type: BartErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: BartErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'BartError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, BartError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns BartError instance
   */
  static fromError(error: any): BartError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: BartErrorType; retryable: boolean }> = {
      '401': { type: BartErrorType.Authentication, retryable: false },
      '429': { type: BartErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new BartError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = BartErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = BartErrorType.Authentication
    } else if (statusCode === 403) {
      type = BartErrorType.Authorization
    } else if (statusCode === 404) {
      type = BartErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = BartErrorType.Validation
    } else if (statusCode === 429) {
      type = BartErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = BartErrorType.Server
      retryable = true
    }

    return new BartError(message, code, type, {
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
    return this.type === BartErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === BartErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === BartErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === BartErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === BartErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === BartErrorType.Server
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
