/**
 * Realphonevalidation Errors
 *
 * Auto-generated error handling for Realphonevalidation Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/realphonevalidation
 */

/**
 * Error type enum
 */
export enum RealphonevalidationErrorType {
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
 * Realphonevalidation Error class
 *
 * Custom error class for Realphonevalidation Integration operations.
 */
export class RealphonevalidationError extends Error {
  public readonly code: string | number
  public readonly type: RealphonevalidationErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: RealphonevalidationErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'RealphonevalidationError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, RealphonevalidationError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns RealphonevalidationError instance
   */
  static fromError(error: any): RealphonevalidationError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: RealphonevalidationErrorType; retryable: boolean }> = {
      '401': { type: RealphonevalidationErrorType.Authentication, retryable: false },
      '429': { type: RealphonevalidationErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new RealphonevalidationError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = RealphonevalidationErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = RealphonevalidationErrorType.Authentication
    } else if (statusCode === 403) {
      type = RealphonevalidationErrorType.Authorization
    } else if (statusCode === 404) {
      type = RealphonevalidationErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = RealphonevalidationErrorType.Validation
    } else if (statusCode === 429) {
      type = RealphonevalidationErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = RealphonevalidationErrorType.Server
      retryable = true
    }

    return new RealphonevalidationError(message, code, type, {
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
    return this.type === RealphonevalidationErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === RealphonevalidationErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === RealphonevalidationErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === RealphonevalidationErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === RealphonevalidationErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === RealphonevalidationErrorType.Server
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
