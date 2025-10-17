/**
 * Bill Errors
 *
 * Auto-generated error handling for Bill Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/bill
 */

/**
 * Error type enum
 */
export enum BillErrorType {
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
 * Bill Error class
 *
 * Custom error class for Bill Integration operations.
 */
export class BillError extends Error {
  public readonly code: string | number
  public readonly type: BillErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: BillErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'BillError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, BillError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns BillError instance
   */
  static fromError(error: any): BillError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: BillErrorType; retryable: boolean }> = {
      '401': { type: BillErrorType.Authentication, retryable: false },
      '429': { type: BillErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new BillError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = BillErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = BillErrorType.Authentication
    } else if (statusCode === 403) {
      type = BillErrorType.Authorization
    } else if (statusCode === 404) {
      type = BillErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = BillErrorType.Validation
    } else if (statusCode === 429) {
      type = BillErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = BillErrorType.Server
      retryable = true
    }

    return new BillError(message, code, type, {
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
    return this.type === BillErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === BillErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === BillErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === BillErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === BillErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === BillErrorType.Server
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
