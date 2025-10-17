/**
 * Ravenseotools Errors
 *
 * Auto-generated error handling for Ravenseotools Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/ravenseotools
 */

/**
 * Error type enum
 */
export enum RavenseotoolsErrorType {
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
 * Ravenseotools Error class
 *
 * Custom error class for Ravenseotools Integration operations.
 */
export class RavenseotoolsError extends Error {
  public readonly code: string | number
  public readonly type: RavenseotoolsErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: RavenseotoolsErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'RavenseotoolsError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, RavenseotoolsError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns RavenseotoolsError instance
   */
  static fromError(error: any): RavenseotoolsError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: RavenseotoolsErrorType; retryable: boolean }> = {
      '401': { type: RavenseotoolsErrorType.Authentication, retryable: false },
      '429': { type: RavenseotoolsErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new RavenseotoolsError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = RavenseotoolsErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = RavenseotoolsErrorType.Authentication
    } else if (statusCode === 403) {
      type = RavenseotoolsErrorType.Authorization
    } else if (statusCode === 404) {
      type = RavenseotoolsErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = RavenseotoolsErrorType.Validation
    } else if (statusCode === 429) {
      type = RavenseotoolsErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = RavenseotoolsErrorType.Server
      retryable = true
    }

    return new RavenseotoolsError(message, code, type, {
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
    return this.type === RavenseotoolsErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === RavenseotoolsErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === RavenseotoolsErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === RavenseotoolsErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === RavenseotoolsErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === RavenseotoolsErrorType.Server
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
