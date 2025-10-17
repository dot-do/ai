/**
 * Servicem8 Errors
 *
 * Auto-generated error handling for Servicem8 Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/servicem8
 */

/**
 * Error type enum
 */
export enum Servicem8ErrorType {
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
 * Servicem8 Error class
 *
 * Custom error class for Servicem8 Integration operations.
 */
export class Servicem8Error extends Error {
  public readonly code: string | number
  public readonly type: Servicem8ErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: Servicem8ErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'Servicem8Error'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, Servicem8Error)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns Servicem8Error instance
   */
  static fromError(error: any): Servicem8Error {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: Servicem8ErrorType; retryable: boolean }> = {
      '401': { type: Servicem8ErrorType.Authentication, retryable: false },
      '429': { type: Servicem8ErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new Servicem8Error(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = Servicem8ErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = Servicem8ErrorType.Authentication
    } else if (statusCode === 403) {
      type = Servicem8ErrorType.Authorization
    } else if (statusCode === 404) {
      type = Servicem8ErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = Servicem8ErrorType.Validation
    } else if (statusCode === 429) {
      type = Servicem8ErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = Servicem8ErrorType.Server
      retryable = true
    }

    return new Servicem8Error(message, code, type, {
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
    return this.type === Servicem8ErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === Servicem8ErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === Servicem8ErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === Servicem8ErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === Servicem8ErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === Servicem8ErrorType.Server
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
