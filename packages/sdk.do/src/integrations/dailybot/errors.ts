/**
 * Dailybot Errors
 *
 * Auto-generated error handling for Dailybot Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/dailybot
 */

/**
 * Error type enum
 */
export enum DailybotErrorType {
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
 * Dailybot Error class
 *
 * Custom error class for Dailybot Integration operations.
 */
export class DailybotError extends Error {
  public readonly code: string | number
  public readonly type: DailybotErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: DailybotErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'DailybotError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, DailybotError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns DailybotError instance
   */
  static fromError(error: any): DailybotError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: DailybotErrorType; retryable: boolean }> = {
      '401': { type: DailybotErrorType.Authentication, retryable: false },
      '429': { type: DailybotErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new DailybotError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = DailybotErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = DailybotErrorType.Authentication
    } else if (statusCode === 403) {
      type = DailybotErrorType.Authorization
    } else if (statusCode === 404) {
      type = DailybotErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = DailybotErrorType.Validation
    } else if (statusCode === 429) {
      type = DailybotErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = DailybotErrorType.Server
      retryable = true
    }

    return new DailybotError(message, code, type, {
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
    return this.type === DailybotErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === DailybotErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === DailybotErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === DailybotErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === DailybotErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === DailybotErrorType.Server
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
