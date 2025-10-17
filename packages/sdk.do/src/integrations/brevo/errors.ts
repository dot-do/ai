/**
 * Brevo Errors
 *
 * Auto-generated error handling for Brevo Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/brevo
 */

/**
 * Error type enum
 */
export enum BrevoErrorType {
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
 * Brevo Error class
 *
 * Custom error class for Brevo Integration operations.
 */
export class BrevoError extends Error {
  public readonly code: string | number
  public readonly type: BrevoErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: BrevoErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'BrevoError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, BrevoError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns BrevoError instance
   */
  static fromError(error: any): BrevoError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: BrevoErrorType; retryable: boolean }> = {
      '401': { type: BrevoErrorType.Authentication, retryable: false },
      '429': { type: BrevoErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new BrevoError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = BrevoErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = BrevoErrorType.Authentication
    } else if (statusCode === 403) {
      type = BrevoErrorType.Authorization
    } else if (statusCode === 404) {
      type = BrevoErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = BrevoErrorType.Validation
    } else if (statusCode === 429) {
      type = BrevoErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = BrevoErrorType.Server
      retryable = true
    }

    return new BrevoError(message, code, type, {
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
    return this.type === BrevoErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === BrevoErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === BrevoErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === BrevoErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === BrevoErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === BrevoErrorType.Server
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
