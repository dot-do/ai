/**
 * Yandex Errors
 *
 * Auto-generated error handling for Yandex Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/yandex
 */

/**
 * Error type enum
 */
export enum YandexErrorType {
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
 * Yandex Error class
 *
 * Custom error class for Yandex Integration operations.
 */
export class YandexError extends Error {
  public readonly code: string | number
  public readonly type: YandexErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: YandexErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'YandexError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, YandexError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns YandexError instance
   */
  static fromError(error: any): YandexError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: YandexErrorType; retryable: boolean }> = {
      '401': { type: YandexErrorType.Authentication, retryable: false },
      '429': { type: YandexErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new YandexError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = YandexErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = YandexErrorType.Authentication
    } else if (statusCode === 403) {
      type = YandexErrorType.Authorization
    } else if (statusCode === 404) {
      type = YandexErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = YandexErrorType.Validation
    } else if (statusCode === 429) {
      type = YandexErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = YandexErrorType.Server
      retryable = true
    }

    return new YandexError(message, code, type, {
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
    return this.type === YandexErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === YandexErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === YandexErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === YandexErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === YandexErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === YandexErrorType.Server
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
