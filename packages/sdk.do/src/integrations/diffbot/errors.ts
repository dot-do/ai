/**
 * Diffbot Errors
 *
 * Auto-generated error handling for Diffbot Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/diffbot
 */

/**
 * Error type enum
 */
export enum DiffbotErrorType {
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
 * Diffbot Error class
 *
 * Custom error class for Diffbot Integration operations.
 */
export class DiffbotError extends Error {
  public readonly code: string | number
  public readonly type: DiffbotErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: DiffbotErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'DiffbotError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, DiffbotError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns DiffbotError instance
   */
  static fromError(error: any): DiffbotError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: DiffbotErrorType; retryable: boolean }> = {
      '401': { type: DiffbotErrorType.Authentication, retryable: false },
      '429': { type: DiffbotErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new DiffbotError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = DiffbotErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = DiffbotErrorType.Authentication
    } else if (statusCode === 403) {
      type = DiffbotErrorType.Authorization
    } else if (statusCode === 404) {
      type = DiffbotErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = DiffbotErrorType.Validation
    } else if (statusCode === 429) {
      type = DiffbotErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = DiffbotErrorType.Server
      retryable = true
    }

    return new DiffbotError(message, code, type, {
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
    return this.type === DiffbotErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === DiffbotErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === DiffbotErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === DiffbotErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === DiffbotErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === DiffbotErrorType.Server
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
