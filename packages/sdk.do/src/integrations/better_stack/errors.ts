/**
 * Better stack Errors
 *
 * Auto-generated error handling for Better stack Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/better_stack
 */

/**
 * Error type enum
 */
export enum BetterStackErrorType {
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
 * Better stack Error class
 *
 * Custom error class for Better stack Integration operations.
 */
export class BetterStackError extends Error {
  public readonly code: string | number
  public readonly type: BetterStackErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: BetterStackErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'BetterStackError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, BetterStackError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns BetterStackError instance
   */
  static fromError(error: any): BetterStackError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: BetterStackErrorType; retryable: boolean }> = {
      '401': { type: BetterStackErrorType.Authentication, retryable: false },
      '429': { type: BetterStackErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new BetterStackError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = BetterStackErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = BetterStackErrorType.Authentication
    } else if (statusCode === 403) {
      type = BetterStackErrorType.Authorization
    } else if (statusCode === 404) {
      type = BetterStackErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = BetterStackErrorType.Validation
    } else if (statusCode === 429) {
      type = BetterStackErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = BetterStackErrorType.Server
      retryable = true
    }

    return new BetterStackError(message, code, type, {
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
    return this.type === BetterStackErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === BetterStackErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === BetterStackErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === BetterStackErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === BetterStackErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === BetterStackErrorType.Server
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
