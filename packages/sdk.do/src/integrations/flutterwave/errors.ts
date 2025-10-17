/**
 * Flutterwave Errors
 *
 * Auto-generated error handling for Flutterwave Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/flutterwave
 */

/**
 * Error type enum
 */
export enum FlutterwaveErrorType {
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
 * Flutterwave Error class
 *
 * Custom error class for Flutterwave Integration operations.
 */
export class FlutterwaveError extends Error {
  public readonly code: string | number
  public readonly type: FlutterwaveErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: FlutterwaveErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'FlutterwaveError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, FlutterwaveError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns FlutterwaveError instance
   */
  static fromError(error: any): FlutterwaveError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: FlutterwaveErrorType; retryable: boolean }> = {
      '401': { type: FlutterwaveErrorType.Authentication, retryable: false },
      '429': { type: FlutterwaveErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new FlutterwaveError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = FlutterwaveErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = FlutterwaveErrorType.Authentication
    } else if (statusCode === 403) {
      type = FlutterwaveErrorType.Authorization
    } else if (statusCode === 404) {
      type = FlutterwaveErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = FlutterwaveErrorType.Validation
    } else if (statusCode === 429) {
      type = FlutterwaveErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = FlutterwaveErrorType.Server
      retryable = true
    }

    return new FlutterwaveError(message, code, type, {
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
    return this.type === FlutterwaveErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === FlutterwaveErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === FlutterwaveErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === FlutterwaveErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === FlutterwaveErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === FlutterwaveErrorType.Server
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
