/**
 * Raisely Errors
 *
 * Auto-generated error handling for Raisely Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/raisely
 */

/**
 * Error type enum
 */
export enum RaiselyErrorType {
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
 * Raisely Error class
 *
 * Custom error class for Raisely Integration operations.
 */
export class RaiselyError extends Error {
  public readonly code: string | number
  public readonly type: RaiselyErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: RaiselyErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'RaiselyError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, RaiselyError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns RaiselyError instance
   */
  static fromError(error: any): RaiselyError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: RaiselyErrorType; retryable: boolean }> = {
      '401': { type: RaiselyErrorType.Authentication, retryable: false },
      '429': { type: RaiselyErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new RaiselyError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = RaiselyErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = RaiselyErrorType.Authentication
    } else if (statusCode === 403) {
      type = RaiselyErrorType.Authorization
    } else if (statusCode === 404) {
      type = RaiselyErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = RaiselyErrorType.Validation
    } else if (statusCode === 429) {
      type = RaiselyErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = RaiselyErrorType.Server
      retryable = true
    }

    return new RaiselyError(message, code, type, {
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
    return this.type === RaiselyErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === RaiselyErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === RaiselyErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === RaiselyErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === RaiselyErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === RaiselyErrorType.Server
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
