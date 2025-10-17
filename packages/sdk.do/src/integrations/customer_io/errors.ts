/**
 * Customer io Errors
 *
 * Auto-generated error handling for Customer io Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/customer_io
 */

/**
 * Error type enum
 */
export enum CustomerIoErrorType {
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
 * Customer io Error class
 *
 * Custom error class for Customer io Integration operations.
 */
export class CustomerIoError extends Error {
  public readonly code: string | number
  public readonly type: CustomerIoErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: CustomerIoErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'CustomerIoError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, CustomerIoError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns CustomerIoError instance
   */
  static fromError(error: any): CustomerIoError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: CustomerIoErrorType; retryable: boolean }> = {
      '401': { type: CustomerIoErrorType.Authentication, retryable: false },
      '429': { type: CustomerIoErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new CustomerIoError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = CustomerIoErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = CustomerIoErrorType.Authentication
    } else if (statusCode === 403) {
      type = CustomerIoErrorType.Authorization
    } else if (statusCode === 404) {
      type = CustomerIoErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = CustomerIoErrorType.Validation
    } else if (statusCode === 429) {
      type = CustomerIoErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = CustomerIoErrorType.Server
      retryable = true
    }

    return new CustomerIoError(message, code, type, {
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
    return this.type === CustomerIoErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === CustomerIoErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === CustomerIoErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === CustomerIoErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === CustomerIoErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === CustomerIoErrorType.Server
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
