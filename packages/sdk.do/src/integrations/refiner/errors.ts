/**
 * Refiner Errors
 *
 * Auto-generated error handling for Refiner Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/refiner
 */

/**
 * Error type enum
 */
export enum RefinerErrorType {
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
 * Refiner Error class
 *
 * Custom error class for Refiner Integration operations.
 */
export class RefinerError extends Error {
  public readonly code: string | number
  public readonly type: RefinerErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: RefinerErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'RefinerError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, RefinerError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns RefinerError instance
   */
  static fromError(error: any): RefinerError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: RefinerErrorType; retryable: boolean }> = {
      '401': { type: RefinerErrorType.Authentication, retryable: false },
      '429': { type: RefinerErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new RefinerError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = RefinerErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = RefinerErrorType.Authentication
    } else if (statusCode === 403) {
      type = RefinerErrorType.Authorization
    } else if (statusCode === 404) {
      type = RefinerErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = RefinerErrorType.Validation
    } else if (statusCode === 429) {
      type = RefinerErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = RefinerErrorType.Server
      retryable = true
    }

    return new RefinerError(message, code, type, {
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
    return this.type === RefinerErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === RefinerErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === RefinerErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === RefinerErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === RefinerErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === RefinerErrorType.Server
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
