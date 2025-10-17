/**
 * Bubble Errors
 *
 * Auto-generated error handling for Bubble Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/bubble
 */

/**
 * Error type enum
 */
export enum BubbleErrorType {
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
 * Bubble Error class
 *
 * Custom error class for Bubble Integration operations.
 */
export class BubbleError extends Error {
  public readonly code: string | number
  public readonly type: BubbleErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: BubbleErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'BubbleError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, BubbleError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns BubbleError instance
   */
  static fromError(error: any): BubbleError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: BubbleErrorType; retryable: boolean }> = {
      '401': { type: BubbleErrorType.Authentication, retryable: false },
      '429': { type: BubbleErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new BubbleError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = BubbleErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = BubbleErrorType.Authentication
    } else if (statusCode === 403) {
      type = BubbleErrorType.Authorization
    } else if (statusCode === 404) {
      type = BubbleErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = BubbleErrorType.Validation
    } else if (statusCode === 429) {
      type = BubbleErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = BubbleErrorType.Server
      retryable = true
    }

    return new BubbleError(message, code, type, {
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
    return this.type === BubbleErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === BubbleErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === BubbleErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === BubbleErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === BubbleErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === BubbleErrorType.Server
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
