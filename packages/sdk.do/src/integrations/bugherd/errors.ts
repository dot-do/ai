/**
 * Bugherd Errors
 *
 * Auto-generated error handling for Bugherd Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/bugherd
 */

/**
 * Error type enum
 */
export enum BugherdErrorType {
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
 * Bugherd Error class
 *
 * Custom error class for Bugherd Integration operations.
 */
export class BugherdError extends Error {
  public readonly code: string | number
  public readonly type: BugherdErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: BugherdErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'BugherdError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, BugherdError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns BugherdError instance
   */
  static fromError(error: any): BugherdError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: BugherdErrorType; retryable: boolean }> = {
      '401': { type: BugherdErrorType.Authentication, retryable: false },
      '429': { type: BugherdErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new BugherdError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = BugherdErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = BugherdErrorType.Authentication
    } else if (statusCode === 403) {
      type = BugherdErrorType.Authorization
    } else if (statusCode === 404) {
      type = BugherdErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = BugherdErrorType.Validation
    } else if (statusCode === 429) {
      type = BugherdErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = BugherdErrorType.Server
      retryable = true
    }

    return new BugherdError(message, code, type, {
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
    return this.type === BugherdErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === BugherdErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === BugherdErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === BugherdErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === BugherdErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === BugherdErrorType.Server
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
