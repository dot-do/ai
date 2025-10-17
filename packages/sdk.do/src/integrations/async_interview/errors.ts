/**
 * Async interview Errors
 *
 * Auto-generated error handling for Async interview Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/async_interview
 */

/**
 * Error type enum
 */
export enum AsyncInterviewErrorType {
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
 * Async interview Error class
 *
 * Custom error class for Async interview Integration operations.
 */
export class AsyncInterviewError extends Error {
  public readonly code: string | number
  public readonly type: AsyncInterviewErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: AsyncInterviewErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'AsyncInterviewError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AsyncInterviewError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns AsyncInterviewError instance
   */
  static fromError(error: any): AsyncInterviewError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: AsyncInterviewErrorType; retryable: boolean }> = {
      '401': { type: AsyncInterviewErrorType.Authentication, retryable: false },
      '429': { type: AsyncInterviewErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new AsyncInterviewError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = AsyncInterviewErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = AsyncInterviewErrorType.Authentication
    } else if (statusCode === 403) {
      type = AsyncInterviewErrorType.Authorization
    } else if (statusCode === 404) {
      type = AsyncInterviewErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = AsyncInterviewErrorType.Validation
    } else if (statusCode === 429) {
      type = AsyncInterviewErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = AsyncInterviewErrorType.Server
      retryable = true
    }

    return new AsyncInterviewError(message, code, type, {
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
    return this.type === AsyncInterviewErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === AsyncInterviewErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === AsyncInterviewErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === AsyncInterviewErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === AsyncInterviewErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === AsyncInterviewErrorType.Server
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
