/**
 * Bugsnag Errors
 *
 * Auto-generated error handling for Bugsnag Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/bugsnag
 */

/**
 * Error type enum
 */
export enum BugsnagErrorType {
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
 * Bugsnag Error class
 *
 * Custom error class for Bugsnag Integration operations.
 */
export class BugsnagError extends Error {
  public readonly code: string | number
  public readonly type: BugsnagErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: BugsnagErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'BugsnagError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, BugsnagError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns BugsnagError instance
   */
  static fromError(error: any): BugsnagError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: BugsnagErrorType; retryable: boolean }> = {
      '401': { type: BugsnagErrorType.Authentication, retryable: false },
      '429': { type: BugsnagErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new BugsnagError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = BugsnagErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = BugsnagErrorType.Authentication
    } else if (statusCode === 403) {
      type = BugsnagErrorType.Authorization
    } else if (statusCode === 404) {
      type = BugsnagErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = BugsnagErrorType.Validation
    } else if (statusCode === 429) {
      type = BugsnagErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = BugsnagErrorType.Server
      retryable = true
    }

    return new BugsnagError(message, code, type, {
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
    return this.type === BugsnagErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === BugsnagErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === BugsnagErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === BugsnagErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === BugsnagErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === BugsnagErrorType.Server
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
