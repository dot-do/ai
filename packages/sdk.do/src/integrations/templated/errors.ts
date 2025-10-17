/**
 * Templated Errors
 *
 * Auto-generated error handling for Templated Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/templated
 */

/**
 * Error type enum
 */
export enum TemplatedErrorType {
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
 * Templated Error class
 *
 * Custom error class for Templated Integration operations.
 */
export class TemplatedError extends Error {
  public readonly code: string | number
  public readonly type: TemplatedErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: TemplatedErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'TemplatedError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, TemplatedError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns TemplatedError instance
   */
  static fromError(error: any): TemplatedError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: TemplatedErrorType; retryable: boolean }> = {
      '401': { type: TemplatedErrorType.Authentication, retryable: false },
      '429': { type: TemplatedErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new TemplatedError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = TemplatedErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = TemplatedErrorType.Authentication
    } else if (statusCode === 403) {
      type = TemplatedErrorType.Authorization
    } else if (statusCode === 404) {
      type = TemplatedErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = TemplatedErrorType.Validation
    } else if (statusCode === 429) {
      type = TemplatedErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = TemplatedErrorType.Server
      retryable = true
    }

    return new TemplatedError(message, code, type, {
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
    return this.type === TemplatedErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === TemplatedErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === TemplatedErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === TemplatedErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === TemplatedErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === TemplatedErrorType.Server
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
