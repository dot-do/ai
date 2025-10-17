/**
 * Blazemeter Errors
 *
 * Auto-generated error handling for Blazemeter Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/blazemeter
 */

/**
 * Error type enum
 */
export enum BlazemeterErrorType {
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
 * Blazemeter Error class
 *
 * Custom error class for Blazemeter Integration operations.
 */
export class BlazemeterError extends Error {
  public readonly code: string | number
  public readonly type: BlazemeterErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: BlazemeterErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'BlazemeterError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, BlazemeterError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns BlazemeterError instance
   */
  static fromError(error: any): BlazemeterError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: BlazemeterErrorType; retryable: boolean }> = {
      '401': { type: BlazemeterErrorType.Authentication, retryable: false },
      '429': { type: BlazemeterErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new BlazemeterError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = BlazemeterErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = BlazemeterErrorType.Authentication
    } else if (statusCode === 403) {
      type = BlazemeterErrorType.Authorization
    } else if (statusCode === 404) {
      type = BlazemeterErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = BlazemeterErrorType.Validation
    } else if (statusCode === 429) {
      type = BlazemeterErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = BlazemeterErrorType.Server
      retryable = true
    }

    return new BlazemeterError(message, code, type, {
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
    return this.type === BlazemeterErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === BlazemeterErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === BlazemeterErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === BlazemeterErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === BlazemeterErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === BlazemeterErrorType.Server
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
