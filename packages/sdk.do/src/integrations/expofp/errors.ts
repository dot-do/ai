/**
 * Expofp Errors
 *
 * Auto-generated error handling for Expofp Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/expofp
 */

/**
 * Error type enum
 */
export enum ExpofpErrorType {
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
 * Expofp Error class
 *
 * Custom error class for Expofp Integration operations.
 */
export class ExpofpError extends Error {
  public readonly code: string | number
  public readonly type: ExpofpErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: ExpofpErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'ExpofpError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ExpofpError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns ExpofpError instance
   */
  static fromError(error: any): ExpofpError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: ExpofpErrorType; retryable: boolean }> = {
      '401': { type: ExpofpErrorType.Authentication, retryable: false },
      '429': { type: ExpofpErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new ExpofpError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = ExpofpErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = ExpofpErrorType.Authentication
    } else if (statusCode === 403) {
      type = ExpofpErrorType.Authorization
    } else if (statusCode === 404) {
      type = ExpofpErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = ExpofpErrorType.Validation
    } else if (statusCode === 429) {
      type = ExpofpErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = ExpofpErrorType.Server
      retryable = true
    }

    return new ExpofpError(message, code, type, {
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
    return this.type === ExpofpErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === ExpofpErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === ExpofpErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === ExpofpErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === ExpofpErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === ExpofpErrorType.Server
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
