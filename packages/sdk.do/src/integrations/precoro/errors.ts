/**
 * Precoro Errors
 *
 * Auto-generated error handling for Precoro Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/precoro
 */

/**
 * Error type enum
 */
export enum PrecoroErrorType {
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
 * Precoro Error class
 *
 * Custom error class for Precoro Integration operations.
 */
export class PrecoroError extends Error {
  public readonly code: string | number
  public readonly type: PrecoroErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: PrecoroErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'PrecoroError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, PrecoroError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns PrecoroError instance
   */
  static fromError(error: any): PrecoroError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: PrecoroErrorType; retryable: boolean }> = {
      '401': { type: PrecoroErrorType.Authentication, retryable: false },
      '429': { type: PrecoroErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new PrecoroError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = PrecoroErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = PrecoroErrorType.Authentication
    } else if (statusCode === 403) {
      type = PrecoroErrorType.Authorization
    } else if (statusCode === 404) {
      type = PrecoroErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = PrecoroErrorType.Validation
    } else if (statusCode === 429) {
      type = PrecoroErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = PrecoroErrorType.Server
      retryable = true
    }

    return new PrecoroError(message, code, type, {
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
    return this.type === PrecoroErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === PrecoroErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === PrecoroErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === PrecoroErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === PrecoroErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === PrecoroErrorType.Server
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
