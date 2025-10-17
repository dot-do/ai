/**
 * Loyverse Errors
 *
 * Auto-generated error handling for Loyverse Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/loyverse
 */

/**
 * Error type enum
 */
export enum LoyverseErrorType {
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
 * Loyverse Error class
 *
 * Custom error class for Loyverse Integration operations.
 */
export class LoyverseError extends Error {
  public readonly code: string | number
  public readonly type: LoyverseErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: LoyverseErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'LoyverseError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, LoyverseError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns LoyverseError instance
   */
  static fromError(error: any): LoyverseError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: LoyverseErrorType; retryable: boolean }> = {
      '401': { type: LoyverseErrorType.Authentication, retryable: false },
      '429': { type: LoyverseErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new LoyverseError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = LoyverseErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = LoyverseErrorType.Authentication
    } else if (statusCode === 403) {
      type = LoyverseErrorType.Authorization
    } else if (statusCode === 404) {
      type = LoyverseErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = LoyverseErrorType.Validation
    } else if (statusCode === 429) {
      type = LoyverseErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = LoyverseErrorType.Server
      retryable = true
    }

    return new LoyverseError(message, code, type, {
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
    return this.type === LoyverseErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === LoyverseErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === LoyverseErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === LoyverseErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === LoyverseErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === LoyverseErrorType.Server
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
