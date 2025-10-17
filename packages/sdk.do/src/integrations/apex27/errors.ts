/**
 * Apex27 Errors
 *
 * Auto-generated error handling for Apex27 Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/apex27
 */

/**
 * Error type enum
 */
export enum Apex27ErrorType {
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
 * Apex27 Error class
 *
 * Custom error class for Apex27 Integration operations.
 */
export class Apex27Error extends Error {
  public readonly code: string | number
  public readonly type: Apex27ErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: Apex27ErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'Apex27Error'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, Apex27Error)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns Apex27Error instance
   */
  static fromError(error: any): Apex27Error {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: Apex27ErrorType; retryable: boolean }> = {
      '401': { type: Apex27ErrorType.Authentication, retryable: false },
      '429': { type: Apex27ErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new Apex27Error(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = Apex27ErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = Apex27ErrorType.Authentication
    } else if (statusCode === 403) {
      type = Apex27ErrorType.Authorization
    } else if (statusCode === 404) {
      type = Apex27ErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = Apex27ErrorType.Validation
    } else if (statusCode === 429) {
      type = Apex27ErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = Apex27ErrorType.Server
      retryable = true
    }

    return new Apex27Error(message, code, type, {
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
    return this.type === Apex27ErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === Apex27ErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === Apex27ErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === Apex27ErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === Apex27ErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === Apex27ErrorType.Server
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
