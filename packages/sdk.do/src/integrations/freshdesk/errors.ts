/**
 * Freshdesk Errors
 *
 * Auto-generated error handling for Freshdesk Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/freshdesk
 */

/**
 * Error type enum
 */
export enum FreshdeskErrorType {
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
 * Freshdesk Error class
 *
 * Custom error class for Freshdesk Integration operations.
 */
export class FreshdeskError extends Error {
  public readonly code: string | number
  public readonly type: FreshdeskErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: FreshdeskErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'FreshdeskError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, FreshdeskError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns FreshdeskError instance
   */
  static fromError(error: any): FreshdeskError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: FreshdeskErrorType; retryable: boolean }> = {
      '401': { type: FreshdeskErrorType.Authentication, retryable: false },
      '429': { type: FreshdeskErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new FreshdeskError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = FreshdeskErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = FreshdeskErrorType.Authentication
    } else if (statusCode === 403) {
      type = FreshdeskErrorType.Authorization
    } else if (statusCode === 404) {
      type = FreshdeskErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = FreshdeskErrorType.Validation
    } else if (statusCode === 429) {
      type = FreshdeskErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = FreshdeskErrorType.Server
      retryable = true
    }

    return new FreshdeskError(message, code, type, {
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
    return this.type === FreshdeskErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === FreshdeskErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === FreshdeskErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === FreshdeskErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === FreshdeskErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === FreshdeskErrorType.Server
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
