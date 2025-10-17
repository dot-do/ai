/**
 * Kaleido Errors
 *
 * Auto-generated error handling for Kaleido Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/kaleido
 */

/**
 * Error type enum
 */
export enum KaleidoErrorType {
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
 * Kaleido Error class
 *
 * Custom error class for Kaleido Integration operations.
 */
export class KaleidoError extends Error {
  public readonly code: string | number
  public readonly type: KaleidoErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: KaleidoErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'KaleidoError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, KaleidoError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns KaleidoError instance
   */
  static fromError(error: any): KaleidoError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: KaleidoErrorType; retryable: boolean }> = {
      '401': { type: KaleidoErrorType.Authentication, retryable: false },
      '429': { type: KaleidoErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new KaleidoError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = KaleidoErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = KaleidoErrorType.Authentication
    } else if (statusCode === 403) {
      type = KaleidoErrorType.Authorization
    } else if (statusCode === 404) {
      type = KaleidoErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = KaleidoErrorType.Validation
    } else if (statusCode === 429) {
      type = KaleidoErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = KaleidoErrorType.Server
      retryable = true
    }

    return new KaleidoError(message, code, type, {
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
    return this.type === KaleidoErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === KaleidoErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === KaleidoErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === KaleidoErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === KaleidoErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === KaleidoErrorType.Server
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
