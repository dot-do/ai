/**
 * Dromo Errors
 *
 * Auto-generated error handling for Dromo Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/dromo
 */

/**
 * Error type enum
 */
export enum DromoErrorType {
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
 * Dromo Error class
 *
 * Custom error class for Dromo Integration operations.
 */
export class DromoError extends Error {
  public readonly code: string | number
  public readonly type: DromoErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: DromoErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'DromoError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, DromoError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns DromoError instance
   */
  static fromError(error: any): DromoError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: DromoErrorType; retryable: boolean }> = {
      '401': { type: DromoErrorType.Authentication, retryable: false },
      '429': { type: DromoErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new DromoError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = DromoErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = DromoErrorType.Authentication
    } else if (statusCode === 403) {
      type = DromoErrorType.Authorization
    } else if (statusCode === 404) {
      type = DromoErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = DromoErrorType.Validation
    } else if (statusCode === 429) {
      type = DromoErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = DromoErrorType.Server
      retryable = true
    }

    return new DromoError(message, code, type, {
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
    return this.type === DromoErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === DromoErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === DromoErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === DromoErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === DromoErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === DromoErrorType.Server
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
