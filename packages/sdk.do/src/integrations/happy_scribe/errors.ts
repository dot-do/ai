/**
 * Happy scribe Errors
 *
 * Auto-generated error handling for Happy scribe Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/happy_scribe
 */

/**
 * Error type enum
 */
export enum HappyScribeErrorType {
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
 * Happy scribe Error class
 *
 * Custom error class for Happy scribe Integration operations.
 */
export class HappyScribeError extends Error {
  public readonly code: string | number
  public readonly type: HappyScribeErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: HappyScribeErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'HappyScribeError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, HappyScribeError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns HappyScribeError instance
   */
  static fromError(error: any): HappyScribeError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: HappyScribeErrorType; retryable: boolean }> = {
      '401': { type: HappyScribeErrorType.Authentication, retryable: false },
      '429': { type: HappyScribeErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new HappyScribeError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = HappyScribeErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = HappyScribeErrorType.Authentication
    } else if (statusCode === 403) {
      type = HappyScribeErrorType.Authorization
    } else if (statusCode === 404) {
      type = HappyScribeErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = HappyScribeErrorType.Validation
    } else if (statusCode === 429) {
      type = HappyScribeErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = HappyScribeErrorType.Server
      retryable = true
    }

    return new HappyScribeError(message, code, type, {
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
    return this.type === HappyScribeErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === HappyScribeErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === HappyScribeErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === HappyScribeErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === HappyScribeErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === HappyScribeErrorType.Server
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
