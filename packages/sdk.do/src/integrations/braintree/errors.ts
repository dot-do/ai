/**
 * Braintree Errors
 *
 * Auto-generated error handling for Braintree Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/braintree
 */

/**
 * Error type enum
 */
export enum BraintreeErrorType {
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
 * Braintree Error class
 *
 * Custom error class for Braintree Integration operations.
 */
export class BraintreeError extends Error {
  public readonly code: string | number
  public readonly type: BraintreeErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: BraintreeErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'BraintreeError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, BraintreeError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns BraintreeError instance
   */
  static fromError(error: any): BraintreeError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: BraintreeErrorType; retryable: boolean }> = {
      authentication_error: { type: BraintreeErrorType.Authentication, retryable: false },
      authorization_error: { type: BraintreeErrorType.Authorization, retryable: false },
      not_found: { type: BraintreeErrorType.NotFound, retryable: false },
      validation_error: { type: BraintreeErrorType.Validation, retryable: false },
      rate_limit_error: { type: BraintreeErrorType.RateLimit, retryable: true },
      server_error: { type: BraintreeErrorType.Server, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new BraintreeError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = BraintreeErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = BraintreeErrorType.Authentication
    } else if (statusCode === 403) {
      type = BraintreeErrorType.Authorization
    } else if (statusCode === 404) {
      type = BraintreeErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = BraintreeErrorType.Validation
    } else if (statusCode === 429) {
      type = BraintreeErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = BraintreeErrorType.Server
      retryable = true
    }

    return new BraintreeError(message, code, type, {
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
    return this.type === BraintreeErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === BraintreeErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === BraintreeErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === BraintreeErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === BraintreeErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === BraintreeErrorType.Server
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
