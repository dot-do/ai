/**
 * More trees Errors
 *
 * Auto-generated error handling for More trees Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/more_trees
 */

/**
 * Error type enum
 */
export enum MoreTreesErrorType {
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
 * More trees Error class
 *
 * Custom error class for More trees Integration operations.
 */
export class MoreTreesError extends Error {
  public readonly code: string | number
  public readonly type: MoreTreesErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: MoreTreesErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'MoreTreesError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, MoreTreesError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns MoreTreesError instance
   */
  static fromError(error: any): MoreTreesError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: MoreTreesErrorType; retryable: boolean }> = {
      '401': { type: MoreTreesErrorType.Authentication, retryable: false },
      '429': { type: MoreTreesErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new MoreTreesError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = MoreTreesErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = MoreTreesErrorType.Authentication
    } else if (statusCode === 403) {
      type = MoreTreesErrorType.Authorization
    } else if (statusCode === 404) {
      type = MoreTreesErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = MoreTreesErrorType.Validation
    } else if (statusCode === 429) {
      type = MoreTreesErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = MoreTreesErrorType.Server
      retryable = true
    }

    return new MoreTreesError(message, code, type, {
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
    return this.type === MoreTreesErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === MoreTreesErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === MoreTreesErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === MoreTreesErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === MoreTreesErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === MoreTreesErrorType.Server
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
