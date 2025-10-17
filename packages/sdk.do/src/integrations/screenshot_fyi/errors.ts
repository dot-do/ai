/**
 * Screenshot fyi Errors
 *
 * Auto-generated error handling for Screenshot fyi Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/screenshot_fyi
 */

/**
 * Error type enum
 */
export enum ScreenshotFyiErrorType {
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
 * Screenshot fyi Error class
 *
 * Custom error class for Screenshot fyi Integration operations.
 */
export class ScreenshotFyiError extends Error {
  public readonly code: string | number
  public readonly type: ScreenshotFyiErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: ScreenshotFyiErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'ScreenshotFyiError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ScreenshotFyiError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns ScreenshotFyiError instance
   */
  static fromError(error: any): ScreenshotFyiError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: ScreenshotFyiErrorType; retryable: boolean }> = {
      '401': { type: ScreenshotFyiErrorType.Authentication, retryable: false },
      '429': { type: ScreenshotFyiErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new ScreenshotFyiError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = ScreenshotFyiErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = ScreenshotFyiErrorType.Authentication
    } else if (statusCode === 403) {
      type = ScreenshotFyiErrorType.Authorization
    } else if (statusCode === 404) {
      type = ScreenshotFyiErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = ScreenshotFyiErrorType.Validation
    } else if (statusCode === 429) {
      type = ScreenshotFyiErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = ScreenshotFyiErrorType.Server
      retryable = true
    }

    return new ScreenshotFyiError(message, code, type, {
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
    return this.type === ScreenshotFyiErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === ScreenshotFyiErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === ScreenshotFyiErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === ScreenshotFyiErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === ScreenshotFyiErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === ScreenshotFyiErrorType.Server
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
