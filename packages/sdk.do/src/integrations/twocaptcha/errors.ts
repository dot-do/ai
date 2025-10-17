/**
 * Twocaptcha Errors
 *
 * Auto-generated error handling for Twocaptcha Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/twocaptcha
 */

/**
 * Error type enum
 */
export enum TwocaptchaErrorType {
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
 * Twocaptcha Error class
 *
 * Custom error class for Twocaptcha Integration operations.
 */
export class TwocaptchaError extends Error {
  public readonly code: string | number
  public readonly type: TwocaptchaErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: TwocaptchaErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'TwocaptchaError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, TwocaptchaError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns TwocaptchaError instance
   */
  static fromError(error: any): TwocaptchaError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: TwocaptchaErrorType; retryable: boolean }> = {
      '401': { type: TwocaptchaErrorType.Authentication, retryable: false },
      '429': { type: TwocaptchaErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new TwocaptchaError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = TwocaptchaErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = TwocaptchaErrorType.Authentication
    } else if (statusCode === 403) {
      type = TwocaptchaErrorType.Authorization
    } else if (statusCode === 404) {
      type = TwocaptchaErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = TwocaptchaErrorType.Validation
    } else if (statusCode === 429) {
      type = TwocaptchaErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = TwocaptchaErrorType.Server
      retryable = true
    }

    return new TwocaptchaError(message, code, type, {
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
    return this.type === TwocaptchaErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === TwocaptchaErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === TwocaptchaErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === TwocaptchaErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === TwocaptchaErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === TwocaptchaErrorType.Server
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
