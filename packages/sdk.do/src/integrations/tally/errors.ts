/**
 * Tally Errors
 *
 * Auto-generated error handling for Tally Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/tally
 */

/**
 * Error type enum
 */
export enum TallyErrorType {
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
 * Tally Error class
 *
 * Custom error class for Tally Integration operations.
 */
export class TallyError extends Error {
  public readonly code: string | number
  public readonly type: TallyErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: TallyErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'TallyError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, TallyError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns TallyError instance
   */
  static fromError(error: any): TallyError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: TallyErrorType; retryable: boolean }> = {
      '401': { type: TallyErrorType.Authentication, retryable: false },
      '429': { type: TallyErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new TallyError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = TallyErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = TallyErrorType.Authentication
    } else if (statusCode === 403) {
      type = TallyErrorType.Authorization
    } else if (statusCode === 404) {
      type = TallyErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = TallyErrorType.Validation
    } else if (statusCode === 429) {
      type = TallyErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = TallyErrorType.Server
      retryable = true
    }

    return new TallyError(message, code, type, {
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
    return this.type === TallyErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === TallyErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === TallyErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === TallyErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === TallyErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === TallyErrorType.Server
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
