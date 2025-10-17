/**
 * Dynamics365 Errors
 *
 * Auto-generated error handling for Dynamics365 Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/dynamics365
 */

/**
 * Error type enum
 */
export enum Dynamics365ErrorType {
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
 * Dynamics365 Error class
 *
 * Custom error class for Dynamics365 Integration operations.
 */
export class Dynamics365Error extends Error {
  public readonly code: string | number
  public readonly type: Dynamics365ErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: Dynamics365ErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'Dynamics365Error'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, Dynamics365Error)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns Dynamics365Error instance
   */
  static fromError(error: any): Dynamics365Error {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: Dynamics365ErrorType; retryable: boolean }> = {
      '401': { type: Dynamics365ErrorType.Authentication, retryable: false },
      '429': { type: Dynamics365ErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new Dynamics365Error(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = Dynamics365ErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = Dynamics365ErrorType.Authentication
    } else if (statusCode === 403) {
      type = Dynamics365ErrorType.Authorization
    } else if (statusCode === 404) {
      type = Dynamics365ErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = Dynamics365ErrorType.Validation
    } else if (statusCode === 429) {
      type = Dynamics365ErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = Dynamics365ErrorType.Server
      retryable = true
    }

    return new Dynamics365Error(message, code, type, {
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
    return this.type === Dynamics365ErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === Dynamics365ErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === Dynamics365ErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === Dynamics365ErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === Dynamics365ErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === Dynamics365ErrorType.Server
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
