/**
 * Re amaze Errors
 *
 * Auto-generated error handling for Re amaze Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/re_amaze
 */

/**
 * Error type enum
 */
export enum ReAmazeErrorType {
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
 * Re amaze Error class
 *
 * Custom error class for Re amaze Integration operations.
 */
export class ReAmazeError extends Error {
  public readonly code: string | number
  public readonly type: ReAmazeErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: ReAmazeErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'ReAmazeError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ReAmazeError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns ReAmazeError instance
   */
  static fromError(error: any): ReAmazeError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: ReAmazeErrorType; retryable: boolean }> = {
      '401': { type: ReAmazeErrorType.Authentication, retryable: false },
      '429': { type: ReAmazeErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new ReAmazeError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = ReAmazeErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = ReAmazeErrorType.Authentication
    } else if (statusCode === 403) {
      type = ReAmazeErrorType.Authorization
    } else if (statusCode === 404) {
      type = ReAmazeErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = ReAmazeErrorType.Validation
    } else if (statusCode === 429) {
      type = ReAmazeErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = ReAmazeErrorType.Server
      retryable = true
    }

    return new ReAmazeError(message, code, type, {
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
    return this.type === ReAmazeErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === ReAmazeErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === ReAmazeErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === ReAmazeErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === ReAmazeErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === ReAmazeErrorType.Server
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
