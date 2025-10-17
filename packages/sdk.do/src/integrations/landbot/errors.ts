/**
 * Landbot Errors
 *
 * Auto-generated error handling for Landbot Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/landbot
 */

/**
 * Error type enum
 */
export enum LandbotErrorType {
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
 * Landbot Error class
 *
 * Custom error class for Landbot Integration operations.
 */
export class LandbotError extends Error {
  public readonly code: string | number
  public readonly type: LandbotErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: LandbotErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'LandbotError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, LandbotError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns LandbotError instance
   */
  static fromError(error: any): LandbotError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: LandbotErrorType; retryable: boolean }> = {
      '401': { type: LandbotErrorType.Authentication, retryable: false },
      '429': { type: LandbotErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new LandbotError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = LandbotErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = LandbotErrorType.Authentication
    } else if (statusCode === 403) {
      type = LandbotErrorType.Authorization
    } else if (statusCode === 404) {
      type = LandbotErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = LandbotErrorType.Validation
    } else if (statusCode === 429) {
      type = LandbotErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = LandbotErrorType.Server
      retryable = true
    }

    return new LandbotError(message, code, type, {
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
    return this.type === LandbotErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === LandbotErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === LandbotErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === LandbotErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === LandbotErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === LandbotErrorType.Server
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
