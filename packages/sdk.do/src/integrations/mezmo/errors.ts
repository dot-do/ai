/**
 * Mezmo Errors
 *
 * Auto-generated error handling for Mezmo Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/mezmo
 */

/**
 * Error type enum
 */
export enum MezmoErrorType {
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
 * Mezmo Error class
 *
 * Custom error class for Mezmo Integration operations.
 */
export class MezmoError extends Error {
  public readonly code: string | number
  public readonly type: MezmoErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: MezmoErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'MezmoError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, MezmoError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns MezmoError instance
   */
  static fromError(error: any): MezmoError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: MezmoErrorType; retryable: boolean }> = {
      '401': { type: MezmoErrorType.Authentication, retryable: false },
      '429': { type: MezmoErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new MezmoError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = MezmoErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = MezmoErrorType.Authentication
    } else if (statusCode === 403) {
      type = MezmoErrorType.Authorization
    } else if (statusCode === 404) {
      type = MezmoErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = MezmoErrorType.Validation
    } else if (statusCode === 429) {
      type = MezmoErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = MezmoErrorType.Server
      retryable = true
    }

    return new MezmoError(message, code, type, {
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
    return this.type === MezmoErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === MezmoErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === MezmoErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === MezmoErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === MezmoErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === MezmoErrorType.Server
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
