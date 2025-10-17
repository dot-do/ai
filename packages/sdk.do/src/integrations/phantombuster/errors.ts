/**
 * Phantombuster Errors
 *
 * Auto-generated error handling for Phantombuster Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/phantombuster
 */

/**
 * Error type enum
 */
export enum PhantombusterErrorType {
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
 * Phantombuster Error class
 *
 * Custom error class for Phantombuster Integration operations.
 */
export class PhantombusterError extends Error {
  public readonly code: string | number
  public readonly type: PhantombusterErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: PhantombusterErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'PhantombusterError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, PhantombusterError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns PhantombusterError instance
   */
  static fromError(error: any): PhantombusterError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: PhantombusterErrorType; retryable: boolean }> = {
      '401': { type: PhantombusterErrorType.Authentication, retryable: false },
      '429': { type: PhantombusterErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new PhantombusterError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = PhantombusterErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = PhantombusterErrorType.Authentication
    } else if (statusCode === 403) {
      type = PhantombusterErrorType.Authorization
    } else if (statusCode === 404) {
      type = PhantombusterErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = PhantombusterErrorType.Validation
    } else if (statusCode === 429) {
      type = PhantombusterErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = PhantombusterErrorType.Server
      retryable = true
    }

    return new PhantombusterError(message, code, type, {
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
    return this.type === PhantombusterErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === PhantombusterErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === PhantombusterErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === PhantombusterErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === PhantombusterErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === PhantombusterErrorType.Server
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
