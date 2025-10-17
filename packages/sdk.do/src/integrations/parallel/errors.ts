/**
 * Parallel Errors
 *
 * Auto-generated error handling for Parallel Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/parallel
 */

/**
 * Error type enum
 */
export enum ParallelErrorType {
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
 * Parallel Error class
 *
 * Custom error class for Parallel Integration operations.
 */
export class ParallelError extends Error {
  public readonly code: string | number
  public readonly type: ParallelErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: ParallelErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'ParallelError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ParallelError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns ParallelError instance
   */
  static fromError(error: any): ParallelError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: ParallelErrorType; retryable: boolean }> = {
      '401': { type: ParallelErrorType.Authentication, retryable: false },
      '429': { type: ParallelErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new ParallelError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = ParallelErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = ParallelErrorType.Authentication
    } else if (statusCode === 403) {
      type = ParallelErrorType.Authorization
    } else if (statusCode === 404) {
      type = ParallelErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = ParallelErrorType.Validation
    } else if (statusCode === 429) {
      type = ParallelErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = ParallelErrorType.Server
      retryable = true
    }

    return new ParallelError(message, code, type, {
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
    return this.type === ParallelErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === ParallelErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === ParallelErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === ParallelErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === ParallelErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === ParallelErrorType.Server
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
