/**
 * Salesmate Errors
 *
 * Auto-generated error handling for Salesmate Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/salesmate
 */

/**
 * Error type enum
 */
export enum SalesmateErrorType {
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
 * Salesmate Error class
 *
 * Custom error class for Salesmate Integration operations.
 */
export class SalesmateError extends Error {
  public readonly code: string | number
  public readonly type: SalesmateErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: SalesmateErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'SalesmateError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, SalesmateError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns SalesmateError instance
   */
  static fromError(error: any): SalesmateError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: SalesmateErrorType; retryable: boolean }> = {
      '401': { type: SalesmateErrorType.Authentication, retryable: false },
      '429': { type: SalesmateErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new SalesmateError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = SalesmateErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = SalesmateErrorType.Authentication
    } else if (statusCode === 403) {
      type = SalesmateErrorType.Authorization
    } else if (statusCode === 404) {
      type = SalesmateErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = SalesmateErrorType.Validation
    } else if (statusCode === 429) {
      type = SalesmateErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = SalesmateErrorType.Server
      retryable = true
    }

    return new SalesmateError(message, code, type, {
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
    return this.type === SalesmateErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === SalesmateErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === SalesmateErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === SalesmateErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === SalesmateErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === SalesmateErrorType.Server
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
