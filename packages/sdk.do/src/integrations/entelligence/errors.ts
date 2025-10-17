/**
 * Entelligence Errors
 *
 * Auto-generated error handling for Entelligence Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/entelligence
 */

/**
 * Error type enum
 */
export enum EntelligenceErrorType {
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
 * Entelligence Error class
 *
 * Custom error class for Entelligence Integration operations.
 */
export class EntelligenceError extends Error {
  public readonly code: string | number
  public readonly type: EntelligenceErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: EntelligenceErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'EntelligenceError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, EntelligenceError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns EntelligenceError instance
   */
  static fromError(error: any): EntelligenceError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: EntelligenceErrorType; retryable: boolean }> = {
      '401': { type: EntelligenceErrorType.Authentication, retryable: false },
      '429': { type: EntelligenceErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new EntelligenceError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = EntelligenceErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = EntelligenceErrorType.Authentication
    } else if (statusCode === 403) {
      type = EntelligenceErrorType.Authorization
    } else if (statusCode === 404) {
      type = EntelligenceErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = EntelligenceErrorType.Validation
    } else if (statusCode === 429) {
      type = EntelligenceErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = EntelligenceErrorType.Server
      retryable = true
    }

    return new EntelligenceError(message, code, type, {
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
    return this.type === EntelligenceErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === EntelligenceErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === EntelligenceErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === EntelligenceErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === EntelligenceErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === EntelligenceErrorType.Server
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
