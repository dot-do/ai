/**
 * Shortpixel Errors
 *
 * Auto-generated error handling for Shortpixel Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/shortpixel
 */

/**
 * Error type enum
 */
export enum ShortpixelErrorType {
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
 * Shortpixel Error class
 *
 * Custom error class for Shortpixel Integration operations.
 */
export class ShortpixelError extends Error {
  public readonly code: string | number
  public readonly type: ShortpixelErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: ShortpixelErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'ShortpixelError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ShortpixelError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns ShortpixelError instance
   */
  static fromError(error: any): ShortpixelError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: ShortpixelErrorType; retryable: boolean }> = {
      '401': { type: ShortpixelErrorType.Authentication, retryable: false },
      '429': { type: ShortpixelErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new ShortpixelError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = ShortpixelErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = ShortpixelErrorType.Authentication
    } else if (statusCode === 403) {
      type = ShortpixelErrorType.Authorization
    } else if (statusCode === 404) {
      type = ShortpixelErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = ShortpixelErrorType.Validation
    } else if (statusCode === 429) {
      type = ShortpixelErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = ShortpixelErrorType.Server
      retryable = true
    }

    return new ShortpixelError(message, code, type, {
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
    return this.type === ShortpixelErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === ShortpixelErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === ShortpixelErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === ShortpixelErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === ShortpixelErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === ShortpixelErrorType.Server
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
