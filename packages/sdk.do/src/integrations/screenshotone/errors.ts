/**
 * Screenshotone Errors
 *
 * Auto-generated error handling for Screenshotone Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/screenshotone
 */

/**
 * Error type enum
 */
export enum ScreenshotoneErrorType {
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
 * Screenshotone Error class
 *
 * Custom error class for Screenshotone Integration operations.
 */
export class ScreenshotoneError extends Error {
  public readonly code: string | number
  public readonly type: ScreenshotoneErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: ScreenshotoneErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'ScreenshotoneError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ScreenshotoneError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns ScreenshotoneError instance
   */
  static fromError(error: any): ScreenshotoneError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: ScreenshotoneErrorType; retryable: boolean }> = {
      '401': { type: ScreenshotoneErrorType.Authentication, retryable: false },
      '429': { type: ScreenshotoneErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new ScreenshotoneError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = ScreenshotoneErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = ScreenshotoneErrorType.Authentication
    } else if (statusCode === 403) {
      type = ScreenshotoneErrorType.Authorization
    } else if (statusCode === 404) {
      type = ScreenshotoneErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = ScreenshotoneErrorType.Validation
    } else if (statusCode === 429) {
      type = ScreenshotoneErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = ScreenshotoneErrorType.Server
      retryable = true
    }

    return new ScreenshotoneError(message, code, type, {
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
    return this.type === ScreenshotoneErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === ScreenshotoneErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === ScreenshotoneErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === ScreenshotoneErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === ScreenshotoneErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === ScreenshotoneErrorType.Server
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
