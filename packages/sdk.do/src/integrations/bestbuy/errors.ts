/**
 * Bestbuy Errors
 *
 * Auto-generated error handling for Bestbuy Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/bestbuy
 */

/**
 * Error type enum
 */
export enum BestbuyErrorType {
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
 * Bestbuy Error class
 *
 * Custom error class for Bestbuy Integration operations.
 */
export class BestbuyError extends Error {
  public readonly code: string | number
  public readonly type: BestbuyErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: BestbuyErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'BestbuyError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, BestbuyError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns BestbuyError instance
   */
  static fromError(error: any): BestbuyError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: BestbuyErrorType; retryable: boolean }> = {
      '401': { type: BestbuyErrorType.Authentication, retryable: false },
      '429': { type: BestbuyErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new BestbuyError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = BestbuyErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = BestbuyErrorType.Authentication
    } else if (statusCode === 403) {
      type = BestbuyErrorType.Authorization
    } else if (statusCode === 404) {
      type = BestbuyErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = BestbuyErrorType.Validation
    } else if (statusCode === 429) {
      type = BestbuyErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = BestbuyErrorType.Server
      retryable = true
    }

    return new BestbuyError(message, code, type, {
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
    return this.type === BestbuyErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === BestbuyErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === BestbuyErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === BestbuyErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === BestbuyErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === BestbuyErrorType.Server
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
