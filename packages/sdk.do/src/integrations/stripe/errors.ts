/**
 * Stripe Errors
 *
 * Auto-generated error handling for Stripe Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/stripe
 */

/**
 * Error type enum
 */
export enum StripeErrorType {
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
 * Stripe Error class
 *
 * Custom error class for Stripe Integration operations.
 */
export class StripeError extends Error {
  public readonly code: string | number
  public readonly type: StripeErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: StripeErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'StripeError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, StripeError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns StripeError instance
   */
  static fromError(error: any): StripeError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: StripeErrorType; retryable: boolean }> = {
      invalid_request_error: { type: StripeErrorType.Validation, retryable: false },
      authentication_error: { type: StripeErrorType.Authentication, retryable: false },
      permission_error: { type: StripeErrorType.Authorization, retryable: false },
      not_found_error: { type: StripeErrorType.NotFound, retryable: false },
      rate_limit_error: { type: StripeErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new StripeError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = StripeErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = StripeErrorType.Authentication
    } else if (statusCode === 403) {
      type = StripeErrorType.Authorization
    } else if (statusCode === 404) {
      type = StripeErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = StripeErrorType.Validation
    } else if (statusCode === 429) {
      type = StripeErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = StripeErrorType.Server
      retryable = true
    }

    return new StripeError(message, code, type, {
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
    return this.type === StripeErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === StripeErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === StripeErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === StripeErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === StripeErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === StripeErrorType.Server
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
