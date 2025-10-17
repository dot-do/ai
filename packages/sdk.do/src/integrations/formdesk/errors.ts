/**
 * Formdesk Errors
 *
 * Auto-generated error handling for Formdesk Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/formdesk
 */

/**
 * Error type enum
 */
export enum FormdeskErrorType {
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
 * Formdesk Error class
 *
 * Custom error class for Formdesk Integration operations.
 */
export class FormdeskError extends Error {
  public readonly code: string | number
  public readonly type: FormdeskErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: FormdeskErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'FormdeskError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, FormdeskError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns FormdeskError instance
   */
  static fromError(error: any): FormdeskError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: FormdeskErrorType; retryable: boolean }> = {
      '401': { type: FormdeskErrorType.Authentication, retryable: false },
      '429': { type: FormdeskErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new FormdeskError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = FormdeskErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = FormdeskErrorType.Authentication
    } else if (statusCode === 403) {
      type = FormdeskErrorType.Authorization
    } else if (statusCode === 404) {
      type = FormdeskErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = FormdeskErrorType.Validation
    } else if (statusCode === 429) {
      type = FormdeskErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = FormdeskErrorType.Server
      retryable = true
    }

    return new FormdeskError(message, code, type, {
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
    return this.type === FormdeskErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === FormdeskErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === FormdeskErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === FormdeskErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === FormdeskErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === FormdeskErrorType.Server
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
