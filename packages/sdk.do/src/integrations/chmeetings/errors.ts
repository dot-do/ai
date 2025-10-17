/**
 * Chmeetings Errors
 *
 * Auto-generated error handling for Chmeetings Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/chmeetings
 */

/**
 * Error type enum
 */
export enum ChmeetingsErrorType {
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
 * Chmeetings Error class
 *
 * Custom error class for Chmeetings Integration operations.
 */
export class ChmeetingsError extends Error {
  public readonly code: string | number
  public readonly type: ChmeetingsErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: ChmeetingsErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'ChmeetingsError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ChmeetingsError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns ChmeetingsError instance
   */
  static fromError(error: any): ChmeetingsError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: ChmeetingsErrorType; retryable: boolean }> = {
      '401': { type: ChmeetingsErrorType.Authentication, retryable: false },
      '429': { type: ChmeetingsErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new ChmeetingsError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = ChmeetingsErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = ChmeetingsErrorType.Authentication
    } else if (statusCode === 403) {
      type = ChmeetingsErrorType.Authorization
    } else if (statusCode === 404) {
      type = ChmeetingsErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = ChmeetingsErrorType.Validation
    } else if (statusCode === 429) {
      type = ChmeetingsErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = ChmeetingsErrorType.Server
      retryable = true
    }

    return new ChmeetingsError(message, code, type, {
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
    return this.type === ChmeetingsErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === ChmeetingsErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === ChmeetingsErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === ChmeetingsErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === ChmeetingsErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === ChmeetingsErrorType.Server
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
