/**
 * Moz Errors
 *
 * Auto-generated error handling for Moz Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/moz
 */

/**
 * Error type enum
 */
export enum MozErrorType {
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
 * Moz Error class
 *
 * Custom error class for Moz Integration operations.
 */
export class MozError extends Error {
  public readonly code: string | number
  public readonly type: MozErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: MozErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'MozError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, MozError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns MozError instance
   */
  static fromError(error: any): MozError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: MozErrorType; retryable: boolean }> = {
      '401': { type: MozErrorType.Authentication, retryable: false },
      '429': { type: MozErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new MozError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = MozErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = MozErrorType.Authentication
    } else if (statusCode === 403) {
      type = MozErrorType.Authorization
    } else if (statusCode === 404) {
      type = MozErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = MozErrorType.Validation
    } else if (statusCode === 429) {
      type = MozErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = MozErrorType.Server
      retryable = true
    }

    return new MozError(message, code, type, {
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
    return this.type === MozErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === MozErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === MozErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === MozErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === MozErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === MozErrorType.Server
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
