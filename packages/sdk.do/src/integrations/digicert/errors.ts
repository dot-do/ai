/**
 * Digicert Errors
 *
 * Auto-generated error handling for Digicert Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/digicert
 */

/**
 * Error type enum
 */
export enum DigicertErrorType {
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
 * Digicert Error class
 *
 * Custom error class for Digicert Integration operations.
 */
export class DigicertError extends Error {
  public readonly code: string | number
  public readonly type: DigicertErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: DigicertErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'DigicertError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, DigicertError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns DigicertError instance
   */
  static fromError(error: any): DigicertError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: DigicertErrorType; retryable: boolean }> = {
      '401': { type: DigicertErrorType.Authentication, retryable: false },
      '429': { type: DigicertErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new DigicertError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = DigicertErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = DigicertErrorType.Authentication
    } else if (statusCode === 403) {
      type = DigicertErrorType.Authorization
    } else if (statusCode === 404) {
      type = DigicertErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = DigicertErrorType.Validation
    } else if (statusCode === 429) {
      type = DigicertErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = DigicertErrorType.Server
      retryable = true
    }

    return new DigicertError(message, code, type, {
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
    return this.type === DigicertErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === DigicertErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === DigicertErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === DigicertErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === DigicertErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === DigicertErrorType.Server
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
