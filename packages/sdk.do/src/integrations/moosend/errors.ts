/**
 * Moosend Errors
 *
 * Auto-generated error handling for Moosend Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/moosend
 */

/**
 * Error type enum
 */
export enum MoosendErrorType {
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
 * Moosend Error class
 *
 * Custom error class for Moosend Integration operations.
 */
export class MoosendError extends Error {
  public readonly code: string | number
  public readonly type: MoosendErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: MoosendErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'MoosendError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, MoosendError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns MoosendError instance
   */
  static fromError(error: any): MoosendError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: MoosendErrorType; retryable: boolean }> = {
      '401': { type: MoosendErrorType.Authentication, retryable: false },
      '429': { type: MoosendErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new MoosendError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = MoosendErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = MoosendErrorType.Authentication
    } else if (statusCode === 403) {
      type = MoosendErrorType.Authorization
    } else if (statusCode === 404) {
      type = MoosendErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = MoosendErrorType.Validation
    } else if (statusCode === 429) {
      type = MoosendErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = MoosendErrorType.Server
      retryable = true
    }

    return new MoosendError(message, code, type, {
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
    return this.type === MoosendErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === MoosendErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === MoosendErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === MoosendErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === MoosendErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === MoosendErrorType.Server
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
