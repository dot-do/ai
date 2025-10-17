/**
 * Klipfolio Errors
 *
 * Auto-generated error handling for Klipfolio Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/klipfolio
 */

/**
 * Error type enum
 */
export enum KlipfolioErrorType {
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
 * Klipfolio Error class
 *
 * Custom error class for Klipfolio Integration operations.
 */
export class KlipfolioError extends Error {
  public readonly code: string | number
  public readonly type: KlipfolioErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: KlipfolioErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'KlipfolioError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, KlipfolioError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns KlipfolioError instance
   */
  static fromError(error: any): KlipfolioError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: KlipfolioErrorType; retryable: boolean }> = {
      '401': { type: KlipfolioErrorType.Authentication, retryable: false },
      '429': { type: KlipfolioErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new KlipfolioError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = KlipfolioErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = KlipfolioErrorType.Authentication
    } else if (statusCode === 403) {
      type = KlipfolioErrorType.Authorization
    } else if (statusCode === 404) {
      type = KlipfolioErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = KlipfolioErrorType.Validation
    } else if (statusCode === 429) {
      type = KlipfolioErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = KlipfolioErrorType.Server
      retryable = true
    }

    return new KlipfolioError(message, code, type, {
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
    return this.type === KlipfolioErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === KlipfolioErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === KlipfolioErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === KlipfolioErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === KlipfolioErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === KlipfolioErrorType.Server
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
