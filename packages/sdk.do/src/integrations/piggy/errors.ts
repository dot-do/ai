/**
 * Piggy Errors
 *
 * Auto-generated error handling for Piggy Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/piggy
 */

/**
 * Error type enum
 */
export enum PiggyErrorType {
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
 * Piggy Error class
 *
 * Custom error class for Piggy Integration operations.
 */
export class PiggyError extends Error {
  public readonly code: string | number
  public readonly type: PiggyErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: PiggyErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'PiggyError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, PiggyError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns PiggyError instance
   */
  static fromError(error: any): PiggyError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: PiggyErrorType; retryable: boolean }> = {
      '401': { type: PiggyErrorType.Authentication, retryable: false },
      '429': { type: PiggyErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new PiggyError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = PiggyErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = PiggyErrorType.Authentication
    } else if (statusCode === 403) {
      type = PiggyErrorType.Authorization
    } else if (statusCode === 404) {
      type = PiggyErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = PiggyErrorType.Validation
    } else if (statusCode === 429) {
      type = PiggyErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = PiggyErrorType.Server
      retryable = true
    }

    return new PiggyError(message, code, type, {
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
    return this.type === PiggyErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === PiggyErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === PiggyErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === PiggyErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === PiggyErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === PiggyErrorType.Server
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
