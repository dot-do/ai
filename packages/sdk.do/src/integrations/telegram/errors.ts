/**
 * Telegram Errors
 *
 * Auto-generated error handling for Telegram Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/telegram
 */

/**
 * Error type enum
 */
export enum TelegramErrorType {
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
 * Telegram Error class
 *
 * Custom error class for Telegram Integration operations.
 */
export class TelegramError extends Error {
  public readonly code: string | number
  public readonly type: TelegramErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: TelegramErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'TelegramError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, TelegramError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns TelegramError instance
   */
  static fromError(error: any): TelegramError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: TelegramErrorType; retryable: boolean }> = {
      '401': { type: TelegramErrorType.Authentication, retryable: false },
      '429': { type: TelegramErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new TelegramError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = TelegramErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = TelegramErrorType.Authentication
    } else if (statusCode === 403) {
      type = TelegramErrorType.Authorization
    } else if (statusCode === 404) {
      type = TelegramErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = TelegramErrorType.Validation
    } else if (statusCode === 429) {
      type = TelegramErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = TelegramErrorType.Server
      retryable = true
    }

    return new TelegramError(message, code, type, {
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
    return this.type === TelegramErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === TelegramErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === TelegramErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === TelegramErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === TelegramErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === TelegramErrorType.Server
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
