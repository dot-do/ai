/**
 * Terminus Errors
 *
 * Auto-generated error handling for Terminus Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/terminus
 */

/**
 * Error type enum
 */
export enum TerminusErrorType {
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
 * Terminus Error class
 *
 * Custom error class for Terminus Integration operations.
 */
export class TerminusError extends Error {
  public readonly code: string | number
  public readonly type: TerminusErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: TerminusErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'TerminusError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, TerminusError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns TerminusError instance
   */
  static fromError(error: any): TerminusError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: TerminusErrorType; retryable: boolean }> = {
      '401': { type: TerminusErrorType.Authentication, retryable: false },
      '429': { type: TerminusErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new TerminusError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = TerminusErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = TerminusErrorType.Authentication
    } else if (statusCode === 403) {
      type = TerminusErrorType.Authorization
    } else if (statusCode === 404) {
      type = TerminusErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = TerminusErrorType.Validation
    } else if (statusCode === 429) {
      type = TerminusErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = TerminusErrorType.Server
      retryable = true
    }

    return new TerminusError(message, code, type, {
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
    return this.type === TerminusErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === TerminusErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === TerminusErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === TerminusErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === TerminusErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === TerminusErrorType.Server
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
