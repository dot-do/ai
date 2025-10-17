/**
 * Botpress Errors
 *
 * Auto-generated error handling for Botpress Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/botpress
 */

/**
 * Error type enum
 */
export enum BotpressErrorType {
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
 * Botpress Error class
 *
 * Custom error class for Botpress Integration operations.
 */
export class BotpressError extends Error {
  public readonly code: string | number
  public readonly type: BotpressErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: BotpressErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'BotpressError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, BotpressError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns BotpressError instance
   */
  static fromError(error: any): BotpressError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: BotpressErrorType; retryable: boolean }> = {
      '401': { type: BotpressErrorType.Authentication, retryable: false },
      '429': { type: BotpressErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new BotpressError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = BotpressErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = BotpressErrorType.Authentication
    } else if (statusCode === 403) {
      type = BotpressErrorType.Authorization
    } else if (statusCode === 404) {
      type = BotpressErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = BotpressErrorType.Validation
    } else if (statusCode === 429) {
      type = BotpressErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = BotpressErrorType.Server
      retryable = true
    }

    return new BotpressError(message, code, type, {
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
    return this.type === BotpressErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === BotpressErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === BotpressErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === BotpressErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === BotpressErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === BotpressErrorType.Server
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
