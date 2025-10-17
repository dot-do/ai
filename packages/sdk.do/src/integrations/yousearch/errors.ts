/**
 * Yousearch Errors
 *
 * Auto-generated error handling for Yousearch Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/yousearch
 */

/**
 * Error type enum
 */
export enum YousearchErrorType {
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
 * Yousearch Error class
 *
 * Custom error class for Yousearch Integration operations.
 */
export class YousearchError extends Error {
  public readonly code: string | number
  public readonly type: YousearchErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: YousearchErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'YousearchError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, YousearchError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns YousearchError instance
   */
  static fromError(error: any): YousearchError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: YousearchErrorType; retryable: boolean }> = {
      '401': { type: YousearchErrorType.Authentication, retryable: false },
      '429': { type: YousearchErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new YousearchError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = YousearchErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = YousearchErrorType.Authentication
    } else if (statusCode === 403) {
      type = YousearchErrorType.Authorization
    } else if (statusCode === 404) {
      type = YousearchErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = YousearchErrorType.Validation
    } else if (statusCode === 429) {
      type = YousearchErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = YousearchErrorType.Server
      retryable = true
    }

    return new YousearchError(message, code, type, {
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
    return this.type === YousearchErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === YousearchErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === YousearchErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === YousearchErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === YousearchErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === YousearchErrorType.Server
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
