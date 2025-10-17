/**
 * Kaggle Errors
 *
 * Auto-generated error handling for Kaggle Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/kaggle
 */

/**
 * Error type enum
 */
export enum KaggleErrorType {
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
 * Kaggle Error class
 *
 * Custom error class for Kaggle Integration operations.
 */
export class KaggleError extends Error {
  public readonly code: string | number
  public readonly type: KaggleErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: KaggleErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'KaggleError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, KaggleError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns KaggleError instance
   */
  static fromError(error: any): KaggleError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: KaggleErrorType; retryable: boolean }> = {
      '401': { type: KaggleErrorType.Authentication, retryable: false },
      '429': { type: KaggleErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new KaggleError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = KaggleErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = KaggleErrorType.Authentication
    } else if (statusCode === 403) {
      type = KaggleErrorType.Authorization
    } else if (statusCode === 404) {
      type = KaggleErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = KaggleErrorType.Validation
    } else if (statusCode === 429) {
      type = KaggleErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = KaggleErrorType.Server
      retryable = true
    }

    return new KaggleError(message, code, type, {
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
    return this.type === KaggleErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === KaggleErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === KaggleErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === KaggleErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === KaggleErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === KaggleErrorType.Server
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
