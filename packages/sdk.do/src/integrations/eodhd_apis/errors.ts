/**
 * Eodhd apis Errors
 *
 * Auto-generated error handling for Eodhd apis Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/eodhd_apis
 */

/**
 * Error type enum
 */
export enum EodhdApisErrorType {
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
 * Eodhd apis Error class
 *
 * Custom error class for Eodhd apis Integration operations.
 */
export class EodhdApisError extends Error {
  public readonly code: string | number
  public readonly type: EodhdApisErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: EodhdApisErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'EodhdApisError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, EodhdApisError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns EodhdApisError instance
   */
  static fromError(error: any): EodhdApisError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: EodhdApisErrorType; retryable: boolean }> = {
      '401': { type: EodhdApisErrorType.Authentication, retryable: false },
      '429': { type: EodhdApisErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new EodhdApisError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = EodhdApisErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = EodhdApisErrorType.Authentication
    } else if (statusCode === 403) {
      type = EodhdApisErrorType.Authorization
    } else if (statusCode === 404) {
      type = EodhdApisErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = EodhdApisErrorType.Validation
    } else if (statusCode === 429) {
      type = EodhdApisErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = EodhdApisErrorType.Server
      retryable = true
    }

    return new EodhdApisError(message, code, type, {
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
    return this.type === EodhdApisErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === EodhdApisErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === EodhdApisErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === EodhdApisErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === EodhdApisErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === EodhdApisErrorType.Server
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
