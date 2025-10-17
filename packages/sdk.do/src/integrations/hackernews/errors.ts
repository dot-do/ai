/**
 * Hackernews Errors
 *
 * Auto-generated error handling for Hackernews Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/hackernews
 */

/**
 * Error type enum
 */
export enum HackernewsErrorType {
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
 * Hackernews Error class
 *
 * Custom error class for Hackernews Integration operations.
 */
export class HackernewsError extends Error {
  public readonly code: string | number
  public readonly type: HackernewsErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: HackernewsErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'HackernewsError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, HackernewsError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns HackernewsError instance
   */
  static fromError(error: any): HackernewsError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: HackernewsErrorType; retryable: boolean }> = {
      '401': { type: HackernewsErrorType.Authentication, retryable: false },
      '429': { type: HackernewsErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new HackernewsError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = HackernewsErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = HackernewsErrorType.Authentication
    } else if (statusCode === 403) {
      type = HackernewsErrorType.Authorization
    } else if (statusCode === 404) {
      type = HackernewsErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = HackernewsErrorType.Validation
    } else if (statusCode === 429) {
      type = HackernewsErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = HackernewsErrorType.Server
      retryable = true
    }

    return new HackernewsError(message, code, type, {
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
    return this.type === HackernewsErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === HackernewsErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === HackernewsErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === HackernewsErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === HackernewsErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === HackernewsErrorType.Server
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
