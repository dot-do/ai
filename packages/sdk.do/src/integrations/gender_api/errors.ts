/**
 * Gender api Errors
 *
 * Auto-generated error handling for Gender api Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/gender_api
 */

/**
 * Error type enum
 */
export enum GenderApiErrorType {
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
 * Gender api Error class
 *
 * Custom error class for Gender api Integration operations.
 */
export class GenderApiError extends Error {
  public readonly code: string | number
  public readonly type: GenderApiErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: GenderApiErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'GenderApiError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, GenderApiError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns GenderApiError instance
   */
  static fromError(error: any): GenderApiError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: GenderApiErrorType; retryable: boolean }> = {
      '401': { type: GenderApiErrorType.Authentication, retryable: false },
      '429': { type: GenderApiErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new GenderApiError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = GenderApiErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = GenderApiErrorType.Authentication
    } else if (statusCode === 403) {
      type = GenderApiErrorType.Authorization
    } else if (statusCode === 404) {
      type = GenderApiErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = GenderApiErrorType.Validation
    } else if (statusCode === 429) {
      type = GenderApiErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = GenderApiErrorType.Server
      retryable = true
    }

    return new GenderApiError(message, code, type, {
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
    return this.type === GenderApiErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === GenderApiErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === GenderApiErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === GenderApiErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === GenderApiErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === GenderApiErrorType.Server
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
