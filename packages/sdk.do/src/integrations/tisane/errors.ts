/**
 * Tisane Errors
 *
 * Auto-generated error handling for Tisane Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/tisane
 */

/**
 * Error type enum
 */
export enum TisaneErrorType {
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
 * Tisane Error class
 *
 * Custom error class for Tisane Integration operations.
 */
export class TisaneError extends Error {
  public readonly code: string | number
  public readonly type: TisaneErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: TisaneErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'TisaneError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, TisaneError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns TisaneError instance
   */
  static fromError(error: any): TisaneError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: TisaneErrorType; retryable: boolean }> = {
      '401': { type: TisaneErrorType.Authentication, retryable: false },
      '429': { type: TisaneErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new TisaneError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = TisaneErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = TisaneErrorType.Authentication
    } else if (statusCode === 403) {
      type = TisaneErrorType.Authorization
    } else if (statusCode === 404) {
      type = TisaneErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = TisaneErrorType.Validation
    } else if (statusCode === 429) {
      type = TisaneErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = TisaneErrorType.Server
      retryable = true
    }

    return new TisaneError(message, code, type, {
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
    return this.type === TisaneErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === TisaneErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === TisaneErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === TisaneErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === TisaneErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === TisaneErrorType.Server
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
