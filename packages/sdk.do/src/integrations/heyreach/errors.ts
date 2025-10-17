/**
 * Heyreach Errors
 *
 * Auto-generated error handling for Heyreach Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/heyreach
 */

/**
 * Error type enum
 */
export enum HeyreachErrorType {
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
 * Heyreach Error class
 *
 * Custom error class for Heyreach Integration operations.
 */
export class HeyreachError extends Error {
  public readonly code: string | number
  public readonly type: HeyreachErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: HeyreachErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'HeyreachError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, HeyreachError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns HeyreachError instance
   */
  static fromError(error: any): HeyreachError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: HeyreachErrorType; retryable: boolean }> = {
      '401': { type: HeyreachErrorType.Authentication, retryable: false },
      '429': { type: HeyreachErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new HeyreachError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = HeyreachErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = HeyreachErrorType.Authentication
    } else if (statusCode === 403) {
      type = HeyreachErrorType.Authorization
    } else if (statusCode === 404) {
      type = HeyreachErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = HeyreachErrorType.Validation
    } else if (statusCode === 429) {
      type = HeyreachErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = HeyreachErrorType.Server
      retryable = true
    }

    return new HeyreachError(message, code, type, {
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
    return this.type === HeyreachErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === HeyreachErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === HeyreachErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === HeyreachErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === HeyreachErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === HeyreachErrorType.Server
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
