/**
 * Customerio Errors
 *
 * Auto-generated error handling for Customerio Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/customerio
 */

/**
 * Error type enum
 */
export enum CustomerioErrorType {
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
 * Customerio Error class
 *
 * Custom error class for Customerio Integration operations.
 */
export class CustomerioError extends Error {
  public readonly code: string | number
  public readonly type: CustomerioErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: CustomerioErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'CustomerioError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, CustomerioError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns CustomerioError instance
   */
  static fromError(error: any): CustomerioError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: CustomerioErrorType; retryable: boolean }> = {
      '401': { type: CustomerioErrorType.Authentication, retryable: false },
      '429': { type: CustomerioErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new CustomerioError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = CustomerioErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = CustomerioErrorType.Authentication
    } else if (statusCode === 403) {
      type = CustomerioErrorType.Authorization
    } else if (statusCode === 404) {
      type = CustomerioErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = CustomerioErrorType.Validation
    } else if (statusCode === 429) {
      type = CustomerioErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = CustomerioErrorType.Server
      retryable = true
    }

    return new CustomerioError(message, code, type, {
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
    return this.type === CustomerioErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === CustomerioErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === CustomerioErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === CustomerioErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === CustomerioErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === CustomerioErrorType.Server
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
