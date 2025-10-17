/**
 * Genderize Errors
 *
 * Auto-generated error handling for Genderize Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/genderize
 */

/**
 * Error type enum
 */
export enum GenderizeErrorType {
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
 * Genderize Error class
 *
 * Custom error class for Genderize Integration operations.
 */
export class GenderizeError extends Error {
  public readonly code: string | number
  public readonly type: GenderizeErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: GenderizeErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'GenderizeError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, GenderizeError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns GenderizeError instance
   */
  static fromError(error: any): GenderizeError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: GenderizeErrorType; retryable: boolean }> = {
      '401': { type: GenderizeErrorType.Authentication, retryable: false },
      '429': { type: GenderizeErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new GenderizeError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = GenderizeErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = GenderizeErrorType.Authentication
    } else if (statusCode === 403) {
      type = GenderizeErrorType.Authorization
    } else if (statusCode === 404) {
      type = GenderizeErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = GenderizeErrorType.Validation
    } else if (statusCode === 429) {
      type = GenderizeErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = GenderizeErrorType.Server
      retryable = true
    }

    return new GenderizeError(message, code, type, {
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
    return this.type === GenderizeErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === GenderizeErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === GenderizeErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === GenderizeErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === GenderizeErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === GenderizeErrorType.Server
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
