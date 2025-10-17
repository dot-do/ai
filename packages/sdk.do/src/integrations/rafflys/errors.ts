/**
 * Rafflys Errors
 *
 * Auto-generated error handling for Rafflys Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/rafflys
 */

/**
 * Error type enum
 */
export enum RafflysErrorType {
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
 * Rafflys Error class
 *
 * Custom error class for Rafflys Integration operations.
 */
export class RafflysError extends Error {
  public readonly code: string | number
  public readonly type: RafflysErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: RafflysErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'RafflysError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, RafflysError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns RafflysError instance
   */
  static fromError(error: any): RafflysError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: RafflysErrorType; retryable: boolean }> = {
      '401': { type: RafflysErrorType.Authentication, retryable: false },
      '429': { type: RafflysErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new RafflysError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = RafflysErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = RafflysErrorType.Authentication
    } else if (statusCode === 403) {
      type = RafflysErrorType.Authorization
    } else if (statusCode === 404) {
      type = RafflysErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = RafflysErrorType.Validation
    } else if (statusCode === 429) {
      type = RafflysErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = RafflysErrorType.Server
      retryable = true
    }

    return new RafflysError(message, code, type, {
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
    return this.type === RafflysErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === RafflysErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === RafflysErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === RafflysErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === RafflysErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === RafflysErrorType.Server
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
