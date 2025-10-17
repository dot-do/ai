/**
 * Cats Errors
 *
 * Auto-generated error handling for Cats Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/cats
 */

/**
 * Error type enum
 */
export enum CatsErrorType {
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
 * Cats Error class
 *
 * Custom error class for Cats Integration operations.
 */
export class CatsError extends Error {
  public readonly code: string | number
  public readonly type: CatsErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: CatsErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'CatsError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, CatsError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns CatsError instance
   */
  static fromError(error: any): CatsError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: CatsErrorType; retryable: boolean }> = {
      '401': { type: CatsErrorType.Authentication, retryable: false },
      '429': { type: CatsErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new CatsError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = CatsErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = CatsErrorType.Authentication
    } else if (statusCode === 403) {
      type = CatsErrorType.Authorization
    } else if (statusCode === 404) {
      type = CatsErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = CatsErrorType.Validation
    } else if (statusCode === 429) {
      type = CatsErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = CatsErrorType.Server
      retryable = true
    }

    return new CatsError(message, code, type, {
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
    return this.type === CatsErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === CatsErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === CatsErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === CatsErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === CatsErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === CatsErrorType.Server
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
